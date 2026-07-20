package com.example.demo.repos;

import com.example.demo.models.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AccountRepository extends MongoRepository<Account, String> {
    List<Account> findByUserId(String userId);
}