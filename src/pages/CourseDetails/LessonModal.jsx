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
      <form 
        onSubmit={handleLessonSubmit} 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl w-full max-w-md space-y-3 text-slate-800 dark:text-slate-100 shadow-2xl transition-colors duration-200"
      >
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {isEditingLesson ? 'Edit Lesson' : 'New Lesson'}
        </h3>
        
        {submitLessonError && (
          <div className="text-red-500 dark:text-red-400 text-xs font-medium">
            {submitLessonError}
          </div>
        )}

        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Title *
          </label>
          <input 
            type="text" 
            name="title"
            placeholder="Lesson Title..." 
            value={lessonForm.title} 
            onChange={handleLessonChange} 
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1" 
            required
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Content / Description
          </label>
          <textarea 
            name="content"
            placeholder="Lesson content..." 
            rows={2} 
            value={lessonForm.content} 
            onChange={handleLessonChange} 
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1 resize-none" 
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              Video URL
            </label>
            <input 
              type="text" 
              name="videoUrl"
              placeholder="https://..." 
              value={lessonForm.videoUrl} 
              onChange={handleLessonChange} 
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1" 
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
              PDF URL
            </label>
            <input 
              type="text" 
              name="pdfUrl"
              placeholder="https://..." 
              value={lessonForm.pdfUrl} 
              onChange={handleLessonChange} 
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1" 
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
            Order
          </label>
          <input 
            type="number" 
            name="order"
            placeholder="0" 
            value={lessonForm.order} 
            onChange={handleLessonChange} 
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 mt-1" 
          />
        </div>

        <div className="flex justify-end gap-2 text-xs pt-2">
          <button 
            type="button" 
            onClick={closeLessonModal} 
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={submittingLesson} 
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg disabled:opacity-50 transition-colors"
          >
            {submittingLesson ? 'Saving...' : 'Save Lesson'}
          </button>
        </div>
      </form>
    </div>
  );
}