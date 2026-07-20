import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../services/accountService";

const CreateAccount = () => {
  const [accountType, setAccountType] = useState<"CHECKING" | "SAVINGS">("CHECKING");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Get the currently logged-in user
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user.id) {
        setMessage({ text: "User not found. Please log in again.", type: "error" });
        setLoading(false);
        return;
      }

      await createAccount({
        userId: user.id,
        accountType: accountType,
      });

      setMessage({ text: "Account created successfully!", type: "success" });

      // Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to create account";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <h2 className="text-2xl font-semibold text-[#0F172A] mb-2">Create New Account</h2>
      <p className="text-slate-500 mb-8">Open a new Checking or Savings account</p>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6"
      >
        {/* Success / Error Message */}
        {message && (
          <div
            className={`p-4 rounded-2xl text-sm ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Account Type */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Account Type
          </label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value as "CHECKING" | "SAVINGS")}
            className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="CHECKING">Checking</option>
            <option value="SAVINGS">Savings</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-semibold py-4 rounded-2xl transition"
        >
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;