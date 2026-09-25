import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BackendStatusCard from './components/BackendStatusCard';
import DevOpsTracker from './components/DevOpsTracker';
import DeploymentGuideModal from './components/DeploymentGuideModal';
import { api, API_BASE_URL } from './services/api';
import { 
  Server, 
  Globe, 
  ExternalLink, 
  CheckCircle, 
  ArrowRight, 
  Code2, 
  ShieldCheck, 
  Terminal,
  BookOpen
} from 'lucide-react';

export default function App() {
  const [health, setHealth] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [healthError, setHealthError] = useState(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Fetch backend telemetry
  const fetchHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const res = await api.getHealth();
      setHealth({ ...res.data, latency: res.latency });
    } catch (err) {
      setHealth(null);
      setHealthError(err.message || 'Unable to reach backend service');
    } finally {
      setHealthLoading(false);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    setTasksLoading(true);
    try {
      const res = await api.getTasks();
      setTasks(res.data || []);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchTasks();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        health={health}
        loading={healthLoading}
        onPing={fetchHealth}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
              Classroom DevOps Masterclass
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Deploy Django REST on <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">Render</span> &amp; React on <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Vercel</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              This interactive full-stack app is designed to teach students how to decouple frontends and backends, configure production environment variables, solve CORS issues, and deploy to modern cloud platforms.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <BookOpen className="h-4 w-4" />
                <span>Open Deployment Tutorial</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>

              <a
                href={`${API_BASE_URL}/admin/`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all"
              >
                <Server className="h-4 w-4 text-purple-400" />
                <span>Django Admin</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              <a
                href={`${API_BASE_URL}/api/health/`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all font-mono"
              >
                <span>/api/health/</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Live Backend Telemetry & Health Status */}
        <section aria-labelledby="telemetry-heading">
          <BackendStatusCard
            health={health}
            loading={healthLoading}
            error={healthError}
          />
        </section>

        {/* Interactive DevOps Checklist and CRUD Playground */}
        <section aria-labelledby="tracker-heading">
          <DevOpsTracker
            tasks={tasks}
            onRefresh={fetchTasks}
            loading={tasksLoading}
          />
        </section>

        {/* Educational Architecture Flashcards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Render Configuration */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Server className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Render Web Service</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Build script runs <code className="text-purple-300">./build.sh</code> which executes pip install, static collection, and automated database migrations.
            </p>
            <div className="text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
              gunicorn core.wsgi:application
            </div>
          </div>

          {/* Card 2: Vercel Configuration */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Vercel Edge Hosting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              React Vite generates static assets in <code className="text-emerald-300">dist/</code>. Vercel serves them instantly over global edge CDN nodes.
            </p>
            <div className="text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
              VITE_API_URL=https://...
            </div>
          </div>

          {/* Card 3: CORS & Routing */}
          <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. CORS &amp; SPA Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Django permits cross-origin API calls with <code className="text-amber-300">django-cors-headers</code>. Vercel uses <code className="text-amber-300">vercel.json</code> to prevent 404s.
            </p>
            <div className="text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
              rewrites: [/(.*) -&gt; index.html]
            </div>
          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>DevOps Education Project</span>
            <span>•</span>
            <span>Django 5.2 + React 19 + Vite 8 + Tailwind CSS</span>
          </div>
          <div>
            Built for teaching backend deployment on Render &amp; frontend on Vercel
          </div>
        </div>
      </footer>

      {/* Interactive Deployment Modal */}
      <DeploymentGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

    </div>
  );
}
