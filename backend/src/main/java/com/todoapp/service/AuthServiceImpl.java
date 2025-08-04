package com.todoapp.service;

import com.todoapp.dto.AuthResponse;
import com.todoapp.dto.LoginRequest;
import com.todoapp.dto.RegisterRequest;
import com.todoapp.model.User;
import com.todoapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtService jwtService;
    
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        // Validate passwords match
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create new user
        User user = new User(
            registerRequest.getUsername(),
            registerRequest.getEmail(),
            encodePassword(registerRequest.getPassword())
        );
        
        User savedUser = userRepository.save(user);
        
        // Generate JWT token
        String token = jwtService.generateToken(savedUser.getUsername());
        
        return new AuthResponse(token, savedUser.getId(), savedUser.getUsername(), savedUser.getEmail());
    }
    
    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        // Find user by username or email
        User user = userRepository.findByUsernameOrEmail(loginRequest.getUsernameOrEmail())
            .orElseThrow(() -> new RuntimeException("Invalid username/email or password"));
        
        // Validate password
        if (!validatePassword(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username/email or password");
        }
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername());
        
        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail());
    }
    
    @Override
    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
    
    @Override
    public String encodePassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }
} 