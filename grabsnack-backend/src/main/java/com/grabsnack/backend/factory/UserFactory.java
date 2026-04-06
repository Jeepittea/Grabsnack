package com.grabsnack.backend.factory;

import com.grabsnack.backend.model.User;

public class UserFactory {

    // Private constructor to prevent instantiation (utility class)
    private UserFactory() {}

    /**
     * Factory method for creating a regular user (email + password)
     */
    public static User createUser(String email, String password, String role) {
        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        return user;
    }

    /**
     * Factory method for creating a Google OAuth user
     */
    public static User createGoogleUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setPassword("GOOGLE_AUTH"); // placeholder since no password
        user.setRole("USER");
        return user;
    }

}
