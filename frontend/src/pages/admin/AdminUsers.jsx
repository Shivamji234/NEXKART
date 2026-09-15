import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import { useNotifications } from '../../context/NotificationContext';
import { Users, Shield, UserCheck, UserX, Search } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToast } = useNotifications();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      if (res.success) setUsers(res.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (user) => {
    try {
      const res = await adminAPI.updateUserStatus(user._id, {
        isActive: !user.isActive,
      });
      if (res.success) {
        addToast(`User account ${!user.isActive ? 'activated' : 'deactivated'}.`);
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleRole = async (user) => {
    const nextRole = user.role === 'admin' ? 'customer' : 'admin';
    try {
      const res = await adminAPI.updateUserStatus(user._id, {
        role: nextRole,
      });
      if (res.success) {
        addToast(`User role updated to ${nextRole.toUpperCase()}.`);
        fetchUsers();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.mobile.includes(search)
  );

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
            Identity & Authorization
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
            Registered Patrons & Personnel ({users.length})
          </h1>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center space-x-3">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by name, email, or mobile number..."
          className="w-full text-xs focus:outline-none tracking-wide"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 font-semibold">Patron Name</th>
                <th className="py-3 px-4 font-semibold">Contact Details</th>
                <th className="py-3 px-4 font-semibold">Registration Date</th>
                <th className="py-3 px-4 font-semibold">Role</th>
                <th className="py-3 px-4 font-semibold">Verification</th>
                <th className="py-3 px-4 font-semibold">Account Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 transition">
                  <td className="py-3 px-4 font-semibold text-luxury-950">{u.name}</td>
                  <td className="py-3 px-4">
                    <p className="font-medium">{u.email}</p>
                    <p className="text-[10px] text-gray-400">{u.mobile}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-500">{formatDate(u.createdAt)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'admin'
                          ? 'bg-gold-100 text-gold-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.isVerified ? 'Verified' : 'Pending OTP'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleRole(u)}
                      className="px-2.5 py-1 border border-gray-300 rounded text-[10px] uppercase font-bold text-gray-700 hover:bg-gray-50"
                      title="Toggle Customer / Admin Role"
                    >
                      {u.role === 'admin' ? 'Make Customer' : 'Promote Admin'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(u)}
                      className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold ${
                        u.isActive
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
