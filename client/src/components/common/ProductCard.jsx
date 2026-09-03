import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.items || []);

  const isWishlisted = wishlist.some(
    (item) => (item._id || item.id) === (product._id || product.id)
  );

  const displayImage =
    product.thumbnail ||
    (product.images && product.images[0]) ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';

  const secondaryImage =
    product.images && product.images[1] ? product.images[1] : displayImage;

  const currentPrice = product.price || product.discountPrice || product.originalPrice;
  const originalPrice = product.originalPrice;
  const discountPercent = product.discountPercentage || 0;
  const rating = product.ratingsAverage || product.rating || 4.8;
  const reviewCount = product.ratingsQuantity || product.numReviews || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: currentPrice,
        image: displayImage,
        size: product.sizes?.[0] || 'M',
        color: product.colors?.[0] || 'Standard',
        quantity: 1
      })
    );
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="group rounded-3xl overflow-hidden glass-card border border-slate-800/80 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between">
      
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-950">
        <Link to={`/product/${product.slug || product._id}`} className="block w-full h-full">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </Link>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            {discountPercent}% OFF
          </span>
        )}

        {/* Gender / New Badge */}
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-emerald-500 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            NEW
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white shadow-rose-500/30'
              : 'bg-slate-950/60 text-slate-300 hover:text-rose-400 hover:bg-slate-950/90'
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View / Add to Bag Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 px-4 rounded-xl gold-gradient-btn text-xs font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
          
          <Link
            to={`/product/${product.slug || product._id}`}
            className="p-2.5 rounded-xl glass-panel border border-slate-700 hover:border-amber-400 text-slate-200 hover:text-white transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-semibold text-amber-400 truncate max-w-[120px]">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="font-semibold">{rating}</span>
              {reviewCount > 0 && (
                <span className="text-slate-500 text-[10px]">({reviewCount})</span>
              )}
            </div>
          </div>

          <Link
            to={`/product/${product.slug || product._id}`}
            className="block text-sm font-semibold text-white line-clamp-1 group-hover:text-amber-300 transition-colors"
          >
            {product.name}
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1 font-light">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price Section */}
        <div className="flex items-baseline justify-between pt-3 mt-3 border-t border-slate-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-white">
              ₹{currentPrice?.toLocaleString('en-IN')}
            </span>
            {originalPrice > currentPrice && (
              <span className="text-xs text-slate-500 line-through">
                ₹{originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Available Sizes Hint */}
          {product.sizes && product.sizes.length > 0 && (
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
              {product.sizes.slice(0, 3).join(', ')}
            </span>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProductCard;
