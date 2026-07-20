import api from './api';

export interface CreateAccountRequest {
  userId: string;
  accountType: 'CHECKING' | 'SAVINGS';
}

// Create new account
export const createAccount = async (accountData: CreateAccountRequest) => {
  const response = await api.post('/accounts', accountData);
  return response.data;
};

// Get all accounts for a user
export const getAccountsByUser = async (userId: string) => {
  const response = await api.get(`/accounts/user/${userId}`);
  return response.data;
};

// Deposit money
export const depositToAccount = async (accountId: string, amount: number) => {
  const response = await api.post(`/accounts/${accountId}/deposit`, { amount });
  return response.data;
};

// Withdraw money
export const withdrawFromAccount = async (accountId: string, amount: number) => {
  const response = await api.post(`/accounts/${accountId}/withdraw`, { amount });
  return response.data;
};

// Transfer between accounts (Bonus)
export const transferBetweenAccounts = async (
  fromAccountId: string,
  toAccountId: string,
  amount: number
) => {
  const response = await api.post('/accounts/transfer', {
    fromAccountId,
    toAccountId,
    amount,
  });
  return response.data;
};