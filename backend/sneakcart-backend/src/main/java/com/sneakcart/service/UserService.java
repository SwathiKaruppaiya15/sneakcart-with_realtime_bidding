package com.sneakcart.service;

import com.sneakcart.dto.request.LoginRequest;
import com.sneakcart.dto.request.RegisterRequest;
import com.sneakcart.dto.response.UserResponse;
import com.sneakcart.entity.User;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }
        // NOTE: In production, hash the password with BCrypt before saving
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail().toLowerCase())
                .password(req.getPassword())
                .build();
        User saved = userRepository.save(user);
        return new UserResponse(saved.getId(), saved.getName(), saved.getEmail());
    }

    public UserResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // NOTE: In production, use BCrypt.matches() to compare hashed passwords
        if (!user.getPassword().equals(req.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return new UserResponse(user.getId(), user.getName(), user.getEmail());
    }
}
