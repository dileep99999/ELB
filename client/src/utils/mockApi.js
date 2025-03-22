/**
 * Mock API utility for GitHub Pages deployment
 * 
 * This file provides mock responses for API calls when the backend is not available.
 * It intercepts axios requests and returns predefined responses based on the URL.
 */

import axios from 'axios';

// Sample bookings data
const sampleBookings = [
  {
    name: "John Doe",
    psNumber: "PS12345",
    deptCode: "IT",
    bookingDate: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  },
  {
    name: "Jane Smith",
    psNumber: "PS54321",
    deptCode: "HR",
    bookingDate: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  },
  {
    name: "Bob Johnson",
    psNumber: "PS67890",
    deptCode: "Finance",
    bookingDate: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString()
  }
];

// Sample stats data
const sampleStats = {
  totalBookings: 156,
  todayBookings: 23,
  departments: [
    { _id: "IT", count: 67 },
    { _id: "HR", count: 42 },
    { _id: "Finance", count: 25 },
    { _id: "Marketing", count: 22 }
  ]
};

// Setup axios interceptor for mock responses
const setupMockApi = () => {
  // Add a response interceptor
  axios.interceptors.response.use(
    response => response, // Return successful responses as is
    error => {
      // If there's no response or the status is not 404, just reject the promise
      if (!error.response || error.response.status !== 404) {
        return Promise.reject(error);
      }

      // Get the request URL
      const url = error.config.url;
      const method = error.config.method;

      console.log(`[Mock API] Intercepting ${method.toUpperCase()} request to: ${url}`);

      // Determine the appropriate mock response based on the URL
      if (url.includes('/api/bookings') && !url.includes('/stats')) {
        if (method === 'post') {
          // Handle booking creation
          return Promise.resolve({
            data: { 
              message: "Booking created successfully",
              booking: {
                ...JSON.parse(error.config.data),
                _id: "mock-booking-id-" + Date.now(),
                timestamp: new Date().toISOString()
              }
            }
          });
        } else {
          // Handle bookings fetch
          return Promise.resolve({
            data: {
              bookings: sampleBookings
            }
          });
        }
      } else if (url.includes('/api/bookings/stats')) {
        // Handle stats fetch
        return Promise.resolve({
          data: sampleStats
        });
      } else if (url.includes('/api/auth/login')) {
        // Handle login
        const requestData = JSON.parse(error.config.data);
        
        // Simple check for demo credentials
        if (requestData.username === 'admin' && requestData.password === 'admin') {
          return Promise.resolve({
            data: {
              token: "mock-jwt-token-" + Date.now(),
              user: {
                _id: "mock-user-id",
                username: requestData.username
              }
            }
          });
        } else {
          return Promise.reject({
            response: {
              status: 401,
              data: { message: "Invalid credentials" }
            }
          });
        }
      }

      // If no matching mock response, reject with original error
      return Promise.reject(error);
    }
  );
};

export default setupMockApi; 