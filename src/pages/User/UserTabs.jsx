import React, { useEffect } from 'react';

const renderStatusBadge = (isActive) => {
  const active = isActive !== false && isActive !== 'false';
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1.5 ${
        active
          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
          : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      {active ? 'Active' : 'Inactive'}
    </span>
  );
};

export const COLUMNS_BY_ROLE = {
  student: [
    {
      header: 'Nom & Prénom',
      render: (row) => `${row?.firstName || ''} ${row?.lastName || ''}`.trim() || row?.name || 'Sans nom',
    },
    {
      header: 'Email',
      render: (row) => row?.email || '-',
    },
    {
      header: 'Téléphone',
      render: (row) => row?.phone || '-',
    },
    {
      header: 'Student Code',
      render: (row) => row?.studentCode || '-',
    },
    {
      header: 'Level',
      render: (row) => row?.level || '-',
    },
    {
      header: 'Group', 
      render: (row) => row?.group || '-',
    },
    {
      header: 'Department',
      render: (row) => row?.department?.name || row?.department?.nom || row?.departement?.name || row?.departement?.nom || '-',
    },
    {
      header: 'Status',
      render: (row) => renderStatusBadge(row?.isActive),
    },
  ],

  teacher: [
    {
      header: 'Nom & Prénom',
      render: (row) => `${row?.firstName || ''} ${row?.lastName || ''}`.trim() || row?.name || 'Sans nom',
    },
    {
      header: 'Email',
      render: (row) => row?.email || '-',
    },
    {
      header: 'Téléphone',
      render: (row) => row?.phone || '-',
    },
    {
      header: 'Speciality',
      render: (row) => row?.speciality || '-',
    },
    {
      header: 'Office',
      render: (row) => row?.office || '-',
    },
    {
      header: 'Department',
      render: (row) => row?.department?.name || row?.department?.nom || row?.departement?.name || row?.departement?.nom || '-',
    },
    {
      header: 'Status',
      render: (row) => renderStatusBadge(row?.isActive),
    },
  ],

  admin: [
    {
      header: 'Nom & Prénom',
      render: (row) => `${row?.firstName || ''} ${row?.lastName || ''}`.trim() || row?.name || 'Sans nom',
    },
    {
      header: 'Email',
      render: (row) => row?.email || '-',
    },
    {
      header: 'Téléphone',
      render: (row) => row?.phone || '-',
    },
    {
      header: 'Permissions',
      render: (row) =>
        row?.permissions && row?.permissions?.length > 0 ? (
          <div className="flex gap-1 flex-wrap">
            {row.permissions.map((perm, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {perm}
              </span>
            ))}
          </div>
        ) : (
          'All'
        ),
    },
    {
      header: 'Status',
      render: (row) => renderStatusBadge(row?.isActive),
    },
  ],
};

export default function UserTabs({ activeRole, onRoleChange }) {
  const roles = ['student', 'teacher', 'admin'];

  useEffect(() => {
    if (onRoleChange) {
      const selectedColumns = COLUMNS_BY_ROLE[activeRole] || COLUMNS_BY_ROLE.student;
      onRoleChange(activeRole, selectedColumns);
    }
  }, [activeRole]);

  const handleSelectRole = (role) => {
    const selectedColumns = COLUMNS_BY_ROLE[role] || COLUMNS_BY_ROLE.student;
    if (onRoleChange) {
      onRoleChange(role, selectedColumns);
    }
  };

  return (
    <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
      {roles.map((role) => {
        const isActive = activeRole === role;
        return (
          <button
            key={role}
            onClick={() => handleSelectRole(role)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl capitalize transition-all duration-200 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {role}s
          </button>
        );
      })}
    </div>
  );
}