import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccountsByUser } from "../services/accountService";

interface DashboardProps {
  username: string;
}

const Dashboard = ({ username }: DashboardProps) => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        
        if (!user.id) {
          console.error("No user ID found in localStorage");
          setLoading(false);
          return;
        }

        const data = await getAccountsByUser(user.id);
        setAccounts(data);
      } catch (error) {
        console.error("Failed to fetch accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center text-slate-500">
        Loading your accounts...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold text-[#0F172A]">Welcome back, {username}</h1>
        <p className="text-slate-500 mt-2 text-lg">Here’s a summary of your accounts today.</p>
      </div>

      <h2 className="text-xl font-semibold text-[#0F172A] mb-6">Your Accounts</h2>

      {accounts.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
          <p className="text-slate-500">You don’t have any accounts yet.</p>
          <Link 
            to="/create-account" 
            className="inline-block mt-4 bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl text-sm font-medium"
          >
            Create Your First Account
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <div 
              key={account.id} 
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
            >
              <div className="text-sm text-slate-500 tracking-[1.5px] mb-1">{account.accountType} ACCOUNT</div>
              <div className="text-4xl font-semibold text-[#0F172A] tracking-tight mb-1">
                ${account.balance?.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400 mb-8 font-mono">Account • {account.id}</div>

              <Link 
                to={`/account/${account.id}`} 
                className="inline-block bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl text-sm font-medium transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;