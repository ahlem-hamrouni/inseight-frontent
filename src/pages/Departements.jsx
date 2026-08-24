import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

const initialForm = { name: '', description: '' };

export default function Departements() {
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/departements/list?page=${page}&limit=5&q=${encodeURIComponent(search)}`);
      
      if (res.data?.departements) {
        setDepartments(res.data.departements);
        setPages(res.data.pages || 1);
      } else if (Array.isArray(res.data)) {
        setDepartments(res.data);
        setPages(1);
      } else {
        setDepartments([]);
        setPages(1);
      }
    } catch (err) {
      setDepartments([]);
      setPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchDepartments();
  }, [user, search, page]);

  const handleOpenModal = (dept = null) => {
    setIsEditing(!!dept);
    setEditingDeptId(dept?._id || null);
    setForm(
      dept
        ? { name: dept.name || '', description: dept.description || '' }
        : initialForm
    );
    setSubmitError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingDeptId(null);
    setForm(initialForm);
    setSubmitError('');
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return setSubmitError('Department name is required.');
    setSubmitting(true);
    setSubmitError('');
    try {
      if (isEditing) {
        await api.put(`/departements/${editingDeptId}`, form);
      } else {
        await api.post('/departements/ajouter', form);
      }
      closeModal();
      fetchDepartments();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'An error occurred while saving department.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await api.delete(`/departements/${id}`);
        fetchDepartments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const columns = [
    {
      header: 'Department Name',
      render: (r) => (
        <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {r.name}
        </span>
      ),
    },
    {
      header: 'Description',
      render: (r) => r.description || '-',
    },
    {
      header: 'Created At',
      render: (r) =>
        r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-',
    },
    ...(user?.role === 'admin'
      ? [
          {
            header: 'Actions',
            align: 'right',
            render: (r) => (
              <div className="space-x-3">
                <button
                  onClick={() => handleOpenModal(r)}
                  className="text-blue-500 hover:text-blue-600 font-medium text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r._id)}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1
          className={`text-2xl font-bold flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          Departments{' '}
          <span className="text-sm font-normal text-slate-400">
            · Manage academic structure
          </span>
        </h1>
      </div>

      <DataTable
        title=""
        buttonText={user?.role === 'admin' ? 'New Department' : null}
        onButtonClick={() => handleOpenModal()}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search department..."
        columns={columns}
        data={departments}
        loading={loading}
      />

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div
            className={`w-full max-w-lg rounded-3xl p-6 shadow-xl ${
              isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">
                  {isEditing ? 'Edit Department' : 'Add Department'}
                </h2>
                <p
                  className={`mt-1 text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  {isEditing
                    ? 'Update department details.'
                    : 'Fill in the information for the new department.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Department Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none"
                />
              </div>

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">
                  {submitError}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}