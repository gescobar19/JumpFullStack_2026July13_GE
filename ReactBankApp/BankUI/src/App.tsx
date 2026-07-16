import { useState } from 'react'
import './App.css'
import { getAccountsByUser, depositToAccount, withdrawFromAccount, createAccount } from './services/accountService'
import { getTransactionsByAccount } from './services/transactionService'
import { getAllUsers, getUserById, createUser } from './services/userService'

interface Account {
  id: string
  type: string
  balance: number
}

interface Transaction {
  id: number
  type: string
  amount: number
  date: string
  description: string
}

function App() {
  const [newUser, setNewUser] = useState({
  username: '',
  password: '',
  name: '',
  email: '',
  role: 'CUSTOMER' as 'CUSTOMER' | 'ADMIN'
});

const [newAccount, setNewAccount] = useState({
  userId: '',
  accountType: 'CHECKING' as 'CHECKING' | 'SAVINGS'
});
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('jenny')
  const [password, setPassword] = useState('jenny123')

  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', type: 'Checking', balance: 2450.75 },
    { id: '2', type: 'Savings', balance: 8750.00 },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: 'Deposit', amount: 1500.75, date: '2026-07-15', description: 'Salary deposit' },
    { id: 2, type: 'Withdraw', amount: 300.00, date: '2026-07-14', description: 'ATM withdrawal' },
  ])

  const [selectedAccount, setSelectedAccount] = useState<string>('1')
  const [amount, setAmount] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'transactions' | 'services'>('dashboard')
  const [message, setMessage] = useState('')
  const [apiResponse, setApiResponse] = useState<any>(null)

  const currentAccount = accounts.find(a => a.id === selectedAccount)
  const [searchUserId, setSearchUserId] = useState('');
  const [searchAccountUserId, setSearchAccountUserId] = useState('');

  const showMessage = (msg: string, isError: boolean = false) => {
  setMessage(msg);
  
  // Optional: Change message color based on success/error
  // You can style .message-banner differently if needed
  
  setTimeout(() => {
    setMessage('');
  }, 3500);
};

  // ==================== LOGIN ====================
  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true)
      setActiveTab('dashboard')
    } else {
      alert('Please enter username and password')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setActiveTab('dashboard')
    setApiResponse(null)
    setMessage('')
  }

  // ==================== DASHBOARD ACTIONS (Local State) ====================
  const handleDeposit = () => {
    if (amount <= 0) return

    setAccounts(prev =>
      prev.map(acc =>
        acc.id === selectedAccount
          ? { ...acc, balance: acc.balance + amount }
          : acc
      )
    )

    const newTx: Transaction = {
      id: Date.now(),
      type: 'Deposit',
      amount,
      date: new Date().toISOString().split('T')[0],
      description: 'Deposit via app'
    }
    setTransactions(prev => [newTx, ...prev])

    showMessage(`Deposited $${amount} successfully`)
    setAmount(0)
  }

  const handleWithdraw = () => {
    const current = accounts.find(a => a.id === selectedAccount)
    if (!current || amount <= 0) return

    if (amount > current.balance) {
      showMessage('Insufficient funds')
      return
    }

    setAccounts(prev =>
      prev.map(acc =>
        acc.id === selectedAccount
          ? { ...acc, balance: acc.balance - amount }
          : acc
      )
    )

    const newTx: Transaction = {
      id: Date.now(),
      type: 'Withdraw',
      amount,
      date: new Date().toISOString().split('T')[0],
      description: 'Withdrawal via app'
    }
    setTransactions(prev => [newTx, ...prev])

    showMessage(`Withdrew $${amount} successfully`)
    setAmount(0)
  }

  // ==================== API TEST FUNCTIONS ====================
  const fetchAllUsers = async () => {
    try {
      const data = await getAllUsers()
      setApiResponse(data)
      showMessage('Users fetched successfully from API')
    } catch (error) {
      showMessage('Failed to fetch users')
      console.error(error)
    }
  }

  const testGetAccounts = async (showMsg: boolean = true, userId?: string) => {
  try {
    // Use the provided userId, or fall back to the one in the form, or the old default
    const idToUse = userId || newAccount.userId || '6a568c59185d399d7f73c838';
    
    const data = await getAccountsByUser(idToUse);
    setApiResponse(data);
    
    if (showMsg) {
      showMessage('Accounts fetched from API');
    }
  } catch (error) {
    showMessage('Failed to fetch accounts');
  }
};

  const testDeposit = async () => {
    if (!selectedAccount || amount <= 0) return alert('Select account and enter amount')
    try {
      const result = await depositToAccount(selectedAccount, amount)
      setApiResponse(result)
      showMessage('Deposit API call successful')
    } catch (error) {
      showMessage('Deposit failed')
    }
  }

  const testWithdraw = async () => {
    if (!selectedAccount || amount <= 0) return alert('Select account and enter amount')
    try {
      const result = await withdrawFromAccount(selectedAccount, amount)
      setApiResponse(result)
      showMessage('Withdraw API call successful')
    } catch (error) {
      showMessage('Withdraw failed')
    }
  }

  const testGetTransactions = async () => {
    try {
      const data = await getTransactionsByAccount(selectedAccount)
      setApiResponse(data)
      showMessage('Transactions fetched from API')
    } catch (error) {
      showMessage('Failed to fetch transactions')
    }
  }

  const handleCreateUser = async () => {
  try {
    await createUser(newUser);
    showMessage('User created successfully!');
    setNewUser({ username: '', password: '', name: '', email: '', role: 'CUSTOMER' });
    fetchAllUsers(); // Refresh list
  } catch (error) {
    showMessage('Failed to create user');
  }
};

