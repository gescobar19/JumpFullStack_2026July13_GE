import { useState, useEffect } from "react";
import { getAllUsers } from "../services/userService";
import { getAccountsByUser } from "../services/accountService";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<"users" | "accounts">("users");
  
  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Accounts state
  const [accounts, setAccounts] = useState<any[]>([]);
  const [searchUserId, setSearchUserId] = useState("");
  const [accountsLoading, setAccountsLoading] = useState(false);

  // Fetch users when Users tab is active
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAccountsByUser = async () => {
    if (!searchUserId.trim()) {
      alert("Please enter a User ID");
      return;
    }

    setAccountsLoading(true);
    try {
      const data = await getAccountsByUser(searchUserId);
      setAccounts(data);
    } catch (error) {
      console.error("Failed to fetch accounts", error);
      alert("Failed to load accounts for this user");
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
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

      {/* ==================== USERS TAB ==================== */}
      {activeTab === "users" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">All Users ({users.length})</h2>
            <button className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm">
              + Create User
            </button>
          </div>

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
                    <td className="p-4 font-mono text-xs text-slate-500">{user.id?.slice(-10)}</td>
                    <td className="p-4 font-medium">{user.username}</td>
                    <td className="p-4">{user.name || "-"}</td>
                    <td className="p-4 text-slate-500">{user.email || "-"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "ADMIN" ? "bg-sky-100 text-sky-700" : "bg-emerald-100 text-emerald-700"
                      }`}>
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

      {/* ==================== ACCOUNTS TAB ==================== */}
      {activeTab === "accounts" && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-lg mb-4">Get Accounts by User ID</h2>
            
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter User ID"
                value={searchUserId}
                onChange={(e) => setSearchUserId(e.target.value)}
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <button
                onClick={fetchAccountsByUser}
                disabled={accountsLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-6 py-2.5 rounded-xl font-medium transition"
              >
                {accountsLoading ? "Loading..." : "Get Accounts"}
              </button>
            </div>
          </div>

          {accounts.length > 0 && (
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
          )}

          {!accountsLoading && accounts.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Enter a User ID above and click "Get Accounts"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;