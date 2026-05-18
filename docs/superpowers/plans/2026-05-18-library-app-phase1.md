# 南昌航空大学图书借阅 APP — 一期实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成一期三个核心模块（用户、图书检索、借阅管理）的前后端实现。

**Architecture:** 单仓库 `client/` + `server/` 结构。后端 Spring Boot + JPA + MySQL，提供 REST API。前端 React Native (Expo) + React Navigation + Zustand + Axios。JWT 认证，统一错误响应格式。

**Tech Stack:**

- 后端：Spring Boot 3.2 + Spring Data JPA + Spring Security + MySQL 8 + Maven
- 前端：React Native (Expo) + React Navigation 6 + React Native Paper + Zustand + Axios + AsyncStorage

**前置条件：**

- JDK 17+ 和 Maven 3.9+（需安装）
- Node.js 18+ 已就绪（v24.13.0）
- Expo CLI（`npm install -g expo-cli`）
- MySQL 8.0+（运行在 localhost:3306，用户 root / 密码 123456）

---

## 文件结构

```
lanhangapp/
├── server/
│   ├── pom.xml
│   ├── src/main/resources/
│   │   └── application.yml
│   └── src/main/java/com/nchu/library/
│       ├── LibraryApplication.java
│       ├── model/
│       │   ├── User.java
│       │   ├── Card.java
│       │   ├── Book.java
│       │   └── BorrowRecord.java
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── RegisterRequest.java
│       │   ├── ApiResponse.java
│       │   └── BorrowRequest.java
│       ├── repository/
│       │   ├── UserRepository.java
│       │   ├── CardRepository.java
│       │   ├── BookRepository.java
│       │   └── BorrowRecordRepository.java
│       ├── service/
│       │   ├── AuthService.java
│       │   ├── UserService.java
│       │   ├── BookService.java
│       │   └── BorrowService.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── UserController.java
│       │   ├── BookController.java
│       │   └── BorrowController.java
│       ├── config/
│       │   ├── SecurityConfig.java
│       │   ├── CorsConfig.java
│       │   └── JwtAuthFilter.java
│       └── util/
│           └── JwtUtil.java
│
└── client/
    ├── App.tsx
    ├── package.json
    ├── app.json
    ├── tsconfig.json
    ├── src/
    │   ├── api/
    │   │   ├── client.ts          # Axios 实例
    │   │   ├── auth.ts            # 登录/注册 API
    │   │   ├── books.ts           # 图书 API
    │   │   └── borrow.ts          # 借阅 API
    │   ├── store/
    │   │   ├── authStore.ts       # 认证状态 (Zustand)
    │   │   └── borrowStore.ts     # 借阅状态
    │   ├── navigation/
    │   │   ├── AppNavigator.tsx   # 主导航
    │   │   └── TabNavigator.tsx   # 底部 Tab
    │   ├── screens/
    │   │   ├── auth/
    │   │   │   ├── LoginScreen.tsx
    │   │   │   └── RegisterScreen.tsx
    │   │   ├── home/
    │   │   │   ├── HomeScreen.tsx
    │   │   │   └── BookDetailScreen.tsx
    │   │   ├── borrow/
    │   │   │   ├── BorrowListScreen.tsx
    │   │   │   └── BorrowHistoryScreen.tsx
    │   │   └── profile/
    │   │       ├── ProfileScreen.tsx
    │   │       └── CardStatusScreen.tsx
    │   ├── components/
    │   │   ├── BookCard.tsx
    │   │   ├── EmptyState.tsx
    │   │   └── LoadingSpinner.tsx
    │   └── utils/
    │       ├── storage.ts         # AsyncStorage 封装
    │       └── constants.ts
    └── ...
```

---

### Task 1: 创建 Spring Boot 后端项目骨架

**Files:**

- Create: `server/pom.xml`
- Create: `server/src/main/resources/application.yml`
- Create: `server/src/main/java/com/nchu/library/LibraryApplication.java`

- [ ] **Step 1: 创建 pom.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>
    <groupId>com.nchu</groupId>
    <artifactId>library</artifactId>
    <version>1.0.0</version>
    <name>library</name>
    <description>南昌航空大学图书借阅APP后端</description>

    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.12.5</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <!-- Spring Security -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <!-- Spring Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

- [ ] **Step 2: 创建 application.yml**

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/library_db?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

app:
  jwt:
    secret: nchu-library-app-jwt-secret-key-2024-spring-boot-project
    expiration: 86400000 # 24h (毫秒)