const handleCreateAccount = async () => {
  if (!newAccount.userId.trim()) {
    showMessage('Please enter a User ID', true);
    return;
  }

  try {
    // Save the userId before we clear the form
    const createdForUserId = newAccount.userId;

    await createAccount(newAccount);
    showMessage('Account created successfully!');

    // Clear the form
    setNewAccount({ userId: '', accountType: 'CHECKING' });

    // Refresh accounts for the SAME user we just created the account for
    await testGetAccounts(false, createdForUserId);
  } catch (error: any) {
    console.error(error);
    showMessage('Failed to create account. Make sure the User ID exists.', true);
  }
};

// Silent refresh (no message)
const refreshAccountsList = async () => {
  try {
    const data = await getAccountsByUser(newAccount.userId || '6a568c59185d399d7f73c838');
    setApiResponse(data);
  } catch (error) {
    console.error('Failed to refresh accounts list');
  }
};

const fetchUserById = async () => {
  if (!searchUserId.trim()) return alert('Please enter a User ID');

  try {
    const data = await getUserById(searchUserId);
    setApiResponse([data]); // wrap in array so table logic works
    showMessage('User fetched successfully');
  } catch (error) {
    showMessage('User not found');
    setApiResponse(null);
  }
};

const fetchAccountsByUserId = async () => {
  if (!searchAccountUserId.trim()) {
    showMessage('Please enter a User ID', true);
    return;
  }

  try {
    const data = await getAccountsByUser(searchAccountUserId);
    setApiResponse(data);
    showMessage(`Accounts for user fetched successfully`);
  } catch (error) {
    showMessage('Failed to fetch accounts for this user', true);
    setApiResponse(null);
  }
};


  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">🏦 ABC Digital Bank</div>

        {isLoggedIn && (
          <div className="nav-tabs">
            <button className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
            <button className={`nav-tab ${activeTab === 'accounts' ? 'active' : ''}`} onClick={() => setActiveTab('accounts')}>Accounts</button>
            <button className={`nav-tab ${activeTab === 'transactions' ? 'active' : ''}`} onClick={() => setActiveTab('transactions')}>Transactions</button>
            <button className={`nav-tab ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services (API)</button>
          </div>
        )}

        <div className="nav-user">
          {isLoggedIn ? (
            <>
              <span>Welcome, {username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span>Please login</span>
          )}
        </div>
      </nav>

      <div className="container">
        {/* Login Screen */}
        {!isLoggedIn && (
          <div className="login-section">
            <h2>Login to ABC Digital Bank</h2>
            <div className="amount-input" style={{ maxWidth: '320px', margin: '30px auto' }}>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginTop: '10px' }} />
            </div>
            <button onClick={handleLogin} className="btn btn-primary">Login</button>
          </div>
        )}

        {/* Main Content */}
        {isLoggedIn && (
          <>
            {message && <div className="message-banner">{message}</div>}

            {/* SERVICES TAB */}
            {/* ==================== SERVICES TAB ==================== */}
            {activeTab === 'services' && (
              <div>
                <h2 style={{ marginBottom: '0.5rem', color: '#1e3a8a' }}>API Services</h2>
                <p style={{ marginBottom: '2rem', color: '#555' }}>
                  Create, view, and search Users & Accounts
                </p>

                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>

                  {/* ========== CREATE USER + CREATE ACCOUNT (same as before) ========== */}
                  <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Create New User</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '1rem' }}>
                      <input type="text" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
                      <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                      <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                      <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                      <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'CUSTOMER' | 'ADMIN' })}>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <button onClick={handleCreateUser} className="btn btn-primary">Create User</button>
                  </div>

                  <div style={{ marginBottom: '3rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Create New Account</h3>
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem', maxWidth: '500px' }}>
                      <input type="text" placeholder="User ID" value={newAccount.userId} onChange={(e) => setNewAccount({ ...newAccount, userId: e.target.value })} style={{ flex: 1 }} />
                      <select value={newAccount.accountType} onChange={(e) => setNewAccount({ ...newAccount, accountType: e.target.value as 'CHECKING' | 'SAVINGS' })} style={{ width: '180px' }}>
                        <option value="CHECKING">CHECKING</option>
                        <option value="SAVINGS">SAVINGS</option>
                      </select>
                    </div>
                    <button onClick={handleCreateAccount} className="btn btn-secondary">Create Account</button>
                  </div>

                  {/* ========== VIEW DATA ========== */}
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>View Data</h3>

                    {/* Get All Users */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <button onClick={fetchAllUsers} className="btn btn-primary">
                        Get All Users
                      </button>
                    </div>

                    {/* Get User by ID */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <input
                        type="text"
                        placeholder="Enter User ID"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', width: '280px' }}
                      />
                      <button onClick={fetchUserById} className="btn btn-outline">
                        Get User by ID
                      </button>
                    </div>

                    {/* Get Accounts by User ID */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <input
                        type="text"
                        placeholder="Enter User ID to get accounts"
                        value={searchAccountUserId}
                        onChange={(e) => setSearchAccountUserId(e.target.value)}
                        style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e2e8f0', width: '280px' }}
                      />
                      <button onClick={fetchAccountsByUserId} className="btn btn-secondary">
                        Get Accounts by User ID
                      </button>
                    </div>
                  </div>

                  {/* USERS TABLE (Striped) */}
                  {apiResponse && Array.isArray(apiResponse) && apiResponse[0]?.username && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>Users ({apiResponse.length})</h3>
                      <div className="transactions-table striped-table">
                        <table>
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Username</th>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {apiResponse.map((user: any, index: number) => (
                              <tr key={index}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{user.id}</td>
                                <td><strong>{user.username}</strong></td>
                                <td>{user.name || '-'}</td>
                                <td>{user.email || '-'}</td>
                                <td>
                                  <span className={`badge ${user.role === 'ADMIN' ? 'transfer' : 'deposit'}`}>
                                    {user.role}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ACCOUNTS TABLE (Striped) */}
                  {apiResponse && Array.isArray(apiResponse) && apiResponse[0]?.accountType && (
                    <div style={{ marginTop: '2rem' }}>
                      <h3 style={{ marginBottom: '1rem', color: '#1e3a8a' }}>Accounts ({apiResponse.length})</h3>
                      <div className="transactions-table striped-table">
                        <table>
                          <thead>
                            <tr>
                              <th>Account ID</th>
                              <th>Type</th>
                              <th>Balance</th>
                              <th>User ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {apiResponse.map((account: any, index: number) => (
                              <tr key={index}>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{account.id}</td>
                                <td>
                                  <span className={`badge ${account.accountType === 'SAVINGS' ? 'deposit' : 'transfer'}`}>
                                    {account.accountType}
                                  </span>
                                </td>
                                <td className="positive"><strong>${account.balance?.toFixed(2) || '0.00'}</strong></td>
                                <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{account.userId}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* DASHBOARD TAB */}
            {activeTab === 'dashboard' && (
              <>
                <header className="welcome">
                  <h1>Welcome back, {username} 👋</h1>
                  <p>Here's a summary of your accounts today.</p>
                </header>

                <section className="accounts-section">
                  <h2>Your Accounts</h2>
                  <div className="accounts-grid">
                    {accounts.map((account) => (
                      <div 
                        key={account.id} 
                        className={`account-card ${selectedAccount === account.id ? 'selected' : ''}`}
                        onClick={() => setSelectedAccount(account.id)}
                      >
                        <div className="account-type">{account.type}</div>
                        <div className="account-balance">${account.balance.toFixed(2)}</div>
                        <div className="account-id">Account • {account.id}</div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="actions-section">
                  <h2>Quick Actions — {currentAccount?.type}</h2>
                  <div className="amount-input">
                    <input 
                      type="number" 
                      placeholder="Enter amount" 
                      value={amount || ''} 
                      onChange={(e) => setAmount(Number(e.target.value))} 
                    />
                  </div>
                  <div className="action-buttons">
                    <button onClick={handleDeposit} className="btn btn-primary">Deposit</button>
                    <button onClick={handleWithdraw} className="btn btn-danger">Withdraw</button>
                    <button className="btn btn-secondary">Transfer</button>
                  </div>
                </section>
              </>
            )}

            {/* ACCOUNTS TAB */}
            {activeTab === 'accounts' && (
              <section className="accounts-section">
                <h2>All Accounts</h2>
                <div className="accounts-grid">
                  {accounts.map((account) => (
                    <div key={account.id} className="account-card">
                      <div className="account-type">{account.type}</div>
                      <div className="account-balance">${account.balance.toFixed(2)}</div>
                      <div className="account-id">Account • {account.id}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TRANSACTIONS TAB */}
            {activeTab === 'transactions' && (
              <section className="transactions-section">
                <h2>Transaction History</h2>
                <div className="transactions-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Type</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>{tx.date}</td>
                          <td>{tx.description}</td>
                          <td><span className={`badge ${tx.type.toLowerCase()}`}>{tx.type}</span></td>
                          <td className={tx.type === 'Withdraw' ? 'negative' : 'positive'}>
                            {tx.type === 'Withdraw' ? '-' : '+'}${tx.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App