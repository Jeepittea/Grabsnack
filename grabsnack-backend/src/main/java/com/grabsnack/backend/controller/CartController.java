package com.grabsnack.backend.controller;

import com.grabsnack.backend.dto.ApiResponse;
import com.grabsnack.backend.dto.CartItemRequest;
import com.grabsnack.backend.model.Cart;
import com.grabsnack.backend.model.CartItem;
import com.grabsnack.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(cartService.getCartForUser(userDetails.getUsername())));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<?>> addItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CartItemRequest request) {
        try {
            CartItem item = cartService.addItem(userDetails.getUsername(), request);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Added to cart", "cartItem", item)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("CART-001", e.getMessage()));
        }
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<?>> updateItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body) {
        try {
            CartItem item = cartService.updateItem(userDetails.getUsername(), itemId, body.get("quantity"));
            return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Cart updated", "cartItem", item != null ? item : Map.of())));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("CART-001", e.getMessage()));
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<?>> removeItem(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long itemId) {
        try {
            cartService.removeItem(userDetails.getUsername(), itemId);
            return ResponseEntity.ok(ApiResponse.ok(Map.of("message", "Removed from cart")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("CART-001", e.getMessage()));
        }
    }
}
