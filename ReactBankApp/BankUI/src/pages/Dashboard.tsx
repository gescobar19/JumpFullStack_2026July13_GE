import { useState, useEffect } from 'react';
import { getAccountsByUser, depositToAccount, withdrawFromAccount, transferBetweenAccounts } from '../services/accountService';
import { getTransactionsByAccount } from '../services/transactionService';

interface DashboardProps {
  userId: string;
}

function Dashboard({ userId }: DashboardProps) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [amount, setAmount] = useState(0);
  const [targetAccount, setTargetAccount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const data = await getAccountsByUser(userId);
      setAccounts(data);
      if (data.length > 0 && !selectedAccount) {
        setSelectedAccount(data[0].id);
        loadTransactions(data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch accounts');
    }
  };

  const loadTransactions = async (accountId: string) => {
    try {
      const data = await getTransactionsByAccount(accountId);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions');
    }
  };

  useEffect(() => {
    if (userId) fetchAccounts();
  }, [userId]);

  const showMessage = (msg: string, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3500);
  };

  const refreshData = async () => {
    await fetchAccounts();
    if (selectedAccount) await loadTransactions(selectedAccount);
  };

  const handleAction = async (action: 'deposit' | 'withdraw' | 'transfer') => {
    if (!selectedAccount || amount <= 0) return;

    setLoading(true);
    try {
      if (action === 'deposit') {
        await depositToAccount(selectedAccount, amount);
        showMessage(`Deposited $${amount} successfully`);
      } 
      else if (action === 'withdraw') {
        await withdrawFromAccount(selectedAccount, amount);
        showMessage(`Withdrew $${amount} successfully`);
      } 
      else if (action === 'transfer') {
        if (!targetAccount) return showMessage('Please select a target account', true);
        await transferBetweenAccounts(selectedAccount, targetAccount, amount);
        showMessage(`Transferred $${amount} successfully`);
      }

      setAmount(0);
      await refreshData();
    } catch (error: any) {
      showMessage(error.response?.data?.message || `${action} failed`, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {message && <div className="message-banner">{message}</div>}

      <header className="welcome">
        <h1>Dashboard</h1>
        <p>Manage your accounts and transactions</p>
      </header>

      {/* Accounts Section */}
      <section className="accounts-section">
        <h2>Your Accounts</h2>
        <div className="accounts-grid">
          {accounts.map((account) => (
            <div
              key={account.id}
              className={`account-card ${selectedAccount === account.id ? 'selected' : ''}`}
              onClick={() => {
                setSelectedAccount(account.id);
                loadTransactions(account.id);
              }}
            >
              <div className="account-type">{account.accountType}</div>
              <div className="account-balance">${account.balance?.toFixed(2)}</div>
              <div className="account-id">ID: {account.id}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="actions-section">
        <h2>Quick Actions</h2>
        <div className="amount-input">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <div className="action-buttons">
          <button onClick={() => handleAction('deposit')} className="btn btn-primary" disabled={loading}>
            Deposit
          </button>
          <button onClick={() => handleAction('withdraw')} className="btn btn-danger" disabled={loading}>
            Withdraw
          </button>
          <button onClick={() => handleAction('transfer')} className="btn btn-secondary" disabled={loading}>
            Transfer
          </button>
        </div>

        <div className="transfer-section">
          <label>Transfer to:</label>
          <select value={targetAccount} onChange={(e) => setTargetAccount(e.target.value)}>
            <option value="">Select destination account</option>
            {accounts
              .filter((a) => a.id !== selectedAccount)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.accountType} ({a.id})
                </option>
              ))}
          </select>
        </div>
      </section>

      {/* Transactions */}
      <section className="transactions-section">
        <h2>Recent Transactions</h2>
        <div className="transactions-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((tx: any) => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td><span className={`badge ${tx.type?.toLowerCase()}`}>{tx.type}</span></td>
                    <td className={tx.type === 'WITHDRAW' ? 'negative' : 'positive'}>
                      {tx.type === 'WITHDRAW' ? '-' : '+'}${tx.amount?.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={3}>No transactions found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;