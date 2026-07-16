import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const originalFetch = window.fetch;
window.fetch = async function (resource, config) {
  const token = localStorage.getItem('sdr_jwt_token');
  if (token) {
    config = config || {};
    config.headers = config.headers || {};
    if (config.headers instanceof Headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    } else {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  const response = await originalFetch(resource, config);
  if (response.status === 401 || response.status === 403) {
    if (resource !== '/api/auth/login') {
      localStorage.removeItem('sdr_jwt_token');
      localStorage.removeItem('sdr_user');
      window.location.reload();
    }
  }
  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
