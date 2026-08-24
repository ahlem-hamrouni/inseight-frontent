import React from 'react';

export default function LessonModal({
  show,
  isEditingLesson,
  lessonForm,
  submitLessonError,
  submittingLesson,
  handleLessonChange,
  handleLessonSubmit,
  closeLessonModal
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <form onSubmit={handleLessonSubmit} className="bg-[#0b132b] border border-slate-800 p-5 rounded-2xl w-full max-w-md space-y-3 text-white">
        <h3 className="text-sm font-bold">{isEditingLesson ? 'Edit Lesson' : 'New Lesson'}</h3>
        {submitLessonError && <div className="text-red-400 text-xs">{submitLessonError}</div>}
        <div>
          <label className="text-[11px] text-slate-400">Title *</label>
          <input 
            type="text" 
            name="title"
            placeholder="Lesson Title..." 
            value={lessonForm.title} 
            onChange={handleLessonChange} 
            className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1" 
            required
          />
        </div>
        <div>
          <label className="text-[11px] text-slate-400">Content / Description</label>
          <textarea 
            name="content"
            placeholder="Lesson content..." 
            rows={2} 
            value={lessonForm.content} 
            onChange={handleLessonChange} 
            className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1 resize-none" 
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] text-slate-400">Video URL</label>
            <input 
              type="text" 
              name="videoUrl"
              placeholder="https://..." 
              value={lessonForm.videoUrl} 
              onChange={handleLessonChange} 
              className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1" 
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-400">PDF URL</label>
            <input 
              type="text" 
              name="pdfUrl"
              placeholder="https://..." 
              value={lessonForm.pdfUrl} 
              onChange={handleLessonChange} 
              className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1" 
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] text-slate-400">Order</label>
          <input 
            type="number" 
            name="order"
            placeholder="0" 
            value={lessonForm.order} 
            onChange={handleLessonChange} 
            className="w-full px-3 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-xs focus:outline-none mt-1" 
          />
        </div>
        <div className="flex justify-end gap-2 text-xs pt-2">
          <button type="button" onClick={closeLessonModal} className="px-3 py-1.5 bg-slate-800 rounded-lg">Cancel</button>
          <button type="submit" disabled={submittingLesson} className="px-3 py-1.5 bg-emerald-600 rounded-lg">
            {submittingLesson ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}