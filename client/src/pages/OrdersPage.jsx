import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/orderSlice';
import {
  Package,
  Calendar,
  CreditCard,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  Truck,
  CheckCircle2,
  Clock
} from 'lucide-react';

const getStatusBadge = (status) => {
  const normalized = status ? status.toLowerCase() : 'confirmed';
  if (normalized.includes('delivered')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" />
        <span>Delivered</span>
      </span>
    );
  }
  if (normalized.includes('shipped')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
        <Truck className="w-3 h-3" />
        <span>Shipped</span>
      </span>
    );
  }
  if (normalized.includes('processing')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3" />
        <span>In Atelier Processing</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
      <Sparkles className="w-3 h-3" />
      <span>{status || 'Order Confirmed'}</span>
    </span>
  );
};

export const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, totalOrders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading && (!orders || orders.length === 0)) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-xs text-amber-400 tracking-widest uppercase font-semibold">
            Retrieving Order Portfolio...
          </p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-950">
        <div className="max-w-md w-full text-center p-8 sm:p-12 rounded-3xl glass-card border border-slate-800 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <Package className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              No Orders Placed Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              When you acquire items from StyleSphere, your couture order portfolio and shipment tracking will be recorded here.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full gold-gradient-btn text-xs font-bold uppercase tracking-wider shadow-xl"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Runway Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300">
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>VIP Client Portfolio ({totalOrders} Total Orders)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
            My Order History
          </h1>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            });

            return (
              <div
                key={order._id}
                className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-6"
              >
                {/* Top Row: Meta & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Order Reference</span>
                    <p className="text-sm font-bold text-white font-mono">{order.orderNumber}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-400" />
                      <span>{dateStr}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span className="uppercase">{order.paymentMethod}</span>
                    </div>

                    {getStatusBadge(order.orderStatus)}
                  </div>
                </div>

                {/* Middle Row: Product Thumbnails & Summary */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  {/* Thumbnail Row */}
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-20 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 relative group"
                        title={`${item.name} (${item.quantity}x)`}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        {item.quantity > 1 && (
                          <span className="absolute bottom-1 right-1 bg-amber-500 text-slate-950 font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow">
                            x{item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="pl-2">
                      <p className="text-xs font-semibold text-white">
                        {order.items?.length} Distinct {order.items?.length === 1 ? 'Piece' : 'Pieces'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px]">
                        {order.items?.map((i) => i.name).join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Price & View Details */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block">Total Acquisition</span>
                      <span className="text-xl font-bold text-amber-400">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      to={`/orders/${order.orderNumber || order._id}`}
                      className="py-2.5 px-5 rounded-xl gold-gradient-btn text-xs font-bold flex items-center gap-1.5 shadow-md"
                    >
                      <span>View Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default OrdersPage;
