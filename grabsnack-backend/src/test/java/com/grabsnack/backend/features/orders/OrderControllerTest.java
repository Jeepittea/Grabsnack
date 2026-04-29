package com.grabsnack.backend.features.orders;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.grabsnack.backend.features.products.Product;
import com.grabsnack.backend.features.products.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired ProductRepository productRepository;

    private String token;
    private Long productId;

    @BeforeEach
    void setUp() throws Exception {
        Product p = new Product();
        p.setName("Spicy Wings");
        p.setPrice(110.0);
        p.setCategory("Snacks");
        p.setStock(30);
        productId = productRepository.save(p).getId();

        String email = "order_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10) + "@test.com";
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Order User", "email", email, "password", "password123"
                ))));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "email", email, "password", "password123"
                ))))
                .andReturn();

        Map<?, ?> resp = objectMapper.readValue(loginResult.getResponse().getContentAsString(), Map.class);
        token = (String) ((Map<?, ?>) resp.get("data")).get("token");
    }

    private Map<String, Object> buildOrderRequest() {
        Map<String, Object> shippingAddress = Map.of(
                "shippingFullName", "Test Buyer",
                "shippingAddress", "123 Test Street",
                "shippingCity", "Manila",
                "shippingZipCode", "1000",
                "shippingCountry", "Philippines"
        );
        Map<String, Object> item = Map.of(
                "productId", productId,
                "name", "Spicy Wings",
                "emoji", "🍗",
                "price", new BigDecimal("110.00"),
                "quantity", 2
        );
        return Map.of(
                "items", List.of(item),
                "shippingAddress", shippingAddress,
                "subtotal", new BigDecimal("220.00"),
                "shipping", new BigDecimal("50.00"),
                "total", new BigDecimal("270.00")
        );
    }

    // TC-ORD-001: Place a valid order — expects 201 Created with order data
    @Test
    void TC_ORD_001_placeOrder_validRequest_returns201() throws Exception {
        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildOrderRequest())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.orderCode").isNotEmpty())
                .andExpect(jsonPath("$.data.status").value("pending"));
    }

    // TC-ORD-002: Get order history for authenticated user — expects 200 with list
    @Test
    void TC_ORD_002_getMyOrders_authenticated_returns200() throws Exception {
        mockMvc.perform(get("/api/orders")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    // TC-ORD-003: Place order then retrieve it by ID — expects 200 with same order
    @Test
    void TC_ORD_003_getOrderById_existingOrder_returns200() throws Exception {
        MvcResult placeResult = mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(buildOrderRequest())))
                .andReturn();

        Map<?, ?> placeResp = objectMapper.readValue(placeResult.getResponse().getContentAsString(), Map.class);
        Long orderId = ((Number) ((Map<?, ?>) placeResp.get("data")).get("id")).longValue();

        mockMvc.perform(get("/api/orders/" + orderId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(orderId));
    }

    // TC-ORD-004: Place order with empty items list — expects 400 Bad Request
    @Test
    void TC_ORD_004_placeOrder_emptyItems_returns400() throws Exception {
        Map<String, Object> shippingAddress = Map.of(
                "shippingFullName", "Test Buyer",
                "shippingAddress", "123 Test Street",
                "shippingCity", "Manila",
                "shippingZipCode", "1000",
                "shippingCountry", "Philippines"
        );
        Map<String, Object> badRequest = Map.of(
                "items", List.of(),
                "shippingAddress", shippingAddress
        );

        mockMvc.perform(post("/api/orders")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(badRequest)))
                .andExpect(status().isBadRequest());
    }

    // TC-ORD-005: Access orders without authentication — expects 401
    @Test
    void TC_ORD_005_getOrders_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isUnauthorized());
    }
}
