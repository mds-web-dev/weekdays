/**
 * API Service for communicating with Django REST backend.
 * Uses import.meta.env.VITE_API_URL or defaults to local Django server (http://127.0.0.1:8000).
 */

const RAW_API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
// Sanitize URL by removing trailing slash if present
export const API_BASE_URL = RAW_API_URL.replace(/\/+$/, '');

/**
 * Standard fetch wrapper with timeout and informative error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  // 15-second timeout for normal requests, with cold-start detection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 35000);

  try {
    const startTime = performance.now();
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    const latency = Math.round(performance.now() - startTime);

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return { success: true, latency };
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw {
        status: response.status,
        message: data?.detail || data?.message || `HTTP error! status: ${response.status}`,
        data,
      };
    }

    return { data, latency };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(
        'Request timed out. If using Render free tier, the backend is likely waking up from sleep mode (takes ~30-50s). Please retry in a few moments.'
      );
    }
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error(
        `Unable to connect to backend at ${API_BASE_URL}. Check if Render backend is online and CORS is configured.`
      );
    }
    throw error;
  }
}

export const api = {
  // Health check endpoint
  getHealth: () => request('/api/health/'),

  // Tasks CRUD endpoints
  getTasks: (category = null) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return request(`/api/tasks/${query}`);
  },

  createTask: (taskData) =>
    request('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  updateTask: (id, updates) =>
    request(`/api/tasks/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),

  deleteTask: (id) =>
    request(`/api/tasks/${id}/`, {
      method: 'DELETE',
    }),

  // Seed sample educational tasks
  seedTasks: () =>
    request('/api/seed/', {
      method: 'POST',
    }),
};
