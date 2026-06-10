package com.smartcashier.repository;

import com.smartcashier.entity.Transaction;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    Optional<Transaction> findByTransactionId(String transactionId);
}
