import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import * as authService from '../services/authService';
import * as reviewService from '../services/reviewService';
import * as addressService from '../services/addressService';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  Heart,
  MapPin,
  LogOut,
  Sparkles,
  ExternalLink,
  Key,
  Star,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Plus,
  X
} from 'lucide-react';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const wishlistCount = useSelector((state) => state.wishlist.items?.length || 0);
  const cartCount = useSelector((state) => state.cart.itemsCount || 0);

  const [activeTab, setActiveTab] = useState('overview');

  // Profile Edit Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState({ type: '', text: '' });
  const [passLoading, setPassLoading] = useState(false);

  // Reviews Tab
  const [myReviews, setMyReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Addresses Tab
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      const loadReviews = async () => {
        try {
          setReviewsLoading(true);
          const revs = await reviewService.getMyReviews();
          setMyReviews(revs || []);
        } catch (err) {
          console.error('Failed to load reviews:', err);
        } finally {
          setReviewsLoading(false);
        }
      };
      loadReviews();
    } else if (activeTab === 'addresses') {
      const loadAddrs = async () => {
        try {
          const addrs = await addressService.getAddresses();
          setAddresses(addrs || []);
        } catch (err) {
          console.error('Failed to load addresses:', err);
        }
      };
      loadAddrs();
    }
  }, [activeTab]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: '', text: '' });
    setProfileLoading(true);

    try {
      const updatedUser = await authService.updateProfile({ name, email, phone });
      setProfileMsg({ type: 'success', text: 'Personal details successfully updated.' });
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg({ type: '', text: '' });

    if (newPassword !== confirmPassword) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (newPassword.length < 6) {
      setPassMsg({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    setPassLoading(true);
    try {
      await authService.changePassword({ currentPassword, newPassword, confirmPassword });
      setPassMsg({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPassMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update password.'
      });
    } finally {
      setPassLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to remove your appraisal?')) {
      try {
        await reviewService.deleteReview(reviewId);
        setMyReviews((prev) => prev.filter((r) => r._id !== reviewId));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addressService.addAddress(newAddr);
      setAddresses(res.addresses || []);
      setShowAddressModal(false);
      setNewAddr({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Delete this delivery address?')) {
      try {
        const res = await addressService.deleteAddress(id);
        setAddresses(res.addresses || []);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete address');
      }
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
      })
    : 'March 2026';

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 bg-slate-950">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Profile Header Card */}
        <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-amber-300 to-amber-600" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={user?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-amber-500/40 shadow-xl shadow-amber-500/10"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-amber-500 text-slate-950 shadow-md">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* User Meta */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center sm:justify-start">
                <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                  {user?.name || 'VIP Client'}
                </h1>
                
                {/* Role Badge */}
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user?.role === 'admin' ? 'Executive Administrator' : 'VIP Client'}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user?.email}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Member since {formattedDate}</span>
                </span>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex flex-col gap-2 shrink-0 pt-2 sm:pt-0">
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="px-5 py-2.5 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-2xl glass-panel border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 transition-all text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-2 sm:gap-6 overflow-x-auto pb-1 text-xs sm:text-sm">
          {[
            { key: 'overview', label: 'Overview', icon: Sparkles },
            { key: 'profile', label: 'Edit Profile', icon: User },
            { key: 'security', label: 'Security & Password', icon: Key },
            { key: 'reviews', label: 'My Appraisals', icon: Star },
            { key: 'addresses', label: 'Saved Addresses', icon: MapPin }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 rounded-xl font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Link
                to="/orders"
                className="p-6 rounded-3xl glass-card border border-slate-800/80 hover:border-amber-500/40 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">My Orders</h3>
                    <p className="text-xs text-slate-400">Track and view history</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </Link>

              <Link
                to="/wishlist"
                className="p-6 rounded-3xl glass-card border border-slate-800/80 hover:border-amber-500/40 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Wishlist</h3>
                    <p className="text-xs text-slate-400">{wishlistCount} saved items</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
              </Link>

              <Link
                to="/cart"
                className="p-6 rounded-3xl glass-card border border-slate-800/80 hover:border-amber-500/40 transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Shopping Bag</h3>
                    <p className="text-xs text-slate-400">{cartCount} pieces in bag</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </Link>
            </div>

            {/* Quick Details Card */}
            <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                VIP Membership Protocol
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                As a StyleSphere VIP client, you receive priority couture reservation, white-glove express dispatch, and dedicated bespoke styling recommendations.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: EDIT PROFILE */}
        {activeTab === 'profile' && (
          <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <h2 className="text-lg font-bold text-white font-serif border-b border-slate-800 pb-4">
              Edit Personal Information
            </h2>

            {profileMsg.text && (
              <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {profileMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-3 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-50"
                >
                  {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <h2 className="text-lg font-bold text-white font-serif border-b border-slate-800 pb-4">
              Security & Credential Update
            </h2>

            {passMsg.text && (
              <div className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 ${
                passMsg.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                {passMsg.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                )}
                <span>{passMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-6 py-3 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-50"
                >
                  {passLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: MY REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <h2 className="text-lg font-bold text-white font-serif border-b border-slate-800 pb-4">
              My Verified Appraisals ({myReviews.length})
            </h2>

            {reviewsLoading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading your appraisals...</div>
            ) : myReviews.length > 0 ? (
              <div className="space-y-4">
                {myReviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-start justify-between gap-4"
                  >
                    <div className="flex gap-4">
                      {rev.product?.thumbnail && (
                        <img
                          src={rev.product.thumbnail}
                          alt={rev.product.name}
                          className="w-14 h-16 rounded-xl object-cover bg-slate-950 shrink-0"
                        />
                      )}
                      <div className="space-y-1">
                        <Link
                          to={rev.product?.slug ? `/product/${rev.product.slug}` : '/shop'}
                          className="text-xs font-bold text-white hover:text-amber-400 transition-colors"
                        >
                          {rev.product?.name || 'Product'}
                        </Link>
                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${
                                s <= rev.rating ? 'fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <h4 className="text-xs font-semibold text-slate-200">{rev.title}</h4>
                        <p className="text-xs text-slate-400">{rev.comment}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="p-2 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                      title="Delete Review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                You haven't published any product appraisals yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white font-serif">
                Saved Delivery Addresses ({addresses.length})
              </h2>
              <button
                onClick={() => setShowAddressModal(true)}
                className="py-2 px-4 rounded-xl gold-gradient-btn text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Modal / Form */}
            {showAddressModal && (
              <form onSubmit={handleSaveAddress} className="p-6 rounded-2xl bg-slate-900 border border-slate-700 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase text-white">Add Delivery Address</h4>
                  <button type="button" onClick={() => setShowAddressModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone *"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Address Line 1 *"
                  value={newAddr.addressLine1}
                  onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="City *"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="State *"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postal Code *"
                    value={newAddr.postalCode}
                    onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>
                <button type="submit" className="px-5 py-2 rounded-xl gold-gradient-btn text-xs font-bold">
                  Save Address
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr._id} className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{addr.addressLine1 || addr.street}</p>
                  <p className="text-xs text-slate-400">{addr.city}, {addr.state} - {addr.postalCode || addr.pincode}</p>
                  <p className="text-xs text-slate-400">Phone: {addr.phone}</p>
                  <div className="pt-2 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
