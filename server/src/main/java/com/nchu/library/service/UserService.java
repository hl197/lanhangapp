package com.nchu.library.service;

import com.nchu.library.model.Card;
import com.nchu.library.model.User;
import com.nchu.library.repository.CardRepository;
import com.nchu.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CardRepository cardRepository;

    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
    }

    public Card getCardStatus(Long userId) {
        return cardRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("借阅证不存在"));
    }
}
