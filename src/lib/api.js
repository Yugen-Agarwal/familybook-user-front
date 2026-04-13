import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const viewerApi = {
  login: (data) => api.post('/viewer/login', data),
  create: (data) => api.post('/viewer/credentials', data),
  list: () => api.get('/viewer/credentials'),
  revoke: (id) => api.delete(`/viewer/credentials/${id}`),
};

export const dataApi = {
  getAll: (params) => api.get('/data', { params }),
  create: (data) => api.post('/data', data),
  update: (id, data) => api.put(`/data/${id}`, data),
  remove: (id) => api.delete(`/data/${id}`),
};

export const formsApi = {
  getAll: () => api.get('/forms'),
  create: (data) => api.post('/forms', data),
  update: (id, data) => api.put(`/forms/${id}`, data),
  remove: (id) => api.delete(`/forms/${id}`),
};
