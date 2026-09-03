import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RotateCcw, Award, Mail, Phone, MapPin } from 'lucide-react';
import ApiHealthStatus from './ApiHealthStatus';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 text-sm">
      {/* Service Highlights */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Complimentary Delivery</h4>
                <p className="text-xs text-slate-400 mt-0.5">Orders over ₹999 across India</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Hassle-Free Returns</h4>
                <p className="text-xs text-slate-400 mt-0.5">14-day seamless exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">100% Authentic</h4>
                <p className="text-xs text-slate-400 mt-0.5">Certified premium designers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">Curated Luxury</h4>
                <p className="text-xs text-slate-400 mt-0.5">Handpicked for modern lifestyle</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
                <span className="font-serif font-black text-slate-950 text-xl">S</span>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Style<span className="text-amber-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Discover. Personalize. Shop. StyleSphere represents the pinnacle of contemporary fashion, blending timeless elegance with bespoke digital shopping experiences.
            </p>
            <div className="pt-2">
              <ApiHealthStatus />
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop?category=women" className="hover:text-amber-400 transition-colors">Women's Haute Couture</Link></li>
              <li><Link to="/shop?category=men" className="hover:text-amber-400 transition-colors">Men's Sartorial</Link></li>
              <li><Link to="/shop?category=footwear" className="hover:text-amber-400 transition-colors">Artisanal Footwear</Link></li>
              <li><Link to="/shop?category=accessories" className="hover:text-amber-400 transition-colors">Luxury Accessories</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-amber-400 transition-colors">Seasonal Runways</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Customer Care</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/orders" className="hover:text-amber-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/profile" className="hover:text-amber-400 transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/profile" className="hover:text-amber-400 transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="hover:text-amber-400 transition-colors">FAQs & Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-amber-400 transition-colors">Concierge Assistance</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Boutique Inquiries</h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Indiranagar Fashion Blvd, Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 (800) 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>concierge@stylesphere.fashion</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} StyleSphere Inc. All rights reserved. Designed for discerning tastemakers.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-slate-400 transition-colors">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
