import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';
import { getTeacherAnalytics } from '../../services/analyticsService';

export default function TeacherDashboard({ courseId }) {
  const { theme } = useAuth();
  const [stats, setStats] = useState({ totalCourses: 0, totalAttempts: 0, averageScore: 0 });

  useEffect(() => {
    if (courseId) {
      getTeacherAnalytics(courseId)
        .then((res) => {
          if (res.success) setStats(res.data);
        })
        .catch((err) => console.error(err));
    }
  }, [courseId]);

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
        <StatCard title="Total Courses" value={stats.totalCourses || 0} />
        <StatCard title="Quiz Attempts" value={stats.totalAttempts || 0} />
        <StatCard title="Average Grade" value={`${stats.averageScore || 0}%`} />
      </div>
    </div>
  );
}