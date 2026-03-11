package com.grabsnack.demo.handler;

import com.grabsnack.demo.model.User;
import com.grabsnack.demo.repository.UserRepository;
import com.grabsnack.demo.security.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        if (email == null || email.isBlank()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                    "OAuth2 provider did not return email address.");
            return;
        }

        if (name == null || name.isBlank()) {
            name = email;
        }

        // Find user
        User user = userRepository.findByEmail(email).orElse(null);

        // Create user if not exists
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(name);
            user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            user = userRepository.save(user);
        }

        // JWT Claims
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("name", user.getFullName());
        claims.put("userId", user.getId());

        String token = jwtService.generateToken(claims, user);

        // Redirect to frontend
        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/oauth-success")
                .queryParam("token", token)
                .queryParam("email", user.getEmail())
                .queryParam("name", user.getFullName())
                .queryParam("role", user.getRole())
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}
