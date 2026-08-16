import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProfileModal({ isOpen, onClose }) {
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

 
  const displayName =
    user?.firstName || user?.lastName
      ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
      : user?.name || user?.username || 'Utilisateur';

 
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    if (displayName) {
      return displayName.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all border ${
          isDark
            ? 'bg-[#0B132B] text-white border-slate-800'
            : 'bg-white text-slate-800 border-slate-200'
        }`}
      >
        
        <div className="flex items-center justify-between border-b pb-4 border-slate-700/50">
          <h3 className="text-lg font-bold">User Profile </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-700/30 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
        <div className="mt-6 flex flex-col items-center">
          
          <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg mb-4">
            {getInitials()}
          </div>

          <h2 className="text-xl font-bold">{displayName}</h2>
          <span className="mt-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30 capitalize">
            {user?.role || 'User'}
          </span>

          
          <div className="w-full mt-6 space-y-3 text-sm">
            <div className={`p-3 rounded-xl flex justify-between items-center ${isDark ? 'bg-[#1C2541]/50' : 'bg-slate-100'}`}>
              <span className="text-slate-400 font-medium">Full name:</span>
              <span className="font-semibold">{displayName}</span>
            </div>

            <div className={`p-3 rounded-xl flex justify-between items-center ${isDark ? 'bg-[#1C2541]/50' : 'bg-slate-100'}`}>
              <span className="text-slate-400 font-medium">Email:</span>
              <span className="font-semibold">{user?.email || 'N/A'}</span>
            </div>

            <div className={`p-3 rounded-xl flex justify-between items-center ${isDark ? 'bg-[#1C2541]/50' : 'bg-slate-100'}`}>
              <span className="text-slate-400 font-medium">Rôle:</span>
              <span className="font-semibold capitalize">{user?.role || 'User'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}