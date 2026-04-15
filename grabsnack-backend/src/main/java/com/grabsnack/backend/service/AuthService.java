package com.grabsnack.backend.service;

import com.grabsnack.backend.dto.AuthResponse;
import com.grabsnack.backend.dto.LoginRequest;
import com.grabsnack.backend.dto.RegisterRequest;
import com.grabsnack.backend.factory.UserFactory;
import com.grabsnack.backend.model.User;
import com.grabsnack.backend.repository.UserRepository;
import com.grabsnack.backend.security.JwtService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService     = jwtService;
    }

    public String register(RegisterRequest request) {
        User user = UserFactory.createUser(
                request.getEmail(),
                encoder.encode(request.getPassword()),
                "USER"
        );
        user.setFullName(request.getFullName());
        userRepository.save(user);
        return "User Registered";
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = optionalUser.get();

        if (!encoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getFullName());
        claims.put("role", user.getRole());

        String token = jwtService.generateToken(claims, user);

        return new AuthResponse(user.getId(), token, user.getEmail(), user.getFullName());
    }
}
