package com.sneakcart.auth.service;

import com.sneakcart.auth.model.User;
import com.sneakcart.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public Map<String, String> register(String name, String email, String password) {
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .build();
        userRepo.save(user);
        return Map.of("token", jwtService.generate(email));
    }

    public Map<String, String> login(String email, String password) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        return Map.of("token", jwtService.generate(email));
    }
}
