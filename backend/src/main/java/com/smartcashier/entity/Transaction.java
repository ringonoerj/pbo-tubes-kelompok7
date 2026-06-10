package com.smartcashier.entity;

import com.smartcashier.service.CalculatorTools;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "transaction")
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "transaction_id", unique = true, nullable = false)
    private String transactionId;

    @ManyToOne
    @JoinColumn(name = "karyawan_id", nullable = false)
    private Karyawan karyawan;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "total_amount", nullable = false)
    private double totalAmount;

    @Column(name = "transaction_date")
    private LocalDateTime transactionDate;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TransactionItem> items = new ArrayList<>();

    public Transaction() {}

    public void calculateTotal() {
        double subtotal = 0;
        for (TransactionItem item : items) {
            double itemSubtotal = CalculatorTools.multiply(item.getProduct().getPrice(), item.getQuantity());
            item.setSubtotal(itemSubtotal);
            subtotal = CalculatorTools.add(subtotal, itemSubtotal);
        }

        if (member != null) {
            double discountAmount = CalculatorTools.multiply(subtotal, member.getDiscountRate());
            this.totalAmount = CalculatorTools.subtract(subtotal, discountAmount);
        } else {
            this.totalAmount = subtotal;
        }
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public Karyawan getKaryawan() { return karyawan; }
    public void setKaryawan(Karyawan karyawan) { this.karyawan = karyawan; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public List<TransactionItem> getItems() { return items; }
    public void setItems(List<TransactionItem> items) { this.items = items; }
}
