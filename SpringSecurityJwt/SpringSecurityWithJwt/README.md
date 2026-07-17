# SpringSecurityWithJwt

Complete project built **using your uploaded files as the base**.

## Paths (kept exactly as in your SecurityConfiguration.java)
- Public: `/api/vi1/auth/**`
- Sensitive (ROLE_ADMIN only): `/api/vi1/admin/**`

## How to run in VS Code
1. Open the `SpringSecurityWithJwt` folder in VS Code
2. Wait for Maven dependencies to download
3. Open `src/main/java/com/example/SpringSecurityWithJwtApplication.java`
4. Click **Run** above the main method
   (or run in terminal: `mvn spring-boot:run`)

## Test users
| Username | Password  | Role       |
|----------|-----------|------------|
| admin    | admin123  | ROLE_ADMIN |
| user     | user123   | ROLE_USER  |

## Test commands

### Login (get JWT)
```bash
curl -X POST http://localhost:8080/api/vi1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Call admin endpoint
```bash
curl http://localhost:8080/api/vi1/admin \
  -H "Authorization: Bearer <TOKEN>"
```

### Files from your upload (kept)
- JwtService.java (syntax fixed only)
- JwtAuthenticationFilter.java
- SecurityConfiguration.java (paths unchanged)
- ImportantDBUserNaming.txt
