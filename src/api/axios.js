import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true   // send httpOnly cookies automatically
});

// Auto-refresh interceptor: if 401 on any protected route, try /refresh then retry
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const is401    = err.response?.status === 401;
    const isAuthRoute = original.url?.includes('/auth/');

    if (is401 && !isAuthRoute && !original._retry) {
      original._retry = true;
      try {
        await api.post('/auth/refresh');
        return api(original);
      } catch {
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(err);
  }
);

export default api;
