import React from 'react';
import { Server, Globe, Activity, BookOpen, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../services/api';

export default function Navbar({ health, loading, onPing, onOpenGuide }) {
  const isHealthy = health?.status === 'healthy';
  const isOffline = !health && !loading;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Server className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white">DevOps Lab</h1>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Render + Vercel
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Teaching Full-Stack Deployment: Django (Render) ⇄ React Vite (Vercel)
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Action Buttons */}
        <div className="flex items-center gap-3">
          
          {/* Target Backend Host indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate max-w-[180px]" title={API_BASE_URL}>
              {API_BASE_URL.replace(/^https?:\/\//, '')}
            </span>
          </div>

          {/* Connection Status Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              loading
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : isHealthy
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {loading && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              )}
              {isHealthy && !loading && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  loading
                    ? 'bg-amber-400'
                    : isHealthy
                    ? 'bg-emerald-400'
                    : 'bg-rose-500'
                }`}
              ></span>
            </span>

            <span>
              {loading
                ? 'Pinging...'
                : isHealthy
                ? `Render Connected (${health.latency || 0}ms)`
                : 'Backend Offline'}
            </span>
          </div>

          {/* Ping Refresh Button */}
          <button
            onClick={onPing}
            disabled={loading}
            title="Ping Render backend /api/health/"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* Teacher & Student Deployment Guide Trigger */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-medium shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Deployment Guide</span>
          </button>

        </div>
      </div>
    </header>
  );
}
