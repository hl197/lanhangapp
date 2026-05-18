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
@RequestMapping("/api/borrows")
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
