import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { addressAPI, authAPI } from '../services/api';
import { User, Lock, MapPin, Plus, Trash2, CheckCircle2, Shield } from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { addToast } = useNotifications();

  // Personal Info State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mobile, setMobile] = useState(user?.mobile || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Change Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  // Saved Addresses State
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    mobile: '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    addressType: 'Home',
    isDefault: false,
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setMobile(user.mobile);
    }
    loadAddresses();
  }, [user]);

  const loadAddresses = async () => {
    try {
      const res = await addressAPI.getAddresses();
      if (res.success) setAddresses(res.addresses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdatingProfile(true);
      await updateProfile({ name, email, mobile });
      addToast('Personal information & email updated successfully.');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('New password confirmation does not match.', 'error');
      return;
    }

    try {
      setChangingPass(true);
      const res = await authAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (res.success) {
        addToast(res.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressAPI.addAddress(addressForm);
      if (res.success) {
        addToast('Address added to your address book.');
        setShowAddressModal(false);
        loadAddresses();
        setAddressForm({
          fullName: '',
          mobile: '',
          house: '',
          street: '',
          city: '',
          state: '',
          pincode: '',
          landmark: '',
          addressType: 'Home',
          isDefault: false,
        });
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressAPI.deleteAddress(id);
      addToast('Address removed.');
      loadAddresses();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await addressAPI.setDefault(id);
      addToast('Default delivery address updated.');
      loadAddresses();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="border-b border-gray-200 pb-4">
        <span className="text-[11px] uppercase tracking-[0.25em] text-gold-600 font-semibold">
          Patron Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-luxury-950 font-serif mt-1">
          Profile & Address Management
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Personal Details & Password Change */}
        <div className="space-y-8 lg:col-span-1">
          {/* Profile Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <User className="w-4 h-4 text-gold-600" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-950">
                Personal Information
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="w-full py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition"
              >
                {updatingProfile ? 'Saving...' : 'Update Profile'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <Lock className="w-4 h-4 text-gold-600" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-950">
                Security & Password
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider font-semibold text-gray-700 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 text-xs rounded focus:outline-none focus:border-luxury-950"
                />
              </div>

              <button
                type="submit"
                disabled={changingPass}
                className="w-full py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-widest rounded hover:bg-black transition"
              >
                {changingPass ? 'Updating...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Cols: Saved Addresses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gold-600" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-luxury-950">
                  Saved Address Book ({addresses.length})
                </h2>
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-1.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded hover:bg-black transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                <p>You have no saved addresses in your luxury portfolio.</p>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-gold-700 font-bold underline"
                >
                  Add your primary residence now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`p-4 rounded-lg border-2 flex flex-col justify-between ${
                      addr.isDefault ? 'border-luxury-950 bg-gold-50/20' : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-luxury-950">{addr.fullName}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                          {addr.addressType}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {addr.house}, {addr.street}
                      </p>
                      <p className="text-xs text-gray-600">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      {addr.landmark && (
                        <p className="text-[11px] text-gray-400">Landmark: {addr.landmark}</p>
                      )}
                      <p className="text-xs text-gray-800 font-medium pt-1">
                        Phone: {addr.mobile}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      {addr.isDefault ? (
                        <span className="text-[11px] font-bold text-luxury-950 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-gold-600" />
                          Default Address
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefaultAddress(addr._id)}
                          className="text-[11px] font-semibold text-gold-700 hover:underline"
                        >
                          Make Default
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteAddress(addr._id)}
                        className="text-gray-400 hover:text-red-600 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddressModal(false)} />
          <div className="relative bg-white rounded-lg p-6 max-w-lg w-full shadow-2xl z-10 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-950">
              Add New Address
            </h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-700 block mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                    className="w-full px-2.5 py-1.5 border text-xs rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-700 block mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={addressForm.mobile}
                    onChange={(e) => setAddressForm({ ...addressForm, mobile: e.target.value })}
                    className="w-full px-2.5 py-1.5 border text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-700 block mb-1">House/Building *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.house}
                    onChange={(e) => setAddressForm({ ...addressForm, house: e.target.value })}
                    className="w-full px-2.5 py-1.5 border text-xs rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-700 block mb-1">Street *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="w-full px-2.5 py-1.5 border text-xs rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-2.5 py-1.5 border text-xs rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-700 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-2.5 py-1.5 border text-xs rounded"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-semibold text-gray-700 block mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                    className="w-full px-2.5 py-1.5 border text-xs rounded"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-luxury-950 text-gold-400 text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 border text-gray-700 text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
