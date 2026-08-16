import React from 'react';
import StatCard from '../../components/StatCard';

export default function StudentDashboard() {
  return (
    <div className="p-6 space-y-6">
     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Enrolled Courses" 
          value="0" 
        />
        <StatCard 
          title="Passed Quizzes" 
          value="0" 
        />
        <StatCard 
          title="Average Score" 
          value="0%" 
        />
      </div>
    </div>
  );
}