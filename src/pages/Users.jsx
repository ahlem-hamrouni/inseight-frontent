import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const { user } = useAuth();
  
  
  const [usersList, setUsersList] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/users/list' : '/users/students';
      
     
      const res = await api.get(`${endpoint}?page=${page}&limit=5`);

     
      setUsersList(res.data.users || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setUsersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [page, user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const columns = [
    {
      header: 'Nom & Prénom',
      render: (row) => `${row?.firstName || ''} ${row?.lastName || ''}`.trim() || row?.name || 'Sans nom',
    },
    {
      header: 'Email',
      render: (row) => row?.email || '-',
    },
    ...(isAdmin
      ? [
          {
            header: 'Rôle',
            render: (row) => (
              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
                {row?.role || 'User'}
              </span>
            ),
          },
          {
            header: 'Actions',
            align: 'right',
            render: (row) => (
              <button 
                onClick={() => handleDelete(row._id)}
                className="text-red-500 hover:text-red-600 font-medium text-xs"
              >
                Delete
              </button>
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <DataTable
        title={isAdmin ? "All users" : "My students"}
        buttonText={isAdmin ? "New User" : null}
        onButtonClick={() => alert('Modal Ajout Utilisateur')}
        columns={columns}
        data={usersList}
        loading={loading}
      />

     
      <Pagination 
        page={page} 
        pages={pages} 
        onPageChange={(newPage) => setPage(newPage)} 
      />
    </div>
  );
}