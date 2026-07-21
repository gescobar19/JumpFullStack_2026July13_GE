import { Link } from "react-router-dom";

const Home = () => {
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-slate-50 via-sky-50 to-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0F172A] text-white text-3xl mb-6 shadow-lg">
          ✧
        </div>

        <h1 className="text-5xl md:text-6xl font-semibold text-[#0F172A] tracking-tight mb-4">
          Celestial Bank
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10">
          Stellar banking. Celestial service.  
          Manage your money with clarity, speed, and confidence.
        </p>

        {isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition shadow-md shadow-sky-200"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/create-account"
              className="bg-white hover:bg-sky-50 text-sky-700 border-2 border-sky-200 px-8 py-4 rounded-2xl font-semibold text-lg transition"
            >
              Create Account
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition shadow-md shadow-sky-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white hover:bg-sky-50 text-sky-700 border-2 border-sky-200 px-8 py-4 rounded-2xl font-semibold text-lg transition"
            >
              Create User
            </Link>
          </div>
        )}
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-4">💳</div>
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
              Easy Accounts
            </h3>
            <p className="text-slate-500">
              Open Checking or Savings accounts in seconds and manage them from one dashboard.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
              Instant Transfers
            </h3>
            <p className="text-slate-500">
              Deposit, withdraw, and move money between accounts with real-time updates.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-[#0F172A] mb-2">
              Secure Access
            </h3>
            <p className="text-slate-500">
              Protected with authentication so only you can access your banking data.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;