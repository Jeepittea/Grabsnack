package com.grabsnack.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class OrderRequest {

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull(message = "Shipping address is required")
    @Valid
    private ShippingAddress shippingAddress;

    private BigDecimal subtotal;
    private BigDecimal shipping;
    private BigDecimal total;

    public List<OrderItemRequest> getItems()               { return items; }
    public void setItems(List<OrderItemRequest> items)     { this.items = items; }

    public ShippingAddress getShippingAddress()                      { return shippingAddress; }
    public void setShippingAddress(ShippingAddress shippingAddress)  { this.shippingAddress = shippingAddress; }

    public BigDecimal getSubtotal()                        { return subtotal; }
    public void setSubtotal(BigDecimal subtotal)           { this.subtotal = subtotal; }

    public BigDecimal getShipping()                        { return shipping; }
    public void setShipping(BigDecimal shipping)           { this.shipping = shipping; }

    public BigDecimal getTotal()                           { return total; }
    public void setTotal(BigDecimal total)                 { this.total = total; }
}
