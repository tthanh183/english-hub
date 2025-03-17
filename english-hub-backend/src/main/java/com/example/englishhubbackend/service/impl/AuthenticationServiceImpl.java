package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.*;
import com.example.englishhubbackend.dto.response.AuthenticateResponse;
import com.example.englishhubbackend.dto.response.IntrospectResponse;
import com.example.englishhubbackend.dto.response.UserResponse;
import com.example.englishhubbackend.enums.RoleEnum;
import com.example.englishhubbackend.exception.AppException;
import com.example.englishhubbackend.exception.ErrorCode;
import com.example.englishhubbackend.mapper.UserMapper;
import com.example.englishhubbackend.models.Role;
import com.example.englishhubbackend.models.User;
import com.example.englishhubbackend.repository.UserRepository;
import com.example.englishhubbackend.service.AuthenticationService;
import com.example.englishhubbackend.service.EmailService;
import com.example.englishhubbackend.service.RoleService;
import com.example.englishhubbackend.util.VerificationCodeUtil;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    UserRepository userRepository;
    UserMapper userMapper;
    EmailService emailService;
    RoleService roleService;
    PasswordEncoder passwordEncoder;
    RedisTemplate<String, String> redisTemplate;

    @NonFinal
    @Value("${security.jwt.secret-key}")
    String SIGNER_KEY;

    private static final long ACCESS_TOKEN_EXPIRY = 15 * 60 * 1000;
    private static final long REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000;

    @Override
    public UserResponse register(RegisterRequest registerRequest) {
        boolean existsByEmail = userRepository.existsByEmail(registerRequest.getEmail());
        if(existsByEmail) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
        User user = userMapper.toUser(registerRequest);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setEnabled(false);
        user.setVerificationCode(VerificationCodeUtil.generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(30));
        Role userRole = roleService.getRole(RoleEnum.USER.name());
        user.setRole(userRole);
        sendVerificationEmail(user);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    public void verifyEmail(VerifyRequest verifyRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(verifyRequest.getEmail());
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            if(user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
                throw new AppException(ErrorCode.VERIFICATION_CODE_EXPIRED);
            }
            if(user.getVerificationCode().equals(verifyRequest.getVerificationCode())) {
                user.setEnabled(true);
                user.setVerificationCode(null);
                user.setVerificationCodeExpiresAt(null);
                userRepository.save(user);
            }else {
                throw new AppException(ErrorCode.INVALID_VERIFICATION_CODE);
            }
        }else {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Override
    public void resendVerificationCode(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()) {
            User user = optionalUser.get();
            if(user.isEnabled()) {
                throw new AppException(ErrorCode.ACCOUNT_ALREADY_VERIFIED);
            }
            user.setVerificationCode(VerificationCodeUtil.generateVerificationCode());
            user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(30));
            sendVerificationEmail(user);
            userRepository.save(user);
        }else {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest introspectRequest) throws JOSEException, ParseException {
        String token = introspectRequest.getToken();
        SignedJWT signedJWT = parseAndVerifyToken(token);

        return IntrospectResponse.builder()
                .valid(!isTokenExpired(signedJWT))
                .build();
    }

    @Override
    public AuthenticateResponse authenticate(AuthenticateRequest authenticateRequest) {
        User user = userRepository.findByEmail(authenticateRequest.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if(!passwordEncoder.matches(authenticateRequest.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String accessToken = generateAccessToken(user);
        String refreshToken = generateRefreshToken(user);
        redisTemplate.opsForValue().set("refresh:" + user.getId(), refreshToken, REFRESH_TOKEN_EXPIRY, TimeUnit.MILLISECONDS);
        return AuthenticateResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    @Override
    public AuthenticateResponse refreshToken(RefreshRequest refreshRequest) {
        try {
            SignedJWT signedJWT = parseAndVerifyToken(refreshRequest.getRefreshToken());

            if (isTokenExpired(signedJWT)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            String userId = getUserIdFromToken(signedJWT);

            if (!isRefreshTokenValid(userId, refreshRequest.getRefreshToken())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            var user = userRepository.findById(UUID.fromString(userId))
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            var newAccessToken = generateAccessToken(user);

            return AuthenticateResponse.builder()
                    .accessToken(newAccessToken)
                    .refreshToken(refreshRequest.getRefreshToken())
                    .authenticated(true)
                    .build();
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @Override
    public void logout(RefreshRequest refreshRequest) {
        try {
            SignedJWT signedJWT = parseAndVerifyToken(refreshRequest.getRefreshToken());
            String userId = getUserIdFromToken(signedJWT);

            if (!isRefreshTokenValid(userId, refreshRequest.getRefreshToken())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            redisTemplate.delete("refresh:" + userId);
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }


    private void sendVerificationEmail(User user) {
        String subject = "Verification Code";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;\">"
                + "<div style=\"max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 15px rgba(0,0,0,0.1);\">"
                + "<h2 style=\"color: #333; text-align: center; font-size: 24px;\">Welcome to Our App!</h2>"
                + "<p style=\"font-size: 16px; text-align: center; color: #555;\">Please use the verification code below to continue:</p>"
                + "<div style=\"background-color: #f1f1f1; padding: 20px; border-radius: 5px; margin-top: 20px; text-align: center;\">"
                + "<h3 style=\"color: #333; font-size: 22px;\">Your Verification Code:</h3>"
                + "<p style=\"font-size: 24px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "<p style=\"font-size: 14px; color: #888; text-align: center; margin-top: 30px;\">If you did not request this verification, please ignore this email.</p>"
                + "</div>"
                + "</body>"
                + "</html>";

        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        }catch (MessagingException e) {
            throw new AppException(ErrorCode.EMAIL_SEND_FAILED);
        }
    }

    private String generateAccessToken(User user) {
        return generateToken(user, ACCESS_TOKEN_EXPIRY, true);
    }

    private String generateRefreshToken(User user) {
        return generateToken(user, REFRESH_TOKEN_EXPIRY, false);
    }

    private String generateToken(User user, long expiryMillis, boolean isAccessToken) {
        try {
            JWTClaimsSet.Builder claimsBuilder = new JWTClaimsSet.Builder()
                    .subject(user.getId().toString())
                    .issuer("senior-project")
                    .issueTime(new Date())
                    .expirationTime(new Date(System.currentTimeMillis() + expiryMillis));

            if(isAccessToken) {
                claimsBuilder.claim("scope", buildScope(user));
            }

            JWTClaimsSet claims = claimsBuilder.build();
            SignedJWT signedJWT = new SignedJWT(new JWSHeader(JWSAlgorithm.HS512), claims);
            signedJWT.sign(new MACSigner(SIGNER_KEY.getBytes()));

            return signedJWT.serialize();
        }catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    private String buildScope(User user) {
        return user.getRole().getName();
    }

    private SignedJWT parseAndVerifyToken(String token) {
        try {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            if (!signedJWT.verify(verifier)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            return signedJWT;
        } catch (Exception e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    private boolean isTokenExpired(SignedJWT signedJWT) throws ParseException {
        return signedJWT.getJWTClaimsSet().getExpirationTime().before(new Date());
    }

    private String getUserIdFromToken(SignedJWT signedJWT) throws ParseException {
        return signedJWT.getJWTClaimsSet().getSubject();
    }

    private boolean isRefreshTokenValid(String userId, String refreshToken) {
        String storedToken = redisTemplate.opsForValue().get("refresh:" + userId);
        return storedToken != null && storedToken.equals(refreshToken);
    }
}
