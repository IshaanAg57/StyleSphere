import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Save,
  Search,
  Sparkles
} from 'lucide-react';

export const AdminInventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stockInputs, setStockInputs] = useState({});
  const [updatingId, setUpdatingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminInventory();
      setInventory(data.inventory || []);
      const inputs = {};
      (data.inventory || []).forEach((item) => {
        inputs[item._id] = item.stock;
      });
      setStockInputs(inputs);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleStockChange = (id, val) => {
    setStockInputs((prev) => ({
      ...prev,
      [id]: Math.max(0, parseInt(val, 10) || 0)
    }));
  };

  const handleSaveStock = async (id) => {
    const newStock = stockInputs[id];
    try {
      setUpdatingId(id);
      await adminService.updateProductStock(id, newStock);
      setSuccessId(id);
      setTimeout(() => setSuccessId(null), 2000);
      await loadInventory();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.brand.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = inventory.length;
  const lowStockCount = inventory.filter((i) => i.stockStatus === 'Low Stock').length;
  const outOfStockCount = inventory.filter((i) => i.stockStatus === 'Out of Stock').length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time atelier inventory monitoring with instant stock adjustments.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl glass-card border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Total Unique Garments</span>
          <p className="text-2xl font-bold text-white font-serif">{totalItems} SKUs</p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-amber-500/30 bg-amber-500/5 space-y-2">
          <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Low Stock Alert (≤ 5 units)</span>
          </span>
          <p className="text-2xl font-bold text-amber-300 font-serif">{lowStockCount} Garments</p>
        </div>

        <div className="p-6 rounded-3xl glass-card border border-rose-500/30 bg-rose-500/5 space-y-2">
          <span className="text-xs font-bold uppercase text-rose-400 flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            <span>Out of Stock</span>
          </span>
          <p className="text-2xl font-bold text-rose-300 font-serif">{outOfStockCount} Garments</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800">
        <div className="max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search inventory by garment name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-4">Garment</th>
                <th className="p-4">Department</th>
                <th className="p-4">Price</th>
                <th className="p-4">Status</th>
                <th className="p-4">Live Stock</th>
                <th className="p-4 text-right">Quick Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Loading inventory records...
                  </td>
                </tr>
              ) : filteredInventory.length > 0 ? (
                filteredInventory.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-10 h-12 rounded-xl object-cover bg-slate-950 shrink-0 border border-slate-800"
                        />
                        <div>
                          <p className="font-semibold text-white">{item.name}</p>
                          <p className="text-[10px] text-amber-400 font-bold uppercase">{item.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4 font-bold text-white">₹{item.price?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        item.stockStatus === 'Out of Stock'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.stockStatus === 'Low Stock'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.stockStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <input
                        type="number"
                        min="0"
                        value={stockInputs[item._id] ?? item.stock}
                        onChange={(e) => handleStockChange(item._id, e.target.value)}
                        className="w-20 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono text-center focus:border-amber-400 focus:outline-none"
                      />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleSaveStock(item._id)}
                        disabled={updatingId === item._id}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all inline-flex items-center gap-1.5 ${
                          successId === item._id
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'gold-gradient-btn shadow-md'
                        }`}
                      >
                        {successId === item._id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Saved</span>
                          </>
                        ) : updatingId === item._id ? (
                          'Saving...'
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No matching items in inventory.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminInventoryPage;
