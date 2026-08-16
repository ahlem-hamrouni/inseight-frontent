import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';


const menusByRole = {
  teacher: [
    { label: 'Dashboard', link: '/teacher/TeacherDashboard' },
    { label: 'Courses', link: '/teacher/courses' },
    { label: 'Quizzes et Exams', link: '/teacher/Quizzes' },
    { label: 'Students', link: '/teacher/Users' },

  ],
  student: [
    { label: 'Dashboard', link: '/student/StudentDashboard' },
    { label: 'Courses', link: '/student/courses' },
    { label: 'Quizzes & Exams', link: '/student/quizzes' },
  ],
  admin: [
    { label: 'Dashboard', link: '/admin/AdminDashboard' },
    { label: 'Courses', link: '/admin/courses' },
    { label: 'Quizzes & Exams', link: '/admin/quizzes' },
    { label: 'Users', link: '/admin/users' },

  ]
};

export default function DashboardLayout() {
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';

  const currentRole = user?.role ;
  const currentMenus = menusByRole[currentRole] ;

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      isDark ? 'bg-[#060B19] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      
      <Sidebar menus={currentMenus} title={currentRole.toUpperCase()} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} />
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}