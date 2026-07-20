import { Link } from "react-router-dom";

const Home = () => {
  // Check if user is already logged in
  const user = localStorage.getItem("user");
  const isLoggedIn = !!user;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-6">✧</div>
        <h1 className="text-5xl font-semibold text-[#0F172A] tracking-tight mb-4">
          Celestial Bank
        </h1>
        <p className="text-xl text-slate-500 mb-10">
          Premium banking for the modern world.
        </p>

        {isLoggedIn ? (
          // Already logged in → show dashboard options
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/dashboard"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition"
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
          // Not logged in → show login / register
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition"
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
      </div>
    </div>
  );
};

export default Home;