import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { depositToAccount } from "../services/accountService";

const Deposit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || Number(amount) <= 0) {
      setMessage({ text: "Please enter a valid amount", type: "error" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await depositToAccount(id!, Number(amount));
      
      setMessage({ text: `Successfully deposited $${amount}`, type: "success" });
      
      // Clear form
      setAmount("");

      // Redirect back to account details after 1.5 seconds
      setTimeout(() => {
        navigate(`/account/${id}`);
      }, 1500);

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Deposit failed. Please try again.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Deposit Money</h2>
      <p className="text-slate-500 mb-8">Account ID: {id}</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        
        {/* Message Banner */}
        {message && (
          <div className={`p-4 rounded-2xl text-sm ${
            message.type === "success" 
              ? "bg-emerald-50 text-emerald-700" 
              : "bg-rose-50 text-rose-700"
          }`}>
            {message.text}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-4 rounded-2xl transition flex items-center justify-center"
        >
          {loading ? "Processing..." : "Confirm Deposit"}
        </button>
      </form>
    </div>
  );
};

export default Deposit;