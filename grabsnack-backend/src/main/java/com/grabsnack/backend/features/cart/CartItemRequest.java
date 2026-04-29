package com.grabsnack.backend.features.cart;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    @Max(value = 10, message = "Quantity cannot exceed 10")
    private Integer quantity;

    public Long getProductId()                   { return productId; }
    public void setProductId(Long productId)     { this.productId = productId; }
    public Integer getQuantity()                 { return quantity; }
    public void setQuantity(Integer quantity)    { this.quantity = quantity; }
}
