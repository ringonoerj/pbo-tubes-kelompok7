import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Menggunakan proxy Vite untuk menghindari CORS issue
  headers: { 
    'Content-Type': 'application/json' 
  }
});

// Interceptor untuk menyisipkan header session karyawan
api.interceptors.request.use((config) => {
  const karyawanStr = localStorage.getItem('karyawan');
  if (karyawanStr) {
    try {
      const karyawan = JSON.parse(karyawanStr);
      if (karyawan && karyawan.id) {
        config.headers['X-Karyawan-Id'] = karyawan.id;
      }
    } catch (e) {
      console.error('Error parsing karyawan session:', e);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
