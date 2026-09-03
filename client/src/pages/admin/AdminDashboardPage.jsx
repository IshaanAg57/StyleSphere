import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../../services/adminService';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await adminService.getDashboardAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load dashboard analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">
            Aggregating Business Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalCustomers = 0,
    totalProducts = 0,
    pendingOrders = 0,
    lowStockProductsCount = 0,
    recentOrders = [],
    lowStockProducts = []
  } = analytics || {};

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive Business Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Executive Performance Overview
          </h1>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/products/new"
            className="py-2.5 px-5 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg"
          >
            <span>Add New Product</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 4 Core Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/90 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-white font-serif">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Settled acquisition volume</span>
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-white font-serif">
              {totalOrders}
            </p>
            <p className="text-[11px] text-slate-400">
              {pendingOrders} in active fulfillment
            </p>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">VIP Clientele</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-white font-serif">
              {totalCustomers}
            </p>
            <p className="text-[11px] text-slate-400">Registered luxury accounts</p>
          </div>
        </div>

        {/* Total Products & Low Stock */}
        <div className="p-6 rounded-3xl glass-card border border-slate-800/90 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Catalog Size</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-bold text-white font-serif">
              {totalProducts} Pieces
            </p>
            <p className="text-[11px] text-amber-400 flex items-center gap-1 font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lowStockProductsCount} Low Stock alert</span>
            </p>
          </div>
        </div>

      </div>

      {/* Two-Column Grid: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Recent Acquisitions</span>
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800/80">
                <tr>
                  <th className="pb-3">Order Ref</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentOrders.length > 0 ? (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 font-mono font-bold text-white">
                        <Link to="/admin/orders" className="hover:text-amber-400">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">{ord.user?.name || ord.shippingAddress?.fullName}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-white">
                        ₹{ord.totalAmount?.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No orders placed yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alert Column */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Low Stock Alerts</span>
            </h3>
            <Link
              to="/admin/inventory"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300"
            >
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumbnail || p.images?.[0]}
                      alt={p.name}
                      className="w-10 h-12 rounded-xl object-cover bg-slate-950"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white truncate max-w-[120px]">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.category?.name || 'Couture'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-xs border border-rose-500/20">
                    {p.stock} Left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                All garments maintain optimal inventory levels.
              </p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
