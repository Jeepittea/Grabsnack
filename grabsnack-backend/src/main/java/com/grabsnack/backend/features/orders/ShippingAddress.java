package com.grabsnack.backend.features.orders;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;

@Embeddable
public class ShippingAddress {

    @NotBlank(message = "Full name is required")
    private String shippingFullName;

    @NotBlank(message = "Address is required")
    private String shippingAddress;

    @NotBlank(message = "City is required")
    private String shippingCity;

    @NotBlank(message = "Zip code is required")
    private String shippingZipCode;

    @NotBlank(message = "Country is required")
    private String shippingCountry;

    public String getShippingFullName()                          { return shippingFullName; }
    public void setShippingFullName(String shippingFullName)     { this.shippingFullName = shippingFullName; }
    public String getShippingAddress()                           { return shippingAddress; }
    public void setShippingAddress(String shippingAddress)       { this.shippingAddress = shippingAddress; }
    public String getShippingCity()                              { return shippingCity; }
    public void setShippingCity(String shippingCity)             { this.shippingCity = shippingCity; }
    public String getShippingZipCode()                           { return shippingZipCode; }
    public void setShippingZipCode(String shippingZipCode)       { this.shippingZipCode = shippingZipCode; }
    public String getShippingCountry()                           { return shippingCountry; }
    public void setShippingCountry(String shippingCountry)       { this.shippingCountry = shippingCountry; }
}
