import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Layers, 
  Cloud, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Server
} from 'lucide-react';

export default function DeploymentGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('architecture');
  const [copiedCode, setCopiedCode] = useState(null);

  if (!isOpen) return null;

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Cloud className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Full-Stack Deployment Masterclass</h3>
              <p className="text-xs text-slate-400">Classroom Guide: Render (Backend) + Vercel (Frontend)</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/30 overflow-x-auto scrollbar-none">
          {[
            { id: 'architecture', label: '1. Architecture & Flow' },
            { id: 'render', label: '2. Render Setup (Django)' },
            { id: 'vercel', label: '3. Vercel Setup (React)' },
            { id: 'pitfalls', label: '4. Pitfalls & CORS Fixes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-300 text-sm">
          
          {/* TAB 1: ARCHITECTURE & FLOW */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Decoupled Web Architecture</h4>
                <p className="text-xs text-slate-400">
                  Students often wonder: Why host frontend and backend separately? Because modern production systems decouple UI delivery (Edge CDN) from business logic (compute microservices).
                </p>
              </div>

              {/* Architecture Diagram Box */}
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs overflow-x-auto leading-relaxed text-indigo-300">
                <div className="min-w-[620px]">
                  <div className="text-emerald-400 font-bold mb-2">🌐 CLIENT BROWSER</div>
                  <div>       │</div>
                  <div>       ▼ (Loads HTML/JS Bundle from CDN)</div>
                  <div className="text-emerald-400 font-bold">▲▲▲ VERCEL EDGE NETWORK (Frontend)</div>
                  <div>       │  • Static React Vite Build (dist/)</div>
                  <div>       │  • SPA Routing via vercel.json rewrites</div>
                  <div>       │  • import.meta.env.VITE_API_URL</div>
                  <div>       │</div>
                  <div>       ▼ HTTPS REST API Requests (CORS Header Checked)</div>
                  <div className="text-indigo-400 font-bold">▼▼▼ RENDER WEB SERVICE (Backend)</div>
                  <div>       │  • Gunicorn WSGI Server (core.wsgi:application)</div>
                  <div>       │  • Django REST Framework (/api/health/, /api/tasks/)</div>
                  <div>       │  • WhiteNoise serving Django static files</div>
                  <div>       │</div>
                  <div>       ▼ Database Connection</div>
                  <div className="text-amber-400 font-bold">🗄️ DATABASE (PostgreSQL on Render or SQLite)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h5 className="font-semibold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-emerald-400" />
                    Frontend on Vercel
                  </h5>
                  <p className="text-xs text-slate-400">
                    Extremely fast global CDN, automatic SSL certificates, zero server management, and instant continuous deployments on Git push.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <h5 className="font-semibold text-white text-xs mb-1 flex items-center gap-1.5">
                    <Server className="h-4 w-4 text-indigo-400" />
                    Backend on Render
                  </h5>
                  <p className="text-xs text-slate-400">
                    Runs persistent Python containers, manages Gunicorn processes, runs automated database migrations on build, and supports managed PostgreSQL.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RENDER BACKEND STEP-BY-STEP */}
          {activeTab === 'render' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Step-by-Step: Deploy Django on Render</h4>
                <p className="text-xs text-slate-400">
                  Follow these exact settings when creating your Web Service in the Render Dashboard (render.com).
                </p>
              </div>

              {/* Step list */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold items-center justify-center">1</span>
                    <h5 className="font-semibold text-white text-sm">Create New Web Service</h5>
                  </div>
                  <p className="text-xs text-slate-400 pl-7">
                    Go to <strong>dashboard.render.com</strong> → Click <strong>New +</strong> → Select <strong>Web Service</strong> → Connect your GitHub repository.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold items-center justify-center">2</span>
                    <h5 className="font-semibold text-white text-sm">Fill in Configuration Settings</h5>
                  </div>
                  
                  <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Root Directory</span>
                      <code className="text-indigo-300 font-bold">backend</code>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Runtime</span>
                      <code className="text-indigo-300 font-bold">Python 3</code>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Build Command</span>
                      <code className="text-emerald-400 font-bold">./build.sh</code>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Start Command</span>
                      <code className="text-emerald-400 font-bold">gunicorn core.wsgi:application</code>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold items-center justify-center">3</span>
                    <h5 className="font-semibold text-white text-sm">Add Environment Variables on Render</h5>
                  </div>
                  <div className="pl-7 space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>DEBUG</span>
                        <span className="text-amber-400">False</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>SECRET_KEY</span>
                        <span className="text-amber-400">generate-a-strong-random-key</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>ALLOWED_HOSTS</span>
                        <span className="text-amber-400">.onrender.com</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>CORS_ALLOWED_ORIGINS</span>
                        <span className="text-amber-400">https://your-frontend.vercel.app</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      * Note: Our Django settings also allow all <code className="text-slate-400">https://*.vercel.app</code> domains automatically via regex!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VERCEL FRONTEND STEP-BY-STEP */}
          {activeTab === 'vercel' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Step-by-Step: Deploy React Vite on Vercel</h4>
                <p className="text-xs text-slate-400">
                  Follow these exact settings when deploying your frontend in Vercel (vercel.com).
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold items-center justify-center">1</span>
                    <h5 className="font-semibold text-white text-sm">Import Repository on Vercel</h5>
                  </div>
                  <p className="text-xs text-slate-400 pl-7">
                    Go to <strong>vercel.com</strong> → Click <strong>Add New...</strong> → <strong>Project</strong> → Import your GitHub repository.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold items-center justify-center">2</span>
                    <h5 className="font-semibold text-white text-sm">Configure Project Settings</h5>
                  </div>
                  
                  <div className="pl-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Root Directory</span>
                      <code className="text-emerald-400 font-bold">frontend</code>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Framework Preset</span>
                      <code className="text-emerald-400 font-bold">Vite</code>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Build Command</span>
                      <code className="text-slate-300 font-bold">vite build (default)</code>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Output Directory</span>
                      <code className="text-slate-300 font-bold">dist (default)</code>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold items-center justify-center">3</span>
                    <h5 className="font-semibold text-white text-sm">Set Environment Variables on Vercel</h5>
                  </div>
                  
                  <div className="pl-7 space-y-2 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono">
                      <div className="text-slate-500 mb-1">Variable Name:</div>
                      <div className="text-emerald-400 font-bold">VITE_API_URL</div>
                      <div className="text-slate-500 mt-2 mb-1">Value (Your Render backend URL without trailing slash):</div>
                      <div className="text-amber-400 font-bold">https://devops-django-backend.onrender.com</div>
                    </div>
                    <p className="text-[11px] text-amber-300/80 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                      ⚠️ <strong>Rule for Vite:</strong> All client-side env variables in Vite MUST be prefixed with <code>VITE_</code>. Normal <code>API_URL</code> will be ignored by Vite!
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold items-center justify-center">4</span>
                    <h5 className="font-semibold text-white text-sm">SPA Routing with vercel.json</h5>
                  </div>
                  <p className="text-xs text-slate-400 pl-7">
                    We included <code className="text-slate-300">frontend/vercel.json</code> which redirects all routes to <code className="text-slate-300">index.html</code> so students never hit 404 on refresh!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PITFALLS & CORS */}
          {activeTab === 'pitfalls' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-base font-bold text-white mb-1">The 4 Classic Student Pitfalls & Fixes</h4>
                <p className="text-xs text-slate-400">
                  These 4 issues cause 95% of student deployment headaches. Here is how we solved each one:
                </p>
              </div>

              {/* Pitfall 1: CORS */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                    Pitfall 1: CORS Error in Browser Console
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded">Common</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Symptom:</strong> <code className="text-rose-300">Access to fetch at ... from origin ... has been blocked by CORS policy</code>.
                </p>
                <p className="text-xs text-slate-400">
                  <strong>Solution:</strong> In Django, install <code className="text-slate-300">django-cors-headers</code>, place <code className="text-slate-300">corsheaders.middleware.CorsMiddleware</code> before <code className="text-slate-300">CommonMiddleware</code>, and add your Vercel URL to <code className="text-slate-300">CORS_ALLOWED_ORIGINS</code>.
                </p>
              </div>

              {/* Pitfall 2: Render Free Tier Sleep */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    Pitfall 2: Render Service Spinning / Timeout
                  </span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">Free Tier</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Symptom:</strong> The first request takes 30-50 seconds or browser shows timeout error.
                </p>
                <p className="text-xs text-slate-400">
                  <strong>Explanation:</strong> Free web services on Render spin down after 15 minutes of inactivity to conserve resources. When a new request arrives, Render boots the container. Once awake, response latency drops to &lt;100ms.
                </p>
              </div>

              {/* Pitfall 3: Trailing Slash in Django */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                    Pitfall 3: Django 301 Redirect / Trailing Slashes
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">API Bug</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Symptom:</strong> POST requests fail with 301 Moved Permanently or method not allowed.
                </p>
                <p className="text-xs text-slate-400">
                  <strong>Solution:</strong> Django expects trailing slashes on URLs by default (<code className="text-slate-300">/api/tasks/</code> instead of <code className="text-slate-300">/api/tasks</code>). Always append <code className="text-slate-300">/</code> in API endpoints!
                </p>
              </div>

              {/* Pitfall 4: Static Files 500 error */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                    Pitfall 4: Django Admin CSS Missing or 500 Error
                  </span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">WhiteNoise</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Symptom:</strong> Django Admin looks like raw unstyled HTML or deployment fails during build.
                </p>
                <p className="text-xs text-slate-400">
                  <strong>Solution:</strong> Gunicorn does not serve static files by default. We configure WhiteNoise in <code className="text-slate-300">settings.py</code> and run <code className="text-slate-300">python manage.py collectstatic --no-input</code> inside <code className="text-slate-300">build.sh</code>.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Also available in <code className="text-slate-400">README.md</code> in project root.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-all"
          >
            Got It, Back to App
          </button>
        </div>

      </div>
    </div>
  );
}
