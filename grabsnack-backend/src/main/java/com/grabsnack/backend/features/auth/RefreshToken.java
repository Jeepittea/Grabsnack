package com.grabsnack.backend.features.auth;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(name = "created_at")
    private Instant createdAt = Instant.now();

    public RefreshToken() {}

    public Long getId()                  { return id; }
    public void setId(Long id)           { this.id = id; }
    public User getUser()                { return user; }
    public void setUser(User user)       { this.user = user; }
    public String getToken()             { return token; }
    public void setToken(String token)   { this.token = token; }
    public Instant getExpiresAt()        { return expiresAt; }
    public void setExpiresAt(Instant e)  { this.expiresAt = e; }
    public Instant getCreatedAt()        { return createdAt; }
}
