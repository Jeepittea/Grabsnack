package com.grabsnack.backend.features.auth;

public class UserFactory {

    private UserFactory() {}

    public static User createUser(String email, String password, String role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        return user;
    }

    public static User createGoogleUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("GOOGLE_AUTH");
        user.setRole("USER");
        return user;
    }
}
