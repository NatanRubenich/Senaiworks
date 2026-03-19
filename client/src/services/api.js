import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('senaiworks_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('senaiworks_token');
      localStorage.removeItem('senaiworks_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  getSecurityQuestion: (email) => api.get(`/auth/security-question?email=${email}`),
  verifySecurity: (data) => api.post('/auth/verify-security', data),
};

// ============ USER ============
export const userAPI = {
  updateIdentity: (data) => api.put('/users/identity', data),
  updateTax: (data) => api.put('/users/tax', data),
  updateBank: (data) => api.put('/users/bank', data),
  payFee: () => api.post('/users/pay-fee'),
};

// ============ GAMES ============
export const gameAPI = {
  create: (data) => api.post('/games', data),
  getMyGames: () => api.get('/games'),
  getGame: (id) => api.get(`/games/${id}`),
  updateBasicData: (id, data) => api.put(`/games/${id}/basic-data`, data),
  updateDescription: (id, data) => api.put(`/games/${id}/description`, data),
  updateStoreGraphics: (id, data) => api.put(`/games/${id}/store-graphics`, data),
  updateScreenshots: (id, data) => api.put(`/games/${id}/screenshots`, data),
  addScreenshot: (id, data) => api.post(`/games/${id}/screenshots/add`, data),
  deleteScreenshot: (id, ssId) => api.delete(`/games/${id}/screenshots/${ssId}`),
  updateLibraryAssets: (id, data) => api.put(`/games/${id}/library-assets`, data),
  updateTrailers: (id, data) => api.put(`/games/${id}/trailers`, data),
  addTrailer: (id, data) => api.post(`/games/${id}/trailers/add`, data),
  deleteTrailer: (id, tId) => api.delete(`/games/${id}/trailers/${tId}`),
  publishStore: (id) => api.post(`/games/${id}/publish-store`),
  updateAppConfig: (id, data) => api.put(`/games/${id}/app-config`, data),
  updateBuildUpload: (id, data) => api.put(`/games/${id}/build-upload`, data),
  updateDepots: (id, data) => api.put(`/games/${id}/depots`, data),
  updateInstallConfig: (id, data) => api.put(`/games/${id}/install-config`, data),
  publishConfig: (id) => api.post(`/games/${id}/publish-config`),
  uploadImage: (id, formData) => api.post(`/games/${id}/upload-image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadVideo: (id, formData) => api.post(`/games/${id}/upload-video`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadBuild: (id, formData) => api.post(`/games/${id}/upload-build`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// ============ ADMIN ============
export const adminAPI = {
  getGames: (params) => api.get('/admin/games', { params }),
  getGameDetails: (id) => api.get(`/admin/games/${id}`),
  approveGame: (id) => api.post(`/admin/games/${id}/approve`),
  rejectGame: (id, reason) => api.post(`/admin/games/${id}/reject`, { reason }),
};

export default api;
