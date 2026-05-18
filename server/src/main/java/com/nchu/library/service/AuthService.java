package com.nchu.library.service;

import com.nchu.library.dto.LoginRequest;
import com.nchu.library.dto.RegisterRequest;
import com.nchu.library.model.Card;
import com.nchu.library.model.User;
import com.nchu.library.repository.CardRepository;
import com.nchu.library.repository.UserRepository;
import com.nchu.library.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CardRepository cardRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByStudentId(req.getStudentId())) {
            throw new RuntimeException("该学号已注册");
        }

        User user = User.builder()
                .studentId(req.getStudentId())
                .password(passwordEncoder.encode(req.getPassword()))
                .name(req.getName())
                .phone(req.getPhone())
                .build();
        user = userRepository.save(user);

        Card card = Card.builder()
                .user(user)
                .cardNo("LIB" + user.getStudentId())
                .status(Card.CardStatus.active)
                .build();
        cardRepository.save(card);

        String token = jwtUtil.generateToken(user.getId(), user.getStudentId());
        return Map.of("token", token, "userId", user.getId(), "name", user.getName());
    }

    public Map<String, Object> login(LoginRequest req) {
        User user = userRepository.findByStudentId(req.getStudentId())
                .orElseThrow(() -> new RuntimeException("学号或密码错误"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("学号或密码错误");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getStudentId());
        return Map.of("token", token, "userId", user.getId(), "name", user.getName());
    }
}
