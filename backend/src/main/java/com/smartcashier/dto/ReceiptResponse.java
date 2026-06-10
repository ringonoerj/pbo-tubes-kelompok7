package com.smartcashier.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ReceiptResponse {
    private String transactionId;
    private String karyawanName;
    private String memberName;
    private double discountRate;
    private LocalDateTime transactionDate;
    private List<ReceiptItem> items;
    private double totalAmount;

    public ReceiptResponse() {}

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getKaryawanName() { return karyawanName; }
    public void setKaryawanName(String karyawanName) { this.karyawanName = karyawanName; }

    public String getMemberName() { return memberName; }
    public void setMemberName(String memberName) { this.memberName = memberName; }

    public double getDiscountRate() { return discountRate; }
    public void setDiscountRate(double discountRate) { this.discountRate = discountRate; }

    public LocalDateTime getTransactionDate() { return transactionDate; }
    public void setTransactionDate(LocalDateTime transactionDate) { this.transactionDate = transactionDate; }

    public List<ReceiptItem> getItems() { return items; }
    public void setItems(List<ReceiptItem> items) { this.items = items; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public static class ReceiptItem {
        private String productName;
        private String category;
        private double price;
        private int quantity;
        private double subtotal;

        public ReceiptItem() {}

        public ReceiptItem(String productName, String category, double price, int quantity, double subtotal) {
            this.productName = productName;
            this.category = category;
            this.price = price;
            this.quantity = quantity;
            this.subtotal = subtotal;
        }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }

        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public double getSubtotal() { return subtotal; }
        public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
    }
}
