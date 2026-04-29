package com.grabsnack.backend.features.products;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private Double price;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;

    private String imageUrl;
    private String category;
    private String emoji;
    private Double rating;

    public String getName()                          { return name; }
    public void setName(String name)                 { this.name = name; }
    public String getDescription()                   { return description; }
    public void setDescription(String description)   { this.description = description; }
    public Double getPrice()                         { return price; }
    public void setPrice(Double price)               { this.price = price; }
    public Integer getStock()                        { return stock; }
    public void setStock(Integer stock)              { this.stock = stock; }
    public String getImageUrl()                      { return imageUrl; }
    public void setImageUrl(String imageUrl)         { this.imageUrl = imageUrl; }
    public String getCategory()                      { return category; }
    public void setCategory(String category)         { this.category = category; }
    public String getEmoji()                         { return emoji; }
    public void setEmoji(String emoji)               { this.emoji = emoji; }
    public Double getRating()                        { return rating; }
    public void setRating(Double rating)             { this.rating = rating; }
}
