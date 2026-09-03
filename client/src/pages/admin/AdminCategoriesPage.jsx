import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    gender: 'unisex',
    image: '',
    featured: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminCategories();
      setCategories(data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCatId(null);
    setFormData({
      name: '',
      description: '',
      gender: 'unisex',
      image: '',
      featured: true
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCatId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      gender: cat.gender || 'unisex',
      image: cat.image || '',
      featured: Boolean(cat.featured)
    });
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Category name is required.');
      return;
    }

    try {
      if (editingCatId) {
        await adminService.updateAdminCategory(editingCatId, formData);
      } else {
        await adminService.createAdminCategory(formData);
      }
      setShowModal(false);
      await loadCategories();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (cat) => {
    if (window.confirm(`Delete category "${cat.name}"?`)) {
      try {
        await adminService.deleteAdminCategory(cat._id);
        await loadCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Department & Category Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organizing garments and accessories into dedicated shopping departments.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="py-2.5 px-5 rounded-xl gold-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Department</span>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="max-w-md w-full rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                {editingCatId ? 'Edit Department' : 'Create New Department'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Artisanal Footwear"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Target Audience
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Editorial overview of this department..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-amber-500"
                />
                <span>Feature on Homepage Discovery Grid</span>
              </label>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl gold-gradient-btn text-xs font-bold uppercase shadow-md"
                >
                  Save Department
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl glass-panel border border-slate-700 text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="p-6 rounded-3xl glass-card border border-slate-800 space-y-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-4">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=400&q=80'}
                alt={cat.name}
                className="w-16 h-20 rounded-2xl object-cover bg-slate-950 shrink-0 border border-slate-800"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    {cat.gender}
                  </span>
                  {cat.featured && (
                    <span className="text-[9px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                      Featured
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">{cat.name}</h3>
                <p className="text-[11px] text-slate-400 font-mono">slug: {cat.slug}</p>
                <p className="text-xs text-emerald-400 font-semibold">{cat.productCount || 0} Products</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleOpenEdit(cat)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                title="Edit"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(cat)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-rose-400 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminCategoriesPage;
