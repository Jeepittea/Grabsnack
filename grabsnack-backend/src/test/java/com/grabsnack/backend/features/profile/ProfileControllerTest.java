package com.grabsnack.backend.features.profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProfileControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;

    private String token;
    private String userEmail;

    @BeforeEach
    void setUp() throws Exception {
        userEmail = "prof_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10) + "@test.com";
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Profile User", "email", userEmail, "password", "password123"
                ))));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", userEmail, "password", "password123"
                ))))
                .andReturn();

        Map<?, ?> resp = objectMapper.readValue(loginResult.getResponse().getContentAsString(), Map.class);
        token = (String) ((Map<?, ?>) resp.get("data")).get("token");
    }

    // TC-PROF-001: Get profile while authenticated — expects 200 with user data
    @Test
    void TC_PROF_001_getProfile_authenticated_returns200() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(userEmail))
                .andExpect(jsonPath("$.data.fullName").value("Profile User"));
    }

    // TC-PROF-002: Update profile full name and phone — expects 200 with updated data
    @Test
    void TC_PROF_002_updateProfile_validData_returns200WithUpdatedFields() throws Exception {
        mockMvc.perform(put("/api/users/me")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Updated Name",
                        "phone", "+639123456789"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Updated Name"))
                .andExpect(jsonPath("$.data.phone").value("+639123456789"));
    }

    // TC-PROF-003: Update profile with only full name (partial update) — expects 200
    @Test
    void TC_PROF_003_updateProfile_partialUpdate_returns200() throws Exception {
        mockMvc.perform(put("/api/users/me")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Partial Update Name"
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Partial Update Name"));
    }

    // TC-PROF-004: Access profile without authentication — expects 401
    @Test
    void TC_PROF_004_getProfile_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }
}
