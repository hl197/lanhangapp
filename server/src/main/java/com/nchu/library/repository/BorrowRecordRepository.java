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
