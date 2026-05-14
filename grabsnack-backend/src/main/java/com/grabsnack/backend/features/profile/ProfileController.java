package com.grabsnack.backend.features.profile;

import com.grabsnack.backend.features.auth.User;
import com.grabsnack.backend.features.auth.UserRepository;
import com.grabsnack.backend.shared.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

    @PutMapping("/me/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody ChangePasswordRequest request) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(user -> {
                    if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .<ApiResponse<String>>body(ApiResponse.fail("AUTH-005", "Current password is incorrect"));
                    }
                    if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .<ApiResponse<String>>body(ApiResponse.fail("VAL-001", "New password must be at least 6 characters"));
                    }
                    user.setPassword(passwordEncoder.encode(request.getNewPassword()));
                    userRepository.save(user);
                    return ResponseEntity.ok(ApiResponse.ok("Password changed successfully"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
