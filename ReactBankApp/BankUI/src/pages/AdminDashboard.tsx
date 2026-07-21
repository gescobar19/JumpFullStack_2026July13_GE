import { useState, useEffect } from "react";
import { getAllUsers, createUser } from "../services/userService";
import { getAccountsByUser } from "../services/accountService";
// If import fails, try: "../services/accountServices"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "accounts">("users");

  // Users
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "CUSTOMER" as "CUSTOMER" | "ADMIN",
  });

  // Accounts
  const [accounts, setAccounts] = useState<any[]>([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState("");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to fetch users", error);
      setMessage({ text: "Failed to load users", type: "error" });
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setMessage(null);

    try {
      await createUser(form);
      setMessage({ text: "User created successfully!", type: "success" });
      setForm({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "CUSTOMER",
      });
      setShowCreateUser(false);
      fetchUsers();
    } catch (error: any) {
      setMessage({
        text: error.response?.data?.message || "Failed to create user",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const fetchAccountsByUser = async (userId?: string) => {
    const id = (userId || searchUserId).trim();
    if (!id) {
      setAccountsError("Please enter a User ID");
      return;
    }

    setAccountsLoading(true);
    setAccountsError("");

    try {
      const data = await getAccountsByUser(id);
      setAccounts(data || []);
      if (!data || data.length === 0) {
        setAccountsError("No accounts found for this user");
      }
    } catch (error) {
      console.error("Failed to fetch accounts", error);
      setAccountsError("Failed to load accounts for this user");
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    setSearchUserId(userId);
    setActiveTab("accounts");
    fetchAccountsByUser(userId);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-semibold text-[#0F172A] mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-2.5 rounded-2xl font-medium transition ${
            activeTab === "users" ? "bg-sky-600 text-white" : "bg-white border border-slate-200"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab("accounts")}
          className={`px-6 py-2.5 rounded-2xl font-medium transition ${
            activeTab === "accounts" ? "bg-sky-600 text-white" : "bg-white border border-slate-200"
          }`}
        >
          Accounts
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-2xl text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ================= USERS TAB ================= */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg">All Users ({users.length})</h2>
              <p className="text-sm text-slate-500">Click a User ID to view accounts</p>
            </div>
            <button
              onClick={() => setShowCreateUser(!showCreateUser)}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm"
            >
              {showCreateUser ? "Cancel" : "+ Create User"}
            </button>
          </div>

          {/* Create User Form */}
          {showCreateUser && (
            <form onSubmit={handleCreateUser} className="p-6 border-b bg-slate-50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="text"
                  placeholder="Username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as "CUSTOMER" | "ADMIN" })
                  }
                  className="px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white px-6 py-3 rounded-xl font-medium"
              >
                {creating ? "Creating..." : "Create User"}
              </button>
            </form>
          )}

          {/* Users Table */}
          {usersLoading ? (
            <div className="p-8 text-center text-slate-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No users found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 text-slate-600 font-semibold">ID</th>
                  <th className="text-left p-4 text-slate-600 font-semibold">Username</th>
                  <th className="text-left p-4 text-slate-600 font-semibold">Name</th>
                  <th className="text-left p-4 text-slate-600 font-semibold">Email</th>
                  <th className="text-left p-4 text-slate-600 font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-4 font-mono text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() => handleUserClick(user.id)}
                        className="hover:text-sky-600 underline"
                        title="View accounts"
                      >
                        {user.id}
                      </button>
                    </td>
                    <td className="p-4 font-medium">{user.username}</td>
                    <td className="p-4">{user.name || "-"}</td>
                    <td className="p-4 text-slate-500">{user.email || "-"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ================= ACCOUNTS TAB ================= */}
      {activeTab === "accounts" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-lg mb-4">Get Accounts by User ID</h2>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter full User ID"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={() => fetchAccountsByUser()}
                disabled={accountsLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-6 py-2.5 rounded-xl font-medium transition"
              >
                {accountsLoading ? "Loading..." : "Get Accounts"}
              </button>
            </div>

            {accountsError && (
              <p className="text-rose-600 text-sm mt-3">{accountsError}</p>
            )}
          </div>

          {accounts.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left p-4 text-slate-600 font-semibold">Account ID</th>
                  <th className="text-left p-4 text-slate-600 font-semibold">Type</th>
                  <th className="text-left p-4 text-slate-600 font-semibold">Balance</th>
                  <th className="text-left p-4 text-slate-600 font-semibold">User ID</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account, index) => (
                  <tr key={account.id} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-4 font-mono text-xs text-slate-600">{account.id}</td>
                    <td className="p-4">
                      <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {account.accountType}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-emerald-600">
                      ${account.balance?.toFixed(2)}
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-500">{account.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !accountsLoading && (
              <div className="p-8 text-center text-slate-500">
                Enter a full User ID, or click a User ID in the Users tab
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;