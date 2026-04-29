package com.grabsnack.backend.features.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    private String uniqueEmail() {
        return "auth_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10) + "@test.com";
    }

    // TC-AUTH-001: Register a brand-new user — expects 200 and success:true
    @Test
    void TC_AUTH_001_register_newUser_returns200() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "New User",
                        "email", uniqueEmail(),
                        "password", "password123"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // TC-AUTH-002: Register with an already-used email — expects 409 Conflict
    @Test
    void TC_AUTH_002_register_duplicateEmail_returns409() throws Exception {
        String email = uniqueEmail();
        Map<String, String> body = Map.of("fullName", "Dup User", "email", email, "password", "password123");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("AUTH-004"));
    }

    // TC-AUTH-003: Login with valid credentials — expects 200 with accessToken and refreshToken
    @Test
    void TC_AUTH_003_login_validCredentials_returnsTokens() throws Exception {
        String email = uniqueEmail();
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Login User", "email", email, "password", "password123"
                ))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", email, "password", "password123"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").isNotEmpty())
                .andExpect(jsonPath("$.data.refreshToken").isNotEmpty());
    }

    // TC-AUTH-004: Login with wrong password — expects 401 Unauthorized
    @Test
    void TC_AUTH_004_login_wrongPassword_returns401() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", "nobody@test.com", "password", "wrongpass"
                ))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }

    // TC-AUTH-005: Logout with a valid JWT — expects 200 and success:true
    @Test
    void TC_AUTH_005_logout_withValidToken_returns200() throws Exception {
        String email = uniqueEmail();
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Logout User", "email", email, "password", "password123"
                ))));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", email, "password", "password123"
                ))))
                .andReturn();

        Map<?, ?> resp = objectMapper.readValue(loginResult.getResponse().getContentAsString(), Map.class);
        String token = (String) ((Map<?, ?>) resp.get("data")).get("token");

        mockMvc.perform(post("/api/auth/logout")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
