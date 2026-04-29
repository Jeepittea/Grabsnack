package com.grabsnack.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class OrderItemRequest {

    private Long productId;

    @NotBlank(message = "Item name is required")
    private String name;

    private String emoji;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    public Long getProductId()                   { return productId; }
    public void setProductId(Long productId)     { this.productId = productId; }

    public String getName()                      { return name; }
    public void setName(String name)             { this.name = name; }

    public String getEmoji()                     { return emoji; }
    public void setEmoji(String emoji)           { this.emoji = emoji; }

    public BigDecimal getPrice()                     { return price; }
    public void setPrice(BigDecimal price)           { this.price = price; }

    public Integer getQuantity()                 { return quantity; }
    public void setQuantity(Integer quantity)    { this.quantity = quantity; }
}
