interface LoginProps {
  username: string;
  setUsername: (value: string) => void;
  onLogin: (role?: "CUSTOMER" | "ADMIN") => void;
}

const Login = ({ username, setUsername, onLogin }: LoginProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const role = username.toLowerCase() === "admin" ? "ADMIN" : "CUSTOMER";
    onLogin(role);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-10 rounded-3xl shadow-xl border border-sky-100">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🏦</div>
          <h1 className="text-2xl font-bold text-sky-800">ABC Digital Bank</h1>
          <p className="text-slate-500 mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3.5 rounded-xl transition shadow-md shadow-sky-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Try <span className="font-medium text-sky-600">admin</span> for Admin access
        </p>
      </div>
    </div>
  );
};

export default Login;