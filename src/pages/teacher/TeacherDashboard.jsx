import React from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';

export default function TeacherDashboard() {
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  return (
    <div className="p-6 space-y-6">
      
      <div className="bg-[#0B132B]/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          Teacher Workspace 
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Manage your courses, track student progress, and oversee exams.
        </p>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Courses" 
          value="0" 
        />
        <StatCard 
          title="Total Students" 
          value="0" 
        />
        <StatCard 
          title="Active Quizzes" 
          value="0" 
        />
      </div>
    </div>
  );
}