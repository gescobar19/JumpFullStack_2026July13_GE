export interface Account {
  id: string;
  type: string;
  balance: number;
}

export interface Transaction {
  id: number;
  type: 'Deposit' | 'Withdraw' | 'Transfer';
  amount: number;
  date: string;
  description: string;
  accountId?: string;
}