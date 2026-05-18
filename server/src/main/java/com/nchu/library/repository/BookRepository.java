package com.nchu.library.repository;

import com.nchu.library.model.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, Long> {

    @Query("SELECT b FROM Book b WHERE " +
           "(:keyword IS NULL OR b.title LIKE %:keyword% OR b.author LIKE %:keyword%) AND " +
           "(:category IS NULL OR b.category = :category)")
    Page<Book> searchBooks(@Param("keyword") String keyword,
                           @Param("category") String category,
                           Pageable pageable);
}
