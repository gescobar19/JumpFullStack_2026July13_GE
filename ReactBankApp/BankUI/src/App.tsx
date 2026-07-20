import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AccountDetails from "./pages/AccountDetails";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transactions from "./pages/Transactions";
import CreateAccount from "./pages/CreateAccount";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "ADMIN">("CUSTOMER");

  // Check if user is already logged in when the app loads
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsLoggedIn(true);
        setUsername(parsedUser.username || parsedUser.name || "User");
        setRole(parsedUser.role || "CUSTOMER");
      } catch (error) {
        // If user data is invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogin = (userRole: "CUSTOMER" | "ADMIN" = "CUSTOMER") => {
    setIsLoggedIn(true);
    setRole(userRole);

    // Also update username from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setUsername(parsedUser.username || parsedUser.name || "User");
    }
  };

  const handleLogout = () => {
    // Clear everything
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUsername("");
    setRole("CUSTOMER");
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar
          isLoggedIn={isLoggedIn}
          username={username}
          role={role}
          onLogout={handleLogout}
        />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/login"
              element={
                isLoggedIn ? (
                  <Navigate to={role === "ADMIN" ? "/admin" : "/dashboard"} />
                ) : (
                  <Login
                    username={username}
                    setUsername={setUsername}
                    onLogin={handleLogin}
                  />
                )
              }
            />

            {/* Customer Routes */}
            <Route
              path="/dashboard"
              element={
                isLoggedIn && role === "CUSTOMER" ? (
                  <Dashboard username={username} />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/create-account"
              element={isLoggedIn ? <CreateAccount /> : <Navigate to="/login" />}
            />
            <Route
              path="/account/:id"
              element={isLoggedIn ? <AccountDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/deposit/:id"
              element={isLoggedIn ? <Deposit /> : <Navigate to="/login" />}
            />
            <Route
              path="/withdraw/:id"
              element={isLoggedIn ? <Withdraw /> : <Navigate to="/login" />}
            />
            <Route
              path="/transactions/:id"
              element={isLoggedIn ? <Transactions /> : <Navigate to="/login" />}
            />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                isLoggedIn && role === "ADMIN" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;