import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import Courses from './pages/Courses';
import Quizzes from './pages/Quizzes';
import Users from './pages/Users';


function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<DashboardLayout />}>

       
        <Route path="admin/AdminDashboard" element={<AdminDashboard />} />
        <Route path="teacher/TeacherDashboard" element={<TeacherDashboard />} />
        <Route path="student/StudentDashboard" element={<StudentDashboard />} />
        <Route path="teacher/courses" element={<Courses />} />
        <Route path="student/courses" element={<Courses />} />
        <Route path="teacher/Quizzes" element={<Quizzes />} />
        <Route path="student/Quizzes" element={<Quizzes />} />
        <Route path="admin/courses" element={<Courses />} />
        <Route path="admin/Quizzes" element={<Quizzes />} />
        <Route path="admin/Users" element={<Users />} />
        <Route path="teacher/Users" element={<Users />} />
        
      </Route>
    </Routes>
  );
}

export default App;