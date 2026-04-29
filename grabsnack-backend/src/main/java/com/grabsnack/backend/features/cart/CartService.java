package com.grabsnack.backend.features.cart;

import com.grabsnack.backend.features.auth.User;
import com.grabsnack.backend.features.auth.UserRepository;
import com.grabsnack.backend.features.products.Product;
import com.grabsnack.backend.features.products.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Cart getCartForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
    }

    public CartItem addItem(String email, CartItemRequest req) {
        Cart cart    = getCartForUser(email);
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst()
                .map(existing -> {
                    existing.setQuantity(existing.getQuantity() + req.getQuantity());
                    return cartItemRepository.save(existing);
                })
                .orElseGet(() -> {
                    CartItem item = new CartItem();
                    item.setCart(cart);
                    item.setProduct(product);
                    item.setQuantity(req.getQuantity());
                    return cartItemRepository.save(item);
                });
    }

    public CartItem updateItem(String email, Long itemId, Integer quantity) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!item.getCart().getUser().getEmail().equals(email)) throw new RuntimeException("Forbidden");
        if (quantity <= 0) { cartItemRepository.delete(item); return null; }
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }

    public void removeItem(String email, Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!item.getCart().getUser().getEmail().equals(email)) throw new RuntimeException("Forbidden");
        cartItemRepository.delete(item);
    }

    public void clearCart(String email) {
        Cart cart = getCartForUser(email);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
