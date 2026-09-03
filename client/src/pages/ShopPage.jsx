import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/common/ProductCard';
import ProductSkeleton from '../components/common/ProductSkeleton';
import {
  SlidersHorizontal,
  Search,
  X,
  ChevronDown,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GENDERS = [
  { label: 'All Collections', value: 'all' },
  { label: 'Women', value: 'women' },
  { label: 'Men', value: 'men' },
  { label: 'Unisex', value: 'unisex' }
];

const PRICE_RANGES = [
  { label: 'All Prices', min: '', max: '' },
  { label: 'Under ₹3,000', min: '0', max: '3000' },
  { label: '₹3,000 - ₹5,000', min: '3000', max: '5000' },
  { label: '₹5,000 - ₹8,000', min: '5000', max: '8000' },
  { label: 'Above ₹8,000', min: '8000', max: '' }
];

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products, totalProducts, page, totalPages, loading, categories } =
    useSelector((state) => state.products);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  // Extract active query params
  const currentCategory = searchParams.get('category') || 'all';
  const currentGender = searchParams.get('gender') || 'all';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentSize = searchParams.get('size') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentQuery = searchParams.get('q') || '';

  // Calculate active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (currentCategory !== 'all') count++;
    if (currentGender !== 'all') count++;
    if (currentMinPrice || currentMaxPrice) count++;
    if (currentSize !== 'all') count++;
    if (currentQuery) count++;
    return count;
  }, [currentCategory, currentGender, currentMinPrice, currentMaxPrice, currentSize, currentQuery]);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products whenever search params change
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 12,
      sort: currentSort
    };

    if (currentQuery) params.q = currentQuery;
    if (currentCategory !== 'all') params.category = currentCategory;
    if (currentGender !== 'all') params.gender = currentGender;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    if (currentSize !== 'all') params.size = currentSize;

    dispatch(fetchProducts(params));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [
    dispatch,
    currentPage,
    currentSort,
    currentQuery,
    currentCategory,
    currentGender,
    currentMinPrice,
    currentMaxPrice,
    currentSize
  ]);

  // Helper to update specific search param
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceSelect = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', min);
    else newParams.delete('minPrice');

    if (max) newParams.set('maxPrice', max);
    else newParams.delete('maxPrice');

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('q', searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', newPage.toString());
      setSearchParams(newParams);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Title & Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Runway & Curated Collections</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-tight">
              The StyleSphere Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Discover {totalProducts} handcrafted and bespoke designer pieces.
            </p>
          </div>

          {/* Search bar in header */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products, brands, tags..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateParam('q', '');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="py-2.5 px-4 rounded-2xl gold-gradient-btn text-xs font-bold shrink-0 shadow-md"
            >
              Search
            </button>
          </form>
        </div>

        {/* Top Filter Bar (Sorting, Active Badges, Mobile Trigger) */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800">
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-amber-500/40 text-xs font-semibold text-amber-300"
            >
              <Filter className="w-4 h-4" />
              <span>Filters ({activeFiltersCount})</span>
            </button>

            {/* Active filters pill list */}
            {activeFiltersCount > 0 && (
              <div className="hidden sm:flex items-center gap-2 flex-wrap text-xs">
                <span className="text-slate-400 text-xs">Active:</span>
                
                {currentCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span>Category: {currentCategory}</span>
                    <button onClick={() => updateParam('category', 'all')}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {currentGender !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span>Gender: {currentGender}</span>
                    <button onClick={() => updateParam('gender', 'all')}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {(currentMinPrice || currentMaxPrice) && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span>Price: ₹{currentMinPrice || '0'} - ₹{currentMaxPrice || 'Max'}</span>
                    <button onClick={() => handlePriceSelect('', '')}><X className="w-3 h-3" /></button>
                  </span>
                )}

                {currentSize !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <span>Size: {currentSize}</span>
                    <button onClick={() => updateParam('size', 'all')}><X className="w-3 h-3" /></button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-rose-400 hover:text-rose-300 underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-400 hidden sm:inline">Sort By:</span>
            <div className="relative">
              <select
                value={currentSort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 rounded-xl px-3.5 py-2 pr-8 text-xs font-medium text-white focus:outline-none cursor-pointer transition-colors"
              >
                <option value="newest">Newest Runway Additions</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Main Content Layout (Sidebar + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28">
            <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Audience</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {GENDERS.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => updateParam('gender', g.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        currentGender === g.value
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Categories</span>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <button
                    onClick={() => updateParam('category', 'all')}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      currentCategory === 'all'
                        ? 'text-amber-400 font-bold bg-amber-500/10'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>All Categories</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id || cat.slug}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                        currentCategory === cat.slug
                          ? 'text-amber-400 font-bold bg-amber-500/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Price Range</span>
                <div className="space-y-1">
                  {PRICE_RANGES.map((pr, idx) => {
                    const isSelected =
                      currentMinPrice === pr.min && currentMaxPrice === pr.max;
                    return (
                      <button
                        key={idx}
                        onClick={() => handlePriceSelect(pr.min, pr.max)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                          isSelected
                            ? 'text-amber-400 font-bold bg-amber-500/10'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{pr.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sizes Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Sizes</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => updateParam('size', 'all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      currentSize === 'all'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => updateParam('size', s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        currentSize === s
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Right Product Grid */}
          <main className="lg:col-span-9 space-y-8">
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProductSkeleton count={6} />
              </div>
            ) : products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id || product.slug} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8 border-t border-slate-800">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                            currentPage === pageNum
                              ? 'gold-gradient-btn text-slate-950 shadow-md'
                              : 'glass-panel border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2.5 rounded-xl glass-panel border border-slate-700 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="p-12 sm:p-16 rounded-3xl glass-card border border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white font-serif">No Matching Creations Found</h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  We couldn't find any designer items matching your current search parameters. Try expanding your filters or search keywords.
                </p>
                <div className="pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-2.5 rounded-full gold-gradient-btn text-xs font-bold shadow-lg"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-slate-950 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 z-10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Audience */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase text-slate-300">Audience</span>
              <div className="grid grid-cols-2 gap-1.5">
                {GENDERS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => {
                      updateParam('gender', g.value);
                      setMobileFilterOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-medium ${
                      currentGender === g.value
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-300">Categories</span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    updateParam('category', 'all');
                    setMobileFilterOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                    currentCategory === 'all'
                      ? 'text-amber-400 font-bold bg-amber-500/10'
                      : 'text-slate-400'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id || cat.slug}
                    onClick={() => {
                      updateParam('category', cat.slug);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      currentCategory === cat.slug
                        ? 'text-amber-400 font-bold bg-amber-500/10'
                        : 'text-slate-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <span className="text-xs font-bold uppercase text-slate-300">Price Range</span>
              <div className="space-y-1">
                {PRICE_RANGES.map((pr, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handlePriceSelect(pr.min, pr.max);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      currentMinPrice === pr.min && currentMaxPrice === pr.max
                        ? 'text-amber-400 font-bold bg-amber-500/10'
                        : 'text-slate-400'
                    }`}
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  clearAllFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-300 text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ShopPage;
