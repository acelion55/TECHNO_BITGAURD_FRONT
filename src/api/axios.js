import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true   // send httpOnly cookies automatically
});

// Auto-refresh interceptor: if access token expired, call /refresh then retry
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    // Only attempt refresh for TOKEN_EXPIRED, not for regular 401s (like /auth/me on first load)
    if (
      err.response?.status === 401 &&
      err.response?.data?.code === 'TOKEN_EXPIRED' &&
      !original._retry &&
      !original.url?.includes('/auth/')
    ) {
      original._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(original);
      } catch {
        // Refresh failed — redirect to login only if user was logged in
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(err);
  }
);

export default api;
