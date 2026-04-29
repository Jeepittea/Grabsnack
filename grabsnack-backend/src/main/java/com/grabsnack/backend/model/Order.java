package com.grabsnack.backend.model;

import com.grabsnack.backend.dto.ShippingAddress;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_code", nullable = false, length = 20)
    private String orderCode;

    // 'pending' | 'processing' | 'delivered'
    @Column(columnDefinition = "ENUM('pending','processing','delivered') DEFAULT 'pending'")
    private String status = "pending";

    @Embedded
    private ShippingAddress shippingAddress;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 10, scale = 2)
    private BigDecimal shipping = BigDecimal.valueOf(50);

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    @Column(name = "created_at", insertable = false, updatable = false,
            columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public Order() {}

    // ── Getters / Setters ──────────────────────────────────────────────────────

    public Long getId()                        { return id; }
    public void setId(Long id)                { this.id = id; }

    public User getUser()                      { return user; }
    public void setUser(User user)            { this.user = user; }

    public String getOrderCode()                       { return orderCode; }
    public void setOrderCode(String orderCode)        { this.orderCode = orderCode; }

    public String getStatus()                  { return status; }
    public void setStatus(String status)      { this.status = status; }

    public ShippingAddress getShippingAddress()                          { return shippingAddress; }
    public void setShippingAddress(ShippingAddress shippingAddress)     { this.shippingAddress = shippingAddress; }

    public BigDecimal getSubtotal()                    { return subtotal; }
    public void setSubtotal(BigDecimal subtotal)      { this.subtotal = subtotal; }

    public BigDecimal getShipping()                    { return shipping; }
    public void setShipping(BigDecimal shipping)      { this.shipping = shipping; }

    public BigDecimal getTotal()                       { return total; }
    public void setTotal(BigDecimal total)            { this.total = total; }

    public LocalDateTime getCreatedAt()                { return createdAt; }

    public List<OrderItem> getItems()                  { return items; }
    public void setItems(List<OrderItem> items)       { this.items = items; }
}
