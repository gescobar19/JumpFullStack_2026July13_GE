import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAccountsByUser } from "../services/accountService";

const AccountDetails = () => {
  const { id } = useParams();
  const [account, setAccount] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user.id) {
          setError("User not found. Please log in again.");
          setLoading(false);
          return;
        }

        const accounts = await getAccountsByUser(user.id);
        const foundAccount = accounts.find((acc: any) => acc.id === id);

        if (foundAccount) {
          setAccount(foundAccount);
        } else {
          setError("Account not found");
        }
      } catch (err) {
        console.error("Failed to fetch account:", err);
        setError("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center text-slate-500">
        Loading account details...
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center text-rose-500">
        {error || "Account not found"}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold text-[#0F172A] mb-8">Account Details</h2>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
        <div className="space-y-6">
          <div className="flex justify-between">
            <span className="text-slate-500">Account ID</span>
            <span className="font-mono text-sm font-medium text-slate-800">{account.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500">Account Type</span>
            <span className="font-semibold text-slate-800">{account.accountType}</span>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            <span className="text-lg text-slate-500">Balance</span>
            <span className="text-4xl font-semibold text-sky-700">
              ${account.balance?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Link 
          to={`/deposit/${account.id}`} 
          className="bg-sky-600 hover:bg-sky-700 text-white text-center py-3.5 rounded-2xl font-medium transition"
        >
          Deposit
        </Link>
        <Link 
          to={`/withdraw/${account.id}`} 
          className="bg-rose-500 hover:bg-rose-600 text-white text-center py-3.5 rounded-2xl font-medium transition"
        >
          Withdraw
        </Link>
        <Link 
          to={`/transactions/${account.id}`} 
          className="bg-emerald-500 hover:bg-emerald-600 text-white text-center py-3.5 rounded-2xl font-medium transition"
        >
          Transactions
        </Link>
      </div>
    </div>
  );
};

export default AccountDetails;