package com.nchu.library.service;

import com.nchu.library.model.Book;
import com.nchu.library.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public Page<Book> searchBooks(String keyword, String category, Pageable pageable) {
        return bookRepository.searchBooks(keyword, category, pageable);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("图书不存在"));
    }
}
