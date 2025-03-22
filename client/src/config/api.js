// API configuration for different environments
const isDevelopment = import.meta.env.DEV;

// For development, use local API
// For production (GitHub Pages), use an external hosted API
const API_BASE_URL = isDevelopment 
  ? '' // Empty for using Vite's proxy
  : 'https://your-backend-api-url.com'; // Replace with your hosted backend API URL

export default API_BASE_URL; 