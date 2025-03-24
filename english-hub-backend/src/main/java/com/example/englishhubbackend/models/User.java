package com.example.englishhubbackend.models;

import com.example.englishhubbackend.enums.UserStatusEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;
    String username;
    @Column(unique = true, nullable = false)
    String email;
    @Column(nullable = false)
    String password;
    boolean enabled;
    String verificationCode;
    LocalDateTime verificationCodeExpiresAt;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    Role role;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    UserStatusEnum status = UserStatusEnum.UNVERIFIED;
    LocalDate joinDate;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
    @JsonIgnore
    List<Result> results;
}
