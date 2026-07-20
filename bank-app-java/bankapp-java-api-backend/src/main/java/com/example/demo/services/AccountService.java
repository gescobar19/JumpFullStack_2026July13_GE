package com.example.demo.services;

import com.example.demo.models.Account;
import com.example.demo.models.Transaction;
import com.example.demo.repos.AccountRepository;
import com.example.demo.repos.TransactionRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public AccountService(AccountRepository accountRepository, TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public List<Account> getAccountsByUserId(String userId) {
        return accountRepository.findByUserId(userId);
    }

    public Optional<Account> getAccountById(String id) {
        return accountRepository.findById(id);
    }

    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    // Deposit money
    public Account deposit(String accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance() + amount);

        // Create transaction record
        Transaction txn = new Transaction(accountId, account.getUserId(), "DEPOSIT", amount, "Deposit to account");
        transactionRepository.save(txn);
        account.getTransactions().add(txn);

        return accountRepository.save(account);
    }

    // Withdraw money
    public Account withdraw(String accountId, double amount) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (account.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        account.setBalance(account.getBalance() - amount);

        Transaction txn = new Transaction(accountId, account.getUserId(), "WITHDRAW", amount, "Withdrawal from account");
        transactionRepository.save(txn);
        account.getTransactions().add(txn);

        return accountRepository.save(account);
    }
    
 // Transfer money between accounts
    public void transfer(String fromAccountId, String toAccountId, double amount) {
        if (amount <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        Account fromAccount = accountRepository.findById(fromAccountId)
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        Account toAccount = accountRepository.findById(toAccountId)
                .orElseThrow(() -> new RuntimeException("Destination account not found"));

        if (fromAccount.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance in source account");
        }

        // Perform transfer
        fromAccount.setBalance(fromAccount.getBalance() - amount);
        toAccount.setBalance(toAccount.getBalance() + amount);

        // Create transaction records
        Transaction withdrawTxn = new Transaction(
            fromAccountId, 
            fromAccount.getUserId(), 
            "TRANSFER_OUT", 
            amount, 
            "Transfer to account " + toAccountId
        );

        Transaction depositTxn = new Transaction(
            toAccountId, 
            toAccount.getUserId(), 
            "TRANSFER_IN", 
            amount, 
            "Transfer from account " + fromAccountId
        );

        transactionRepository.save(withdrawTxn);
        transactionRepository.save(depositTxn);

        fromAccount.getTransactions().add(withdrawTxn);
        toAccount.getTransactions().add(depositTxn);

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);
    }
    
    public void deleteAccount(String id) {
        accountRepository.deleteById(id);
    }
}