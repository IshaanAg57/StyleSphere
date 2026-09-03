import React from 'react';
import HeroSection from '../components/home/HeroSection';
import ShopByCategory from '../components/home/ShopByCategory';
import TrendingSection from '../components/home/TrendingSection';
import PromoBanner from '../components/home/PromoBanner';
import CustomerReviews from '../components/home/CustomerReviews';
import Newsletter from '../components/home/Newsletter';

export const HomePage = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <ShopByCategory />
      <TrendingSection />
      <PromoBanner />
      <CustomerReviews />
      <Newsletter />
    </div>
  );
};

export default HomePage;
