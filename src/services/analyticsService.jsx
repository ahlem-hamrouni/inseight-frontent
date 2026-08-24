import  api from '../api/axios';

const get = (path, params) => {
  return api.get(path, { params }).then((response) => response.data);
};

export const getStudentAnalytics = () => get('/analytics/student');
export const getTeacherAnalytics = (courseId) => get(`/analytics/teacher/course/${courseId}`);
export const getAdminAnalytics = (params) => get('/analytics/admin', params);
export const getStudentsByLevel = (params) => get('/analytics/level', params);
export const getStudentsByGroup = (params) => get('/analytics/group', params);
export const getPlatformGrowth = (params) => get('/analytics/platform-growth', params);
  
