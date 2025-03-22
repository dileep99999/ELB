// API configuration for different environments
// For development, use local API
// For production (GitHub Pages), use the deployed backend
const isDevelopment = import.meta.env.DEV;

const API_BASE_URL = isDevelopment 
  ? '' // Empty for using Vite's proxy
  : 'https://elbs-backend.onrender.com'; // Replace with your actual deployed backend URL

export default API_BASE_URL; 