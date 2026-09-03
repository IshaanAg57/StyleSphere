import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrderDetails } from '../store/slices/orderSlice';
import {
  CheckCircle2,
  Package,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();

  const { currentOrder, loading } = useSelector((state) => state.orders);
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

  return (
    <div className="min-h-screen bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Celebration Banner */}
        <div className="text-center space-y-4 p-8 sm:p-12 rounded-3xl glass-card border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-amber-400" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Acquisition Confirmed & Authorized</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif tracking-tight">
              Thank You for Your Order
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Your haute couture items are currently being hand-inspected and packaged in bespoke StyleSphere protective boxing.
            </p>
          </div>

          {/* Quick Summary Grid */}
          {activeOrder && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800 text-left">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Order Number</span>
                <p className="text-xs font-bold text-amber-400 truncate">{activeOrder.orderNumber}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Date Placed</span>
                <p className="text-xs font-semibold text-white">
                  {new Date(activeOrder.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Amount</span>
                <p className="text-xs font-bold text-white">
                  ₹{activeOrder.totalAmount?.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Payment</span>
                <p className="text-xs font-semibold text-emerald-400 uppercase">
                  {activeOrder.paymentMethod}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Shipping & Order Snapshot Details */}
        {activeOrder && (
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

            {/* Items Summary */}
            <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-3">
                <Package className="w-4 h-4" />
                <span>Ensemble Summary ({activeOrder.items?.length || 0} Pieces)</span>
              </div>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {activeOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-300 truncate max-w-[180px]">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-white">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            to="/orders"
            className="py-3.5 px-8 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider text-center shadow-lg"
          >
            <span>View All My Orders</span>
          </Link>

          <Link
            to="/shop"
            className="py-3.5 px-8 rounded-2xl glass-panel border border-slate-700 text-xs font-bold uppercase tracking-wider text-center text-slate-200 hover:text-white transition-colors"
          >
            <span>Continue Exploring Runway</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
