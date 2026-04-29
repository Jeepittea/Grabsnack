package com.grabsnack.backend.features.cart;

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

import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CartControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired ProductRepository productRepository;

    private String token;
    private Long productId;

    @BeforeEach
    void setUp() throws Exception {
        Product p = new Product();
        p.setName("Cart Test Fries");
        p.setPrice(85.0);
        p.setCategory("Fries");
        p.setStock(20);
        productId = productRepository.save(p).getId();

        String email = "cart_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10) + "@test.com";
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "fullName", "Cart User", "email", email, "password", "password123"
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

    // TC-CART-001: View cart while authenticated — expects 200 with cart data
    @Test
    void TC_CART_001_getCart_authenticated_returns200() throws Exception {
        mockMvc.perform(get("/api/cart")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // TC-CART-002: Add a product to cart — expects 200 and success:true
    @Test
    void TC_CART_002_addItemToCart_validProduct_returns200() throws Exception {
        mockMvc.perform(post("/api/cart/items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "productId", productId, "quantity", 2
                ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.message").value("Added to cart"));
    }

    // TC-CART-003: Update cart item quantity — expects 200
    @Test
    void TC_CART_003_updateCartItem_validQuantity_returns200() throws Exception {
        // Add item first
        MvcResult addResult = mockMvc.perform(post("/api/cart/items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "productId", productId, "quantity", 1
                ))))
                .andReturn();

        Map<?, ?> addResp = objectMapper.readValue(addResult.getResponse().getContentAsString(), Map.class);
        Map<?, ?> cartItemData = (Map<?, ?>) ((Map<?, ?>) addResp.get("data")).get("cartItem");
        Long itemId = ((Number) cartItemData.get("id")).longValue();

        mockMvc.perform(put("/api/cart/items/" + itemId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("quantity", 3))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // TC-CART-004: Remove an item from cart — expects 200 with removal message
    @Test
    void TC_CART_004_removeCartItem_existingItem_returns200() throws Exception {
        MvcResult addResult = mockMvc.perform(post("/api/cart/items")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of(
                        "productId", productId, "quantity", 1
                ))))
                .andReturn();

        Map<?, ?> addResp = objectMapper.readValue(addResult.getResponse().getContentAsString(), Map.class);
        Map<?, ?> cartItemData = (Map<?, ?>) ((Map<?, ?>) addResp.get("data")).get("cartItem");
        Long itemId = ((Number) cartItemData.get("id")).longValue();

        mockMvc.perform(delete("/api/cart/items/" + itemId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.message").value("Removed from cart"));
    }

    // TC-CART-005: Access cart without authentication — expects 401
    @Test
    void TC_CART_005_getCart_unauthenticated_returns401() throws Exception {
        mockMvc.perform(get("/api/cart"))
                .andExpect(status().isUnauthorized());
    }
}
