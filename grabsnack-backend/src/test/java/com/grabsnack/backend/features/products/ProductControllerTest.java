package com.grabsnack.backend.features.products;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ProductControllerTest {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired ProductRepository productRepository;

    private Long testProductId;

    @BeforeEach
    void setUp() {
        Product p = new Product();
        p.setName("Crispy Chicken Burger");
        p.setDescription("Juicy crispy chicken burger");
        p.setPrice(120.0);
        p.setCategory("Burgers");
        p.setStock(50);
        p.setEmoji("🍔");
        p.setRating(4.5);
        testProductId = productRepository.save(p).getId();
    }

    // TC-PROD-001: Get all products — expects 200 and a data object
    @Test
    void TC_PROD_001_getAllProducts_returnsOk() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").exists());
    }

    // TC-PROD-002: Get product by valid ID — expects 200 with product data
    @Test
    void TC_PROD_002_getProductById_existingId_returnsProduct() throws Exception {
        mockMvc.perform(get("/api/products/" + testProductId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Crispy Chicken Burger"))
                .andExpect(jsonPath("$.data.price").value(120.0));
    }

    // TC-PROD-003: Get product by non-existing ID — expects 404
    @Test
    void TC_PROD_003_getProductById_nonExistingId_returns404() throws Exception {
        mockMvc.perform(get("/api/products/999999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.error.code").value("DB-001"));
    }

    // TC-PROD-004: Search products by name query — expects 200 with filtered results
    @Test
    void TC_PROD_004_searchProducts_withMatchingQuery_returnsResults() throws Exception {
        mockMvc.perform(get("/api/products").param("search", "Chicken"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    // TC-PROD-005: Filter products by category — expects 200
    @Test
    void TC_PROD_005_filterByCategory_returnsOk() throws Exception {
        mockMvc.perform(get("/api/products").param("category", "Burgers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
