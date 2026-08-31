import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import ChatbotButton from '../components/ai/ChatbotButton';
import Chatbot from '../components/ai/Chatbot';
import { useCurrentStudent } from '../hooks/useCurrentStudent';
const menusByRole = {
  teacher: [
    { label: 'Dashboard', link: '/teacher/TeacherDashboard' },
    { label: 'Courses', link: '/teacher/courses' },
    { label: 'Quizzes et Exams', link: '/teacher/quizzes' },
    { label: 'Students', link: '/teacher/users' },
    { label: 'Documents', link: '/teacher/docs' },
  ],
  student: [
    { label: 'Dashboard', link: '/student/StudentDashboard' },
    { label: 'Courses', link: '/student/courses' },
    { label: 'Quizzes & Exams', link: '/student/quizzes' },
    { label: 'Documents', link: '/student/docs' },
    { label: 'Certificates', link: '/student/Certificates' },
  ],
  admin: [
    { label: 'Dashboard', link: '/admin/AdminDashboard' },
    { label: 'Courses', link: '/admin/courses' },
    { label: 'Quizzes & Exams', link: '/admin/quizzes' },
    { label: 'Users', link: '/admin/users' },
    { label: 'Documents', link: '/admin/docs' },
    { label: 'Departments', link: '/admin/dept' },
  ]
};

export default function DashboardLayout() {
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';
  const [isChatOpen, setIsChatOpen] = useState(false);

  const currentRole = user?.role;
  const currentMenus = menusByRole[currentRole];

  const student = useCurrentStudent(); 
  const [isOpen, setIsOpen ]= useState (false)

  return (
    <div className={`min-h-screen flex transition-colors duration-200 relative ${
      isDark ? 'bg-[#060B19] text-white' : 'bg-slate-100 text-slate-900'
    }`}>

      <Sidebar menus={currentMenus} title={currentRole?.toUpperCase()} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header user={user} />
        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main> <Chatbot studentId={user?._id || user?.id} isOpen={isOpen} onClose={() => setIsOpen(false)} /> <ChatbotButton open= {isOpen} onClick={() => setIsOpen((value) => ! value)}/>
      </div>

      
    </div>
  );
}