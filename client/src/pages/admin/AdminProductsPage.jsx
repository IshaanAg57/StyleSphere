import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as adminService from '../../services/adminService';
import * as productService from '../../services/productService';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Filter,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export const AdminProductsPage = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.q = search;
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (stockFilter !== 'all') params.stockStatus = stockFilter;

      const data = await adminService.getAdminProducts(params);
      setProducts(data.products || []);
      setTotalProducts(data.totalProducts || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load admin products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats || []);
      } catch (e) {}
    };
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, selectedCategory, stockFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleDelete = async (productId, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        await adminService.deleteAdminProduct(productId);
        await loadProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Product Portfolio Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing {totalProducts} active designer items across all departments.
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="py-2.5 px-5 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Creation</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </form>

        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="all">All Stock Levels</option>
            <option value="low">Low Stock (≤ 5)</option>
            <option value="out">Out of Stock (0)</option>
          </select>
        </div>

      </div>

      {/* Product Table */}
      <div className="rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Flags</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading products...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.thumbnail || prod.images?.[0]}
                          alt={prod.name}
                          className="w-12 h-14 rounded-xl object-cover bg-slate-950 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-white">{prod.name}</p>
                          <p className="text-[10px] text-amber-400 font-bold uppercase">{prod.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{prod.category?.name || 'Couture'}</td>
                    <td className="p-4 font-bold text-white">₹{prod.price?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        prod.stock <= 0
                          ? 'bg-rose-500/10 text-rose-400'
                          : prod.stock <= 5
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {prod.stock} Units
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1 flex-wrap">
                        {prod.featured && <span className="text-[9px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded">Featured</span>}
                        {prod.trending && <span className="text-[9px] bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">Trending</span>}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${prod._id}/edit`}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(prod._id, prod.name)}
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No products found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminProductsPage;
