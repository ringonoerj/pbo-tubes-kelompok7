package com.smartcashier.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "karyawan")
public class Karyawan extends User {
    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String password;

    @Column(name = "kpi_score")
    private double kpiScore;

    // Default constructor for JPA
    public Karyawan() {
        super();
    }

    public Karyawan(String id, String name, String phoneNumber, String password) {
        super(id, name, phoneNumber);
        this.employeeId = id;
        this.password = password;
        this.kpiScore = 0.0;
    }

    public boolean login(String inputId, String inputPassword) {
        if (this.employeeId.equals(inputId) && this.password.equals(inputPassword)) {
            System.out.println("Login berhasil! Selamat datang, " + this.name);
            return true;
        } else {
            System.out.println("Login gagal! ID atau Password salah.");
            return false;
        }
    }

    public double getKpi() { return this.kpiScore; }
    public void setKpi(double kpiScore) { this.kpiScore = kpiScore; }
    public void addKpi(double score) { this.kpiScore += score; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public void displayProfile() {
        System.out.println("=== Profil Karyawan ===");
        System.out.println("ID Karyawan : " + this.employeeId);
        System.out.println("Nama        : " + this.name);
        System.out.println("No HP       : " + this.phoneNumber);
        System.out.println("KPI Saat Ini: " + this.kpiScore);
        System.out.println("=======================");
    }
}
