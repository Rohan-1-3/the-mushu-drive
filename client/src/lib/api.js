import axios from 'axios';

export const API_BASE = 'http://localhost:3001/api/v1'

export const api = axios.create({
	baseURL: API_BASE,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' }
});

// Interceptor to unwrap data / normalize errors
api.interceptors.response.use(
	(res) => res.data,
	(error) => {
		const errRes = error.response;
		if (errRes?.data) {
			const messages = [];
			const data = errRes.data;
			if (Array.isArray(data.err)) {
				data.err.forEach(e => {
					if (typeof e === 'string') messages.push(e);
					else if (e?.msg) messages.push(e.msg);
					else if (e?.message) messages.push(e.message);
				});
			}
			if (data.message && messages.length === 0) messages.push(data.message);
			error.message = messages.join('\n') || error.message;
		}
		return Promise.reject(error);
	}
);

// Auth specific calls (expand later)
export const authApi = {
    authenticate: () => api.post('/user/authenticateUser'),
	login: ({ username, password }) => api.post('/user/login', { username, password }),
    logout: () => api.post('/user/logout'),
    register: ({ username, password, firstname, lastname }) => api.post('/user/signup', { username, password, firstname, lastname }),
    getCurrentUser: () => api.get('/user/me')
};

export default api;

