import React from 'react';

export default function QuestionItem({ 
  q, 
  index, 
  choices, 
  isDark, 
  onEdit, 
  onDeleteQuestion, 
  onDeleteChoice 
}) {
  return (
    <div className={`p-6 rounded-2xl border transition-all ${
      isDark ? 'bg-[#0B132B] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
              {q.type}
            </span>
            <span className="text-xs text-slate-400">
              {q.points} pt{q.points > 1 ? 's' : ''}
            </span>
          </div>
          <h3 className="font-semibold text-base">
            {index + 1}. {q.statement}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(q)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20"
          >
            Edit
          </button>
          <button
            onClick={() => onDeleteQuestion(q._id)}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
          >
            Delete
          </button>
        </div>
      </div>

      {q.type !== 'ShortAnswer' && (
        <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-2">
          <p className="text-xs text-slate-400 font-medium">Answer options:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {choices.map((c) => (
              <div
                key={c._id}
                className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                  c.isCorrect
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-medium'
                    : isDark
                    ? 'border-slate-800 bg-[#060B19]/50 text-slate-300'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <span>{c.text} {c.isCorrect && '✓ (Correct)'}</span>
                <button
                  onClick={() => onDeleteChoice(c._id)}
                  className="text-slate-500 hover:text-rose-500 ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}