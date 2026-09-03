import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import * as adminService from '../../services/adminService';
import * as productService from '../../services/productService';
import { ArrowLeft, Save, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AdminProductFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(productId);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    brand: 'StyleSphere Atelier',
    category: '',
    gender: 'women',
    price: '',
    originalPrice: '',
    stock: 10,
    shortDescription: '',
    description: '',
    material: '100% Mulberry Silk & Cashmere',
    thumbnail: '',
    imagesStr: '',
    colorsStr: 'Black, Gold, Ivory',
    sizesStr: 'XS, S, M, L',
    tagsStr: 'luxury, couture, evening',
    featured: false,
    trending: false,
    isNewArrival: true
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats || []);
        if (cats && cats.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: cats[0]._id }));
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (isEditing) {
      const loadProduct = async () => {
        try {
          setLoading(true);
          const data = await productService.getProductBySlug(productId);
          const p = data.product;
          if (p) {
            setFormData({
              name: p.name || '',
              brand: p.brand || '',
              category: p.category?._id || p.category || '',
              gender: p.gender || 'women',
              price: p.price || '',
              originalPrice: p.originalPrice || '',
              stock: p.stock || 0,
              shortDescription: p.shortDescription || '',
              description: p.description || '',
              material: p.material || '',
              thumbnail: p.thumbnail || '',
              imagesStr: p.images ? p.images.join(', ') : '',
              colorsStr: p.colors ? p.colors.join(', ') : '',
              sizesStr: p.sizes ? p.sizes.join(', ') : '',
              tagsStr: p.tags ? p.tags.join(', ') : '',
              featured: Boolean(p.featured),
              trending: Boolean(p.trending),
              isNewArrival: Boolean(p.isNewArrival)
            });
          }
        } catch (err) {
          setFormError('Failed to load product details');
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [productId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.name || !formData.price || !formData.category) {
      setFormError('Please fill in Name, Price, and Category.');
      return;
    }

    const payload = {
      name: formData.name,
      brand: formData.brand,
      category: formData.category,
      gender: formData.gender,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
      stock: parseInt(formData.stock, 10) || 0,
      shortDescription: formData.shortDescription,
      description: formData.description,
      material: formData.material,
      thumbnail: formData.thumbnail || (formData.imagesStr ? formData.imagesStr.split(',')[0].trim() : ''),
      images: formData.imagesStr
        ? formData.imagesStr.split(',').map((s) => s.trim()).filter(Boolean)
        : [formData.thumbnail || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'],
      colors: formData.colorsStr.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: formData.sizesStr.split(',').map((s) => s.trim()).filter(Boolean),
      tags: formData.tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
      featured: formData.featured,
      trending: formData.trending,
      isNewArrival: formData.isNewArrival
    };

    try {
      setLoading(true);
      if (isEditing) {
        await adminService.updateAdminProduct(productId, payload);
        setFormSuccess('Product updated successfully!');
      } else {
        await adminService.createAdminProduct(payload);
        setFormSuccess('Product published successfully!');
      }
      setTimeout(() => navigate('/admin/products'), 1500);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-serif">
            {isEditing ? 'Edit Haute Couture Piece' : 'Create New Luxury Creation'}
          </h1>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{formSuccess} Redirecting to portfolio...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-card border border-slate-800 space-y-6">
        
        {/* Core Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Creation Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Silk Velvet Gala Gown"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Atelier / Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Luxe Atelier"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Category & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Department / Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Target Audience
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Price (₹) *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="6499"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Original MSRP (₹)
            </label>
            <input
              type="number"
              min="0"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              placeholder="8999"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Initial Stock Units *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="12"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Imagery */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Primary Image URL *
            </label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://images.unsplash.com/photo-1595777457583-95e059d581b8..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Gallery Images (Comma-Separated URLs)
            </label>
            <textarea
              rows={2}
              value={formData.imagesStr}
              onChange={(e) => setFormData({ ...formData, imagesStr: e.target.value })}
              placeholder="https://images.unsplash.com/..., https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Variants: Colors, Sizes, Material */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Color Palette (Comma-Separated)
            </label>
            <input
              type="text"
              value={formData.colorsStr}
              onChange={(e) => setFormData({ ...formData, colorsStr: e.target.value })}
              placeholder="Emerald Green, Midnight Obsidian, Ruby Wine"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Sizes Available (Comma-Separated)
            </label>
            <input
              type="text"
              value={formData.sizesStr}
              onChange={(e) => setFormData({ ...formData, sizesStr: e.target.value })}
              placeholder="XS, S, M, L, XL"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Fabric & Composition
          </label>
          <input
            type="text"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            placeholder="100% Silk Velvet with Habotai Lining"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Descriptions */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Short Tagline Description
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            placeholder="Dramatic silk velvet gown with fluid drape and couture tailoring."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
            Full Editorial Description
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Crafted from sumptuous silk velvet with a dramatic cowl neckline..."
            className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-6 pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-amber-500"
            />
            <span>Featured Editorial Drop</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.trending}
              onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-amber-500"
            />
            <span>Trending This Season</span>
          </label>

          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isNewArrival}
              onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
              className="rounded bg-slate-900 border-slate-700 text-amber-500"
            />
            <span>New Runway Arrival</span>
          </label>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-800 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 rounded-2xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-xl disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : isEditing ? 'Update Product' : 'Publish Product'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3 rounded-2xl glass-panel border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Cancel
          </button>
        </div>

      </form>

    </div>
  );
};

export default AdminProductFormPage;
