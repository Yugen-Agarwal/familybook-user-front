import api from './axios';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyLoginOtp: (data) => api.post('/auth/verify-login-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  resendOtp: (data) => api.post('/auth/resend-otp', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const viewerApi = {
  login: (data) => api.post('/viewer/login', data),
  create: (data) => api.post('/viewer/credentials', data),
  list: () => api.get('/viewer/credentials'),
  update: (id, data) => api.put(`/viewer/credentials/${id}`, data),
  revoke: (id) => api.delete(`/viewer/credentials/${id}`),
  changeType: (id, type) => api.patch(`/viewer/credentials/${id}/type`, { type }),
  toggle: (id) => api.patch(`/viewer/credentials/${id}/toggle`),
};

export const dataApi = {
  getAll: (params) => api.get('/data', { params }),
  create: (data) => api.post('/data', data),
  update: (id, data) => api.put(`/data/${id}`, data),
  remove: (id) => api.delete(`/data/${id}`),
  getActivity: (params) => api.get('/data/activity', { params }),
};

export const formsApi = {
  getAll:  ()           => api.get('/forms'),
  create:  (data)       => api.post('/forms', data),
  update:  (id, data)   => api.put(`/forms/${id}`, data),
  remove:  (id)         => api.delete(`/forms/${id}`),
  // User personal forms
  getMy:        ()          => api.get('/forms/my'),
  createMy:     (data)      => api.post('/forms/my', data),
  updateMy:     (id, data)  => api.put(`/forms/my/${id}`, data),
  removeMy:     (id)        => api.delete(`/forms/my/${id}`),
};
