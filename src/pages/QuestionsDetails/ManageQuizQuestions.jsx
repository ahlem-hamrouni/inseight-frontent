import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import QuestionItem from './QuestionItem';
import QuestionModal from './QuestionModal';

export default function ManageQuizQuestions() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  const [questions, setQuestions] = useState([]);
  const [choicesMap, setChoicesMap] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [formData, setFormData] = useState({
    statement: '',
    type: 'MCQ',
    points: 1,
    order: 0,
    choices: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
  });

  const fetchQuestionsData = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/questions/${quizId}`);
      const qList = Array.isArray(res.data) ? res.data : [];
      setQuestions(qList);

      const choicesObj = {};
      for (const q of qList) {
        try {
          const cRes = await api.get(`/choices/${q._id}`);
          choicesObj[q._id] = Array.isArray(cRes.data) ? cRes.data : [];
        } catch (err) {
          choicesObj[q._id] = [];
        }
      }
      setChoicesMap(choicesObj);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) fetchQuestionsData();
  }, [quizId]);

  const openCreateModal = () => {
    setEditingQuestionId(null);
    setFormData({
      statement: '',
      type: 'MCQ',
      points: 1,
      order: questions.length + 1,
      choices: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
    });
    setShowModal(true);
  };

  const openEditModal = (question) => {
    setEditingQuestionId(question._id);
    const existingChoices = choicesMap[question._id] || [];
    setFormData({
      statement: question.statement,
      type: question.type,
      points: question.points || 1,
      order: question.order || 0,
      choices: existingChoices.length > 0 
        ? existingChoices.map(c => ({ _id: c._id, text: c.text, isCorrect: c.isCorrect }))
        : [{ text: '', isCorrect: false }]
    });
    setShowModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestionId) {
        await api.put(`/questions/${editingQuestionId}`, {
          statement: formData.statement,
          type: formData.type,
          points: formData.points,
          order: formData.order
        });

        if (formData.type !== 'ShortAnswer') {
          for (const c of formData.choices) {
            if (c._id) {
              await api.put(`/choices/${c._id}`, { text: c.text, isCorrect: c.isCorrect });
            } else {
              await api.post('/choices/ajouter', {
                question: editingQuestionId,
                text: c.text,
                isCorrect: c.isCorrect
              });
            }
          }
        }
      } else {
        await api.post(`/questions/${quizId}/questions`, {
          statement: formData.statement,
          type: formData.type,
          points: formData.points,
          order: formData.order,
          choices: formData.type === 'ShortAnswer' ? [] : formData.choices
        });
      }

      setShowModal(false);
      fetchQuestionsData();
    } catch (err) {
      console.error('Error saving question:', err);
      alert('Error occurred while saving.');
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/questions/${qId}`);
      fetchQuestionsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChoice = async (choiceId) => {
    if (!window.confirm('Are you sure you want to delete this choice?')) return;
    try {
      await api.delete(`/choices/${choiceId}`);
      fetchQuestionsData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.statement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isDark ? 'bg-[#0B132B] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}>
        <div>
          <button
            onClick={() => navigate('/teacher/quizzes')}
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 mb-1 block"
          >
            ← Back to Quizzes
          </button>
          <h2 className="text-xl font-bold">Manage Questions</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`px-4 py-2 rounded-xl text-sm border focus:outline-none ${
              isDark ? 'bg-[#060B19] border-slate-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 focus:border-blue-500'
            }`}
          />
          <button
            onClick={openCreateModal}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-md shadow-blue-600/20"
          >
            Add Question
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading...</div>
      ) : filteredQuestions.length === 0 ? (
        <div className={`p-8 text-center rounded-2xl border ${
          isDark ? 'bg-[#0B132B] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          No questions found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <QuestionItem
              key={q._id}
              q={q}
              index={idx}
              choices={choicesMap[q._id] || []}
              isDark={isDark}
              onEdit={openEditModal}
              onDeleteQuestion={handleDeleteQuestion}
              onDeleteChoice={handleDeleteChoice}
            />
          ))}
        </div>
      )}

      <QuestionModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveQuestion}
        formData={formData}
        setFormData={setFormData}
        editingQuestionId={editingQuestionId}
        isDark={isDark}
      />
    </div>
  );
}