package com.grabsnack.backend.features.orders;

import com.grabsnack.backend.shared.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders")
    public ResponseEntity<ApiResponse<Order>> placeOrder(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody OrderRequest request) {
        try {
            Order order = orderService.placeOrder(userDetails.getUsername(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(order));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.fail("ORDER-001", e.getMessage()));
        }
    }

    @GetMapping("/api/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getOrdersForUser(userDetails.getUsername())));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id, userDetails.getUsername());
            return ResponseEntity.ok(ApiResponse.ok(order));
        } catch (RuntimeException e) {
            String code   = e.getMessage().equals("Forbidden") ? "AUTH-003" : "DB-001";
            int    status = e.getMessage().equals("Forbidden") ? 403 : 404;
            return ResponseEntity.status(status).body(ApiResponse.fail(code, e.getMessage()));
        }
    }

    @GetMapping("/api/admin/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders(
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.ok(orderService.getAllOrders(status)));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            Order order = orderService.updateStatus(id, body.get("status"));
            return ResponseEntity.ok(ApiResponse.ok(order));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.fail("DB-001", e.getMessage()));
        }
    }
}
