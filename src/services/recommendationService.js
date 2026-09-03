import api from "../api/axios";

export const getRecommendations = (studentId) => {
    return api.get(`/recommendations/student/${studentId}`);
};

export const markRecommendationAsRead = (recommendationId) => {
    return api.put(`/recommendations/${recommendationId}/read`);
};

export const markAllRecommendationsAsRead = (studentId) => {
    return api.put(`/recommendations/read-all`, { studentId });
};