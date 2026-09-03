import React, { useEffect, useState } from 'react';
import * as adminService from '../../services/adminService';
import { Users, Search, Mail, Calendar, DollarSign, Package } from 'lucide-react';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (search) params.q = search;

      const data = await adminService.getAdminCustomers(params);
      setCustomers(data.customers || []);
      setTotalCustomers(data.totalCustomers || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadCustomers();
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight">
            VIP Clientele Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Managing {totalCustomers} registered patrons and luxury account holders.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </form>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl glass-card border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Email</th>
                <th className="p-4">Patron Since</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4 text-right">Lifetime Spend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading clientele...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={cust.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={cust.name}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                        />
                        <div>
                          <p className="font-semibold text-white">{cust.name}</p>
                          <span className="text-[9px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            VIP Patron
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{cust.email}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(cust.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 font-semibold text-white">
                      {cust.orderCount || 0} Orders
                    </td>
                    <td className="p-4 text-right font-bold text-amber-400 font-serif text-sm">
                      ₹{cust.totalSpent?.toLocaleString('en-IN') || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No customers found.
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

export default AdminCustomersPage;
