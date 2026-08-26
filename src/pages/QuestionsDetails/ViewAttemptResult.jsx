import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ViewAttemptResult() {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const { theme } = useAuth();
  const isDark = theme === 'dark';

  const [attemptData, setAttemptData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/attempts/${attemptId}`);
        if (res.data?.success) {
          setAttemptData(res.data);
        }
      } catch (err) {
        console.error("Erreur récuperation attempt:", err);
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) fetchAttemptDetails();
  }, [attemptId]);

  if (loading) return <div className="p-8 text-center">Chargement des résultats...</div>;
  if (!attemptData) return <div className="p-8 text-center text-red-500">Résultat introuvable.</div>;

  const { attempt, answers } = attemptData;

  return (
    <div className={`max-w-3xl mx-auto p-8 rounded-3xl border space-y-6 ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'
    }`}>
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold">{attempt?.quiz?.title || 'Détails du Quiz'}</h1>
          <p className="text-xs text-slate-400">Passe le: {new Date(attempt?.submittedAt).toLocaleString()}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-blue-500">{attempt?.score} pts</span>
          <p className="text-xs text-slate-400">Durée: {attempt?.duration} sec</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Récapitulatif des questions:</h3>
        {answers?.map((ans, idx) => {
          const isCorrect = ans.isCorrect;
          const userChoice = ans.selectedChoice?.text || ans.textAnswer || "Aucune réponse";

          return (
            <div 
              key={ans._id || idx} 
              className={`p-4 rounded-2xl border ${
                isCorrect ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <p className="font-semibold text-sm">{idx + 1}. {ans.question?.statement}</p>
                <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  isCorrect ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'
                }`}>
                  {isCorrect ? `+${ans.pointsEarned} pts` : '0 pt'}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Votre réponse: </span> 
                {userChoice}
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => navigate(-1)}
        className="w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-800 font-medium transition"
      >
        Retour
      </button>
    </div>
  );
}