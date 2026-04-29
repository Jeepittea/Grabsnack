package com.grabsnack.backend.repository;

import com.grabsnack.backend.model.Cart;
import com.grabsnack.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
