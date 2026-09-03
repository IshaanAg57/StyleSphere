import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

/**
 * ProtectedRoute component for route protection and role-based access control
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Array<string>} [props.allowedRoles] - Optional allowed roles (e.g. ['admin'])
 */
export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  // If initial auth check is loading, show brief luxury spinner
  if (loading && !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  // If not authenticated, redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user role is not authorized
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-950 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl glass-card border border-rose-500/30 space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">Access Restricted</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Your current role (<span className="text-amber-400 font-semibold uppercase text-xs">{user?.role}</span>) does not have authorization to view this area.
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gold-gradient-btn text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to StyleSphere</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
