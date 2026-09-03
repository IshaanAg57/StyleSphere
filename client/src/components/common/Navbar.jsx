import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Sparkles,
  LogOut,
  ChevronDown,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartCount = useSelector((state) => state.cart.itemsCount || 0);
  const wishlistCount = useSelector((state) => state.wishlist.items?.length || 0);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Catalog', path: '/shop' },
    { name: 'Categories', path: '/categories' },
    { name: 'New Arrivals', path: '/shop?sort=newest' },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    dispatch(logout());
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600/20 via-amber-500/20 to-amber-600/20 border-b border-amber-500/20 py-1 px-4 text-center text-xs font-medium text-amber-300 flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Complimentary Express Shipping on Orders Over ₹999 | Discover the Spring '26 Collection</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
              <span className="font-serif font-black text-slate-950 text-2xl tracking-tighter">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                Style<span className="text-amber-400">Sphere</span>
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-slate-400 font-semibold -mt-1">
                Discover • Personalize • Shop
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? 'text-amber-400 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400 after:rounded-full'
                      : 'text-slate-300 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Trigger */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-slate-900 border border-amber-500/40 rounded-full px-3 py-1.5 shadow-inner">
                  <input
                    type="text"
                    placeholder="Search luxury fashion..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm text-slate-200 placeholder-slate-500 outline-none w-36 sm:w-56"
                    autoFocus
                  />
                  <button 
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="text-slate-400 hover:text-white ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-slate-300 hover:text-amber-400 transition-colors rounded-full hover:bg-slate-800/50"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="p-2 text-slate-300 hover:text-amber-400 transition-colors relative rounded-full hover:bg-slate-800/50"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Link */}
            <Link
              to="/cart"
              className="p-2 text-slate-300 hover:text-amber-400 transition-colors relative rounded-full hover:bg-slate-800/50"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full border border-slate-700/80 bg-slate-900/60 hover:border-amber-500/60 transition-all text-xs font-medium text-slate-200"
                >
                  <img
                    src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={user?.name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-400/50"
                  />
                  <span className="hidden sm:inline font-semibold">{user?.name?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 rounded-2xl glass-card border border-slate-700/80 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-3 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                      <div className="mt-1.5">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          user?.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>{user?.role === 'admin' ? 'Admin' : 'VIP Member'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-amber-400 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-amber-400 transition-colors"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>

                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-400 hover:bg-slate-800/60 transition-colors font-semibold"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-slate-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 p-1.5 px-3.5 rounded-full border border-slate-700/80 bg-slate-900/60 hover:border-amber-500/60 transition-all text-xs font-semibold text-slate-200 hover:text-amber-400"
              >
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white md:hidden"
              aria-label="Open Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-950/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search StyleSphere catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </form>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover border border-amber-400"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{user?.name}</p>
                      <p className="text-[10px] text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase">{user?.role}</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold text-slate-950"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Executive Admin Portal</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-300 bg-rose-500/10 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl glass-panel border border-slate-700 text-xs font-bold text-center text-slate-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
