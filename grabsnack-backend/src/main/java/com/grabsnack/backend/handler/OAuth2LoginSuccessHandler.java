package com.grabsnack.backend.handler;

import com.grabsnack.backend.model.User;
import com.grabsnack.backend.repository.UserRepository;
import com.grabsnack.backend.security.JwtService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.*;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser=(OAuth2User)authentication.getPrincipal();

        String email=oauthUser.getAttribute("email");
        String name=oauthUser.getAttribute("name");

        User user=userRepository.findByEmail(email)
                .orElseGet(() ->
                        userRepository.save(
                                new User(name,email,"google-login")
                        )
                );

        Map<String,Object> claims=new HashMap<>();

        claims.put("name",user.getFullName());
        claims.put("role",user.getRole());

        String token=jwtService.generateToken(claims,user);

        String redirectUrl=UriComponentsBuilder
                .fromUriString(frontendUrl)
                .path("/oauth-success")
                .queryParam("token",token)
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }
}