import React from 'react';

export default function ModuleLessonsList({
  activeModule,
  setActiveModule,
  activeLesson,
  setActiveLesson,
  lessons,
  isDark,
  isManagement,
  handleOpenCreateLesson,
  handleOpenEditLesson,
  handleDeleteLesson
}) {
  if (!activeModule) return null;

  const activeModuleLessons = lessons.filter(
    l => String(l.module?._id || l.module) === String(activeModule._id || activeModule.id)
  );

  return (
    <div className={`mt-8 p-6 rounded-2xl border transition-all ${
      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-700/40">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {activeModule.titre}
          </h2>
          {activeModule.description && (
            <p className="text-xs text-slate-400 mt-1">{activeModule.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isManagement && (
            <button 
              onClick={(e) => handleOpenCreateLesson(e, activeModule._id || activeModule.id)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg transition"
            >
              + Add Lesson
            </button>
          )}
          <button 
            onClick={() => { setActiveModule(null); setActiveLesson(null); }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {activeModuleLessons.map((lesson) => {
          const isSelectedLesson = activeLesson && String(activeLesson._id || activeLesson.id) === String(lesson._id || lesson.id);

          return (
            <div 
              key={lesson._id || lesson.id} 
              onClick={() => setActiveLesson(lesson)}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                isSelectedLesson 
                  ? (isDark ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/50' : 'bg-blue-50 border-blue-400')
                  : (isDark ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/60' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80')
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {lesson.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono">(Order: {lesson.order ?? 0})</span>
                  </div>
                  <p className={`text-sm mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {lesson.content || <span className="italic text-slate-500">No content description provided.</span>}
                  </p>
                </div>

                {isManagement && (
                  <div className="flex items-center gap-2 text-xs shrink-0">
                    <button 
                      onClick={(e) => handleOpenEditLesson(e, lesson)} 
                      className="px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded font-medium transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={(e) => handleDeleteLesson(e, lesson._id || lesson.id)} 
                      className="px-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-3 text-xs font-medium border-t border-slate-700/30 pt-2">
                {lesson.videoUrl && (
                  <a 
                    href={lesson.videoUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="text-red-400 hover:underline flex items-center gap-1"
                  >
                     Watch Video
                  </a>
                )}
                {lesson.pdfUrl && (
                  <a 
                    href={lesson.pdfUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                     View Document
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {activeModuleLessons.length === 0 && (
          <p className="text-slate-500 italic text-sm py-2">No lessons available in this module.</p>
        )}
      </div>
    </div>
  );
}