package com.smartcashier.service;

import com.smartcashier.dto.ReceiptResponse;
import com.smartcashier.dto.TransactionRequest;
import com.smartcashier.entity.Karyawan;
import com.smartcashier.entity.Member;
import com.smartcashier.entity.Product;
import com.smartcashier.entity.Transaction;
import com.smartcashier.entity.TransactionItem;
import com.smartcashier.repository.KaryawanRepository;
import com.smartcashier.repository.MemberRepository;
import com.smartcashier.repository.ProductRepository;
import com.smartcashier.repository.TransactionRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private KaryawanRepository karyawanRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Transactional
    public ReceiptResponse createTransaction(TransactionRequest request, String karyawanId) {
        // 1. Look up Karyawan
        Karyawan karyawan = karyawanRepository.findById(karyawanId)
                .orElseThrow(() -> new RuntimeException("Karyawan tidak ditemukan dengan ID: " + karyawanId));

        // 2. Create Transaction
        Transaction transaction = new Transaction();
        transaction.setKaryawan(karyawan);
        transaction.setTransactionDate(LocalDateTime.now());
        
        // Generate Transaction ID: TX-YYYYMMDD-XXXX
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = transactionRepository.count();
        String generatedId = "TX-" + datePart + "-" + String.format("%04d", count + 1);
        while (transactionRepository.findByTransactionId(generatedId).isPresent()) {
            count++;
            generatedId = "TX-" + datePart + "-" + String.format("%04d", count + 1);
        }
        transaction.setTransactionId(generatedId);

        // 3. Look up Member (optional)
        if (request.getMemberPhone() != null && !request.getMemberPhone().trim().isEmpty()) {
            Optional<Member> memberOpt = memberRepository.findByPhoneNumber(request.getMemberPhone());
            memberOpt.ifPresent(transaction::setMember);
        }

        // 4. Add items
        List<TransactionItem> items = new ArrayList<>();
        for (TransactionRequest.ItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produk tidak ditemukan dengan ID: " + itemReq.getProductId()));
            
            // Decrease stock
            productService.decreaseStock(product.getId(), itemReq.getQuantity());

            TransactionItem transactionItem = new TransactionItem();
            transactionItem.setTransaction(transaction);
            transactionItem.setProduct(product);
            transactionItem.setQuantity(itemReq.getQuantity());
            
            items.add(transactionItem);
        }
        transaction.setItems(items);

        // 5. Calculate total (uses CalculatorTools internally)
        transaction.calculateTotal();

        // 6. Save Transaction
        Transaction savedTransaction = transactionRepository.save(transaction);

        // 7. Update Karyawan KPI (add 5.0 points)
        karyawan.addKpi(5.0);
        karyawanRepository.save(karyawan);

        // 8. Generate ReceiptResponse
        return convertToReceiptResponse(savedTransaction);
    }

    public ReceiptResponse getReceipt(String transactionId) {
        Transaction transaction = transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaksi tidak ditemukan dengan ID: " + transactionId));
        return convertToReceiptResponse(transaction);
    }

    private ReceiptResponse convertToReceiptResponse(Transaction transaction) {
        ReceiptResponse response = new ReceiptResponse();
        response.setTransactionId(transaction.getTransactionId());
        response.setKaryawanName(transaction.getKaryawan().getName());
        if (transaction.getMember() != null) {
            response.setMemberName(transaction.getMember().getName());
            response.setDiscountRate(transaction.getMember().getDiscountRate());
        } else {
            response.setMemberName("-");
            response.setDiscountRate(0.0);
        }
        response.setTransactionDate(transaction.getTransactionDate());
        response.setTotalAmount(transaction.getTotalAmount());

        List<ReceiptResponse.ReceiptItem> receiptItems = new ArrayList<>();
        for (TransactionItem item : transaction.getItems()) {
            ReceiptResponse.ReceiptItem receiptItem = new ReceiptResponse.ReceiptItem(
                    item.getProduct().getProductName(),
                    item.getProduct().getCategory(),
                    item.getProduct().getPrice(),
                    item.getQuantity(),
                    item.getSubtotal()
            );
            receiptItems.add(receiptItem);
        }
        response.setItems(receiptItems);
        return response;
    }
}
