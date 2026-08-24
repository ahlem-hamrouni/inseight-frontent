import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';

const initialForm = { title: '', course: '', duration: '', passingScore: 50 };

export default function Quizzes() {
  const navigate = useNavigate();
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';

  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/quizzes/list?q=${encodeURIComponent(search)}&page=${page}&limit=5`);
      setQuizzes(res.data?.quizzes || (Array.isArray(res.data) ? res.data : []));
      setPages(res.data?.pages || 1);
    } catch (err) {
      setQuizzes([]); setPages(1);
    } finally { setLoading(false); }
  };

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses/list');
      setCourses(Array.isArray(res.data) ? res.data : (res.data?.courses || res.data?.data || []));
    } catch { setCourses([]); }
  };

  useEffect(() => { setPage(1); }, [search]);
  useEffect(() => { fetchQuizzes(); }, [user, search, page]);
  useEffect(() => { if (user?.role !== 'student') fetchCourses(); }, [user]);

  const handleOpenModal = (quiz = null) => {
    setIsEditing(!!quiz);
    setEditingQuizId(quiz?._id || null);
    setForm(quiz ? { title: quiz.title || '', course: quiz.course?._id || quiz.course || '', duration: quiz.duration || '', passingScore: quiz.passingScore || 50 } : initialForm);
    setSubmitError(''); setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setIsEditing(false); setEditingQuizId(null); setForm(initialForm); setSubmitError(''); };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) return setSubmitError('Title is required.');
    setSubmitting(true); setSubmitError('');
    try {
      if (isEditing) {
        await api.put(`/quizzes/${editingQuizId}`, form);
      } else {
        await api.post('/quizzes/create', { ...form, createdBy: user?._id || user?.id }).catch(err => {
          if (err.response?.status === 404) return api.post('/quizzes', { ...form, createdBy: user?._id || user?.id });
          throw err;
        });
      }
      closeModal(); fetchQuizzes();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'An error occurred while saving.');
    } finally { setSubmitting(false); }
  };

  const handlePublish = async (id) => { try { await api.put(`/quizzes/${id}/publish`); fetchQuizzes(); } catch (err) { console.error(err); } };
  const handleDelete = async (id) => { if (window.confirm('Are you sure you want to delete this quiz?')) { try { await api.delete(`/quizzes/${id}`); fetchQuizzes(); } catch (err) { console.error(err); } } };

  const columns = user?.role === 'student' ? [
    { header: 'Course', render: (r) => r.course?.title || r.course?.titre || r.course?.name || '-' },
    { header: 'Quiz', render: (r) => r.title },
    { header: 'Duration', render: (r) => r.duration ? `${r.duration} min` : '-' },
    { header: 'Questions', render: (r) => r.questionsCount ?? 0 },
    { header: 'Passing Score', render: (r) => `${r.passingScore || 50}%` },
    { header: 'Action', align: 'right', render: (r) => <button onClick={() => navigate(`/student/quizzes/${r._id}`)} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-xs px-4 py-1.5 rounded-full dark:bg-blue-500/10 dark:text-blue-400">Start</button> }
  ] : [
    { header: 'Quiz Title', render: (r) => <span onClick={() => navigate(`/teacher/quizzes/${r._id}/questions`)} className={`font-semibold cursor-pointer hover:underline hover:text-blue-400 ${isDark ? 'text-white' : 'text-slate-900'}`}>{r.title}</span> },
    { header: 'Course', render: (r) => r.course?.title || r.course?.titre || '-' },
    { header: 'Duration', render: (r) => r.duration ? `${r.duration} min` : '-' },
    { header: 'Passing Score', render: (r) => `${r.passingScore || 50}%` },
    { header: 'Status', render: (r) => <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${r.isPublished ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>{r.isPublished ? 'Published' : 'Draft'}</span> },
    { header: 'Actions', align: 'right', render: (r) => (
      <div className="space-x-3">
        {!r.isPublished && <button onClick={() => handlePublish(r._id)} className="text-green-500 hover:text-green-600 font-medium text-xs">Publish</button>}
        <button onClick={() => handleOpenModal(r)} className="text-blue-500 hover:text-blue-600 font-medium text-xs">Edit</button>
        <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-600 font-medium text-xs">Delete</button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      
      

      <DataTable
       title={user?.role === 'admin' ? 'ALL quizzes' : 'My Quizzes' }
       buttonText={user?.role === 'admin' ? 'New quiz' : null}
        onButtonClick={() => handleOpenModal()}
        searchValue={search}
        onSearchChange={(e) => setSearch(e.target.value)}
        searchPlaceholder="Search quiz..."
        columns={columns} data={quizzes} loading={loading} />

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-3xl p-6 shadow-xl ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">{isEditing ? 'Edit Quiz' : 'Add Quiz'}</h2>
                <p className={`mt-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{isEditing ? 'Update quiz details.' : 'Fill in the information for the new quiz.'}</p>
              </div>
              <button type="button" onClick={closeModal} className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1">Quiz Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Associated Course</label>
                <select name="course" value={form.course} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none">
                  <option value="">-- Select a course --</option>
                  {courses.map((c) => (<option key={c._id || c.id} value={c._id || c.id}>{c.title || c.titre || c.description || c.name || 'Untitled Course'}</option>))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Duration (min)</label>
                  <input type="number" name="duration" value={form.duration} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Passing Score (%)</label>
                  <input type="number" name="passingScore" value={form.passingScore} onChange={handleChange} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              {submitError && <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">{submitError}</div>}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button type="button" onClick={closeModal} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs text-slate-600 dark:text-slate-300">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50">{submitting ? 'Saving...' : isEditing ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}