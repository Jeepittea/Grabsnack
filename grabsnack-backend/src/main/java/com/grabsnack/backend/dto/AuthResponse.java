package com.grabsnack.backend.dto;

public class AuthResponse {

    private Long   id;
    private String token;
    private String email;
    private String fullName;

    public AuthResponse(Long id, String token, String email, String fullName) {
        this.id       = id;
        this.token    = token;
        this.email    = email;
        this.fullName = fullName;
    }

    public Long   getId()       { return id; }
    public String getToken()    { return token; }
    public String getEmail()    { return email; }
    public String getFullName() { return fullName; }
}
