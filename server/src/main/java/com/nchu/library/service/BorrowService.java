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
        if (record.getStatus() != BorrowRecord.BorrowStatus.borrowed
                && record.getStatus() != BorrowRecord.BorrowStatus.overdue) {
            throw new RuntimeException("该书已归还");
        }

        record.setReturnDate(LocalDateTime.now());
        record.setStatus(BorrowRecord.BorrowStatus.returned);

        Book book = record.getBook();
        book.setAvailable(book.getAvailable() + 1);
        bookRepository.save(book);

        return borrowRecordRepository.save(record);
    }

    @Transactional(readOnly = true)
    public List<BorrowRecord> getCurrentBorrows(Long userId) {
        return borrowRecordRepository.findByUserIdAndStatus(
                userId, BorrowRecord.BorrowStatus.borrowed);
    }

    @Transactional(readOnly = true)
    public Page<BorrowRecord> getBorrowHistory(Long userId, Pageable pageable) {
        return borrowRecordRepository.findByUserIdOrderByBorrowDateDesc(userId, pageable);
    }
}
