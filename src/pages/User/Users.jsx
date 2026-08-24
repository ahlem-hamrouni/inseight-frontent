import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import DataTable from '../../components/DataTable';
import Pagination from '../../components/Pagination';
import UserModal from './UserModal';
import UserTabs, { COLUMNS_BY_ROLE } from './UserTabs';
import { useAuth } from '../../context/AuthContext';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  isActive: true,
  password: '',
  phone: '',
  role: 'student',
  studentCode: '',
  level: 'L1',
  group: '', // 
  speciality: '',
  office: '',
  departement: '',
};

export default function Users() {
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const [activeRole, setActiveRole] = useState('student');
  const [dynamicColumns, setDynamicColumns] = useState(COLUMNS_BY_ROLE.student);

  const [usersList, setUsersList] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchDepartements = async () => {
    try {
      const res = await api.get('/departements/list');
      setDepartements(res.data.departements || res.data || []);
    } catch (err) {
      console.error('Erreur chargement départements:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? `/users/getlist${activeRole}` : '/users/students';
      const res = await api.get(`${endpoint}?page=${page}&limit=5&search=${encodeURIComponent(search)}`);

      setUsersList(res.data.users || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setUsersList([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, activeRole]);

  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchDepartements();
    }
  }, [page, user, search, activeRole]);

  const handleRoleChange = (newRole, newColumns) => {
    setActiveRole(newRole);
    setDynamicColumns(newColumns);
  };

  const handleOpenModal = (userData = null) => {
    setIsEditing(!!userData);
    setEditingUserId(userData?._id || null);
    if (userData) {
      setForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        isActive: userData.isActive ?? true,
        password: '',
        phone: userData.phone || '',
        role: userData.role || 'student',
        studentCode: userData.studentCode || '',
        level: userData.level || 'L1',
        group: userData.group || '', // 
        speciality: userData.speciality || '',
        office: userData.office || '',
        departement: userData.department?._id || userData.department || userData.departement || '',
      });
    } else {
      setForm({ ...initialForm, role: activeRole });
    }
    setSubmitError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingUserId(null);
    setForm(initialForm);
    setSubmitError('');
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const payload = { ...form, isActive: form.isActive === 'true' || form.isActive === true };
    if (!payload.departement) delete payload.departement;
    if (isEditing && !payload.password) delete payload.password;

    try {
      if (isEditing) {
        await api.put(`/users/${editingUserId}`, payload);
      } else {
        await api.post('/users/ajouter', payload);
      }
      closeModal();
      fetchUsers();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  const finalColumns = [
    ...dynamicColumns,
    ...(isAdmin
      ? [
          {
            header: 'Actions',
            align: 'right',
            render: (row) => (
              <div className="space-x-3">
                <button
                  onClick={() => handleOpenModal(row)}
                  className="text-blue-500 hover:text-blue-600 font-medium text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(row._id)}
                  className="text-red-500 hover:text-red-600 font-medium text-xs"
                >
                  Delete
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      {isAdmin && (
        <UserTabs
          activeRole={activeRole}
          onRoleChange={handleRoleChange}
        />
      )}

      <DataTable
        title={isAdmin ? `Liste des ${activeRole}s` : 'My students'}
        buttonText={isAdmin ? 'New User' : undefined}
        onButtonClick={isAdmin ? () => handleOpenModal() : undefined}
        columns={finalColumns}
        data={usersList}
        loading={loading}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder={`Search ${activeRole}...`}
      />

      <Pagination page={page} pages={pages} onPageChange={(newPage) => setPage(newPage)} />

      <UserModal
        showModal={showModal}
        closeModal={closeModal}
        isEditing={isEditing}
        isDark={isDark}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        departements={departements}
      />
    </div>
  );
}