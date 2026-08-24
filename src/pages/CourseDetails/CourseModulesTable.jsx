import React from 'react';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';

export default function CourseModulesTable({
  modules,
  lessons,
  loading,
  page,
  pages,
  setPage,
  isManagement,
  handleSelectRow,
  handleOpenCreateLesson,
  handleOpenEditModule,
  handleDeleteModule
}) {
  const columns = [
    {
      header: 'MODULE TITLE',
      render: (module) => (
        <div>
          <span className="font-bold text-blue-400 block text-sm">
            {module.titre}
          </span>
          {module.description && (
            <p className="text-xs text-slate-400 italic max-w-sm truncate mt-0.5">
              {module.description}
            </p>
          )}
        </div>
      )
    },
    {
      header: 'LESSONS COUNT',
      render: (module) => {
        const count = lessons.filter(l => String(l.module?._id || l.module) === String(module._id || module.id)).length;
        return (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {count} {count === 1 ? 'Lesson' : 'Lessons'}
          </span>
        );
      }
    },
    {
      header: 'ORDER',
      render: (module) => (
        <span className="text-xs text-slate-400 font-mono">
          {module.order ?? 0}
        </span>
      )
    },
    {
      header: 'MODULE ACTIONS',
      align: 'right',
      render: (module) => (
        <div className="flex items-center justify-end gap-3 text-xs">
          {isManagement ? (
            <>
              <button 
                onClick={(e) => handleOpenCreateLesson(e, module._id || module.id)}
                className="text-emerald-400 hover:underline font-medium"
              >
                + Add Lesson
              </button>
              <span className="text-slate-700">|</span>
              <button 
                onClick={(e) => handleOpenEditModule(e, module)}
                className="text-blue-400 hover:underline font-medium"
              >
                Edit
              </button>
              <button 
                onClick={(e) => handleDeleteModule(e, module._id || module.id)} 
                className="text-red-400 hover:underline font-medium"
              >
                Delete
              </button>
            </>
          ) : '-'}
        </div>
      )
    }
  ];

  return (
    <>
      <DataTable 
        columns={columns}
        data={modules}
        loading={loading}
        onRowClick={(row) => handleSelectRow(row)}
      />

      {!loading && modules.length > 0 && (
        <div className="pt-4 flex justify-center">
          <Pagination page={page} pages={pages} onPageChange={(newPage) => setPage(newPage)} />
        </div>
      )}
    </>
  );
}