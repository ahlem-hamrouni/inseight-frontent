import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

import CourseDetailsHeader from './CourseDetailsHeader';
import CourseModulesTable from './CourseModulesTable';
import ModuleLessonsList from './ModuleLessonsList';
import ModuleModal from './ModuleModal';
import LessonModal from './LessonModal';

const initialModuleForm = { titre: '', description: '', order: 0 };
const initialLessonForm = { title: '', content: '', videoUrl: '', pdfUrl: '', order: 0 };

export default function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, theme } = useAuth();
  const isDark = theme === 'dark';

  const isManagement = user?.role === 'teacher' || user?.role === 'admin';

  
  const [modules, setModules] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');

 
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [moduleForm, setModuleForm] = useState(initialModuleForm);
  const [submittingModule, setSubmittingModule] = useState(false);
  const [submitModuleError, setSubmitModuleError] = useState('');

  
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState(initialLessonForm);
  const [submittingLesson, setSubmittingLesson] = useState(false);
  const [submitLessonError, setSubmitLessonError] = useState('');

  
  const loadData = async () => {
    try {
      setLoading(true);
      const [resMod, resLess] = await Promise.all([
        api.get(`/modules/list?page=${page}&limit=5&q=${encodeURIComponent(search)}`),
        api.get('/lessons/list')
      ]);

      const fetchedModules = Array.isArray(resMod.data) ? resMod.data : (resMod.data?.data || resMod.data?.modules || []);
      const totalPages = resMod.data?.pages || resMod.data?.totalPages || 1;
      const fetchedLessons = Array.isArray(resLess.data) ? resLess.data : (resLess.data?.data || resLess.data?.lessons || []);

      const filteredModules = fetchedModules.filter(m => String(m.course?._id || m.course) === String(courseId));
      setModules(filteredModules);
      setPages(totalPages);
      setLessons(fetchedLessons);

      if (activeModule) {
        const updated = filteredModules.find(m => String(m._id || m.id) === String(activeModule._id || activeModule.id));
        if (updated) setActiveModule(updated);
      }
    } catch (err) {
      console.error('Error loading course details:', err);
      setModules([]);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadData();
  }, [user, courseId, page, search]);

  
  const handleModuleChange = (e) => setModuleForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOpenCreateModule = () => {
    setIsEditingModule(false);
    setCurrentModuleId(null);
    setModuleForm(initialModuleForm);
    setSubmitModuleError('');
    setShowModuleModal(true);
  };

  const handleOpenEditModule = (e, module) => {
    e.stopPropagation();
    setIsEditingModule(true);
    setCurrentModuleId(module._id || module.id);
    setModuleForm({
      titre: module.titre || module.title || '',
      description: module.description || '',
      order: module.order || 0
    });
    setSubmitModuleError('');
    setShowModuleModal(true);
  };

  const closeModuleModal = () => {
    setShowModuleModal(false);
    setIsEditingModule(false);
    setCurrentModuleId(null);
    setModuleForm(initialModuleForm);
    setSubmitModuleError('');
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();
    if (!moduleForm.titre) return setSubmitModuleError('Please fill in module title.');
    setSubmittingModule(true);
    setSubmitModuleError('');
    try {
      const payload = {
        titre: moduleForm.titre,
        description: moduleForm.description,
        order: Number(moduleForm.order) || 0,
        course: courseId
      };

      if (isEditingModule) {
        await api.put(`/modules/${currentModuleId}`, payload);
      } else {
        await api.post(`/modules/course/${courseId}`, payload);      }
      closeModuleModal();
      await loadData();
    } catch (err) {
      setSubmitModuleError(err.response?.data?.message || 'Error saving module.');
    } finally {
      setSubmittingModule(false);
    }
  };

  const handleDeleteModule = async (e, moduleId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this module?')) {
      try {
        await api.delete(`/modules/${moduleId}`);
        if (activeModule && String(activeModule._id || activeModule.id) === String(moduleId)) {
          setActiveModule(null);
          setActiveLesson(null);
        }
        await loadData();
      } catch (err) {
        console.error('Error deleting module:', err);
        alert(err.response?.data?.message || 'Error deleting module.');
      }
    }
  };

  
  const handleLessonChange = (e) => setLessonForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleOpenCreateLesson = (e, moduleId) => {
    e.stopPropagation();
    setSelectedModuleId(moduleId);
    setIsEditingLesson(false);
    setCurrentLessonId(null);
    setLessonForm(initialLessonForm);
    setSubmitLessonError('');
    setShowLessonModal(true);
  };

  const handleOpenEditLesson = (e, lesson) => {
    e.stopPropagation();
    setIsEditingLesson(true);
    setCurrentLessonId(lesson._id || lesson.id);
    setLessonForm({
      title: lesson.title || '',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      pdfUrl: lesson.pdfUrl || '',
      order: lesson.order || 0
    });
    setSubmitLessonError('');
    setShowLessonModal(true);
  };

  const closeLessonModal = () => {
    setShowLessonModal(false);
    setIsEditingLesson(false);
    setCurrentLessonId(null);
    setSelectedModuleId(null);
    setLessonForm(initialLessonForm);
    setSubmitLessonError('');
  };

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    if (!lessonForm.title) return setSubmitLessonError('Please fill in lesson title.');
    setSubmittingLesson(true);
    setSubmitLessonError('');
    try {
      const payload = {
        ...lessonForm,
        order: Number(lessonForm.order) || 0
      };

      if (isEditingLesson) {
        await api.put(`/lessons/${currentLessonId}`, payload);
      } else {
        await api.post(`/lessons/${selectedModuleId}/lessons`, payload);
      }
      closeLessonModal();
      await loadData();
    } catch (err) {
      setSubmitLessonError(err.response?.data?.message || 'Error saving lesson.');
    } finally {
      setSubmittingLesson(false);
    }
  };

  const handleDeleteLesson = async (e, lessonId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await api.delete(`/lessons/${lessonId}`);
        if (activeLesson && String(activeLesson._id || activeLesson.id) === String(lessonId)) {
          setActiveLesson(null);
        }
        await loadData();
      } catch (err) {
        console.error('Error deleting lesson:', err);
        alert(err.response?.data?.message || 'Error deleting lesson.');
      }
    }
  };

  const handleSelectRow = (moduleRow) => {
    if (activeModule && String(activeModule._id || activeModule.id) === String(moduleRow._id || moduleRow.id)) {
      setActiveModule(null);
      setActiveLesson(null);
    } else {
      setActiveModule(moduleRow);
      setActiveLesson(null);
    }
  };

  return (
    <div className="space-y-6">
      <CourseDetailsHeader 
        isDark={isDark}
        search={search}
        setSearch={setSearch}
        setPage={setPage}
        isManagement={isManagement}
        onOpenCreateModule={handleOpenCreateModule}
        onNavigateBack={() => navigate(-1)}
      />

      <CourseModulesTable 
        modules={modules}
        lessons={lessons}
        loading={loading}
        page={page}
        pages={pages}
        setPage={setPage}
        isManagement={isManagement}
        handleSelectRow={handleSelectRow}
        handleOpenCreateLesson={handleOpenCreateLesson}
        handleOpenEditModule={handleOpenEditModule}
        handleDeleteModule={handleDeleteModule}
      />

      <ModuleLessonsList 
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeLesson={activeLesson}
        setActiveLesson={setActiveLesson}
        lessons={lessons}
        isDark={isDark}
        isManagement={isManagement}
        handleOpenCreateLesson={handleOpenCreateLesson}
        handleOpenEditLesson={handleOpenEditLesson}
        handleDeleteLesson={handleDeleteLesson}
      />

      <ModuleModal 
        show={showModuleModal}
        isEditingModule={isEditingModule}
        moduleForm={moduleForm}
        submitModuleError={submitModuleError}
        submittingModule={submittingModule}
        handleModuleChange={handleModuleChange}
        handleModuleSubmit={handleModuleSubmit}
        closeModuleModal={closeModuleModal}
      />

      <LessonModal 
        show={showLessonModal}
        isEditingLesson={isEditingLesson}
        lessonForm={lessonForm}
        submitLessonError={submitLessonError}
        submittingLesson={submittingLesson}
        handleLessonChange={handleLessonChange}
        handleLessonSubmit={handleLessonSubmit}
        closeLessonModal={closeLessonModal}
      />
    </div>
  );
}