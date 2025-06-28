import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8080";

const Api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },

});

Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add it as a Bearer token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default Api;