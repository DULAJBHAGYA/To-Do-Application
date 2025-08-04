package com.todoapp.service;

import com.todoapp.dto.AuthResponse;
import com.todoapp.dto.LoginRequest;
import com.todoapp.dto.RegisterRequest;

public interface AuthService {
    
    AuthResponse register(RegisterRequest registerRequest);
    
    AuthResponse login(LoginRequest loginRequest);
    
    boolean validatePassword(String rawPassword, String encodedPassword);
    
    String encodePassword(String rawPassword);
} 