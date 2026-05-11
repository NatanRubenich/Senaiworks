import api from '../config/api';

export const reviewModel = {
  list: (appId) => api.get(`/store/games/${appId}/reviews`),
  upsert: (appId, payload) => api.post(`/store/games/${appId}/reviews`, payload),
  remove: (appId) => api.delete(`/store/games/${appId}/reviews/mine`),
};
