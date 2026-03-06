package com.grabsnack.backend.controller;

import com.grabsnack.backend.dto.LoginRequest;
import com.grabsnack.backend.dto.RegisterRequest;
import com.grabsnack.backend.model.User;
import com.grabsnack.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*") // allows React frontend to access this API
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // REGISTER USER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // LOGIN USER
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> user = userRepository.findByEmail(request.getEmail());

        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!user.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        return ResponseEntity.ok("Login successful");
    }
}