import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const categories = [
  {
    id: 'women',
    name: "Women's Collection",
    subtitle: 'Haute couture, dresses & chic essentials',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
    itemCount: '1,420+ Items',
    colSpan: 'md:col-span-2'
  },
  {
    id: 'men',
    name: "Men's Sartorial",
    subtitle: 'Tailored suits, shirts & streetwear',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    itemCount: '980+ Items',
    colSpan: 'md:col-span-1'
  },
  {
    id: 'footwear',
    name: 'Artisanal Footwear',
    subtitle: 'Italian leather shoes & sneakers',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    itemCount: '650+ Items',
    colSpan: 'md:col-span-1'
  },
  {
    id: 'accessories',
    name: 'Luxury Accessories',
    subtitle: 'Leather handbags, belts & fine jewelry',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    itemCount: '520+ Items',
    colSpan: 'md:col-span-2'
  }
];

export const ShopByCategory = () => {
  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Curated Portfolios</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">
              Shop By Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="mt-4 md:mt-0 text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group transition-colors"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className={`group relative rounded-3xl overflow-hidden aspect-[4/3] ${cat.colSpan} border border-slate-800/80 bg-slate-900 shadow-xl`}
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              
              {/* Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent group-hover:from-slate-950/95 transition-all duration-300" />

              {/* Content Box */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
                    {cat.itemCount}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1 max-w-xs">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="p-3 rounded-2xl glass-panel border border-white/10 text-white group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300 shrink-0">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ShopByCategory;
