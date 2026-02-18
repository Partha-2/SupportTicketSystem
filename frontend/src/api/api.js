import axios from 'axios';

const api = axios.create({
    baseURL: '/api/tickets/',
});

export const ticketService = {
    getAll: (params) => api.get('/', { params }),
    getStats: () => api.get('/stats/'),
    create: (data) => api.post('/', data),
    patch: (id, data) => api.patch(`/${id}/`, data),
    classify: (description) => api.post('/classify/', { description }),
};

export default api;
