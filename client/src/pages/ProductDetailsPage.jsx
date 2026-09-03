import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductBySlug, clearSelectedProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/common/ProductCard';
import ProductReviews from '../components/reviews/ProductReviews';
import {
  Star,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Check,
  Minus,
  Plus,
  ArrowLeft,
  Layers,
  HelpCircle
} from 'lucide-react';

export const ProductDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, relatedProducts, detailsLoading, error } = useSelector(
    (state) => state.products
  );
  const wishlist = useSelector((state) => state.wishlist.items || []);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [dispatch, slug]);

  // Set initial selected color and size when product loads
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.colors && selectedProduct.colors.length > 0) {
        setSelectedColor(selectedProduct.colors[0]);
      }
      if (selectedProduct.sizes && selectedProduct.sizes.length > 0) {
        setSelectedSize(selectedProduct.sizes[0]);
      }
      setSelectedImageIndex(0);
      setQuantity(1);
    }
  }, [selectedProduct]);

  const isWishlisted = selectedProduct
    ? wishlist.some((item) => (item._id || item.id) === selectedProduct._id)
    : false;

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    dispatch(
      addToCart({
        product: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price || selectedProduct.originalPrice,
        image: selectedProduct.images?.[0] || selectedProduct.thumbnail,
        size: selectedSize || 'M',
        color: selectedColor || 'Standard',
        quantity
      })
    );
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleToggleWishlist = () => {
    if (!selectedProduct) return;
    dispatch(toggleWishlist(selectedProduct));
  };

  if (detailsLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-xs text-amber-400 tracking-widest uppercase font-semibold">
            Unveiling Couture Piece...
          </p>
        </div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-slate-950 text-center">
        <div className="max-w-md mx-auto p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
          <h2 className="text-2xl font-bold text-white font-serif">Product Unavailable</h2>
          <p className="text-xs text-slate-400">
            {error || 'This couture piece is no longer available in our collection.'}
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full gold-gradient-btn text-xs font-bold shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images =
    selectedProduct.images && selectedProduct.images.length > 0
      ? selectedProduct.images
      : [selectedProduct.thumbnail || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80'];

  const currentPrice = selectedProduct.price || selectedProduct.originalPrice;
  const originalPrice = selectedProduct.originalPrice;
  const discountPercent = selectedProduct.discountPercentage || 0;
  const rating = selectedProduct.ratingsAverage || 4.8;
  const numReviews = selectedProduct.ratingsQuantity || 0;

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <Link to="/shop" className="hover:text-amber-400 transition-colors">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          {selectedProduct.category && (
            <>
              <Link
                to={`/shop?category=${selectedProduct.category.slug || selectedProduct.category}`}
                className="hover:text-amber-400 transition-colors"
              >
                {selectedProduct.category.name || 'Category'}
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            </>
          )}
          <span className="text-white truncate max-w-[200px] sm:max-w-none">
            {selectedProduct.name}
          </span>
        </nav>

        {/* Product Core Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-slate-800 bg-slate-900 group">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80';
                }}
              />

              {/* Discount Tag */}
              {discountPercent > 0 && (
                <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  {discountPercent}% OFF
                </span>
              )}

              {/* Wishlist Button */}
              <button
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-200 shadow-xl ${
                  isWishlisted
                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                    : 'bg-slate-950/70 text-slate-300 hover:text-rose-400 hover:bg-slate-950'
                }`}
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails Row */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-900 ${
                      selectedImageIndex === idx
                        ? 'border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'border-slate-800 hover:border-slate-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT: Product Details & Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Brand & Title */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  {selectedProduct.brand}
                </span>
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="font-semibold text-xs">{rating}</span>
                  <span className="text-slate-500 text-xs">({numReviews} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight mt-1.5">
                {selectedProduct.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-3">
                <span className="text-3xl font-bold text-white">
                  ₹{currentPrice?.toLocaleString('en-IN')}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-sm text-slate-500 line-through">
                    ₹{originalPrice?.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Inclusive of all luxury taxes
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-slate-300 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Color Selector */}
            {selectedProduct.colors && selectedProduct.colors.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-slate-300">
                    Color Selection:
                  </span>
                  <span className="text-amber-400 font-medium">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        selectedColor === color
                          ? 'gold-gradient-btn text-slate-950 font-bold shadow-md'
                          : 'glass-panel border border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-slate-300">
                    Select Size:
                  </span>
                  <span className="text-amber-400 font-medium">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-11 rounded-xl text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'gold-gradient-btn text-slate-950 shadow-md scale-105'
                          : 'glass-panel border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Stock Status */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                  Quantity
                </span>
                <div className="inline-flex items-center rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.stock || 10, q + 1))}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Stock Status Badge */}
              <div className="text-right">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                  Availability
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>In Stock ({selectedProduct.stock || 15} pieces left)</span>
                </span>
              </div>
            </div>

            {/* Added to Bag Notice Alert */}
            {addedNotice && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Added {quantity}x {selectedProduct.name} to your shopping bag!</span>
                </div>
                <Link to="/cart" className="underline font-bold text-emerald-200">
                  View Bag
                </Link>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 px-6 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl hover:shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`p-4 rounded-2xl glass-panel border transition-colors ${
                  isWishlisted
                    ? 'border-rose-500 text-rose-400 bg-rose-500/10'
                    : 'border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Luxury Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>100% Certified Authentic</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                <span>14-Day Free Returns</span>
              </div>
            </div>

          </div>

        </div>

        {/* Product Tabs (Material, Specs, Sizing, Delivery) */}
        <div className="rounded-3xl glass-card border border-slate-800 p-8 space-y-6">
          
          <div className="flex border-b border-slate-800 gap-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'details'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Material & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('sizing')}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'sizing'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sizing & Fit Guide
            </button>
            <button
              onClick={() => setActiveTab('delivery')}
              className={`pb-4 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'delivery'
                  ? 'text-amber-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeTab === 'details' && (
              <div className="space-y-3">
                <p>
                  <strong className="text-white">Composition:</strong> {selectedProduct.material || '100% Organic Mulberry Silk & Artisanal Cashmere.'}
                </p>
                <p>
                  <strong className="text-white">Heritage:</strong> Masterfully crafted using sustainable atelier techniques. Every seam is reinforced with double-needle stitching to preserve structure and longevity.
                </p>
                <p>
                  <strong className="text-white">Care Instructions:</strong> Specialized dry clean only. Store in complimentary breathable cotton garment bag away from direct sunlight.
                </p>
              </div>
            )}

            {activeTab === 'sizing' && (
              <div className="space-y-3">
                <p>
                  <strong className="text-white">Tailored Silhouette:</strong> Designed with a contemporary modern fit. True to international sizing standards.
                </p>
                <p>
                  For an oversized, relaxed drape, we recommend ordering one size larger than your typical size.
                </p>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="space-y-3">
                <p>
                  <strong className="text-white">Express Delivery:</strong> Dispatched in bespoke StyleSphere protective packaging within 24-48 business hours with live tracking.
                </p>
                <p>
                  <strong className="text-white">Returns:</strong> We accept complimentary returns and exchanges within 14 days of delivery for unworn garments with original tags intact.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Product Reviews & Ratings Section */}
        <ProductReviews productId={selectedProduct._id} />

        {/* Related Products Section */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="space-y-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Complete Your Ensemble
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight mt-1">
                  You May Also Admire
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Explore Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod._id || prod.slug} product={prod} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailsPage;
