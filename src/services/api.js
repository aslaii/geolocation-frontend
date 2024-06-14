import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const registerUser = (data) => api.post('/api/register', data);
export const loginUser = (data) => api.post('/api/login', data);
export const getGeoInfo = (ip) => axios.get(`https://ipinfo.io/${ip}/geo`);
export const getUser = () => api.get('/api/user');
export const getSearchHistories = () => api.get('/api/search-histories');
export const saveSearchHistory = (data) => api.post('/api/search-histories', data);
export const deleteSearchHistories = (ids) => api.delete('/api/search-histories', { data: { ids } });