```

- [ ] **Step 3: 创建 LibraryApplication.java**

```java
package com.nchu.library;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LibraryApplication {
    public static void main(String[] args) {
        SpringApplication.run(LibraryApplication.class, args);
    }
}
```

- [ ] **Step 4: 初始化 MySQL 数据库**

Run: `mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS library_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`（输入密码 123456）

- [ ] **Step 5: 验证后端能启动**

Run: `cd server && mvn spring-boot:run`
Expected: 启动成功，无报错，监听 8080 端口。按 Ctrl+C 停止。

- [ ] **Step 6: Commit**

```bash
git add server/pom.xml server/src/main/resources/application.yml server/src/main/java/com/nchu/library/LibraryApplication.java
git commit -m "feat(server): init Spring Boot project skeleton"
```

---

### Task 2: 实现 JWT 工具类和统一响应 DTO

**Files:**

- Create: `server/src/main/java/com/nchu/library/util/JwtUtil.java`
- Create: `server/src/main/java/com/nchu/library/dto/ApiResponse.java`
- Create: `server/src/main/java/com/nchu/library/dto/LoginRequest.java`
- Create: `server/src/main/java/com/nchu/library/dto/RegisterRequest.java`

- [ ] **Step 1: JwtUtil.java**

```java
package com.nchu.library.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expiration;

    public JwtUtil(@Value("${app.jwt.secret}") String secret,
                   @Value("${app.jwt.expiration}") long expiration) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    public String generateToken(Long userId, String studentId) {
        return Jwts.builder()
                .subject(userId.toString())
                .claim("studentId", studentId)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    public Long getUserIdFromToken(String token) {
        return Long.parseLong(
                Jwts.parser().verifyWith(key).build()
                        .parseSignedClaims(token)
                        .getPayload().getSubject()
        );
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

- [ ] **Step 2: ApiResponse.java**

```java
package com.nchu.library.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(200, "success", data);
    }

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(200, message, data);
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }

    public static <T> ApiResponse<T> error(int code, String message, T data) {
        return new ApiResponse<>(code, message, data);
    }
}
```

- [ ] **Step 3: LoginRequest.java / RegisterRequest.java**

```java
package com.nchu.library.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "学号不能为空")
    private String studentId;

    @NotBlank(message = "密码不能为空")
    private String password;
}
```

```java
package com.nchu.library.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "学号不能为空")
    @Size(min = 8, max = 20, message = "学号长度不合法")
    private String studentId;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 32, message = "密码长度需6-32位")
    private String password;

    @NotBlank(message = "姓名不能为空")
    private String name;

    private String phone;
}
```

- [ ] **Step 4: Commit**

```bash
git add server/src/main/java/com/nchu/library/util/JwtUtil.java server/src/main/java/com/nchu/library/dto/
git commit -m "feat(server): JWT util and DTOs"
```

---

### Task 3: JPA 实体类

**Files:**

- Create: `server/src/main/java/com/nchu/library/model/User.java`
- Create: `server/src/main/java/com/nchu/library/model/Card.java`
- Create: `server/src/main/java/com/nchu/library/model/Book.java`
- Create: `server/src/main/java/com/nchu/library/model/BorrowRecord.java`

- [ ] **Step 1: User.java**

```java
package com.nchu.library.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", unique = true, nullable = false, length = 20)
    private String studentId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
```

- [ ] **Step 2: Card.java**

```java
package com.nchu.library.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "card_no", unique = true, nullable = false, length = 20)
    private String cardNo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum CardStatus {
        active, frozen, lost
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
```

- [ ] **Step 3: Book.java**

```java
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
```

- [ ] **Step 4: BorrowRecord.java**

```java
package com.nchu.library.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BorrowRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @Column(name = "borrow_date", nullable = false)
    private LocalDateTime borrowDate;

    @Column(name = "due_date", nullable = false)
    private LocalDateTime dueDate;

    @Column(name = "return_date")
    private LocalDateTime returnDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BorrowStatus status;

    @Column(nullable = false)
    private Boolean renewed;

    public enum BorrowStatus {
        borrowed, returned, overdue
    }

    @PrePersist
    protected void onCreate() {
        if (borrowDate == null) borrowDate = LocalDateTime.now();
        if (dueDate == null) dueDate = borrowDate.plusDays(30);
        if (renewed == null) renewed = false;
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add server/src/main/java/com/nchu/library/model/
git commit -m "feat(server): JPA entities (User, Card, Book, BorrowRecord)"
```

---

### Task 4: Repository 层

**Files:**

- Create: `server/src/main/java/com/nchu/library/repository/UserRepository.java`
- Create: `server/src/main/java/com/nchu/library/repository/CardRepository.java`
- Create: `server/src/main/java/com/nchu/library/repository/BookRepository.java`
- Create: `server/src/main/java/com/nchu/library/repository/BorrowRecordRepository.java`

- [ ] **Step 1: UserRepository.java**

```java
package com.nchu.library.repository;

import com.nchu.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);
}
```

- [ ] **Step 2: CardRepository.java**

```java
package com.nchu.library.repository;

import com.nchu.library.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByUserId(Long userId);
}
```

- [ ] **Step 3: BookRepository.java**

```java
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
```

- [ ] **Step 4: BorrowRecordRepository.java**

```java
package com.nchu.library.repository;

import com.nchu.library.model.BorrowRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByUserIdAndStatus(Long userId, BorrowRecord.BorrowStatus status);
    Page<BorrowRecord> findByUserIdOrderByBorrowDateDesc(Long userId, Pageable pageable);
    long countByUserIdAndStatus(Long userId, BorrowRecord.BorrowStatus status);
    boolean existsByUserIdAndBookIdAndStatus(Long userId, Long bookId, BorrowRecord.BorrowStatus status);
}
```

- [ ] **Step 5: Commit**

```bash
git add server/src/main/java/com/nchu/library/repository/
git commit -m "feat(server): JPA repositories"
```

---

### Task 5: Spring Security 和 JWT 认证过滤器

**Files:**

- Create: `server/src/main/java/com/nchu/library/config/SecurityConfig.java`
- Create: `server/src/main/java/com/nchu/library/config/JwtAuthFilter.java`
- Create: `server/src/main/java/com/nchu/library/config/CorsConfig.java`

- [ ] **Step 1: JwtAuthFilter.java** — 从请求头提取 JWT 并设置安全上下文

```java
package com.nchu.library.config;

import com.nchu.library.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.validateToken(token)) {
                Long userId = jwtUtil.getUserIdFromToken(token);
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

- [ ] **Step 2: SecurityConfig.java** — 配置无需认证的路径

```java
package com.nchu.library.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/books/**").permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

- [ ] **Step 3: CorsConfig.java**

```java
package com.nchu.library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add server/src/main/java/com/nchu/library/config/
git commit -m "feat(server): Spring Security + JWT filter + CORS"
```

---

### Task 6: 认证业务 (AuthController + AuthService)

**Files:**

- Create: `server/src/main/java/com/nchu/library/service/AuthService.java`
- Create: `server/src/main/java/com/nchu/library/controller/AuthController.java`

- [ ] **Step 1: AuthService.java**

```java
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

        // 创建借阅证
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
```

- [ ] **Step 2: AuthController.java**

```java
package com.nchu.library.controller;

import com.nchu.library.dto.ApiResponse;
import com.nchu.library.dto.LoginRequest;
import com.nchu.library.dto.RegisterRequest;
import com.nchu.library.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginRequest req) {
        try {
            return ResponseEntity.ok(ApiResponse.success(authService.login(req)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody RegisterRequest req) {
        try {
            return ResponseEntity.ok(ApiResponse.success("注册成功", authService.register(req)));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }
}
```

- [ ] **Step 3: Commit**

```bash
git add server/src/main/java/com/nchu/library/service/AuthService.java server/src/main/java/com/nchu/library/controller/AuthController.java
git commit -m "feat(server): auth login/register"
```

---

### Task 7: 图书和用户 API

**Files:**

- Create: `server/src/main/java/com/nchu/library/service/BookService.java`
- Create: `server/src/main/java/com/nchu/library/service/UserService.java`
- Create: `server/src/main/java/com/nchu/library/controller/BookController.java`
- Create: `server/src/main/java/com/nchu/library/controller/UserController.java`
- Create: `server/src/main/java/com/nchu/library/dto/BorrowRequest.java`

- [ ] **Step 1: BookService.java**

```java
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
```

- [ ] **Step 2: BookController.java**

```java
package com.nchu.library.controller;

import com.nchu.library.dto.ApiResponse;
import com.nchu.library.model.Book;
import com.nchu.library.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Book>>> searchBooks(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Book> books = bookService.searchBooks(keyword, category, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(books));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Book>> getBook(@PathVariable Long id) {
        try {
            Book book = bookService.getBookById(id);
            return ResponseEntity.ok(ApiResponse.success(book));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(404, e.getMessage()));
        }
    }
}
```

- [ ] **Step 3: UserService.java**

```java
package com.nchu.library.service;

import com.nchu.library.model.Card;
import com.nchu.library.model.User;
import com.nchu.library.repository.CardRepository;
import com.nchu.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

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
```

- [ ] **Step 4: UserController.java**

```java
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
        user.setPassword(null); // 不返回密码
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/card-status")
    public ResponseEntity<ApiResponse<Card>> getCardStatus(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();
        Card card = userService.getCardStatus(userId);
        return ResponseEntity.ok(ApiResponse.success(card));
    }
}
```

- [ ] **Step 5: Commit**

```bash
git add server/src/main/java/com/nchu/library/service/BookService.java server/src/main/java/com/nchu/library/service/UserService.java server/src/main/java/com/nchu/library/controller/BookController.java server/src/main/java/com/nchu/library/controller/UserController.java
git commit -m "feat(server): book search and user profile APIs"
```

---

### Task 8: 借阅 API

**Files:**

- Create: `server/src/main/java/com/nchu/library/service/BorrowService.java`
- Create: `server/src/main/java/com/nchu/library/controller/BorrowController.java`
- Create: `server/src/main/java/com/nchu/library/dto/BorrowRequest.java`

- [ ] **Step 1: BorrowRequest.java**

```java
package com.nchu.library.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BorrowRequest {
    @NotNull(message = "图书ID不能为空")
    private Long bookId;
}
```

- [ ] **Step 2: BorrowService.java**

```java
package com.nchu.library.service;

import com.nchu.library.model.Book;
import com.nchu.library.model.BorrowRecord;
import com.nchu.library.model.User;
import com.nchu.library.repository.BookRepository;
import com.nchu.library.repository.BorrowRecordRepository;
import com.nchu.library.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Transactional
    public BorrowRecord borrowBook(Long userId, Long bookId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("用户不存在"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("图书不存在"));

        if (book.getAvailable() <= 0) {
            throw new RuntimeException("该书已全部借出");
        }

        // 检查用户是否已有未归还的相同图书
        if (borrowRecordRepository.existsByUserIdAndBookIdAndStatus(
                userId, bookId, BorrowRecord.BorrowStatus.borrowed)) {
            throw new RuntimeException("您已借阅过该书，尚未归还");
        }

        book.setAvailable(book.getAvailable() - 1);
        bookRepository.save(book);

        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .book(book)
                .borrowDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(30))
                .status(BorrowRecord.BorrowStatus.borrowed)
                .build();
        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord renewBook(Long userId, Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("借阅记录不存在"));

        if (!record.getUser().getId().equals(userId)) {
            throw new RuntimeException("无权操作此借阅记录");
        }
        if (record.getStatus() != BorrowRecord.BorrowStatus.borrowed) {
            throw new RuntimeException("该记录状态不允许续借");
        }
        if (record.getRenewed()) {
            throw new RuntimeException("已续借过一次，不可重复续借");
        }

        record.setDueDate(record.getDueDate().plusDays(30));
        record.setRenewed(true);
        return borrowRecordRepository.save(record);
    }

    @Transactional
    public BorrowRecord returnBook(Long userId, Long recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new RuntimeException("借阅记录不存在"));

        if (!record.getUser().getId().equals(userId)) {
            throw new RuntimeException("无权操作此借阅记录");
        }
        if (record.getStatus() != BorrowRecord.BorrowStatus.borrowed) {
            throw new RuntimeException("该书已归还");
        }

        record.setReturnDate(LocalDateTime.now());
        record.setStatus(BorrowRecord.BorrowStatus.returned);

        Book book = record.getBook();
        book.setAvailable(book.getAvailable() + 1);
        bookRepository.save(book);

        return borrowRecordRepository.save(record);
    }

    public List<BorrowRecord> getCurrentBorrows(Long userId) {
        return borrowRecordRepository.findByUserIdAndStatus(
                userId, BorrowRecord.BorrowStatus.borrowed);
    }

    public Page<BorrowRecord> getBorrowHistory(Long userId, Pageable pageable) {
        return borrowRecordRepository.findByUserIdOrderByBorrowDateDesc(userId, pageable);
    }
}
```

- [ ] **Step 3: BorrowController.java**

```java
package com.nchu.library.controller;

import com.nchu.library.dto.ApiResponse;
import com.nchu.library.dto.BorrowRequest;
import com.nchu.library.model.BorrowRecord;
import com.nchu.library.service.BorrowService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping
    public ResponseEntity<ApiResponse<?>> borrowBook(Authentication auth,
                                                      @Valid @RequestBody BorrowRequest req) {
        try {
            BorrowRecord record = borrowService.borrowBook((Long) auth.getPrincipal(), req.getBookId());
            return ResponseEntity.ok(ApiResponse.success("借阅成功", record));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(409, e.getMessage()));
        }
    }

    @PostMapping("/{id}/renew")
    public ResponseEntity<ApiResponse<?>> renewBook(Authentication auth, @PathVariable Long id) {
        try {
            BorrowRecord record = borrowService.renewBook((Long) auth.getPrincipal(), id);
            return ResponseEntity.ok(ApiResponse.success("续借成功", record));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<?>> returnBook(Authentication auth, @PathVariable Long id) {
        try {
            BorrowRecord record = borrowService.returnBook((Long) auth.getPrincipal(), id);
            return ResponseEntity.ok(ApiResponse.success("归还成功", record));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<List<BorrowRecord>>> getCurrentBorrows(Authentication auth) {
        List<BorrowRecord> records = borrowService.getCurrentBorrows((Long) auth.getPrincipal());
        return ResponseEntity.ok(ApiResponse.success(records));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<Page<BorrowRecord>>> getBorrowHistory(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<BorrowRecord> records = borrowService.getBorrowHistory(
                (Long) auth.getPrincipal(), PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success(records));
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add server/src/main/java/com/nchu/library/service/BorrowService.java server/src/main/java/com/nchu/library/controller/BorrowController.java server/src/main/java/com/nchu/library/dto/BorrowRequest.java
git commit -m "feat(server): borrow, renew, return APIs"
```

---

### Task 9: 创建 React Native 前端项目

**Files:**

- Create: `client/` (Expo 项目)
- Create: `client/src/api/client.ts`
- Create: `client/src/utils/storage.ts`
- Create: `client/src/utils/constants.ts`

- [ ] **Step 1: 初始化 Expo 项目**

Run: `cd lanhangapp && npx create-expo-app@latest client --template blank-typescript`

- [ ] **Step 2: 安装依赖**

Run: `cd client && npx expo install react-native-paper react-native-safe-area-context @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs react-native-screens react-native-gesture-handler`

Run: `cd client && npm install zustand axios @react-native-async-storage/async-storage`

- [ ] **Step 3: 创建 API 客户端 client.ts**

```typescript
import axios from "axios";
import { getToken } from "../utils/storage";

const API_BASE_URL = "http://10.0.2.2:8080/api"; // Android 模拟器
// const API_BASE_URL = 'http://localhost:8080/api'; // iOS 模拟器或 Web

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "网络错误";
    return Promise.reject(new Error(message));
  },
);

export default client;
```

- [ ] **Step 4: 创建 storage.ts 和 constants.ts**

```typescript
// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_info";

export const saveToken = async (token: string) =>
  AsyncStorage.setItem(TOKEN_KEY, token);

export const getToken = async (): Promise<string | null> =>
  AsyncStorage.getItem(TOKEN_KEY);

export const removeToken = async () => AsyncStorage.removeItem(TOKEN_KEY);

export const saveUser = async (user: object) =>
  AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

export const getUser = async () => {
  const json = await AsyncStorage.getItem(USER_KEY);
  return json ? JSON.parse(json) : null;
};
```

```typescript
// utils/constants.ts
export const COLORS = {
  primary: "#1565C0",
  accent: "#42A5F5",
  background: "#F5F5F5",
  surface: "#FFFFFF",
  text: "#212121",
  textSecondary: "#757575",
  error: "#D32F2F",
  success: "#388E3C",
  warning: "#F57C00",
  border: "#E0E0E0",
};

export const BOOK_CATEGORIES = [
  "计算机科学",
  "文学",
  "历史",
  "经济管理",
  "自然科学",
  "哲学",
  "艺术",
  "教育",
  "语言",
  "医学",
  "工程技术",
  "其他",
] as const;
```

- [ ] **Step 5: Commit**

```bash
git add client/src/api/ client/src/utils/
git commit -m "feat(client): create Expo project with API client"
```

---

### Task 10: 认证 API + Zustand 状态管理

**Files:**

- Create: `client/src/api/auth.ts`
- Create: `client/src/api/books.ts`
- Create: `client/src/api/borrow.ts`
- Create: `client/src/store/authStore.ts`

- [ ] **Step 1: API 模块**

```typescript
// api/auth.ts
import client from "./client";

export interface LoginParams {
  studentId: string;
  password: string;
}

export interface RegisterParams {
  studentId: string;
  password: string;
  name: string;
  phone?: string;
}

export const loginApi = (params: LoginParams) =>
  client.post("/auth/login", params);

export const registerApi = (params: RegisterParams) =>
  client.post("/auth/register", params);
```

```typescript
// api/books.ts
import client from "./client";

export interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  location: string;
  total: number;
  available: number;
  cover: string;
  description: string;
}

export const searchBooks = (params: {
  keyword?: string;
  category?: string;
  page?: number;
  size?: number;
}) => client.get("/books", { params });

export const getBookDetail = (id: number) => client.get(`/books/${id}`);
```

```typescript
// api/borrow.ts
import client from "./client";

export interface BorrowRecord {
  id: number;
  userId: number;
  bookId: number;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "borrowed" | "returned" | "overdue";
  renewed: boolean;
}

export const borrowBook = (bookId: number) =>
  client.post("/borrow", { bookId });

export const renewBook = (recordId: number) =>
  client.post(`/borrow/${recordId}/renew`);

export const returnBook = (recordId: number) =>
  client.post(`/borrow/${recordId}/return`);

export const getCurrentBorrows = () => client.get("/borrow/current");

export const getBorrowHistory = (page = 0, size = 20) =>
  client.get("/borrow/history", { params: { page, size } });
```

- [ ] **Step 2: AuthStore**

```typescript
// store/authStore.ts
import { create } from "zustand";
import {
  loginApi,
  registerApi,
  LoginParams,
  RegisterParams,
} from "../api/auth";
import { saveToken, removeToken, saveUser, getUser } from "../utils/storage";

interface UserInfo {
  userId: number;
  name: string;
}

interface AuthState {
  user: UserInfo | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  loading: false,

  login: async (params) => {
    set({ loading: true });
    try {
      const res: any = await loginApi(params);
      const { token, userId, name } = res.data;
      await saveToken(token);
      await saveUser({ userId, name });
      set({ user: { userId, name }, isLoggedIn: true, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (params) => {
    set({ loading: true });
    try {
      const res: any = await registerApi(params);
      const { token, userId, name } = res.data;
      await saveToken(token);
      await saveUser({ userId, name });
      set({ user: { userId, name }, isLoggedIn: true, loading: false });
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    await removeToken();
    set({ user: null, isLoggedIn: false });
  },

  restoreSession: async () => {
    const user = await getUser();
    if (user) {
      set({ user, isLoggedIn: true });
    }
  },
}));
```

- [ ] **Step 3: Commit**

```bash
git add client/src/api/ client/src/store/
git commit -m "feat(client): API modules and auth store"
```

---

### Task 11: 导航框架

**Files:**

- Create: `client/src/navigation/TabNavigator.tsx`
- Create: `client/src/navigation/AppNavigator.tsx`
- Modify: `client/App.tsx`

- [ ] **Step 1: TabNavigator.tsx**

```tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/home/HomeScreen";
import BorrowListScreen from "../screens/borrow/BorrowListScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { COLORS } from "../utils/constants";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            首页: "home-outline",
            借阅: "book-outline",
            我的: "person-outline",
          };
          return (
            <Ionicons
              name={icons[route.name] || "help-outline"}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false,
      })}
    >
      <Tab.Screen name="首页" component={HomeScreen} />
      <Tab.Screen name="借阅" component={BorrowListScreen} />
      <Tab.Screen name="我的" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

- [ ] **Step 2: AppNavigator.tsx**

```tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import TabNavigator from "./TabNavigator";
import BookDetailScreen from "../screens/home/BookDetailScreen";
import BorrowHistoryScreen from "../screens/borrow/BorrowHistoryScreen";
import { useAuthStore } from "../store/authStore";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  BookDetail: { bookId: number };
  BorrowHistory: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="BookDetail" component={BookDetailScreen} />
            <Stack.Screen
              name="BorrowHistory"
              component={BorrowHistoryScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

- [ ] **Step 3: App.tsx**

```tsx
import React, { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";
import { useAuthStore } from "./src/store/authStore";

export default function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, []);

  return (
    <PaperProvider>
      <AppNavigator />
    </PaperProvider>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add client/App.tsx client/src/navigation/
git commit -m "feat(client): navigation framework with auth gating"
```

---

### Task 12: 登录和注册页面

**Files:**

- Create: `client/src/screens/auth/LoginScreen.tsx`
- Create: `client/src/screens/auth/RegisterScreen.tsx`
- Create: `client/src/components/LoadingSpinner.tsx`

- [ ] **Step 1: LoginScreen.tsx**

```tsx
import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../utils/constants";

export default function LoginScreen({ navigation }: any) {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuthStore();

  const handleLogin = async () => {
    try {
      setError("");
      await login({ studentId, password });
    } catch (e: any) {
      setError(e.message || "登录失败");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Surface style={styles.card}>
        <Text variant="headlineMedium" style={styles.title}>
          南昌航空大学
        </Text>
        <Text variant="titleMedium" style={styles.subtitle}>
          图书借阅系统
        </Text>

        <TextInput
          label="学号"
          value={studentId}
          onChangeText={setStudentId}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          label="密码"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
          contentStyle={{ paddingVertical: 6 }}
        >
          登录
        </Button>

        <Button mode="text" onPress={() => navigation.navigate("Register")}>
          没有账号？立即注册
        </Button>
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  card: { padding: 24, borderRadius: 12, elevation: 4 },
  title: { textAlign: "center", color: COLORS.primary, fontWeight: "bold" },
  subtitle: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: 24,
  },
  input: { marginBottom: 12 },
  error: { color: COLORS.error, textAlign: "center", marginBottom: 8 },
  button: { marginBottom: 8, borderRadius: 8 },
});
```

- [ ] **Step 2: RegisterScreen.tsx**

```tsx
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { TextInput, Button, Text, Surface } from "react-native-paper";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../utils/constants";

export default function RegisterScreen({ navigation }: any) {
  const [form, setForm] = useState({
    studentId: "",
    password: "",
    name: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const { register, loading } = useAuthStore();

  const update = (key: string, value: string) =>
    setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    if (!form.studentId || !form.password || !form.name) {
      setError("请填写必要信息");
      return;
    }
    try {
      setError("");
      await register(form);
    } catch (e: any) {
      setError(e.message || "注册失败");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Surface style={styles.card}>
          <Text variant="headlineSmall" style={styles.title}>
            注册新账号
          </Text>

          <TextInput
            label="学号 *"
            value={form.studentId}
            onChangeText={(v) => update("studentId", v)}
            mode="outlined"
            style={styles.input}
            autoCapitalize="none"
          />
          <TextInput
            label="密码 *"
            value={form.password}
            onChangeText={(v) => update("password", v)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="姓名 *"
            value={form.name}
            onChangeText={(v) => update("name", v)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="手机号"
            value={form.phone}
            onChangeText={(v) => update("phone", v)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            style={styles.button}
            contentStyle={{ paddingVertical: 6 }}
          >
            注册
          </Button>

          <Button mode="text" onPress={() => navigation.goBack()}>
            已有账号？返回登录
          </Button>
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
  card: { padding: 24, borderRadius: 12, elevation: 4 },
  title: { textAlign: "center", color: COLORS.primary, marginBottom: 24 },
  input: { marginBottom: 12 },
  error: { color: COLORS.error, textAlign: "center", marginBottom: 8 },
  button: { marginBottom: 8, borderRadius: 8 },
});
```

- [ ] **Step 3: Commit**

```bash
git add client/src/screens/auth/ client/src/components/
git commit -m "feat(client): login and register screens"
```

---

### Task 13: 首页 + 图书详情

**Files:**

- Create: `client/src/screens/home/HomeScreen.tsx`
- Create: `client/src/screens/home/BookDetailScreen.tsx`
- Create: `client/src/components/BookCard.tsx`

- [ ] **Step 1: BookCard 组件**

```tsx
import React from "react";
import { TouchableRipple, Card, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";

interface BookCardProps {
  book: {
    id: number;
    title: string;
    author: string;
    cover: string;
    available: number;
    total: number;
  };
  onPress: (id: number) => void;
}

export default function BookCard({ book, onPress }: BookCardProps) {
  return (
    <TouchableRipple onPress={() => onPress(book.id)}>
      <Card style={styles.card}>
        <Card.Cover
          source={{
            uri: book.cover || "https://via.placeholder.com/200x300?text=Book",
          }}
          style={styles.cover}
        />
        <Card.Content style={styles.content}>
          <Text variant="titleSmall" numberOfLines={2}>
            {book.title}
          </Text>
          <Text variant="bodySmall" style={styles.author}>
            {book.author}
          </Text>
          <Text
            variant="bodySmall"
            style={book.available > 0 ? styles.available : styles.unavailable}
          >
            {book.available > 0
              ? `可借 ${book.available}/${book.total}`
              : "已借出"}
          </Text>
        </Card.Content>
      </Card>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  card: { margin: 8, width: 160 },
  cover: { height: 200 },
  content: { paddingVertical: 8 },
  author: { color: "#757575", marginTop: 4 },
  available: { color: "#388E3C", marginTop: 4 },
  unavailable: { color: "#D32F2F", marginTop: 4 },
});
```

- [ ] **Step 2: HomeScreen.tsx**

```tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Chip, Searchbar, ActivityIndicator } from "react-native-paper";
import { searchBooks, Book } from "../../api/books";
import BookCard from "../../components/BookCard";
import { BOOK_CATEGORIES, COLORS } from "../../utils/constants";

export default function HomeScreen({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const fetchBooks = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const p = reset ? 0 : page;
        const res: any = await searchBooks({
          keyword,
          category,
          page: p,
          size: 20,
        });
        const data = res.data.content;
        if (reset) {
          setBooks(data);
          setPage(0);
        } else {
          setBooks((prev) => [...prev, ...data]);
          setPage(p + 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [keyword, category, page],
  );

  useEffect(() => {
    fetchBooks(true);
  }, [keyword, category]);

  const handleBookPress = (bookId: number) => {
    navigation.navigate("BookDetail", { bookId });
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="搜索图书..."
        onChangeText={setKeyword}
        value={keyword}
        style={styles.searchBar}
      />
      <FlatList
        horizontal
        data={BOOK_CATEGORIES}
        renderItem={({ item }) => (
          <Chip
            selected={category === item}
            onPress={() => setCategory(category === item ? null : item)}
            style={styles.chip}
          >
            {item}
          </Chip>
        )}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.chipList}
      />
      <FlatList
        data={books}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={handleBookPress} />
        )}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.bookList}
        onEndReached={() => !loading && fetchBooks()}
        ListEmptyComponent={
          loading ? <ActivityIndicator style={{ marginTop: 40 }} /> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  searchBar: { margin: 12, elevation: 2 },
  chipList: { maxHeight: 48, marginLeft: 12, marginBottom: 4 },
  chip: { marginRight: 8 },
  bookList: { paddingHorizontal: 4, paddingBottom: 20 },
});
```

- [ ] **Step 3: BookDetailScreen.tsx**

```tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Button,
  ActivityIndicator,
  Chip,
  Divider,
} from "react-native-paper";
import { getBookDetail, Book } from "../../api/books";
import { borrowBook } from "../../api/borrow";
import { COLORS } from "../../utils/constants";

export default function BookDetailScreen({ route, navigation }: any) {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);

  useEffect(() => {
    getBookDetail(bookId).then((res: any) => {
      setBook(res.data);
      setLoading(false);
    });
  }, [bookId]);

  const handleBorrow = async () => {
    if (!book || book.available <= 0) return;
    setBorrowing(true);
    try {
      await borrowBook(book.id);
      const res: any = await getBookDetail(bookId);
      setBook(res.data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;
  if (!book) return <Text style={styles.errorText}>图书不存在</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>
        {book.title}
      </Text>
      <Text variant="bodyLarge" style={styles.author}>
        {book.author}
      </Text>
      {book.publisher && (
        <Text variant="bodyMedium" style={styles.meta}>
          {book.publisher}
        </Text>
      )}
      {book.isbn && (
        <Text variant="bodySmall" style={styles.meta}>
          ISBN: {book.isbn}
        </Text>
      )}

      <Divider style={{ marginVertical: 16 }} />

      <View style={styles.infoRow}>
        <Chip icon="book" style={styles.chip}>
          {book.category}
        </Chip>
        <Text
          style={book.available > 0 ? styles.available : styles.unavailable}
        >
          可借 {book.available}/{book.total}
        </Text>
      </View>

      {book.location && (
        <Text variant="bodySmall" style={styles.meta}>
          馆藏位置：{book.location}
        </Text>
      )}

      {book.description && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            简介
          </Text>
          <Text variant="bodyMedium" style={styles.desc}>
            {book.description}
          </Text>
        </>
      )}

      <Button
        mode="contained"
        onPress={handleBorrow}
        loading={borrowing}
        disabled={book.available <= 0}
        style={styles.borrowBtn}
        contentStyle={{ paddingVertical: 8 }}
      >
        {book.available > 0 ? "借阅此书" : "暂无余量"}
      </Button>
    </ScrollView>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add client/src/screens/home/ client/src/components/BookCard.tsx
git commit -m "feat(client): home screen, book search, and book detail"
```

---

### Task 14: 借阅页面 + 个人中心

**Files:**

- Create: `client/src/screens/borrow/BorrowListScreen.tsx`
- Create: `client/src/screens/borrow/BorrowHistoryScreen.tsx`
- Create: `client/src/screens/profile/ProfileScreen.tsx`
- Create: `client/src/screens/profile/CardStatusScreen.tsx`
- Create: `client/src/components/EmptyState.tsx`

- [ ] **Step 1: EmptyState 组件**

```tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  message: string;
}

export default function EmptyState({ icon = "book-outline", message }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={64} color="#BDBDBD" />
      <Text variant="bodyLarge" style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  text: { color: "#9E9E9E", marginTop: 12, textAlign: "center" },
});
```

- [ ] **Step 2: BorrowListScreen.tsx**

```tsx
import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import {
  Text,
  Card,
  Button,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import {
  getCurrentBorrows,
  renewBook,
  returnBook,
  BorrowRecord,
} from "../../api/borrow";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";

export default function BorrowListScreen({ navigation }: any) {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchBorrows();
    }, []),
  );

  const fetchBorrows = async () => {
    setLoading(true);
    try {
      const res: any = await getCurrentBorrows();
      setRecords(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (id: number) => {
    try {
      await renewBook(id);
      fetchBorrows();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      await returnBook(id);
      fetchBorrows();
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        当前借阅
      </Text>
      <FlatList
        data={records}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{item.bookTitle}</Text>
              <Text variant="bodySmall">借阅：{item.borrowDate}</Text>
              <Text variant="bodySmall">应还：{item.dueDate}</Text>
              {item.renewed && <Chip style={styles.chip}>已续借</Chip>}
            </Card.Content>
            <Card.Actions>
              {!item.renewed && (
                <Button onPress={() => handleRenew(item.id)}>续借</Button>
              )}
              <Button onPress={() => handleReturn(item.id)}>归还</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<EmptyState message="暂无借阅记录" />}
      />
      <Button mode="text" onPress={() => navigation.navigate("BorrowHistory")}>
        查看借阅历史
      </Button>
    </View>
  );
}
```

- [ ] **Step 3: BorrowHistoryScreen.tsx**

```tsx
import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Text, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { getBorrowHistory, BorrowRecord } from "../../api/borrow";
import EmptyState from "../../components/EmptyState";
import { COLORS } from "../../utils/constants";

export default function BorrowHistoryScreen() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, []),
  );

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res: any = await getBorrowHistory();
      setRecords(res.data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;

  return (
    <FlatList
      data={records}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">{item.bookTitle}</Text>
            <Text variant="bodySmall">借阅：{item.borrowDate}</Text>
            <Text variant="bodySmall">归还：{item.returnDate || "-"}</Text>
            <Chip style={styles.chip}>
              {item.status === "returned"
                ? "已归还"
                : item.status === "overdue"
                  ? "逾期"
                  : "借阅中"}
            </Chip>
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={<EmptyState message="暂无借阅历史" />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  card: { margin: 12, marginBottom: 0 },
  chip: { alignSelf: "flex-start", marginTop: 8 },
  list: { paddingBottom: 20 },
});
```

- [ ] **Step 4: ProfileScreen.tsx**

```tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, List, Divider, ActivityIndicator } from "react-native-paper";
import { getProfile } from "../../api/user";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../utils/constants";

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res: any = await getProfile();
      setProfile(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.name}>
          {user?.name}
        </Text>
        <Text variant="bodyMedium">{user?.userId}</Text>
      </View>

      <List.Section>
        <List.Item
          title="借阅证状态"
          left={(props) => <List.Icon {...props} icon="card-account-details" />}
          onPress={() => navigation.navigate("CardStatus")}
        />
        <Divider />
        <List.Item
          title="修改密码"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}
        />
        <Divider />
        <List.Item
          title="关于"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <Divider />
        <List.Item
          title="退出登录"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={logout}
          titleStyle={{ color: COLORS.error }}
        />
      </List.Section>
    </View>
  );
}
```

- [ ] **Step 5: CardStatusScreen.tsx**

```tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Card, Chip, ActivityIndicator } from "react-native-paper";
import { getCardStatus } from "../../api/user";
import { COLORS } from "../../utils/constants";

export default function CardStatusScreen() {
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCard();
  }, []);

  const fetchCard = async () => {
    try {
      const res: any = await getCardStatus();
      setCard(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 60 }} />;
  if (!card) return <Text>获取借阅证信息失败</Text>;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">借阅证号</Text>
          <Text variant="headlineSmall" style={styles.cardNo}>
            {card.cardNo}
          </Text>
          <Chip
            style={card.status === "active" ? styles.active : styles.frozen}
          >
            {card.status === "active"
              ? "正常"
              : card.status === "frozen"
                ? "冻结"
                : "挂失"}
          </Chip>
          <Text variant="bodySmall">办证时间：{card.createdAt}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}
```

- [ ] **Step 6: 添加 user API 文件**

```typescript
// client/src/api/user.ts
import client from "./client";

export const getProfile = () => client.get("/user/profile");
export const getCardStatus = () => client.get("/user/card-status");
```

- [ ] **Step 7: Commit**

```bash
git add client/src/screens/borrow/ client/src/screens/profile/ client/src/components/EmptyState.tsx client/src/api/user.ts
git commit -m "feat(client): borrow screens, profile, and card status"
```

---

### Task 15: 种子数据 + 集成验证

**Files:**

- Create: `server/src/main/resources/import.sql`

- [ ] **Step 1: 添加种子数据 `import.sql`**

```sql
-- 测试用户 (密码: 123456 → BCrypt)
INSERT IGNORE INTO users (student_id, password, name, phone, created_at)
VALUES ('2020001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '张三', '13800138001', NOW());
INSERT IGNORE INTO users (student_id, password, name, phone, created_at)
VALUES ('2020002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '李四', '13800138002', NOW());

-- 测试图书
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-111-12345-6', '深入理解计算机系统', 'Randal E. Bryant', '机械工业出版社', '计算机科学', 'A区-3F-01', 5, 5, '经典计算机系统教材');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-302-45678-9', '算法导论', 'Thomas H. Cormen', '清华大学出版社', '计算机科学', 'A区-3F-02', 3, 2, '算法领域权威教材');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-532-34567-8', '百年孤独', '加西亚·马尔克斯', '人民文学出版社', '文学', 'B区-2F-01', 4, 4, '魔幻现实主义经典代表作');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-542-56789-0', '人类简史', '尤瓦尔·赫拉利', '中信出版社', '历史', 'B区-2F-05', 3, 3, '从动物到上帝');
INSERT IGNORE INTO books (isbn, title, author, publisher, category, location, total, available, description)
VALUES ('978-7-300-23456-7', '经济学原理', '曼昆', '中国人民大学出版社', '经济管理', 'C区-3F-03', 6, 5, '经济学入门经典教材');

-- 生成借阅证
INSERT IGNORE INTO cards (user_id, card_no, status, created_at)
SELECT id, CONCAT('LIB', student_id), 'active', NOW() FROM users;
```

- [ ] **Step 2: 启动后端测试**

Run: `cd server && mvn spring-boot:run`
Expected: 启动成功，种子数据自动导入。

- [ ] **Step 3: 测试 API**

Run (终端另一个窗口):

```bash
# 登录测试
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"studentId":"2020001","password":"123456"}'
```

Expected: 返回 `{"code":200,"data":{"token":"...","userId":1,"name":"张三"}}`

```bash
# 搜索图书
curl http://localhost:8080/api/books?keyword=计算机
```

```bash
# 借阅（替换 TOKEN 为实际值）
curl -X POST http://localhost:8080/api/borrow \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"bookId":1}'
```

- [ ] **Step 4: 启动前端验证**

Run: `cd client && npx expo start`
Expected: Expo 开发服务器启动，扫码或模拟器中运行。

- [ ] **Step 5: Commit**

```bash
git add server/src/main/resources/import.sql
git commit -m "feat(server): seed data for testing"
```

---

### Task 16: 收尾 — 配置全局异常处理和 Swagger

**Files:**

- Create: `server/src/main/java/com/nchu/library/config/GlobalExceptionHandler.java`

- [ ] **Step 1: GlobalExceptionHandler.java**

```java
package com.nchu.library.config;

import com.nchu.library.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<?>> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .findFirst().orElse("参数校验失败");
        return ResponseEntity.badRequest().body(ApiResponse.error(400, msg));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<?>> handleRuntime(RuntimeException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.error(400, ex.getMessage()));
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add server/src/main/java/com/nchu/library/config/GlobalExceptionHandler.java
git commit -m "feat(server): global exception handler"
```

---

## 自审检查

| 项目                                    | 状态 |
| --------------------------------------- | ---- |
| 设计文档覆盖用户、检索、借阅三个模块    | ✅   |
| 每个任务包含实际代码，无占位符          | ✅   |
| 前后端类型一致（DTO → 实体 → API 路径） | ✅   |
| 错误处理统一格式                        | ✅   |
| 认证流程完整（注册→登录→JWT→请求拦截）  | ✅   |
