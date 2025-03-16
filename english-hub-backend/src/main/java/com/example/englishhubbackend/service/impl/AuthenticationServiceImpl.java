package com.example.englishhubbackend.service.impl;

import com.example.englishhubbackend.dto.request.RegisterRequest;
import com.example.englishhubbackend.dto.request.VerifyRequest;
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
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationServiceImpl implements AuthenticationService {
    UserRepository userRepository;
    UserMapper userMapper;
    EmailService emailService;
    RoleService roleService;

    @Override
    public UserResponse register(RegisterRequest registerRequest) {
        boolean existsByEmail = userRepository.existsByEmail(registerRequest.getEmail());
        if(existsByEmail) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
        User user = userMapper.toUser(registerRequest);
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
}
