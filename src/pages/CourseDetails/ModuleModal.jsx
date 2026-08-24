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
      <form onSubmit={handleModuleSubmit} className="bg-[#0b132b] border border-slate-800 p-5 rounded-2xl w-full max-w-md space-y-3 text-white">
        <h3 className="text-sm font-bold">{isEditingModule ? 'Edit Module' : 'New Module'}</h3>
        {submitModuleError && <div className="text-red-400 text-xs">{submitModuleError}</div>}
        <div>
          <label className="text-[11px] text-slate-400">Titre *</label>
          <input 
            type="text" 
            name="titre"
            placeholder="Module Titre..." 
            value={moduleForm.titre} 
            onChange={handleModuleChange} 
            className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1" 
            required
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-400">Description</label>
          <textarea 
            name="description"
            placeholder="Module Description..." 
            rows={2}
            value={moduleForm.description} 
            onChange={handleModuleChange} 
            className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1 resize-none" 
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-400">Order</label>
          <input 
            type="number" 
            name="order"
            placeholder="0" 
            value={moduleForm.order} 
            onChange={handleModuleChange} 
            className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1" 
          />
        </div>
        <div className="flex justify-end gap-2 text-xs pt-2">
          <button type="button" onClick={closeModuleModal} className="px-3 py-1.5 bg-slate-800 rounded-lg">Cancel</button>
          <button type="submit" disabled={submittingModule} className="px-3 py-1.5 bg-emerald-600 rounded-lg">
            {submittingModule ? 'Saving...' : 'Save Module'}
          </button>
        </div>
      </form>
    </div>
  );
}