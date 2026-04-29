package com.grabsnack.backend.dto;

public class AuthResponse {

    private Long   id;
    private String token;
    private String refreshToken;
    private String email;
    private String fullName;

    public AuthResponse(Long id, String token, String refreshToken, String email, String fullName) {
        this.id           = id;
        this.token        = token;
        this.refreshToken = refreshToken;
        this.email        = email;
        this.fullName     = fullName;
    }

    public Long   getId()            { return id; }
    public String getToken()         { return token; }
    public String getRefreshToken()  { return refreshToken; }
    public String getEmail()         { return email; }
    public String getFullName()      { return fullName; }
}
