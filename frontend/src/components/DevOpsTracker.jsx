import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Filter, 
  Layers, 
  ArrowUpRight,
  Loader2 
} from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
  { id: 'all', label: 'All Tasks', color: 'bg-slate-800 text-slate-200' },
  { id: 'local', label: 'Local Dev', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  { id: 'render', label: 'Render Backend', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  { id: 'vercel', label: 'Vercel Frontend', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  { id: 'devops', label: 'DevOps & CORS', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
];

export default function DevOpsTracker({ tasks, onRefresh, loading }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('render');
  const [actionLoading, setActionLoading] = useState(null); // id of item being toggled/deleted

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(t => t.category === selectedCategory);

  const completedCount = tasks.filter(t => t.is_completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleToggle = async (task) => {
    setActionLoading(task.id);
    try {
      await api.updateTask(task.id, { is_completed: !task.is_completed });
      await onRefresh();
    } catch (err) {
      alert('Failed to update task: ' + (err.message || 'Network error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(id);
    try {
      await api.deleteTask(id);
      await onRefresh();
    } catch (err) {
      alert('Failed to delete task: ' + (err.message || 'Network error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setActionLoading('creating');
    try {
      await api.createTask({
        title: newTitle.trim(),
        description: newDesc.trim(),
        category: newCategory,
        is_completed: false,
      });
      setNewTitle('');
      setNewDesc('');
      setIsAdding(false);
      await onRefresh();
    } catch (err) {
      alert('Failed to create task: ' + (err.message || 'Network error'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeed = async () => {
    setActionLoading('seeding');
    try {
      await api.seedTasks();
      await onRefresh();
    } catch (err) {
      alert('Failed to seed tasks: ' + (err.message || 'Network error'));
    } finally {
      setActionLoading(null);
    }
  };

  const getCategoryBadge = (cat) => {
    const found = CATEGORIES.find(c => c.id === cat);
    return found ? found.color : 'bg-slate-800 text-slate-300';
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
      
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            Classroom Deployment Checklist & CRUD Test
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            Interact with the Django database in real-time. Check off steps as you deploy to Render & Vercel.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tasks.length === 0 && (
            <button
              onClick={handleSeed}
              disabled={actionLoading === 'seeding'}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Restore Classroom Tasks</span>
            </button>
          )}

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{isAdding ? 'Cancel' : 'Add Custom Step'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="py-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium">Deployment Readiness</span>
          <span className="text-indigo-400 font-semibold font-mono">
            {completedCount} / {tasks.length} Completed ({progressPercent}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === category.id
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Add Task Form (Conditional) */}
      {isAdding && (
        <form onSubmit={handleCreate} className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Create New Deployment Item</h4>
            <span className="text-[11px] text-slate-400">Calls POST /api/tasks/</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="e.g. Set up custom domain on Vercel"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="sm:col-span-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="local">Local Dev</option>
              <option value="render">Render Backend</option>
              <option value="vercel">Vercel Frontend</option>
              <option value="devops">DevOps & CORS</option>
              <option value="general">General</option>
            </select>
          </div>

          <textarea
            placeholder="Detailed description or notes for students..."
            rows={2}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading === 'creating'}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium cursor-pointer disabled:opacity-50"
            >
              {actionLoading === 'creating' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              <span>Save to Backend</span>
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="mt-4 space-y-2.5">
        {loading && tasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            <span>Connecting to Django API...</span>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="py-10 text-center rounded-xl bg-slate-950/40 border border-dashed border-slate-800 p-6">
            <p className="text-slate-400 text-sm">No deployment steps found in this category.</p>
            <button
              onClick={handleSeed}
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
            >
              Restore default classroom checklist
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isItemLoading = actionLoading === task.id;
            return (
              <div
                key={task.id}
                className={`group flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all ${
                  task.is_completed
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-75'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Left: Checkbox & Content */}
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => handleToggle(task)}
                    disabled={isItemLoading}
                    className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer shrink-0"
                    title={task.is_completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {isItemLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                    ) : task.is_completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-600 hover:text-indigo-400" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-medium ${
                          task.is_completed ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md border ${getCategoryBadge(
                          task.category
                        )}`}
                      >
                        {task.category}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleDelete(task.id)}
                    disabled={isItemLoading}
                    title="Delete item (DELETE /api/tasks/{id}/)"
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
