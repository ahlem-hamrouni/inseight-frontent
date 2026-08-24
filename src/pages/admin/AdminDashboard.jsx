import React, { useEffect, useState } from 'react';
import StatCard from '../../components/StatCard';
import StudentsByLevelChart from '../../components/StudentsByLevelChart';
import StudentsByGroupChart from '../../components/StudentsByGroupChart';
import UserDistributionChart from '../../components/UserDistributionChart';
import PlatformGrowthChart from '../../components/PlatformGrowthChart';
import { getAdminAnalytics, getStudentsByLevel, getStudentsByGroup, getPlatformGrowth } from '../../services/analyticsService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ 
    totalUsers: 0,
    totalStudents: 0, 
    activeStudents: 0, 
    inactiveStudents: 0, 
    totalCourses: 0, 
    averageScore: 0,
    userDistribution: {} 
  });
  const [levelData, setLevelData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [loading, setLoading] = useState(true);


  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchData = () => {
    setLoading(true);
    const params = {};
    if (selectedLevel) params.level = selectedLevel;
    if (selectedStatus) params.isActive = selectedStatus;

    Promise.all([
      getAdminAnalytics(params),
      getStudentsByLevel(params),
      getStudentsByGroup(params),
      getPlatformGrowth(params)
    ])
      .then(([adminRes, levelRes, groupRes, growthRes]) => {
        if (adminRes.success) setStats(adminRes.data);
        if (levelRes.success) setLevelData(levelRes.data);
        if (groupRes.success) setGroupData(groupRes.data);
        if (growthRes?.success) setGrowthData(growthRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [selectedLevel, selectedStatus]);

  return (
    <div className="p-6 space-y-6">
     
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistical Overview</h1>
          <p className="text-slate-400 text-sm">ACADEMIC YEAR 2026</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-[#0B132B] border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Levels</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-[#0B132B] border border-slate-700 text-white text-sm rounded-lg p-2.5 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Users" value={stats.totalUsers || 0} />
        <StatCard title="Total Courses" value={stats.totalCourses || 0} />
        <StatCard title="Total Students" value={stats.totalStudents || 0} />
        <StatCard title="Active Students" value={stats.activeStudents || 0} />
        <StatCard title="Inactive Students" value={stats.inactiveStudents || 0} />
        <StatCard title="Overall Average" value={`${stats.averageScore || 0}%`} />
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       
        <div className="bg-[#0B132B]/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Platform Growth</h3>
          <div className="h-64">
            {loading ? (
              <div className="text-white flex items-center justify-center h-full">Loading...</div>
            ) : (
              <PlatformGrowthChart data={growthData} />
            )}
          </div>
        </div>

        <div className="bg-[#0B132B]/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">User Distribution</h3>
          <div className="h-64">
            {loading ? (
              <div className="text-white flex items-center justify-center h-full">Loading...</div>
            ) : (
              <UserDistributionChart distribution={stats.userDistribution} />
            )}
          </div>
        </div>

        <div className="bg-[#0B132B]/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Students by Level</h3>
          <div className="h-64">
            {loading ? (
              <div className="text-white flex items-center justify-center h-full">Loading...</div>
            ) : (
              <StudentsByLevelChart data={levelData} />
            )}
          </div>
        </div>

        <div className="bg-[#0B132B]/80 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Students by Group</h3>
          <div className="h-64">
            {loading ? (
              <div className="text-white flex items-center justify-center h-full">Loading...</div>
            ) : (
              <StudentsByGroupChart data={groupData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}