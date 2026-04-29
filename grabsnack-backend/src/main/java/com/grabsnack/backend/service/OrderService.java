package com.grabsnack.backend.service;

import com.grabsnack.backend.dto.OrderRequest;
import com.grabsnack.backend.model.Order;
import com.grabsnack.backend.model.OrderItem;
import com.grabsnack.backend.model.Product;
import com.grabsnack.backend.model.User;
import com.grabsnack.backend.repository.OrderRepository;
import com.grabsnack.backend.repository.ProductRepository;
import com.grabsnack.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository    orderRepository;
    private final UserRepository     userRepository;
    private final ProductRepository  productRepository;

    @Transactional
    public Order placeOrder(String email, OrderRequest req) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Validate stock before committing anything
        List<Product> productsToUpdate = new ArrayList<>();
        req.getItems().forEach(i -> {
            if (i.getProductId() != null) {
                Product p = productRepository.findById(i.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found: id=" + i.getProductId()));
                if (p.getStock() < i.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for: " + p.getName());
                }
                productsToUpdate.add(p);
            }
        });

        String orderCode = "GS-" + (100000 + (int)(Math.random() * 900000));

        Order order = new Order();
        order.setUser(user);
        order.setOrderCode(orderCode);
        order.setSubtotal(req.getSubtotal());
        order.setShipping(req.getShipping() != null ? req.getShipping() : BigDecimal.valueOf(50));
        order.setTotal(req.getTotal());
        order.setStatus("pending");
        order.setShippingAddress(req.getShippingAddress());

        req.getItems().forEach(i -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setItemName(i.getName());
            item.setItemEmoji(i.getEmoji());
            item.setPrice(i.getPrice());
            item.setQuantity(i.getQuantity());
            order.getItems().add(item);
        });

        Order saved = orderRepository.save(order);

        // Deduct stock after successful save
        for (int idx = 0; idx < productsToUpdate.size(); idx++) {
            Product p = productsToUpdate.get(idx);
            p.setStock(p.getStock() - req.getItems().get(idx).getQuantity());
            productRepository.save(p);
        }

        return saved;
    }

    public List<Order> getOrdersForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(Long id, String email) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Forbidden");
        }
        return order;
    }

    // ── Admin ────────────────────────────────────────────────────────────────

    public List<Order> getAllOrders(String status) {
        if (status != null && !status.isBlank()) {
            return orderRepository.findByStatus(status);
        }
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
