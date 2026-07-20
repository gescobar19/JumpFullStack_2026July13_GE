import api from './api';

// Get transactions for a specific account
export const getTransactionsByAccount = async (accountId: string) => {
  const response = await api.get(`/transactions/account/${accountId}`);
  return response.data;
};

// Get all transactions (Admin)
export const getAllTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};