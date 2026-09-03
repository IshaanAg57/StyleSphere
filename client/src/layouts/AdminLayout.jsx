import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Package,
  Users,
  Boxes,
  Store,
  LogOut,
  Sparkles,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  CreditCard
} from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: ShoppingBag },
  { name: 'Categories', path: '/admin/categories', icon: Layers },
  { name: 'Orders', path: '/admin/orders', icon: Package },
  { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
];

export const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Topbar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-base">
            S
          </div>
          <span className="font-serif font-bold text-white text-base">
            StyleSphere <span className="text-amber-400 font-sans text-xs">Admin</span>
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Desktop Left Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 p-6 flex flex-col justify-between transition-transform duration-300
        md:translate-x-0 md:static md:w-64 md:h-screen md:sticky md:top-0
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="space-y-8">
          
          {/* Brand Logo & VIP Portal Badge */}
          <div className="space-y-2">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="font-serif font-black text-slate-950 text-2xl">S</span>
              </div>
              <div>
                <span className="font-serif text-xl font-bold text-white tracking-tight block">
                  Style<span className="text-amber-400">Sphere</span>
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-amber-400">
                  Executive Suite
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                </NavLink>
              );
            })}
          </nav>

        </div>

        {/* User Info & Storefront Link */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-amber-400 hover:border-amber-500/40 transition-all"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Visit Storefront</span>
          </Link>

          <div className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.profileImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                alt={user?.name}
                className="w-8 h-8 rounded-full object-cover border border-amber-400"
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name?.split(' ')[0] || 'Admin'}</p>
                <span className="text-[9px] font-bold text-amber-400 uppercase">Super Admin</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 max-w-7xl">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;
