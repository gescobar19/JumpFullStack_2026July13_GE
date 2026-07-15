package com.example.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "accounts")
public class Account {

    @Id
    private String id;

    private String userId;           // Link to User
    private String accountType;      // "CHECKING" or "SAVINGS"
    private double balance;
    private List<Transaction> transactions = new ArrayList<>();
    private LocalDateTime createdAt;

    public Account() {
        this.balance = 0.0;
        this.createdAt = LocalDateTime.now();
    }

    public Account(String userId, String accountType) {
        this.userId = userId;
        this.accountType = accountType;
        this.balance = 0.0;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public double getBalance() { return balance; }
    public void setBalance(double balance) { this.balance = balance; }

    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
