import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function DataTable({ title, buttonText, onButtonClick, columns, data = [], loading }) {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      {(title || buttonText) && (
        <div className="flex justify-between items-center mb-2">
          {title && (
            <h2 className={`text-lg font-bold tracking-wide ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {title}
            </h2>
          )}
          
          {buttonText && (
            <button 
              onClick={onButtonClick}
              className="ml-auto bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              + {buttonText}
            </button>
          )}
        </div>
      )}
      
      
      <div className={`border rounded-2xl p-6 shadow-xl backdrop-blur-sm transition-colors duration-200 ${
        isDark 
          ? 'bg-[#0B132B] border-slate-800 text-white' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {loading ? (
          <div className={`text-center py-8 text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Chargement...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b uppercase tracking-wider font-semibold ${
                  isDark 
                    ? 'border-slate-800 text-slate-400' 
                    : 'border-slate-200 text-slate-500'
                }`}>
                  {columns.map((col, idx) => (
                    <th key={idx} className={`pb-4 px-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark 
                  ? 'divide-slate-800 text-slate-200' 
                  : 'divide-slate-100 text-slate-700'
              }`}>
                {data && data.length > 0 ? (
                  data.map((row, idx) => (
                    <tr 
                      key={row._id || idx} 
                      className={`transition-colors ${
                        isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                    >
                      {columns.map((col, colIdx) => (
                        <td key={colIdx} className={`py-4 px-4 ${col.align === 'right' ? 'text-right' : ''}`}>
                          {col.render ? col.render(row) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className={`text-center py-8 ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      Aucune donnée disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}