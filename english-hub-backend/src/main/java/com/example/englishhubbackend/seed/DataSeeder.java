package com.example.englishhubbackend.seed;

import com.example.englishhubbackend.enums.RoleEnum;
import com.example.englishhubbackend.models.User;
import com.example.englishhubbackend.repository.RoleRepository;
import com.example.englishhubbackend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class DataSeeder implements CommandLineRunner {
  UserRepository userRepository;
  PasswordEncoder passwordEncoder;
  RoleRepository roleRepository;

  @Override
  public void run(String... args) throws Exception {
    if (!userRepository.findByEmail("admin@email.com").isPresent()) {
      User admin = new User();
      admin.setUsername("Admin");
      admin.setEmail("admin@email.com");
      admin.setPassword(passwordEncoder.encode("admin"));
      admin.setEnabled(true);
      admin.setRole(roleRepository.findById(RoleEnum.ADMIN.name()).orElse(null));
      userRepository.save(admin);
      log.info("Admin account created");
    }
  }
}
