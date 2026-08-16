import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import CourseCard from '../components/CourseCard';
import CourseModal from '../components/CourseModal';

const initialForm = { title: '', description: '', departement: '', level: '', duration: '', image: '' };

export default function Courses() {
  const { user, theme } = useAuth();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(() => {
    try {
      const saved = localStorage.getItem(`enrolled_courses_${user?._id || user?.id || 'guest'}`);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (user) localStorage.setItem(`enrolled_courses_${user._id || user.id || 'guest'}`, JSON.stringify(enrolledCourseIds));
  }, [enrolledCourseIds, user]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/courses/list?page=${page}&limit=3&q=${encodeURIComponent(search)}`);
      const fetchedCourses = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.courses || res.data?.cours || []);
      const totalPages = res.data?.pages || res.data?.totalPages || 1;
      const backendEnrolledIds = fetchedCourses.filter(c => c.isEnrolled).map(c => String(c._id || c.id));
      if (backendEnrolledIds.length > 0) setEnrolledCourseIds((prev) => Array.from(new Set([...prev, ...backendEnrolledIds])));
      setCourses(fetchedCourses); setPages(totalPages);
    } catch (err) {
      console.error('Error loading courses:', err); setCourses([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadCourses(); }, [user, page, search]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOpenCreate = () => {
    setIsEditing(false); 
    setCurrentCourseId(null); 
    setForm(initialForm); setSubmitError('');
    setShowModal(true);
  };

  const handleOpenEdit = (course) => {
    setIsEditing(true); setCurrentCourseId(course._id || course.id);
    setForm({ title: course.title || course.titre || '', 
      description: course.description || '', 
      departement: course.departement?._id || course.departement || '',
      level: course.level || course.niveau || '',
      duration: course.duration || '', 
      image: course.image || '' });
    setSubmitError(''); setShowModal(true);
  };

  const closeModal = () => { 
    setShowModal(false); 
    setIsEditing(false);
    setCurrentCourseId(null);
    setForm(initialForm); 
    setSubmitError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.duration || !form.level) 
      return setSubmitError('Please fill in title, description, duration, and level.');
    setSubmitting(true); setSubmitError('');
    try {
      if (isEditing) {
        await api.put(`/courses/${currentCourseId}`, { ...form, teacher: user?._id || user?.id, departement: user?.departement?._id || user?.departement });
      } else {
        await api.post('/courses/create', { ...form, teacher: user?._id || user?.id, departement: user?.departement?._id || user?.departement, image: form.image || 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80' });
      }
      closeModal(); await loadCourses();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Error saving course.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await api.delete(`/courses/${courseId}`);
        setCourses((prev) => prev.filter((c) => (c._id || c.id) !== courseId));
      } catch (err) {
        console.error('Error deleting course:', err);
        alert(err.response?.data?.message || 'Error deleting course.');
      }
    }
  };

  const handleEnroll = async (course) => {
    const cId = String(course._id || course.id);
    setEnrolledCourseIds((prev) => Array.from(new Set([...prev, cId])));
    try {
      await api.post('/courses/${courseId}'/enroll, { student: user?._id || user?.id, course: cId, status: 'active' });
    } catch (err) {
      console.error('Backend enrollment error:', err);
      try { await api.post(`/courses/${cId}/enroll`); } catch (e) { console.error('Fallback enroll error:', e); }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>My Courses</h1></div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input type="text" placeholder="Search course..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`w-full px-4 py-2 text-sm rounded-xl border focus:outline-none transition-all ${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'}`} />
          </div>
          {user?.role !== 'student' && <button onClick={handleOpenCreate} className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition shadow-sm">New course</button>}
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>No courses available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, idx) => {
            const courseId = String(course._id || course.id);
            const isEnrolled = course.isEnrolled || enrolledCourseIds.includes(courseId);
            return <CourseCard key={courseId || idx} course={course} isDark={isDark} user={user} isEnrolled={isEnrolled} handleOpenEdit={handleOpenEdit} handleDelete={handleDelete} handleEnroll={handleEnroll} navigate={navigate} />;
          })}
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="pt-4 flex justify-center">
          <Pagination page={page} pages={pages} onPageChange={(newPage) => setPage(newPage)} />
        </div>
      )}

      <CourseModal showModal={showModal} isEditing={isEditing} isDark={isDark} form={form} submitting={submitting} submitError={submitError} closeModal={closeModal} handleSubmit={handleSubmit} handleChange={handleChange} />
    </div>
  );
}