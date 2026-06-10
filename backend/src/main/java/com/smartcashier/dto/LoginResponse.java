package com.smartcashier.dto;

public class LoginResponse {
    private boolean success;
    private String id;
    private String name;
    private double kpiScore;

    public LoginResponse() {}

    public LoginResponse(boolean success, String id, String name, double kpiScore) {
        this.success = success;
        this.id = id;
        this.name = name;
        this.kpiScore = kpiScore;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getKpiScore() { return kpiScore; }
    public void setKpiScore(double kpiScore) { this.kpiScore = kpiScore; }
}
