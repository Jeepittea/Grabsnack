package com.grabsnack.backend.service;

import com.grabsnack.backend.dto.LoginRequest;
import com.grabsnack.backend.dto.RegisterRequest;
import com.grabsnack.backend.model.User;
import com.grabsnack.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder=new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    public String register(RegisterRequest request){

        User user=new User(
                request.getFullName(),
                request.getEmail(),
                encoder.encode(request.getPassword())
        );

        userRepository.save(user);

        return "User Registered";
    }

    public String login(LoginRequest request){

        User user=userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        if(encoder.matches(request.getPassword(),user.getPassword()))
            return "Login Successful";

        return "Invalid Credentials";

    }

}