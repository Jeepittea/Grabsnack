package com.grabsnack.backend.features.products;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public PagedProductResponse getAllProducts(String search, String category, int page, int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);
        Page<Product> result;

        if (search != null && !search.isBlank()) {
            result = productRepository.findByNameContainingIgnoreCase(search, pageable);
        } else if (category != null && !category.isBlank() && !category.equalsIgnoreCase("All")) {
            result = productRepository.findByCategory(category, pageable);
        } else {
            result = productRepository.findAll(pageable);
        }

        return new PagedProductResponse(result.getContent(), page, limit, result.getTotalElements());
    }

    public Product getById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product create(ProductRequest req) {
        Product p = new Product();
        applyRequest(p, req);
        return productRepository.save(p);
    }

    public Product update(Long id, ProductRequest req) {
        Product p = getById(id);
        applyRequest(p, req);
        return productRepository.save(p);
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    private void applyRequest(Product p, ProductRequest req) {
        if (req.getName() != null)        p.setName(req.getName());
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        if (req.getPrice() != null)       p.setPrice(req.getPrice());
        if (req.getStock() != null)       p.setStock(req.getStock());
        if (req.getImageUrl() != null)    p.setImageUrl(req.getImageUrl());
        if (req.getCategory() != null)    p.setCategory(req.getCategory());
        if (req.getEmoji() != null)       p.setEmoji(req.getEmoji());
        if (req.getRating() != null)      p.setRating(req.getRating());
    }
}
