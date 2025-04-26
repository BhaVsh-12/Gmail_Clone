import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URI || "http://localhost:8080";

const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

export default Api;