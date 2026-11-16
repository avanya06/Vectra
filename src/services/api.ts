import axios from 'axios';
import { SmartHubResponse, UserContext } from '../types/index';

export const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://vectra-tve2.onrender.com/api');

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and redirect to login if necessary
      // We shouldn't use window.location here directly if possible, but for simplicity:
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const api = {
  auth: {
    login: async (credentials: any) => axiosInstance.post('/auth/login', credentials),
    register: async (data: any) => axiosInstance.post('/auth/register', data),
    getProfile: async () => axiosInstance.get('/auth/profile'),
    updateProfile: async (data: { displayName?: string; bio?: string; avatarUrl?: string }) => 
      axiosInstance.put('/auth/profile', data),
  },

  links: {
    getSmartLinks: async (username: string, context: UserContext): Promise<SmartHubResponse> => {
      const params = new URLSearchParams({
        device: context.device,
        timeOfDay: context.timeOfDay,
        region: context.region
      });
      
      const response = await axiosInstance.get(`/links/public/${username}?${params}`);
      
      const data = response.data;
      const links = data.links || (Array.isArray(data) ? data : []);
      const profile = data.profile;

      return {
        links: links,
        profile: profile,
        appliedRules: links.flatMap((l: any) => l.appliedRules || []), 
        context
      };
    },

    getMyLinks: async () => axiosInstance.get('/links'),
    createLink: async (data: any) => axiosInstance.post('/links', data),
    updateLink: async (id: string, data: any) => axiosInstance.put(`/links/${id}`, data),
    deleteLink: async (id: string) => axiosInstance.delete(`/links/${id}`),
  },
  shorten: {
    create: async (originalUrl: string) => {
        // We need to call the root /s endpoint, not /api/s
        const baseUrl = API_URL.startsWith('/') ? window.location.origin : API_URL.replace(/\/api\/?$/, ''); 
        return axiosInstance.post('/s', { originalUrl }, { baseURL: baseUrl });
    }
  },
  analytics: {
    track: async (data: { linkId: string, deviceType: string, region: string, referrer?: string }) => 
      axiosInstance.post('/analytics/track', data),
    getStats: async () => axiosInstance.get('/analytics/dashboard')
  }
};


