import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecommendationBell from './recommendations/RecommendationBell';

export default function Header() {
  const { user, theme } = useAuth();
  const location = useLocation();
  const isDark = theme === 'dark';

  const getHeaderTitle = () => {
    const path = location.pathname;
    const isStudent = user?.role === 'student';
    const isTeacher = user?.role === 'teacher';

    if (path.includes('/quizzes/') && !path.endsWith('/quizzes')) {
      return {
        title: 'Quizzes & Exams',
        subtitle: 'Take exams and view your grades'
      };
    }
    
    if (path.includes('/courses')) {
      return {
        title: 'Courses',
        subtitle: isStudent 
          ? 'Browse and join your courses' 
          : 'Manage and organize your courses'
      };
    }
  
    if (path.includes('/Certificates')) {
      return {
        title: 'Certificates',
        subtitle: 'Your achievements' 
      };
    }
  
    if (path.includes('/quizzes')) {
      return {
        title: 'Quizzes & Exams',
        subtitle: isStudent 
          ? 'Take exams and view your grades' 
          : 'Create and evaluate your exams'
      };
    }

    if (path.includes('/users')) {
      return {
        title: isTeacher 
          ? 'My students'
          : 'All users'
      };
    }

    if (path.includes('/docs')) {
      return { 
        title: 'Documents'
      };
    }

    if (path.includes('dept')) {
      return {
        title: 'Departments'
      };
    }
   
    return {
      title: 'Dashboard',
      subtitle: isStudent 
        ? 'Welcome to your learning space' 
        : 'General overview of your management space'
    };
  };

  const currentHeader = getHeaderTitle();

  return (
    <header className={`relative z-40 flex items-center justify-between px-8 py-4 border-b transition-colors duration-200 backdrop-blur-md ${
      isDark 
        ? 'bg-[#060B19]/50 border-slate-800/80 text-white' 
        : 'bg-white/80 border-slate-200 text-slate-800'
    }`}>
      
      <div>
        <h1 className={`text-xl font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {currentHeader.title}
        </h1>
        {currentHeader.subtitle && (
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {currentHeader.subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user?.role === 'student' && (
          <RecommendationBell studentId={user?._id || user?.id} />
        )}
      </div>
    </header>
  );
}