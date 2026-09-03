import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
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
  ExternalLink
} from 'lucide-react';

export const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const wishlistCount = useSelector((state) => state.wishlist.items?.length || 0);
  const cartCount = useSelector((state) => state.cart.itemsCount || 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
          
          {/* Subtle gold decorative banner */}
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
                  {user?.name || 'Tastemaker'}
                </h1>
                
                {/* Role Badge */}
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  user?.role === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>{user?.role === 'admin' ? 'Administrator' : 'VIP Customer'}</span>
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

            {/* Logout Action */}
            <div className="pt-2 sm:pt-0">
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-2xl glass-panel border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 transition-all text-xs font-semibold flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>
        </div>

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
                <p className="text-xs text-slate-400">Track current deliveries</p>
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
                <p className="text-xs text-slate-400">{cartCount} items ready</p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </Link>

        </div>

        {/* Security & Account Details Panel */}
        <div className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white font-serif">Account Security & Preferences</h2>
              <p className="text-xs text-slate-400">Manage credentials and authentication preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Account ID</span>
              <p className="font-mono text-xs text-slate-200">{user?._id || 'ID unavailable'}</p>
            </div>

            <div className="space-y-1 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Authentication Protocol</span>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>JWT Bearer Token (256-bit Encrypted)</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
