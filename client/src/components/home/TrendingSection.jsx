import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingProducts } from '../../store/slices/productSlice';
import ProductCard from '../common/ProductCard';
import ProductSkeleton from '../common/ProductSkeleton';

const fallbackTrendingProducts = [
  {
    _id: 'prod_trend_1',
    slug: 'silk-velvet-evening-gala-gown',
    name: 'Silk Velvet Evening Gala Gown',
    brand: 'Luxe Atelier',
    category: { name: 'Dresses' },
    originalPrice: 8999,
    price: 6499,
    discountPercentage: 28,
    ratingsAverage: 4.9,
    ratingsQuantity: 48,
    thumbnail: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    colors: ['Emerald Green', 'Obsidian Black'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    _id: 'prod_trend_2',
    slug: 'sea-island-cotton-spread-collar-shirt',
    name: 'Sea Island Cotton Spread Collar Shirt',
    brand: 'Monarch & Co.',
    category: { name: 'Shirts' },
    originalPrice: 4499,
    price: 3199,
    discountPercentage: 29,
    ratingsAverage: 4.9,
    ratingsQuantity: 53,
    thumbnail: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    colors: ['Crisp White', 'Sky Blue'],
    sizes: ['38', '40', '42', '44']
  },
  {
    _id: 'prod_trend_3',
    slug: 'goodyear-welted-oxford-leather-shoes',
    name: 'Goodyear-Welted Oxford Leather Shoes',
    brand: 'Monarch & Co.',
    category: { name: 'Footwear' },
    originalPrice: 7999,
    price: 5999,
    discountPercentage: 25,
    ratingsAverage: 4.9,
    ratingsQuantity: 62,
    thumbnail: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80',
    colors: ['Mahogany Burnished', 'Midnight Black'],
    sizes: ['8', '9', '10', '11']
  },
  {
    _id: 'prod_trend_4',
    slug: 'structured-calfskin-top-handle-satchel',
    name: 'Structured Calfskin Top-Handle Satchel',
    brand: 'Maison Celeste',
    category: { name: 'Accessories' },
    originalPrice: 9999,
    price: 7499,
    discountPercentage: 25,
    ratingsAverage: 5.0,
    ratingsQuantity: 39,
    thumbnail: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    colors: ['Cognac Tan', 'Noir Black'],
    sizes: ['One Size']
  }
];

export const TrendingSection = () => {
  const dispatch = useDispatch();
  const { trendingProducts } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchTrendingProducts());
  }, [dispatch]);

  const displayProducts =
    trendingProducts && trendingProducts.length > 0
      ? trendingProducts.slice(0, 4)
      : fallbackTrendingProducts;

  return (
    <section className="py-20 bg-slate-900/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Most Coveted
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1 font-serif">
              Trending This Season
            </h2>
          </div>
          <Link
            to="/shop?sort=trending"
            className="mt-4 sm:mt-0 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Explore All Trending Items →
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard key={product._id || product.slug} product={product} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrendingSection;
