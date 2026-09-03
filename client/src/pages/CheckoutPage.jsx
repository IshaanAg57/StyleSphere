import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrderAsync } from '../store/slices/orderSlice';
import { clearCartAsync, clearCart } from '../store/slices/cartSlice';
import * as addressService from '../services/addressService';
import {
  MapPin,
  Plus,
  CheckCircle2,
  CreditCard,
  Banknote,
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  AlertCircle,
  Truck,
  Sparkles,
  ChevronRight,
  QrCode,
  Smartphone
} from 'lucide-react';

export const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, subtotal, discount, shipping, tax, total } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);
  const { createLoading, error: orderError } = useSelector((state) => state.orders);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [formError, setFormError] = useState('');

  // New Address Form State
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  // Fetch saved addresses on mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const saved = await addressService.getAddresses();
        setAddresses(saved || []);
        if (saved && saved.length > 0) {
          const defaultAddr = saved.find((a) => a.isDefault) || saved[0];
          setSelectedAddressId(defaultAddr._id);
        } else {
          setShowAddAddressForm(true);
        }
      } catch (err) {
        console.error('Failed to load addresses:', err);
      }
    };
    loadAddresses();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (!items || items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state) {
      setFormError('Please fill in all mandatory address fields.');
      return;
    }

    try {
      const res = await addressService.addAddress(newAddress);
      const updatedList = res.addresses;
      setAddresses(updatedList);
      const added = res.newAddress || updatedList[updatedList.length - 1];
      setSelectedAddressId(added._id);
      setShowAddAddressForm(false);
      setNewAddress({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        isDefault: false
      });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    setFormError('');

    const activeAddress = addresses.find((a) => a._id === selectedAddressId);
    if (!activeAddress) {
      setFormError('Please select or add a valid shipping address to proceed.');
      return;
    }

    const orderPayload = {
      shippingAddress: activeAddress,
      paymentMethod
    };

    try {
      const actionResult = await dispatch(createOrderAsync(orderPayload));
      if (createOrderAsync.fulfilled.match(actionResult)) {
        const createdOrder = actionResult.payload;
        dispatch(clearCart());
        if (paymentMethod === 'UPI') {
          navigate(`/payment/${createdOrder._id || createdOrder.orderNumber}`);
        } else {
          navigate(`/order-success/${createdOrder._id || createdOrder.orderNumber}`);
        }
      } else {
        setFormError(actionResult.payload || 'Failed to complete acquisition');
      }
    } catch (err) {
      setFormError('An unexpected error occurred during order submission.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Breadcrumb & Header */}
        <div className="border-b border-slate-800 pb-6 space-y-2">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/cart" className="hover:text-amber-400 transition-colors">Shopping Bag</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-semibold">VIP Checkout & Acquisition</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
            Checkout & Order Authorization
          </h1>
        </div>

        {/* Global Error Banner */}
        {(formError || orderError) && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{formError || orderError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Checkout Sections */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* SECTION 1: Delivery Address */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="text-lg font-bold text-white font-serif">
                    Select Delivery Address
                  </h2>
                </div>
                <button
                  onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                  className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddAddressForm ? 'Select Saved Address' : 'Add New Address'}</span>
                </button>
              </div>

              {/* Saved Addresses Radio Grid */}
              {!showAddAddressForm && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr._id;
                    return (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddressId(addr._id)}
                        className={`p-5 rounded-2xl cursor-pointer transition-all border relative ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                        }`}
                      >
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-amber-400 absolute top-4 right-4" />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{addr.fullName}</span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-bold uppercase bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300">{addr.addressLine1 || addr.street}</p>
                          {addr.addressLine2 && (
                            <p className="text-xs text-slate-400">{addr.addressLine2}</p>
                          )}
                          <p className="text-xs text-slate-400">
                            {addr.city}, {addr.state} - {addr.postalCode || addr.pincode}
                          </p>
                          <p className="text-xs text-slate-400 pt-1">Phone: {addr.phone}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Address Form */}
              {showAddAddressForm && (
                <form onSubmit={handleSaveAddress} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.fullName}
                        onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        placeholder="e.g. Lady Eleanor Vance"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Street Address / Suite / Apartment *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                      placeholder="Penthouse 14, Royal Promenade"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        placeholder="Mumbai"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        placeholder="Maharashtra"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.postalCode}
                        onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                        placeholder="400001"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isDefaultCheck"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-400"
                    />
                    <label htmlFor="isDefaultCheck" className="text-xs text-slate-300 cursor-pointer">
                      Save as my primary default delivery address
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-bold shadow-md"
                    >
                      Save & Use Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddAddressForm(false)}
                        className="px-6 py-2.5 rounded-xl glass-panel border border-slate-700 text-xs text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* SECTION 2: Payment Method */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h2 className="text-lg font-bold text-white font-serif">
                  Payment Architecture
                </h2>
              </div>

              <div className="space-y-3">
                {/* Custom UPI Payment (Primary) */}
                <div
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'UPI'
                      ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white block">
                          Instant UPI Settlement (Scan & Pay)
                        </span>
                        <span className="text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-300">
                        Google Pay • PhonePe • Paytm • BHIM • Direct Mobile Deep Linking
                      </span>
                    </div>
                  </div>
                  {paymentMethod === 'UPI' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === 'COD'
                      ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                      <Banknote className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Cash on Delivery (White-Glove Courier)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Pay upon physical inspection & receipt of your couture piece
                      </span>
                    </div>
                  </div>
                  {paymentMethod === 'COD' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                </div>
              </div>
            </div>

            {/* SECTION 3: Item Snapshots */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <h2 className="text-lg font-bold text-white font-serif">
                  Ensemble Review ({items.length} Distinct Pieces)
                </h2>
              </div>

              <div className="space-y-3">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-slate-800/60 last:border-0">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.thumbnail || item.product?.images?.[0] || item.image}
                        alt={item.product?.name || item.name}
                        className="w-12 h-14 rounded-xl object-cover bg-slate-900"
                      />
                      <div>
                        <p className="font-semibold text-white">{item.product?.name || item.name}</p>
                        <p className="text-slate-400 text-[10px]">
                          Qty: {item.quantity} | Size: {item.selectedSize || item.size} | Color: {item.selectedColor || item.color}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-white">
                      ₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary & Place Order CTA */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight border-b border-slate-800 pb-4">
                Acquisition Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>VIP Privilege Savings (10%)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>White-Glove Express Shipping</span>
                  <span className="font-semibold text-emerald-400">
                    {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-300">
                  <span>Luxury Goods GST (18%)</span>
                  <span className="font-semibold text-white">₹{tax.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-base font-bold text-white block">Final Total</span>
                    <span className="text-[10px] text-slate-400">All duties included</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-400">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Complete Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={createLoading}
                className="w-full py-4 px-6 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-amber-500/20 disabled:opacity-50"
              >
                {createLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Authorizing Acquisition...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Order & Authorize</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 pt-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Protected by 256-Bit SSL VIP Encryption</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
