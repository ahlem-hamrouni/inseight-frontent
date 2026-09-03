import React from 'react';

export default function CourseCard({
  course,
  isDark,
  user,
  isEnrolled,
  handleOpenEdit,
  handleDelete,
  handleEnroll,
  navigate,
}) {
  const courseId = String(course._id || course.id);
  const isManagement = user?.role === 'teacher' || user?.role === 'admin';

  const isCompleted = course.isCompleted || course.enrollmentStatus === 'completed';

  return (
    <div
      className={`group flex flex-col rounded-3xl overflow-hidden border shadow-sm transition hover:shadow-md ${
        isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900'
      }`}
    >
      <div 
        onClick={() => {
          if (isManagement) {
            navigate(`/${user?.role}/courses/${courseId}`);
          }
        }}
        className={`h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-900 ${
          isManagement ? 'cursor-pointer' : 'cursor-default'
        }`}
      >
        <img
          src={
            course.image && course.image.startsWith('http')
              ? course.image
              : 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80'
          }
          alt={course.title || course.titre || 'Course image'}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-snug line-clamp-1 flex-1">
              {course.title || course.titre || 'Untitled'}
            </h3>

            {user?.role !== 'student' ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEdit(course)}
                  className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(courseId)}
                  className="text-xs text-red-500 hover:text-red-400 font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-end shrink-0">
               
                {isCompleted ? (
                  <>
                    <button
                      onClick={() => navigate(`/${user?.role}/courses/${courseId}`)}
                      className="text-xs text-emerald-600 hover:text-emerald-500 font-medium transition-colors"
                    >
                      Review
                    </button>
                    <span className="text-[10px] text-emerald-500 mt-0.5 font-bold">
                      Completed ✓
                    </span>
                  </>
                ) : isEnrolled ? (
                  <>
                    <button
                      onClick={() => navigate(`/${user?.role}/courses/${courseId}`)}
                      className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-colors"
                    >
                      Continue
                    </button>
                    <span className="text-[10px] text-blue-400 mt-0.5 font-medium">
                      Enrolled
                    </span>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEnroll(course)}
                      className="text-xs text-emerald-500 hover:text-emerald-400 font-medium transition-colors"
                    >
                      Enroll
                    </button>
                    <span className="text-[10px] text-emerald-500/80 mt-0.5 font-medium">
                      Available
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          <p className={`mt-2 text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {course.description || 'No description available for this course.'}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            {typeof course.level === 'object' && course.level !== null
        ? course.level.name || course.level.enum || JSON.stringify(course.level)
        : course.level}
          </span>
          <span className="font-medium bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
            {course.duration || '1 month'}
          </span>
        </div>
      </div>
    </div>
  );
}