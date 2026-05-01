package com.sneakcart.service;

import com.sneakcart.dto.request.LoginRequest;
import com.sneakcart.dto.request.RegisterRequest;
import com.sneakcart.dto.response.UserResponse;
import com.sneakcart.entity.User;
import com.sneakcart.exception.BadRequestException;
import com.sneakcart.exception.ResourceNotFoundException;
import com.sneakcart.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BadRequestException("Email already registered: " + req.getEmail());
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail().toLowerCase());
        user.setPassword(req.getPassword());
        user.setRole(User.Role.USER);
        User saved = userRepository.save(user);
        return toResponse(saved);
    }

    public UserResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));
        if (!user.getPassword().equals(req.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }
        return toResponse(user);
    }

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return toResponse(user);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole().name()
        );
    }
}
