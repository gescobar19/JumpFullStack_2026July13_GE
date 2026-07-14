import java.util.*;

//Admin credentials: admin, admin123
//User credentials: .....................

public class Runner {
    static Scanner sc = new Scanner(System.in);

    static List<User> users = new ArrayList<>();

    static{
        User admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword("admin123");

        Customer customer1 = new Customer();
        customer1.setUsername("jenny");
        customer1.setPassword("jenny123");
        customer1.getAccounts().add(new CheckingAccount(1001));
        customer1.getAccounts().add(new SavingsAccount(2001));

        Customer customer2 = new Customer();
        customer2.setUsername("john");
        customer2.setPassword("john123");
        customer2.getAccounts().add(new CheckingAccount(1002));

        Customer customer3 = new Customer();
        customer3.setUsername("fred");
        customer3.setPassword("fred123");
        customer3.getAccounts().add(new SavingsAccount(2002));

        users.add(admin);
        users.add(customer1); users.add(customer2); users.add(customer3);
    }


    public static void main(String[] args) {
        printMessage("Welcome to ABC Digital Bank");


        boolean flag = true;
        while(flag){
            String loginResult = login();

            if(loginResult.equals("invalid")){
                //exception-handling
                System.out.println("Invalid Credentials");
            }else if (loginResult.equals("admin")){
                adminDashboard(loginResult);
            }else{
                customerDashboard(loginResult);
            }

            System.out.println("Do you want to continue? Press y/n");
            String mainLoopUserResponse = sc.nextLine();
            if(mainLoopUserResponse.equalsIgnoreCase("n")){
                flag = false;
            }
        }

    }

    private static void customerDashboard(String username) {
    System.out.println("Welcome customer, " + username);

    // Find the logged-in customer
    Customer currentCustomer = null;

    for (User user : users) {
        if (user instanceof Customer && user.getUsername().equals(username)) {
            currentCustomer = (Customer) user;
            break;
        }
    }

    if (currentCustomer == null) {
        System.out.println("Customer not found.");
        return;
    }

    boolean exit = false;

    while (!exit) {
        System.out.println("\n===== Customer Menu =====");
        System.out.println("1. View My Accounts");
        System.out.println("2. Deposit");
        System.out.println("3. Withdraw");
        System.out.println("4. Transfer");
        System.out.println("5. View Transaction History");
        System.out.println("6. Exit");
        System.out.print("Enter your choice: ");

        int choice = sc.nextInt();
        sc.nextLine();

        switch (choice) {

            case 1:
                System.out.println("\nYour Accounts:");

                for (Account account : currentCustomer.getAccounts()) {
                    System.out.println("------------------------");
                    System.out.println("Account ID: " + account.getId());
                    System.out.println("Balance: $" + account.getBalance());
                }

                if (currentCustomer.getAccounts().isEmpty()) {
                    System.out.println("No accounts found.");
                }
                break;

            case 2:
                System.out.println("Deposit.");
                break;

            case 3:
                System.out.println("Withdraw.");
                break;

            case 4:
                System.out.println("Transfer.");
                break;

            case 5:
                System.out.println("Transaction History:");

                for (Account account : currentCustomer.getAccounts()) {
                    System.out.println("Account " + account.getId());

                    for (String transaction : account.getTransactionHistory()) {
                        System.out.println(transaction);
                    }
                }
                break;

            case 6:
                exit = true;
                break;

            default:
                System.out.println("Invalid option.");
        }
    }
}

