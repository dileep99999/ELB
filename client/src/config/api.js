// API configuration for different environments
// For development, use local API
// For production (GitHub Pages), use the deployed backend
const isDevelopment = import.meta.env.DEV;

const API_BASE_URL = isDevelopment 
  ? '' // Empty for using Vite's proxy
  : 'https://elb.onrender.com'; // Correct deployed backend URL

export default API_BASE_URL; 