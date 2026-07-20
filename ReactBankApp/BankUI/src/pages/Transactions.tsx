import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTransactionsByAccount } from "../services/transactionService";

const Transactions = () => {
  const { id } = useParams();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getTransactionsByAccount(id);
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12 text-center text-slate-500">
        Loading transactions...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Transaction History</h2>
      <p className="text-slate-500 mb-8">Account ID: {id}</p>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No transactions found for this account.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-slate-600 font-semibold">Transaction ID</th>
                <th className="text-left p-4 text-slate-600 font-semibold">Type</th>
                <th className="text-left p-4 text-slate-600 font-semibold">Amount</th>
                <th className="text-left p-4 text-slate-600 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr 
                  key={tx.id || index} 
                  className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                >
                  <td className="p-4 font-mono text-xs text-slate-600">
                    {tx.id}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      tx.type === "DEPOSIT" || tx.type === "TRANSFER_IN" 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-rose-100 text-rose-700"
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold ${
                    tx.type === "WITHDRAW" || tx.type === "TRANSFER_OUT" 
                      ? "text-rose-600" 
                      : "text-emerald-600"
                  }`}>
                    {(tx.type === "WITHDRAW" || tx.type === "TRANSFER_OUT") ? "-" : "+"}
                    ${tx.amount?.toFixed(2)}
                  </td>
                  <td className="p-4 text-slate-600">
                    {tx.timestamp 
                      ? new Date(tx.timestamp).toLocaleDateString() 
                      : tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Transactions;