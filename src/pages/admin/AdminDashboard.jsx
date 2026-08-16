import React from 'react';
import StatCard from '../../components/StatCard';

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Users" 
          value="0" 
        />
        <StatCard 
          title="Total Courses" 
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