import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  X,
  Edit,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Status Update Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.orderNumber = search;
      if (statusFilter !== 'all') params.orderStatus = statusFilter;

      const data = await adminService.getAdminOrders(params);
      setOrders(data.orders || []);
      setTotalOrders(data.totalOrders || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadOrders();
  };

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setNewPaymentStatus(ord.paymentStatus);
    setStatusComment('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      await adminService.updateAdminOrderStatus(selectedOrder._id, {
        orderStatus: newStatus,
        paymentStatus: newPaymentStatus,
        comment: statusComment || `Order status updated to ${newStatus}`
      });
      setSelectedOrder(null);
      await loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Order Fulfillment & Logistics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tracking {totalOrders} luxury client acquisitions across all stages.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order # (e.g. SS-2026)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
        >
          <option value="all">All Fulfillment Stages</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Client</th>
                <th className="p-4">Items Preview</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading client orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{ord.shippingAddress?.fullName || ord.user?.name}</p>
                      <p className="text-[10px] text-slate-400">{ord.user?.email || ord.shippingAddress?.city}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {ord.items?.slice(0, 3).map((item, idx) => (
                          <img
                            key={idx}
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800"
                            title={`${item.name} (${item.quantity}x)`}
                          />
                        ))}
                        {ord.items?.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold">
                            +{ord.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white">₹{ord.totalAmount?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(ord)}
                        className="px-3 py-1.5 rounded-xl gold-gradient-btn text-[11px] font-bold uppercase shadow"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No orders found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Update Order Logistics
                </h3>
                <p className="text-xs font-mono text-amber-400">{selectedOrder.orderNumber}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Fulfillment Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Payment Status *
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Tracking / Courier Note
                </label>
                <input
                  type="text"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  placeholder="e.g. Dispatched via BlueDart Priority (AWB #88921)"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-bold uppercase shadow-md disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Apply Status Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 rounded-xl glass-panel border border-slate-700 text-xs text-slate-300 hover:text-white"
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

export default AdminOrdersPage;
