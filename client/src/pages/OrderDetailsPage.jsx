import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderDetails } from '../store/slices/orderSlice';
import {
  Package,
  MapPin,
  Calendar,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Sparkles,
  ShieldCheck,
  FileText,
  AlertCircle,
  XCircle,
  ExternalLink,
  QrCode
} from 'lucide-react';

const ORDER_STEPS = [
  { label: 'Order Placed', key: 'placed' },
  { label: 'Payment Settlement', key: 'payment' },
  { label: 'Confirmed', key: 'confirmed' },
  { label: 'Processing', key: 'processing' },
  { label: 'Shipped', key: 'shipped' },
  { label: 'Delivered', key: 'delivered' }
];

const getActiveStepIndex = (order) => {
  const status = order?.orderStatus?.toLowerCase() || 'confirmed';
  const payStatus = order?.paymentStatus?.toLowerCase() || 'pending';

  if (status.includes('delivered')) return 5;
  if (status.includes('shipped') || status.includes('delivery')) return 4;
  if (status.includes('processing')) return 3;
  if (status.includes('confirmed') && (order?.isPaid || payStatus === 'paid' || payStatus === 'cash_on_delivery')) return 2;
  if (payStatus === 'pending_verification' || payStatus === 'paid' || payStatus === 'cash_on_delivery') return 1;
  return 0;
};

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { currentOrder, loading, error } = useSelector((state) => state.orders);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetails(orderId)).then((res) => {
        if (res.payload) {
          setOrder(res.payload);
        }
      });
    }
  }, [dispatch, orderId]);

  const activeOrder = order || currentOrder;

  if (loading && !activeOrder) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-xs text-amber-400 tracking-widest uppercase font-semibold">
            Retrieving Acquisition Details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !activeOrder) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-slate-950 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-white font-serif">Order Not Found</h2>
          <p className="text-xs text-slate-400">
            {error || 'Unable to locate the specified order reference.'}
          </p>
          <div className="pt-2">
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient-btn text-xs font-bold shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Orders Portfolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const activeStepIdx = getActiveStepIndex(activeOrder);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="space-y-1">
            <Link
              to="/orders"
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Orders Portfolio</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight flex items-center gap-3">
              <span>Order Reference:</span>
              <span className="text-amber-400 font-mono">{activeOrder.orderNumber}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Placed on{' '}
              {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Download Tax Invoice Button */}
            <a
              href={`/api/orders/${activeOrder._id || activeOrder.orderNumber}/invoice?format=html`}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl glass-panel border border-slate-700 hover:border-amber-400 text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-2 shadow-md transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Download Invoice</span>
            </a>

            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs uppercase tracking-wider">
              Status: {activeOrder.orderStatus}
            </span>
          </div>
        </div>

        {/* Visual Progress Stepper */}
        <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            Fulfillment Progression
          </h2>

          <div className="relative flex items-center justify-between">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-0.5 bg-slate-800 z-0" />
            
            {/* Active Progress Line */}
            <div
              className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 bg-amber-400 transition-all duration-500 z-0"
              style={{ width: `${(activeStepIdx / (ORDER_STEPS.length - 1)) * 100}%` }}
            />

            {ORDER_STEPS.map((step, idx) => {
              const isCompleted = idx <= activeStepIdx;
              const isCurrent = idx === activeStepIdx;

              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'gold-gradient-btn text-slate-950 font-bold shadow-lg shadow-amber-500/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-xs">{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold mt-2 text-center max-w-[70px] ${
                      isCurrent ? 'text-amber-400' : isCompleted ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Items + Summary / Delivery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Items List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight border-b border-slate-800 pb-4">
                Ordered Garments & Pieces ({activeOrder.items?.length || 0})
              </h2>

              <div className="space-y-4">
                {activeOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 rounded-xl object-cover bg-slate-950 shrink-0"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                          {item.brand || 'StyleSphere'}
                        </span>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span>Size: {item.selectedSize}</span>
                          <span>•</span>
                          <span>Color: {item.selectedColor}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-white block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        (₹{item.price.toLocaleString('en-IN')} each)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery & Payment Architecture Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Delivery Address */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3">
                  <MapPin className="w-4 h-4" />
                  <span>Delivery Address</span>
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-white">{activeOrder.shippingAddress?.fullName}</p>
                  <p>{activeOrder.shippingAddress?.addressLine1 || activeOrder.shippingAddress?.street}</p>
                  {activeOrder.shippingAddress?.addressLine2 && (
                    <p>{activeOrder.shippingAddress?.addressLine2}</p>
                  )}
                  <p>
                    {activeOrder.shippingAddress?.city}, {activeOrder.shippingAddress?.state} -{' '}
                    {activeOrder.shippingAddress?.postalCode || activeOrder.shippingAddress?.pincode}
                  </p>
                  <p className="text-slate-400 pt-1">Phone: {activeOrder.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Payment Architecture & Status */}
              <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment Architecture</span>
                  </div>
                  <div className="text-xs text-slate-300 space-y-2 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Method:</span>
                      <span className="font-semibold text-white uppercase">{activeOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Status:</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        activeOrder.paymentStatus === 'paid'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : activeOrder.paymentStatus === 'pending_verification'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : activeOrder.paymentStatus === 'rejected'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {activeOrder.paymentStatus === 'pending_verification'
                          ? 'Verification Pending'
                          : activeOrder.paymentStatus}
                      </span>
                    </div>

                    {activeOrder.paymentReference && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">UTR / Ref:</span>
                        <span className="font-mono text-amber-300 font-semibold">{activeOrder.paymentReference}</span>
                      </div>
                    )}

                    {activeOrder.paymentRejectionReason && (
                      <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px]">
                        <strong>Rejection Reason:</strong> {activeOrder.paymentRejectionReason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Complete Payment Button for pending / rejected UPI orders */}
                {(activeOrder.paymentMethod === 'UPI' && (activeOrder.paymentStatus === 'pending' || activeOrder.paymentStatus === 'rejected')) && (
                  <div className="pt-3 border-t border-slate-800">
                    <Link
                      to={`/payment/${activeOrder._id || activeOrder.orderNumber}`}
                      className="w-full py-2.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-md"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>{activeOrder.paymentStatus === 'rejected' ? 'Resubmit UPI Payment' : 'Complete UPI Payment'}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Financial Breakdown */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight border-b border-slate-800 pb-4">
                Financial Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">
                    ₹{activeOrder.subtotal?.toLocaleString('en-IN')}
                  </span>
                </div>

                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>VIP Privilege Savings (10%)</span>
                    <span className="font-semibold">-₹{activeOrder.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>White-Glove Shipping</span>
                  <span className="font-semibold text-emerald-400">
                    {activeOrder.shippingCost === 0 || activeOrder.shipping === 0
                      ? 'COMPLIMENTARY'
                      : `₹${activeOrder.shippingCost || activeOrder.shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Luxury Goods GST (18%)</span>
                  <span className="font-semibold text-white">
                    ₹{activeOrder.tax?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-white block">Grand Total</span>
                    <span className="text-[10px] text-slate-400">All duties settled</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-400">
                    ₹{activeOrder.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <a
                  href={`/api/orders/${activeOrder._id || activeOrder.orderNumber}/invoice?format=html`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-6 rounded-2xl glass-panel border border-slate-700 text-xs font-bold uppercase tracking-wider text-center text-slate-200 hover:text-white flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Download Tax Invoice</span>
                </a>
                <Link
                  to="/shop"
                  className="w-full py-3 px-6 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider text-center block shadow-lg"
                >
                  Explore Runway Catalog
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetailsPage;
