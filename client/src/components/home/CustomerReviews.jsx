import React from 'react';
import { Star, CheckCircle2, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Ananya Deshmukh',
    role: 'Fashion Curator, Mumbai',
    rating: 5,
    comment: 'The tailoring on the silk midi dress is immaculate. StyleSphere has set a new benchmark for luxury Indian fashion commerce.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    itemPurchased: 'Silk Velvet Trenchcoat'
  },
  {
    id: 2,
    name: 'Vikramaditya Roy',
    role: 'Architect, Bengaluru',
    rating: 5,
    comment: 'Impressed by the artisanal shoes. Delivered within 48 hours in luxury unboxing packaging with personalized care instructions.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    itemPurchased: 'Handcrafted Oxford Shoes'
  },
  {
    id: 3,
    name: 'Zoya Merchant',
    role: 'Creative Director, Delhi',
    rating: 5,
    comment: 'The attention to fabric detail and responsive sizing guidance is peerless. StyleSphere is my new default for all seasonal wardrobe refreshes.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    itemPurchased: 'Sculptural Gold Jewelry'
  }
];

export const CustomerReviews = () => {
  return (
    <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Client Chronicles</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            Loved By Discerning Tastemakers
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Read firsthand testimonials from our global community of fashion connoisseurs.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-8 rounded-3xl glass-card border border-slate-800/80 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-slate-800 pointer-events-none" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-slate-300 italic leading-relaxed mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Reviewer Profile */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-sm text-white">{rev.name}</h4>
                    {rev.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="Verified Buyer" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{rev.role}</p>
                  <p className="text-[10px] text-amber-400/80 font-mono mt-0.5">Purchased: {rev.itemPurchased}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default CustomerReviews;
