import api from './api';

export const getTransactionsByAccount = async (accountId: string) => {
  const response = await api.get(`/transactions/account/${accountId}`);
  return response.data;
};

export const getAllTransactions = async () => {
  const response = await api.get('/transactions');
  return response.data;
};