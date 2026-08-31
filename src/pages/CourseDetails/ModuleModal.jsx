import React from 'react';

export default function ModuleModal({
  show,
  isEditingModule,
  moduleForm,
  submitModuleError,
  submittingModule,
  handleModuleChange,
  handleModuleSubmit,
  closeModuleModal
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form 
        onSubmit={handleModuleSubmit} 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl w-full max-w-md space-y-3 text-slate-800 dark:text-slate-100 shadow-2xl transition-colors duration-200"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {isEditingModule ? 'Edit Module' : 'New Module'}
        </h3>
        
        {submitModuleError && (
          <div className="text-red-500 dark:text-red-400 text-xs font-medium">
            {submitModuleError}
          </div>
        )}

        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Titre *
          </label>
          <input 
            type="text" 
            name="titre"
            placeholder="Module Titre..." 
            value={moduleForm.titre} 
            onChange={handleModuleChange} 
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1" 
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Description
          </label>
          <textarea 
            name="description"
            placeholder="Module Description..." 
            rows={2}
            value={moduleForm.description} 
            onChange={handleModuleChange} 
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1 resize-none" 
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Order
          </label>
          <input 
            type="number" 
            name="order"
            placeholder="0" 
            value={moduleForm.order} 
            onChange={handleModuleChange} 
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1" 
          />
        </div>

        <div className="flex justify-end gap-2 text-xs pt-2">
          <button 
            type="button" 
            onClick={closeModuleModal} 
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submittingModule} 
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            {submittingModule ? 'Saving...' : 'Save Module'}
          </button>
        </div>
      </form>
    </div>
  );
}