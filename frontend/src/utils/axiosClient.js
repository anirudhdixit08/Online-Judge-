// import axios from 'axios';

// const axiosClient = axios.create({
//     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
//     withCredentials : true,
//     headers: {
//         'Content-Type' : 'application/json'
//     }
//   });

// export default axiosClient;


// import axios from 'axios';

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
//   withCredentials: true,   // send cookies/session
//   timeout: 20000,
// });

// // ----- OPTIONAL: Set JSON content-type ONLY for plain objects -----
// axiosClient.interceptors.request.use((config) => {
//   // If the data is FormData → DO NOT set Content-Type
//   if (config.data instanceof FormData) {
//     return config; // browser automatically sets multipart/form-data with boundary
//   }

//   // For other requests, set JSON header
//   config.headers['Content-Type'] = 'application/json';
//   return config;
// });

// export default axiosClient;

// src/utils/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,   // send cookies for auth
  timeout: 20000,
});

// Request interceptor: don't force Content-Type for FormData
axiosClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Let browser set Content-Type (multipart/form-data; boundary=...)
    if (config.headers && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }
    return config;
  }

  // Default JSON content-type for non-FormData requests
  config.headers = config.headers || {};
  if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
}, (error) => Promise.reject(error));

// Optional: simple response logging for debug
axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    // Useful info when debugging 401/403/Network errors
    /* eslint-disable no-console */
    console.error('Axios response error:', err?.response?.status, err?.response?.data);
    /* eslint-enable no-console */
    return Promise.reject(err);
  }
);

export default axiosClient;

