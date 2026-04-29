package com.grabsnack.backend.features.profile;

import com.grabsnack.backend.features.auth.User;
import com.grabsnack.backend.features.auth.UserRepository;
import com.grabsnack.backend.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<User>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(user -> ResponseEntity.ok(ApiResponse.ok(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<User>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ProfileUpdateRequest request) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(user -> {
                    if (request.getFullName() != null) user.setFullName(request.getFullName());
                    if (request.getPhone() != null)    user.setPhone(request.getPhone());
                    return ResponseEntity.ok(ApiResponse.ok(userRepository.save(user)));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
