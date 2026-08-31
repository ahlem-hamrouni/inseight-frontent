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
import Users from './pages/User/Users';
import Documents from './pages/Documents';
import Departements from'./pages/Departements';
import TakeQuiz from './pages/QuestionsDetails/TakeQuiz';
import ManageQuizQuestions from './pages/QuestionsDetails/ManageQuizQuestions';
import ViewAttemptResult from './pages/QuestionsDetails/ViewAttemptResult';
import Certificates from './pages/Certificates';

import CourseDetails from'./pages/CourseDetails/CourseDetails';

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
        <Route path="teacher/Docs" element={<Documents />} />
        <Route path="admin/Docs" element={<Documents />} />
        <Route path="student/Docs" element={<Documents />} />
        <Route path="admin/Dept" element={<Departements/>} />
        <Route path="teacher/courses/:courseId" element={<CourseDetails />} />
        <Route path="student/courses/:courseId" element={<CourseDetails />} />
        <Route path="admin/courses/:courseId" element={<CourseDetails />} />
        <Route path="/student/Quizzes/:id" element={<TakeQuiz />} />
        <Route path="/teacher/Quizzes/:quizId/questions" element={<ManageQuizQuestions />} />
        <Route path="/student/attempts/:attemptId" element={<ViewAttemptResult />} />
        <Route path="student/Certificates" element={<Certificates />} />
      </Route>
    </Routes>
  );
}

export default App;