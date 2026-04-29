package com.grabsnack.backend.service;

import com.grabsnack.backend.dto.AuthResponse;
import com.grabsnack.backend.dto.LoginRequest;
import com.grabsnack.backend.dto.RegisterRequest;
import com.grabsnack.backend.factory.UserFactory;
import com.grabsnack.backend.model.RefreshToken;
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
    private final RefreshTokenService refreshTokenService;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtService jwtService,
                       RefreshTokenService refreshTokenService) {
        this.userRepository      = userRepository;
        this.jwtService          = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
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

        String accessToken   = jwtService.generateToken(claims, user);
        RefreshToken refresh = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(user.getId(), accessToken, refresh.getToken(),
                                user.getEmail(), user.getFullName());
    }

    public AuthResponse refresh(String refreshToken) {
        RefreshToken rt   = refreshTokenService.validateRefreshToken(refreshToken);
        User user         = rt.getUser();

        Map<String, Object> claims = new HashMap<>();
        claims.put("name", user.getFullName());
        claims.put("role", user.getRole());

        String newAccess     = jwtService.generateToken(claims, user);
        RefreshToken newRt   = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(user.getId(), newAccess, newRt.getToken(),
                                user.getEmail(), user.getFullName());
    }

    public void logout(String email) {
        userRepository.findByEmail(email)
                .ifPresent(refreshTokenService::deleteByUser);
    }
}