    private static void adminDashboard(String loginResult) {
        System.out.println("Welcome admin");
        //todo: using switch-case present admin options
        //CRUD for customers, accounts etc

        boolean exit = false;

        while (!exit) {

            System.out.println("\n===== Admin Menu =====");
            System.out.println("1. View All Customers");
            System.out.println("2. View All Accounts");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");

            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    System.out.println("\nCustomers:");

                    for (User user : users) {
                        if (user instanceof Customer) {
                            System.out.println(user.getUsername());
                        }
                    }
                    break;

                case 2:
                    System.out.println("\nAccounts:");

                    for (User user : users) {
                        if (user instanceof Customer) {

                            Customer customer = (Customer) user;

                            System.out.println("\nCustomer: " + customer.getUsername());

                            for (Account account : customer.getAccounts()) {
                                System.out.println("Account ID: " + account.getId());
                                System.out.println("Balance: $" + account.getBalance());
                            }
                        }
                    }
                    break;

                case 3:
                    exit = true;
                    break;

                default:
                    System.out.println("Invalid option.");
            }
        }
    }
    

    static String login(){
        String loginType = "invalid";
        System.out.println("Please enter your username and password separated by a space");//rohit rohit123
        //validation
        String enteredUsernamePassword = sc.nextLine();
        String[] parts =enteredUsernamePassword.split(" ");
        String enteredUsername = parts[0];
        String entetedPassword = parts[1];

        if(enteredUsername.equals("admin") && entetedPassword.equals("admin123")){
            loginType = "admin";
        }else{
            for(int i=0; i<users.size(); i++){
                User user = users.get(i);
                if(enteredUsername.equals(user.getUsername()) && entetedPassword.equals(user.getPassword())){
                    loginType = user.getUsername();
                    break;
                }
            }
        }

        return loginType;
    }

    static void printMessage(String message){
        System.out.println(message);
    }
}

class Bank{
    private int id;
    private String name;
    private List<Customer> customers = new ArrayList<>();

    public Bank(int id, String name, List<Customer> customers) {
        this.id = id;
        this.name = name;
        this.customers = customers;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Customer> getCustomers() {
        return customers;
    }

    public void setCustomers(List<Customer> customers) {
        this.customers = customers;
    }
}

abstract class User{
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    abstract String getUserType();
}

class Admin extends User{
    String getUserType() {
        return "admin";
    }
}

class Customer extends User{
    private List<Account> accounts = new ArrayList<>();
    
    // customer can have multiple accounts
    public List<Account> getAccounts() {
        return accounts;
    }

    public void setAccounts(List<Account> accounts) {
        this.accounts = accounts;
    }

    @Override
    String getUserType() {
        return "customer";
    }
}



abstract class Account{
  //id,
    // balance
    private int id;
    private double balance;
    private List<String> transactionHistory = new ArrayList<>();

    public Account(int id) {
        this.id = id;
        this.balance = 0;
    }

    public int getId() {
        return id;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public List<String> getTransactionHistory() {
        return transactionHistory;
    }
}

class CheckingAccount extends Account implements AccountOperations{
    
    public CheckingAccount(int id) {
    super(id);
    }

    @Override
    public void deposit() {
        System.out.print("Enter amount to deposit: ");
        double amount = Runner.sc.nextDouble();
        Runner.sc.nextLine();

        setBalance(getBalance() + amount);
        getTransactionHistory().add("Deposited $" + amount);

        System.out.println("Deposit successful.");
        System.out.println("Current Balance: $" + getBalance());
    }

    @Override
    public void withdraw() {
        System.out.print("Enter amount to withdraw: ");
        double amount = Runner.sc.nextDouble();
        Runner.sc.nextLine();

        if (amount <= getBalance()) {
            setBalance(getBalance() - amount);
            getTransactionHistory().add("Withdrew $" + amount);

            System.out.println("Withdrawal successful.");
            System.out.println("Current Balance: $" + getBalance());
        } else {
            System.out.println("Insufficient funds.");
        }
    }

    @Override
    public void transfer() {
        System.out.println("Transfer feature coming soon.");
    }
    //getinterestRate()// 1%
}

class SavingsAccount extends Account implements AccountOperations{
        public SavingsAccount(int id) {
        super(id);
    }

    @Override
    public void deposit() {
        System.out.print("Enter amount to deposit: ");
        double amount = Runner.sc.nextDouble();
        Runner.sc.nextLine();

        setBalance(getBalance() + amount);
        getTransactionHistory().add("Deposited $" + amount);

        System.out.println("Deposit successful.");
        System.out.println("Current Balance: $" + getBalance());
    }

    @Override
    public void withdraw() {
        System.out.print("Enter amount to withdraw: ");
        double amount = Runner.sc.nextDouble();
        Runner.sc.nextLine();

        if (amount <= getBalance()) {
            setBalance(getBalance() - amount);
            getTransactionHistory().add("Withdrew $" + amount);

            System.out.println("Withdrawal successful.");
            System.out.println("Current Balance: $" + getBalance());
        } else {
            System.out.println("Insufficient funds.");
        }
    }

    @Override
    public void transfer() {
        System.out.println("Transfer feature coming soon.");
    }
    //getinterestRate()// 2%
}

interface AccountOperations{
    void deposit();
    void withdraw();
    void transfer();
}

