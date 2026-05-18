package com.nchu.library.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "books")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String isbn;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 100)
    private String author;

    @Column(length = 100)
    private String publisher;

    @Column(length = 50)
    private String category;

    @Column(length = 100)
    private String location;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false)
    private Integer available;

    @Column(length = 500)
    private String cover;

    @Column(columnDefinition = "TEXT")
    private String description;
}
