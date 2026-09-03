import React from 'react';

export const ProductSkeleton = ({ count = 8 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-3xl overflow-hidden glass-card border border-slate-800 animate-pulse flex flex-col justify-between"
        >
          {/* Shimmer Image */}
          <div className="aspect-[3/4] bg-slate-800/60 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-700/30 to-transparent" />
          </div>

          {/* Shimmer Content */}
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-slate-800 rounded" />
              <div className="h-3 w-8 bg-slate-800 rounded" />
            </div>

            <div className="h-4 w-4/5 bg-slate-800 rounded" />
            
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
              <div className="h-5 w-20 bg-slate-800 rounded" />
              <div className="h-4 w-12 bg-slate-800/60 rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductSkeleton;
