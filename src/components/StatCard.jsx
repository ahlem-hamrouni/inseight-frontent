import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-[#0B132B]/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm flex justify-between items-center">
      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-white mt-1">
          {value}
        </h3>
        {trend && (
          <p className="text-xs font-medium text-emerald-400 mt-2">
            {trend}
          </p>
        )}
      </div>

      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}