import api from '../config/api';

export const libraryModel = {
  claim: (appId) => api.post(`/store/library/${appId}`),
  getMine: () => api.get('/store/library'),
  check: (appId) => api.get(`/store/library/check/${appId}`),
  download: (appId) => api.get(`/store/download/${appId}`),
};
