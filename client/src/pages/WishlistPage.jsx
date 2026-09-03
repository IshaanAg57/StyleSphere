import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchWishlist,
  removeFromWishlistAsync,
  removeFromWishlist
} from '../store/slices/wishlistSlice';
import { addToCartAsync, addToCart } from '../store/slices/cartSlice';
import { Heart, ShoppingBag, Trash2, Sparkles, ArrowRight } from 'lucide-react';

export const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  const handleRemove = (productId) => {
    if (isAuthenticated) {
      dispatch(removeFromWishlistAsync(productId));
    } else {
      dispatch(removeFromWishlist(productId));
    }
  };

  const handleMoveToBag = (product) => {
    const payload = {
      productId: product._id || product.id,
      selectedSize: product.sizes?.[0] || 'M',
      selectedColor: product.colors?.[0] || 'Standard',
      quantity: 1
    };

    if (isAuthenticated) {
      dispatch(addToCartAsync(payload));
      dispatch(removeFromWishlistAsync(product._id || product.id));
    } else {
      dispatch(
        addToCart({
          product: product._id || product.id,
          name: product.name,
          price: product.price || product.originalPrice,
          image: product.thumbnail || product.images?.[0],
          size: product.sizes?.[0] || 'M',
          color: product.colors?.[0] || 'Standard',
          quantity: 1
        })
      );
      dispatch(removeFromWishlist(product._id || product.id));
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-950">
        <div className="max-w-md w-full text-center p-8 sm:p-12 rounded-3xl glass-card border border-slate-800 space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
              Your Wishlist is Empty
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Save your most coveted runway creations, bespoke garments, and accessories for future indulgence.
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
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800 pb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-xs font-semibold text-rose-300 mb-2">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
              <span>Personal Curations ({items.length} Saved)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              Saved Fashion Pieces
            </h1>
          </div>
          <Link
            to="/shop"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 self-start sm:self-end"
          >
            <span>Continue Browsing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => {
            const pId = product._id || product.id;
            const image =
              product.thumbnail ||
              product.images?.[0] ||
              product.image ||
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
            const price = product.price || product.discountPrice || product.originalPrice || 0;
            const originalPrice = product.originalPrice;
            const slug = product.slug || pId;

            return (
              <div
                key={pId}
                className="group rounded-3xl overflow-hidden glass-card border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
                  <Link to={`/product/${slug}`} className="block w-full h-full">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Remove Wishlist Button */}
                  <button
                    onClick={() => handleRemove(pId)}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-slate-950/70 text-rose-400 hover:bg-rose-500 hover:text-white transition-all shadow-md"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {product.discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                {/* Info & Move to Bag */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                      {product.brand || 'StyleSphere'}
                    </span>
                    <Link
                      to={`/product/${slug}`}
                      className="block text-sm font-semibold text-white group-hover:text-amber-300 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 pt-2">
                      <span className="text-base font-bold text-white">
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      {originalPrice > price && (
                        <span className="text-xs text-slate-500 line-through">
                          ₹{originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => handleMoveToBag(product)}
                    className="w-full py-2.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-amber-500/20"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default WishlistPage;
