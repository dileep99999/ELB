// API configuration for different environments
const isDevelopment = import.meta.env.DEV;

// For development, use local API
// For production (GitHub Pages), use the hosted backend API
const API_BASE_URL = isDevelopment 
  ? '' // Empty for using Vite's proxy
  : ''; // Empty to use relative paths (will work if hosted together with backend)

export default API_BASE_URL; 