import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag, Percent } from 'lucide-react';

export const PromoBanner = () => {
  return (
    <section className="py-16 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-8 sm:p-12 lg:p-16 shadow-2xl">
          
          {/* Background Decorative Pattern */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-xs font-bold text-amber-300">
                <Tag className="w-3.5 h-3.5" />
                <span>EXCLUSIVE PRE-SEASON ACCESS</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Unlock 20% Off Your Inaugural Order
              </h2>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Experience bespoke shopping with handcrafted artisan garments and contemporary runway collections. Apply code at checkout.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div className="flex items-center gap-3 bg-slate-950/80 border border-amber-500/40 px-4 py-2.5 rounded-2xl font-mono text-amber-400 text-sm font-bold tracking-widest shadow-inner">
                  <span>USE CODE:</span>
                  <span className="text-white bg-amber-500/30 px-2 py-0.5 rounded border border-amber-500/50">SPHERE20</span>
                </div>

                <Link
                  to="/shop"
                  className="px-6 py-3 rounded-2xl gold-gradient-btn text-xs font-bold flex items-center gap-2 shadow-lg"
                >
                  <span>Redeem Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-2 border-dashed border-amber-400/50 flex flex-col items-center justify-center p-4 text-center bg-slate-900/80 backdrop-blur-md shadow-2xl">
                <Percent className="w-8 h-8 text-amber-400 mb-1 animate-bounce" />
                <span className="text-2xl sm:text-3xl font-bold text-white font-serif">20% OFF</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-widest">Site-Wide</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
