import React from 'react';

export default function CourseModal({
  showModal,
  isEditing,
  isDark,
  form,
  submitting,
  submitError,
  closeModal,
  handleSubmit,
  handleChange,
}) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
      <div className={`w-full max-w-2xl rounded-3xl p-6 shadow-xl ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">
              {isEditing ? 'Edit course' : 'Add course'}
            </h2>
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {isEditing ? 'Update course details.' : 'Fill in the information for the new course.'}
            </p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-2 block font-medium">Title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                required
              />
            </label>

            <label className="text-sm">
              <span className="mb-2 block font-medium">Duration</span>
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
              />
            </label>
          </div>

          <label className="text-sm">
            <span className="mb-2 block font-medium">Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none resize-none"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-2 block font-medium">Level</span>
              <input
                name="level"
                value={form.level}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
              />
            </label>

            <label className="text-sm">
              <span className="mb-2 block font-medium">Course Image URL</span>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
              />
            </label>
          </div>

          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {submitting 
                ? 'Saving...' 
                : isEditing ? 'Update' : 'Save'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}