import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Certificates() {
  const { user } = useAuth();
  const [studentName, setStudentName] = useState('');
  const [completedCertificates, setCompletedCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMention = (percentage) => {
    if (percentage == 100 ) return 'Mention Excellent';
        if (percentage >= 90) return 'Mention trés bien';
    if (percentage >= 75) return 'Mention Bien';
    if (percentage >= 50) return 'passable';
    return null;
  };

  useEffect(() => {
    if (user) {
      const fullName = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setStudentName(fullName || 'Student Name');
    }

    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await api.get('/inscriptions/list');
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.inscriptions || []);

        const currentUserId = user?.id || user?._id;

        const completedInscriptions = data.filter(item => {
          const itemStudentId = item.student?._id || item.student;
          const isMyInscription = currentUserId && itemStudentId && itemStudentId.toString() === currentUserId.toString();
          return item.status === 'completed' && isMyInscription;
        });

        const completed = await Promise.all(
          completedInscriptions.map(async (item) => {
            const courseId = item.course?._id || item.course;
            let noteOn20 = 0;

            try {
              const scoreRes = await api.get(`/attempts/course-score/${courseId}`);
              noteOn20 = scoreRes.data?.score ?? 0;
            } catch (err) {
              console.error("Error fetching score for course:", courseId, err);
            }

            const percentageScore = Math.round((noteOn20 / 20) * 100);

            return {
              id: item._id,
              courseTitle: item.course?.title || item.course?.titre || 'Course Title',
              percentageScore: percentageScore,
              mention: getMention(percentageScore),
              date: new Date(item.updatedAt || item.enrolledAt || Date.now()).toLocaleDateString('fr-FR')
            };
          })
        );

        const validCertificates = completed.filter(cert => cert.percentageScore >= 50);

        setCompletedCertificates(validCertificates);
      } catch (err) {
        console.error("Error loading certificates:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCertificates();
    }
  }, [user]);

  if (loading) {
    return <div className="p-4 text-center text-slate-500 dark:text-slate-400">Loading certificates...</div>;
  }

  return (
    <div className="p-2 sm:p-4 text-slate-800 dark:text-slate-100 space-y-4">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-certificate, .printable-certificate * {
            visibility: visible;
          }
          .printable-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0 no-print">Your Certificates</h2>

      {completedCertificates.length === 0 ? (
        <div className="p-8 border border-slate-200 dark:border-slate-800 rounded-2xl text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 shadow-sm">
          No completed certificates found yet. You must complete a course with at least 50% score.
        </div>
      ) : (
        <div className="space-y-6">
          {completedCertificates.map((cert, index) => (
            <div key={cert.id || index} className="flex flex-col items-center">
              <div className="printable-certificate relative w-full max-w-4xl h-[340px] sm:h-[380px] rounded-2xl overflow-hidden shadow-md border border-amber-300 dark:border-amber-500/30 bg-white">
                <img
                  src="/certif.png"
                  alt="Certificate Template"
                  className="w-full h-full object-fill block select-none"
                />

                <div className="absolute top-[75%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center text-center space-y-1 px-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-[#3B2F15] capitalize leading-tight">
                    {studentName}
                  </h3>

                  <p className="text-xs text-[#7A6A44] font-medium leading-none">
                    has successfully completed
                  </p>

                  <h4 className="text-lg sm:text-xl font-bold text-[#3B2F15] leading-tight pt-1">
                    {cert.courseTitle}
                  </h4>

                  <div className="pt-1 text-xs text-[#6B5B35] font-medium leading-tight space-y-0.5">
                    <p>Score: <span className="font-bold">{cert.percentageScore}%</span> {cert.mention && <span className="italic">({cert.mention})</span>}</p>
                    <p>Date: <span className="font-bold">{cert.date}</span></p>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="no-print mt-3 px-5 py-2 bg-[#2563EB] hover:bg-blue-600 text-white font-medium text-xs rounded-xl shadow-md flex items-center space-x-2 transition"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                    </svg>
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}