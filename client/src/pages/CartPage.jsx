import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCart,
  updateCartItemAsync,
  removeCartItemAsync,
  clearCartAsync,
  updateQuantity,
  removeFromCart
} from '../store/slices/cartSlice';
import { toggleWishlist, addToWishlistAsync } from '../store/slices/wishlistSlice';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Minus,
  Plus,
  ShoppingBasket
} from 'lucide-react';

export const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, subtotal, discount, shipping, tax, total, loading } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlist = useSelector((state) => state.wishlist.items || []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  const handleUpdateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    if (isAuthenticated && item._id) {
      dispatch(updateCartItemAsync({ itemId: item._id, quantity: newQuantity }));
    } else {
      dispatch(
        updateQuantity({
          product: item.product?._id || item.product,
          size: item.selectedSize || item.size,
          color: item.selectedColor || item.color,
          quantity: newQuantity,
          _id: item._id
        })
      );
    }
  };

  const handleRemoveItem = (item) => {
    if (isAuthenticated && item._id) {
      dispatch(removeCartItemAsync(item._id));
    } else {
      dispatch(
        removeFromCart({
          product: item.product?._id || item.product,
          size: item.selectedSize || item.size,
          color: item.selectedColor || item.color,
          _id: item._id
        })
      );
    }
  };

  const handleMoveToWishlist = (item) => {
    const product = item.product || item;
    if (isAuthenticated && product._id) {
      dispatch(addToWishlistAsync(product._id));
    } else {
      dispatch(toggleWishlist(product));
    }
    handleRemoveItem(item);
  };

  const handleClearCart = () => {
    if (isAuthenticated) {
      dispatch(clearCartAsync());
    } else {
      dispatch({ type: 'cart/clearCart' });
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-950">
        <div className="max-w-md w-full text-center p-8 sm:p-12 rounded-3xl glass-card border border-slate-800 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
            <ShoppingBasket className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              Your Shopping Bag is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Discover timeless silhouettes and haute couture pieces crafted for modern tastemakers.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full gold-gradient-btn text-xs font-bold uppercase tracking-wider shadow-xl"
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)} Items)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              Review Your Selections
            </h1>
          </div>
          <button
            onClick={handleClearCart}
            className="text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 self-start sm:self-end"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Entire Bag</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item, idx) => {
              const product = item.product || {};
              const name = product.name || item.name || 'Luxury Fashion Item';
              const brand = product.brand || item.brand || 'StyleSphere';
              const image =
                product.thumbnail ||
                product.images?.[0] ||
                item.image ||
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
              const price = item.price || product.price || 0;
              const originalPrice = item.originalPrice || product.originalPrice;
              const size = item.selectedSize || item.size || 'M';
              const color = item.selectedColor || item.color || 'Standard';
              const slug = product.slug || item.slug;

              return (
                <div
                  key={item._id || idx}
                  className="p-5 sm:p-6 rounded-3xl glass-card border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  {/* Thumbnail & Info */}
                  <div className="flex gap-4 items-center">
                    <Link
                      to={slug ? `/product/${slug}` : '/shop'}
                      className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800"
                    >
                      <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover object-center hover:scale-105 transition-transform"
                      />
                    </Link>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        {brand}
                      </span>
                      <Link
                        to={slug ? `/product/${slug}` : '/shop'}
                        className="text-sm sm:text-base font-semibold text-white hover:text-amber-300 transition-colors line-clamp-1"
                      >
                        {name}
                      </Link>

                      {/* Variant Badges */}
                      <div className="flex items-center gap-2 pt-1 text-xs">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                          Size: {size}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                          Color: {color}
                        </span>
                      </div>

                      {/* Price per unit */}
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-bold text-white">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {originalPrice > price && (
                          <span className="text-xs text-slate-500 line-through">
                            ₹{originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    {/* Quantity Selector */}
                    <div className="inline-flex items-center rounded-xl bg-slate-900 border border-slate-800">
                      <button
                        onClick={() => handleUpdateQuantity(item, item.quantity - 1)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-white">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item, item.quantity + 1)}
                        className="p-2 text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total item price */}
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-slate-400 block">Item Total</span>
                      <span className="text-base font-bold text-white">
                        ₹{(price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                        title="Move to Wishlist"
                      >
                        <Heart className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Wishlist</span>
                      </button>

                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Shopping Assurances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-xs text-slate-400">
              <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>100% Certified Authentic Couture</span>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
                <Truck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Complimentary Delivery over ₹999</span>
              </div>
              <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-amber-400 shrink-0" />
                <span>14-Day Seamless Returns</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Summary Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
              
              <h2 className="text-lg font-bold text-white font-serif tracking-tight border-b border-slate-800 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-amber-400">
                    <span>VIP Privilege Discount (10%)</span>
                    <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-300">
                  <span>Express White-Glove Shipping</span>
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
                    <span className="text-base font-bold text-white block">Estimated Total</span>
                    <span className="text-[10px] text-slate-400">Inclusive of all duties</span>
                  </div>
                  <span className="text-2xl font-bold text-amber-400">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 px-6 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:shadow-amber-500/20"
                >
                  <span>Proceed to VIP Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/shop"
                  className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
                >
                  ← Continue Exploring Collections
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;
