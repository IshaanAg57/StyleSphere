import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [metrics, setMetrics] = useState({
    awaitingVerification: 0,
    verifiedPayments: 0,
    rejectedPayments: 0,
    totalUpiRevenue: 0,
    pendingAmount: 0
  });
  const [totalPayments, setTotalPayments] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal States
  const [verifyingOrder, setVerifyingOrder] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.q = search;
      if (statusFilter !== 'all') params.paymentStatus = statusFilter;

      const data = await adminService.getAdminPayments(params);
      setPayments(data.payments || []);
      setMetrics(data.metrics || {});
      setTotalPayments(data.totalPayments || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadPayments();
  };

  const handleVerify = async (order) => {
    try {
      setActionLoading(true);
      await adminService.verifyAdminPayment(order._id);
      setVerifyingOrder(null);
      await loadPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to verify payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for payment rejection');
      return;
    }

    try {
      setActionLoading(true);
      await adminService.rejectAdminPayment(rejectingOrder._id, rejectionReason);
      setRejectingOrder(null);
      setRejectionReason('');
      await loadPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject payment');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Manual Financial Reconciliation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            UPI Payment Verification Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Reconcile client bank transaction references and authorize order settlement.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Awaiting Verification */}
        <div className="p-5 rounded-3xl glass-card border border-amber-500/40 bg-amber-500/5 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
          <p className="text-2xl font-bold text-amber-300 font-serif">
            {metrics.awaitingVerification || 0}
          </p>
          <span className="text-[10px] text-slate-400 block">
            ₹{metrics.pendingAmount?.toLocaleString('en-IN') || 0} to verify
          </span>
        </div>

        {/* Verified Payments */}
        <div className="p-5 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settled Orders</span>
          </span>
          <p className="text-2xl font-bold text-white font-serif">
            {metrics.verifiedPayments || 0}
          </p>
          <span className="text-[10px] text-slate-400 block">Funds confirmed</span>
        </div>

        {/* Total UPI Revenue */}
        <div className="p-5 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>UPI Revenue</span>
          </span>
          <p className="text-2xl font-bold text-amber-400 font-serif">
            ₹{metrics.totalUpiRevenue?.toLocaleString('en-IN') || 0}
          </p>
          <span className="text-[10px] text-slate-400 block">Zero-fee settlements</span>
        </div>

        {/* Rejected Payments */}
        <div className="p-5 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected Reference</span>
          </span>
          <p className="text-2xl font-bold text-rose-300 font-serif">
            {metrics.rejectedPayments || 0}
          </p>
          <span className="text-[10px] text-slate-400 block">Incorrect UTR count</span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Invoices
          </span>
          <p className="text-2xl font-bold text-white font-serif">
            {totalPayments}
          </p>
          <span className="text-[10px] text-slate-400 block">Across all methods</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order # or UTR Number..."
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
          <option value="all">All Payment Statuses</option>
          <option value="pending_verification">Awaiting Verification</option>
          <option value="paid">Paid & Verified</option>
          <option value="pending">Awaiting Client Payment</option>
          <option value="rejected">Rejected</option>
          <option value="cash_on_delivery">Cash on Delivery</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Method / App</th>
                <th className="p-4">UTR Reference</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Loading payments records...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-white">{ord.shippingAddress?.fullName || ord.user?.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{ord.user?.email}</p>
                    </td>
                    <td className="p-4 font-bold text-amber-400 font-serif text-sm">
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="p-4">
                      <span className="font-semibold text-white block">{ord.paymentMethod}</span>
                      <span className="text-[10px] text-slate-400">{ord.paymentApp || '—'}</span>
                    </td>
                    <td className="p-4">
                      {ord.paymentReference ? (
                        <span className="font-mono font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {ord.paymentReference}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Not submitted</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ord.paymentStatus === 'pending_verification'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : ord.paymentStatus === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {ord.paymentStatus === 'pending_verification' ? 'Review Needed' : ord.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {ord.paymentStatus === 'pending_verification' || ord.paymentStatus === 'pending' ? (
                          <>
                            <button
                              onClick={() => setVerifyingOrder(ord)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold uppercase shadow-sm"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => {
                                setRejectingOrder(ord);
                                setRejectionReason('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 text-[11px] font-bold uppercase"
                            >
                              Reject
                            </button>
                          </>
                        ) : ord.paymentStatus === 'paid' ? (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 justify-end">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setVerifyingOrder(ord)}
                            className="px-3 py-1.5 rounded-xl gold-gradient-btn text-[11px] font-bold uppercase"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No payment records found matching filters.
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

      {/* Verify Confirmation Modal */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Payment Verification</span>
              </h3>
              <button onClick={() => setVerifyingOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Confirm that the following transaction reference has been verified against the merchant bank statement:
              </p>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order Ref:</span>
                  <span className="font-mono text-white font-bold">{verifyingOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Client:</span>
                  <span className="text-white">{verifyingOrder.user?.name || verifyingOrder.shippingAddress?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Received:</span>
                  <span className="font-bold text-emerald-400 font-serif">₹{verifyingOrder.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">UTR / Ref:</span>
                  <span className="font-mono text-amber-300 font-bold">{verifyingOrder.paymentReference || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleVerify(verifyingOrder)}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold uppercase shadow-lg disabled:opacity-50"
              >
                {actionLoading ? 'Authorizing...' : 'Approve & Settle'}
              </button>
              <button
                onClick={() => setVerifyingOrder(null)}
                className="px-5 py-3 rounded-xl glass-panel border border-slate-700 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleReject} className="max-w-md w-full rounded-3xl bg-slate-900 border border-rose-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>Reject Payment Reference</span>
              </h3>
              <button type="button" onClick={() => setRejectingOrder(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                Provide a clear reason for rejecting the payment reference. The customer will see this message and be prompted to resubmit a valid UTR.
              </p>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Rejection Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. UTR reference not reflected in merchant statement. Please check the transaction ID."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:border-rose-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold uppercase shadow-lg disabled:opacity-50"
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-5 py-3 rounded-xl glass-panel border border-slate-700 text-xs text-slate-300 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default AdminPaymentsPage;
