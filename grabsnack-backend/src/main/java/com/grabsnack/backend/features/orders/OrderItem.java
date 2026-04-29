package com.grabsnack.backend.features.orders;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_emoji",
            columnDefinition = "VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String itemEmoji;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer quantity;

    public OrderItem() {}

    public Long getId()                          { return id; }
    public void setId(Long id)                   { this.id = id; }
    public Order getOrder()                      { return order; }
    public void setOrder(Order order)            { this.order = order; }
    public String getItemName()                  { return itemName; }
    public void setItemName(String itemName)     { this.itemName = itemName; }
    public String getItemEmoji()                 { return itemEmoji; }
    public void setItemEmoji(String itemEmoji)   { this.itemEmoji = itemEmoji; }
    public BigDecimal getPrice()                 { return price; }
    public void setPrice(BigDecimal price)       { this.price = price; }
    public Integer getQuantity()                 { return quantity; }
    public void setQuantity(Integer quantity)    { this.quantity = quantity; }
}
