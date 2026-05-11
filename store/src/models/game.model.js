import api from '../config/api';

export const gameModel = {
  list: (params = {}) => api.get('/store/games', { params }),
  featured: () => api.get('/store/games/featured'),
  getByAppId: (appId) => api.get(`/store/games/${appId}`),
};
