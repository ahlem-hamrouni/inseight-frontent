import React from 'react';

export default function Pagination({ page, pages, onPageChange }) {
  const totalPages = pages && pages > 0 ? pages : 1;

  return (
    <div className="flex justify-end items-center gap-4 mt-4 px-2">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-medium rounded transition disabled:cursor-not-allowed"
      >
        Previous 
      </button>

      <span className="text-xs font-medium text-slate-300">
        Page {page} / {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white text-xs font-medium rounded transition disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}