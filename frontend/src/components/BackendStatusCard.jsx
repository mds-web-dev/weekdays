import React from 'react';
import { Database, ShieldCheck, Zap, Server, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export default function BackendStatusCard({ health, loading, error }) {
  const isHealthy = health?.status === 'healthy';

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Live System Telemetry
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300">
              GET /api/health/
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Django Web Service on Render
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Active Endpoint: <span className="font-mono text-slate-300">{API_BASE_URL}</span>
          </p>
        </div>

        {/* Cold-start reminder badge */}
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 max-w-md">
          <Clock className="h-4 w-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Render Free Tier Tip:</strong> Services sleep after 15 min of inactivity. First request takes ~30–50s to wake up!
          </span>
        </div>
      </div>

      {/* Grid of status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Service State */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Service Status</span>
            <Server className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-lg font-bold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
              {loading ? 'Connecting...' : isHealthy ? 'Healthy & Online' : 'Unreachable'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono truncate">
            {health?.service || 'Django REST Service'}
          </p>
        </div>

        {/* Database */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Database Backend</span>
            <Database className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white uppercase font-mono">
              {health?.database?.engine || 'SQLite / Postgres'}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded ${health?.database?.status === 'ok' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              {health?.database?.status === 'ok' ? 'Active' : 'Pending'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {health?.database?.engine === 'postgresql' ? 'Render Managed Postgres' : 'Local / Ephemeral SQLite'}
          </p>
        </div>

        {/* Environment Mode */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Django Environment</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-white capitalize">
              {health?.environment || 'development'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            DEBUG: {health?.debug_mode ? (
              <span className="text-amber-400 font-semibold">True (Dev Mode)</span>
            ) : (
              <span className="text-emerald-400 font-semibold">False (Secure Prod)</span>
            )}
          </p>
        </div>

        {/* Latency / Roundtrip */}
        <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">API Response Time</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold font-mono text-white">
              {health?.latency != null ? `${health.latency} ms` : '--'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            WhiteNoise Static Serving Active
          </p>
        </div>

      </div>

      {/* Error alert banner if offline */}
      {error && !loading && (
        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-rose-200">Backend Connection Error</p>
            <p className="text-xs text-rose-300 leading-relaxed">{error}</p>
            <div className="text-xs text-rose-200/80 mt-2 font-mono bg-rose-950/40 p-2 rounded">
              Checklist: 1. Is backend running? 2. Is VITE_API_URL set correctly? 3. Are CORS headers allowed?
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
