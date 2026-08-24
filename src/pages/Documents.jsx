import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, FolderPlus, Download, HardDrive } from 'lucide-react';

export default function Documents() {
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
     
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <FileText className="text-blue-600" /> Documents
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            File management coming soon.
          </p>
        </div>

        
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-2xl transition-all shadow-sm">
            <FolderPlus size={18} />
            New Document
          </button>
        )}
      </div>

      
      <div className={`w-full rounded-3xl p-8 border shadow-sm transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
      }`}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <HardDrive size={32} />
          </div>
          <h2 className="text-xl font-bold mb-2">Documents Space</h2>
          <p className="text-slate-400 max-w-md text-sm mb-6">
            This section allows sharing files and courses between teachers and students.
          </p>
          
        </div>
      </div>
    </div>
  );
}