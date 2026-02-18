import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${apiUrl}/api/tickets/`,
});

export const ticketService = {
    getAll: (params) => api.get('/', { params }),
    getStats: () => api.get('/stats/'),
    create: (data) => api.post('/', data),
    patch: (id, data) => api.patch(`/${id}/`, data),
    classify: (description) => api.post('/classify/', { description }),
};

export default api;
