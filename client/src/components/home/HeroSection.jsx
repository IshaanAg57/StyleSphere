import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, Star } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle background glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-amber-500/30 text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Spring / Summer 2026 Collection Live</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Discover. <br />
              <span className="gold-gradient-text italic font-serif">Personalize.</span> <br />
              Shop Luxury.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Step into StyleSphere — a curated sartorial universe where contemporary craftsmanship meets effortless personal elegance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-full gold-gradient-btn flex items-center justify-center gap-3 font-bold text-sm tracking-wide shadow-xl group"
              >
                <span>Shop New Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel border border-slate-700 hover:border-amber-500/50 text-slate-200 hover:text-white transition-all text-sm font-semibold flex items-center justify-center"
              >
                Explore Categories
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-serif">500+</p>
                <p className="text-xs text-slate-400 font-medium">Curated Brands</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-serif">120k+</p>
                <p className="text-xs text-slate-400 font-medium">Happy Tastemakers</p>
              </div>
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-serif">4.9</span>
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <p className="text-xs text-slate-400 font-medium">Elite Rating</p>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60 aspect-[4/5] bg-slate-900">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"
                  alt="StyleSphere Haute Couture"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Floating Glassmorphism Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-white/10 shadow-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Featured Editorial</span>
                    <h3 className="text-sm font-semibold text-white">Silk Velvet Trenchcoat</h3>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">₹ 4,499 <span className="line-through text-slate-500 text-[10px]">₹ 6,999</span></p>
                  </div>
                  <Link
                    to="/shop"
                    className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shadow-md"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Floating Accent Capsule */}
              <div className="absolute -top-4 -right-4 p-3 rounded-2xl glass-panel border border-amber-500/30 shadow-xl hidden sm:flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">100% Certified</p>
                  <p className="text-[10px] text-slate-400">Original Luxury</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
