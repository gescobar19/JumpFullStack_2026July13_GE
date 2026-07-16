package com.example.demo.controllers;

import com.example.demo.models.Account;
import com.example.demo.services.AccountService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/user/{userId}")
    public List<Account> getAccountsByUser(@PathVariable String userId) {
        return accountService.getAccountsByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account created = accountService.createAccount(account);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable String id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{accountId}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable String accountId, @RequestBody Map<String, Double> request) {
        double amount = request.get("amount");
        Account updated = accountService.deposit(accountId, amount);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{accountId}/withdraw")
    public ResponseEntity<Account> withdraw(@PathVariable String accountId, @RequestBody Map<String, Double> request) {
        double amount = request.get("amount");
        Account updated = accountService.withdraw(accountId, amount);
        return ResponseEntity.ok(updated);
    }
    
    // Transfer money between accounts
    @PostMapping("/transfer")
    public ResponseEntity<String> transfer(@RequestBody Map<String, Object> request) {
        String fromAccountId = (String) request.get("fromAccountId");
        String toAccountId = (String) request.get("toAccountId");
        double amount = (Double) request.get("amount");

        accountService.transfer(fromAccountId, toAccountId, amount);
        
        return ResponseEntity.ok("Transfer successful");
    }
}