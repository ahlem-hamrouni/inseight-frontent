import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileModal from './ProfileModal';

export default function Sidebar({ menus, title }) {
  const { user, logout, theme, toggleTheme } = useAuth();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isDark = theme === 'dark';

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return (user.firstName[0] + user.lastName[0]).toUpperCase();
    }
    return 'US';
  };

  return (
    <>
      <aside className={`w-full p-6 flex flex-col justify-between lg:min-h-screen lg:w-72 border-r transition-all duration-300 ${
        isDark ? 'bg-[#0B132B] text-slate-300 border-slate-800' : 'bg-white text-slate-700 border-slate-200 shadow-sm'
      }`}>
        <div>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className={`font-bold text-lg leading-tight tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                EduInsight
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">
                Complete Learning Platform
              </p>
            </div>
          </div>

          <div className="mb-6 px-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
              {title || 'Dashboard'}
            </p>
            <h2 className={`text-xl font-semibold mt-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>
               Management Workspace
            </h2>
          </div>

         
          <nav className="space-y-1.5">
            {menus?.map((item) => (
              <NavLink
                key={item.link}
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : isDark 
                        ? 'text-slate-400 hover:bg-[#1C2541] hover:text-white' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        
        <div className={`pt-6 mt-6 border-t space-y-4 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          
          <div 
            onClick={() => setIsProfileOpen(true)}
            className={`flex items-center gap-3 px-2 py-2 rounded-xl cursor-pointer transition-all ${
              isDark ? 'hover:bg-slate-800/80' : 'hover:bg-slate-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
              isDark ? 'bg-slate-800 text-white border border-slate-700' : 'bg-slate-200 text-slate-800'
            }`}>
            {getInitials()}          
            </div>
            <div className="text-xs overflow-hidden flex-1">
              <p className={`font-semibold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.name || 'Utilisateur'}
              </p>
              <p className="text-slate-400 capitalize truncate">
                {user?.role || title || 'User'}
              </p>
            </div>
          </div>

        
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full ${
              isDark 
                ? 'bg-slate-800/60 text-amber-300 hover:bg-slate-800' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>

          
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}