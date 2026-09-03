import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../store/slices/productSlice';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sartorial Portfolios</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white font-serif tracking-tight">
            Curated Categories
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Explore dedicated wardrobe departments engineered for modern tastemakers and refined living.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <Link
                key={cat._id || cat.slug}
                to={`/shop?category=${cat.slug}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] glass-card border border-slate-800 hover:border-amber-500/40 transition-all duration-500 shadow-2xl"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent group-hover:from-slate-950/90 transition-all" />

                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex items-end justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                      {cat.gender || 'Collection'}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 max-w-xs">
                      {cat.description}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl glass-panel border border-white/10 text-white group-hover:bg-amber-500 group-hover:text-slate-950 transition-all shrink-0 shadow-lg">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-3xl bg-slate-900 animate-pulse border border-slate-800"
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoriesPage;
