import React from 'react';

export default function CourseDetailsHeader({ 
  isDark, 
  search, 
  setSearch, 
  setPage, 
  isManagement, 
  onOpenCreateModule, 
  onNavigateBack 
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Course Content</h1>
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-64">
          <input 
            type="text" 
            placeholder="Search module..." 
            value={search} 
            onChange={(e) => { setSearch(e.target.value); setPage(1); }} 
            className={`w-full px-4 py-2 text-sm rounded-xl border focus:outline-none transition-all ${
              isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
            }`} 
          />
        </div>
        {isManagement && (
          <button 
            onClick={onOpenCreateModule} 
            className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm"
          >
            New Module
          </button>
        )}
        <button 
          onClick={onNavigateBack} 
          className="shrink-0 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl border border-slate-700 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}