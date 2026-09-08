import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TakeQuiz() {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [choicesMap, setChoicesMap] = useState({}); 
  const [answers, setAnswers] = useState({}); 
  const [startedAt] = useState(new Date()); 

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [timeLeft, setTimeLeft] = useState(null); 
  const [resultSummary, setResultSummary] = useState(null); 

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true); 
        const quizRes = await api.get(`/quizzes/${quizId}`);
        const fetchedQuiz = quizRes.data?.quiz || quizRes.data;
        setQuiz(fetchedQuiz);

        if (fetchedQuiz?.duration) {
          setTimeLeft(fetchedQuiz.duration * 60);
        }

        const qRes = await api.get(`/questions/${quizId}`);
        const questionsList = Array.isArray(qRes.data) ? qRes.data : [];
        setQuestions(questionsList);

        const choicesObj = {};
        for (const q of questionsList) {
          try {
            const cRes = await api.get(`/choices/${q._id}`);
            choicesObj[q._id] = Array.isArray(cRes.data) ? cRes.data : [];
          } catch (cErr) {
            console.error(`Error loading choices for question ${q._id}:`, cErr);
            choicesObj[q._id] = [];
          }
        }
        setChoicesMap(choicesObj);

      } catch (err) {
        console.error('Error loading quiz data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchQuizData();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || resultSummary) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAuto(); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, resultSummary]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectChoice = (questionId, choiceId) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], selectedChoice: choiceId, textAnswer: '' }
    }));
  };

  const handleTextAnswerChange = (questionId, text) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { ...prev[questionId], selectedChoice: null, textAnswer: text }
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAuto = () => {
    alert('Time is up! Your quiz will be submitted automatically.');
    executeSubmit();
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    executeSubmit();
  };

  const executeSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => {
        const userAns = answers[q._id] || {};
        return {
          questionId: q._id,
          selectedChoiceId: userAns.selectedChoice || null,
          textAnswer: userAns.textAnswer || ''
        };
      });

      const res = await api.post(`/attempts/submit/${quizId}`, {
        startedAt,
        answers: formattedAnswers
      });
      if (res.data?.attempt?._id) {
      navigate(`/student/attempts/${res.data.attempt._id}`);
      }

      if (res.data?.isEmpty) {
        alert('Aucune réponse enregistrée.');
        navigate('/student/quizzes');
        return;
      }

      setResultSummary(res.data);
    } catch (err) {
      console.error('Error during submission:', err);
      alert('Error submitting your answers.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className={isDark ? 'text-white' : 'text-slate-800'}>Loading quiz...</span>
      </div>
    );
  }

  
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;
  const choices = choicesMap[currentQuestion._id] || [];
  const currentAns = answers[currentQuestion._id] || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          My Quizzes <span className="text-sm font-normal text-slate-400">· Test yourself</span>
        </h1>
      </div>

      <div className={`w-full rounded-3xl p-8 border shadow-sm transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Quiz: {quiz?.title || 'Untitled'}
          </h2>

          {timeLeft !== null && (
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${
              timeLeft < 60 ? 'bg-rose-500/10 text-rose-500 animate-pulse' : 'bg-amber-500/10 text-amber-500'
            }`}>
              ⏱️ Time remaining: {formatTime(timeLeft)}
            </div>
          )}
          <button
            onClick={() => navigate('/student/quizzes')}
            className="text-xs font-semibold text-slate-400 hover:text-slate-500"
          >
            Leave
          </button>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="font-semibold text-base mb-1">
          Question {currentIndex + 1}/{totalQuestions}
          <span className="ml-3 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500">
             {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
          </span>
        </div>

        <div className="text-base font-medium mb-6">
          {currentQuestion.statement}
        </div>        

        <div className="space-y-3 mb-10">
          {(currentQuestion.type === 'MCQ' || currentQuestion.type === 'TrueFalse') && choices.map((c) => {
            const isSelected = currentAns.selectedChoice === c._id;
            return (
              <button
                key={c._id}
                type="button"
                onClick={() => handleSelectChoice(currentQuestion._id, c._id)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 text-blue-600 font-semibold'
                    : isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {c.text}
              </button>
            );
          })}
          {currentQuestion.type === 'ShortAnswer' && (
            <textarea
              rows={4}
              placeholder="Type your answer here..."
              value={currentAns.textAnswer || ''}
              onChange={(e) => handleTextAnswerChange(currentQuestion._id, e.target.value)}
              className={`w-full p-4 rounded-xl border text-sm focus:outline-none transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-500'
              }`}
            />
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`px-6 py-2.5 rounded-2xl text-sm font-medium transition ${
              currentIndex === 0
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-blue-50 dark:bg-slate-800 text-blue-600 hover:bg-blue-100 dark:hover:bg-slate-700'
            }`}
          >
            Previous
          </button>
          {currentIndex === totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-2xl text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Finish & Submit'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-2xl text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}