import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const originalFetch = window.fetch;
const BACKEND_RENDER_URL = 'https://leadscaner.onrender.com';

window.fetch = async function (resource, config) {
  const token = localStorage.getItem('sdr_jwt_token') || localStorage.getItem('token');
  config = config || {};
  config.headers = config.headers || {};

  // Inject token automatically for API calls
  if (token) {
    if (config.headers instanceof Headers) {
      if (!config.headers.has('Authorization')) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } else if (!config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await originalFetch(resource, config);
  } catch (netErr) {
    // If request to local proxy failed and it is an /api call, try direct Render backend!
    if (typeof resource === 'string' && resource.startsWith('/api/')) {
      try {
        console.warn(`[Proxy Fallback] Tentando conexão direta com backend Render para ${resource}...`);
        const directUrl = `${BACKEND_RENDER_URL}${resource}`;
        response = await originalFetch(directUrl, config);
      } catch (fallbackErr) {
        throw netErr;
      }
    } else {
      throw netErr;
    }
  }

  // If Vercel returns 429 Too Many Requests, 502 Bad Gateway, 503 or 504 Gateway Timeout, retry directly on Render
  if (response && [429, 502, 503, 504].includes(response.status) && typeof resource === 'string' && resource.startsWith('/api/')) {
    try {
      console.warn(`[Proxy Fallback ${response.status}] Tentando reconectar direto no Render: ${resource}...`);
      const directUrl = `${BACKEND_RENDER_URL}${resource}`;
      const retryResponse = await originalFetch(directUrl, config);
      if (retryResponse.ok || retryResponse.status < 400) {
        return retryResponse;
      }
    } catch (e) {
      // Continue with original response if direct also fails
    }
  }

  // Handle genuine unauthenticated sessions (only for protected endpoints, not login/register/limits)
  if (response && response.status === 401) {
    const urlStr = typeof resource === 'string' ? resource : (resource?.url || '');
    const isAuthRoute = urlStr.includes('/api/auth/') || urlStr.includes('/login') || urlStr.includes('/register');
    if (!isAuthRoute && token) {
      console.warn('[Auth] Sessão inválida ou expirada detectada.');
      // Do not hard reload to avoid disrupting current form fills
    }
  }

  return response;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
