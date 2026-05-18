package com.nchu.library.controller;

import com.nchu.library.dto.ApiResponse;
import com.nchu.library.model.Card;
import com.nchu.library.model.User;
import com.nchu.library.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<User>> getProfile(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        User user = userService.getUserProfile(userId);
        user.setPassword(null);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/card-status")
    public ResponseEntity<ApiResponse<Card>> getCardStatus(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Card card = userService.getCardStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(card));
    }
}
