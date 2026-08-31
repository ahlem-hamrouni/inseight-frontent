import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import { getStudentAnalytics } from '../../services/analyticsService';

export default function StudentDashboard() {
  const [stats, setStats] = useState({ totalCourses: 0, averageScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  getStudentAnalytics()
    .then((res) => {
      if (res.data?.success && res.data?.data) {
        setStats(res.data.data);
      } else if (res.success && res.data) {
        setStats(res.data);
      }
    })
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, [])
  if (loading) return <div className="p-6 text-white">Chargement...</div>;
  const rawScore = Number(stats.averageScore || 0);
  const percentageScore = (rawScore * 5).toFixed(2);

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Enrolled Courses" value={stats.totalCourses || 0} />
        <StatCard title="Average Score" value={`${percentageScore}%`} />
        <StatCard title="Attendance Rate" value={`${stats.attendanceRate || 0}%`} />
      </div>
    </div>
  );
}