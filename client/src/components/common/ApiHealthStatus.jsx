import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export const ApiHealthStatus = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/health');
      setHealth(response.data.data);
    } catch (err) {
      setError(err.message || 'Unable to connect to StyleSphere API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel border border-slate-700/60 shadow-lg text-xs tracking-wide">
      {loading ? (
        <span className="flex items-center gap-2 text-amber-400">
          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          <span>Connecting to StyleSphere API...</span>
        </span>
      ) : error ? (
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>API Disconnected: {error}</span>
          <button
            onClick={fetchHealth}
            className="ml-2 underline hover:text-rose-300 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-emerald-400">API Live</span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 font-mono">
            {health?.service} ({health?.environment})
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400/90 font-medium">DB: {health?.database?.status}</span>
        </div>
      )}
    </div>
  );
};

export default ApiHealthStatus;
