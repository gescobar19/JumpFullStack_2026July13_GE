# Bank App Java API Backend

Clean Spring Boot REST API for a digital bank with MongoDB + JWT.

## Project Structure (cleaned)

```
bankapp-java-api-backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── controllers/     # REST endpoints
│   │   │   ├── models/          # MongoDB documents (User, Account, Transaction)
│   │   │   ├── repos/           # Spring Data MongoDB repositories
│   │   │   ├── services/        # Business logic
│   │   │   ├── security/        # JWT + Spring Security
│   │   │   └── BankappJavaApiBackendApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── Dockerfile
├── mvnw / mvnw.cmd
└── .mvn/wrapper/
```

## What was removed during cleanup
- `bin/` folder (accidental IDE/Eclipse copy – empty/incomplete)
- `target/` folder (compiled classes – never commit this)
- Empty nested leftover folders

## How to run

1. Set MongoDB URI:
   ```bash
   export MONGODB_URI="mongodb+srv://user:pass@cluster.../dbname"
   ```

2. Run:
   ```bash
   ./mvnw spring-boot:run
   ```
   or
   ```bash
   mvn spring-boot:run
   ```

3. API base: `http://localhost:8080`

## Main Endpoints
- `POST /api/auth/login`
- `GET/POST /api/users`
- `GET/POST /api/accounts` + deposit / withdraw / transfer
- `GET /api/transactions`

## Tech Stack
- Java 17
- Spring Boot 4.x
- Spring Data MongoDB
- Spring Security + JWT (jjwt 0.12.6)
