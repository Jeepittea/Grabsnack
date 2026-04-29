package com.grabsnack.backend.features.products;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 1000)
    private String description;

    private Double price;
    private Integer stock;
    private String imageUrl;
    private String category;

    @Column(columnDefinition = "VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    private String emoji;

    private Double rating;

    public Product() {}

    public Long getId()                      { return id; }
    public void setId(Long id)               { this.id = id; }
    public String getName()                  { return name; }
    public void setName(String name)         { this.name = name; }
    public String getDescription()                   { return description; }
    public void setDescription(String description)   { this.description = description; }
    public Double getPrice()                 { return price; }
    public void setPrice(Double price)       { this.price = price; }
    public Integer getStock()                { return stock; }
    public void setStock(Integer stock)      { this.stock = stock; }
    public String getImageUrl()              { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getCategory()              { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getEmoji()                 { return emoji; }
    public void setEmoji(String emoji)       { this.emoji = emoji; }
    public Double getRating()                { return rating; }
    public void setRating(Double rating)     { this.rating = rating; }
}
