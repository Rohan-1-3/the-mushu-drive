import axios from 'axios';

// Use environment variable for API base URL or fallback to localhost
export const API_BASE = import.meta.env.BACKEND_URL || 'http://localhost:3001/api/v1'

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

// File operations API
export const fileApi = {
    getAllFiles: () => api.get('/files/m/0'),
    getSingleFile: (fileId) => api.get(`/files/m/${fileId}`),
    uploadSingleFile: (formData) => api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    uploadMultipleFiles: (formData) => api.post('/files/upload-multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    renameFile: (fileId, name) => api.put(`/files/m/${fileId}`, { name }),
    deleteFile: (fileId) => api.delete(`/files/m/${fileId}`),
    deleteMultipleFiles: (fileIds) => api.delete('/files/m/delete-multiple', { data: { fileIds } }),
    getDownloadUrl: (fileId) => api.get(`/files/m/${fileId}/download`),
    getPreviewUrl: (fileId) => api.get(`/files/m/${fileId}/download`), // Reuse download endpoint for preview
    downloadFile: (fileId) => api.get(`/files/m/${fileId}/download-file`, { responseType: 'blob' }) // Force download
};

// Folder operations API
export const folderApi = {
    getAllFolders: (parentId = null) => api.get('/folders/f/0', { params: { parentId } }),
    getSingleFolder: (folderId) => api.get(`/folders/f/${folderId}`),
    getFolderContents: (folderId) => api.get(`/folders/f/${folderId}/files`),
    createFolder: (folderName, parentId = null) => api.post('/folders/create', { folderName, parentId }),
    renameFolder: (folderId, folderName) => api.put(`/folders/f/${folderId}`, { folderName }),
    deleteFolder: (folderId, force = false) => api.delete(`/folders/f/${folderId}`, { params: { force } }),
    bulkDeleteFolders: (folderIds, force = false) => api.delete('/folders/bulk-delete', { data: { folderIds, force } })
};

export default api;

