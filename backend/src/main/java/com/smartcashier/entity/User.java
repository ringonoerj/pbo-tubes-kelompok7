package com.smartcashier.entity;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;

@MappedSuperclass
public abstract class User {
    @Id
    protected String id;
    protected String name;
    protected String phoneNumber;

    // Default constructor for JPA
    protected User() {
    }

    public User(String id, String name, String phoneNumber) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
    }

    public abstract void displayProfile();

    public String getId() { return this.id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return this.name; }
    public void setName(String name) { this.name = name; }
    
    public String getPhoneNumber() { return this.phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
}
