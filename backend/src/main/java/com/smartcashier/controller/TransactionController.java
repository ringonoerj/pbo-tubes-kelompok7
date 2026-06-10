package com.smartcashier.controller;

import com.smartcashier.dto.ReceiptResponse;
import com.smartcashier.dto.TransactionRequest;
import com.smartcashier.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping
    public ResponseEntity<ReceiptResponse> createTransaction(
            @RequestBody TransactionRequest request,
            @RequestHeader("X-Karyawan-Id") String karyawanId) {
        try {
            ReceiptResponse response = transactionService.createTransaction(request, karyawanId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/receipt")
    public ResponseEntity<ReceiptResponse> getReceipt(@PathVariable("id") String transactionId) {
        try {
            ReceiptResponse response = transactionService.getReceipt(transactionId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
