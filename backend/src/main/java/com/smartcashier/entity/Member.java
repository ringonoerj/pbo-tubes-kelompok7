package com.smartcashier.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "member")
public class Member extends User {
    @Column(name = "join_date")
    private String joinDate;

    @Column(name = "discount_rate")
    private double discountRate = 0.05; // Default 5%

    // Default constructor for JPA
    public Member() {
        super();
    }

    public Member(String id, String name, String phoneNumber, String joinDate, double discountRate) {
        super(id, name, phoneNumber);
        this.joinDate = joinDate;
        this.discountRate = discountRate;
    }

    // Method to apply discount, returns the discounted amount
    public double applyDiscount(double amount) {
        return amount * (1.0 - this.discountRate);
    }

    public String getJoinDate() { return joinDate; }
    public void setJoinDate(String joinDate) { this.joinDate = joinDate; }

    public double getDiscountRate() { return discountRate; }
    public void setDiscountRate(double discountRate) { this.discountRate = discountRate; }

    @Override
    public void displayProfile() {
        System.out.println("=== Profil Member ===");
        System.out.println("ID Member   : " + this.id);
        System.out.println("Nama        : " + this.name);
        System.out.println("No HP       : " + this.phoneNumber);
        System.out.println("Tanggal Join: " + this.joinDate);
        System.out.println("Rate Diskon : " + (this.discountRate * 100) + "%");
        System.out.println("=======================");
    }
}
