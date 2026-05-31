import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Derive the backend origin from BASE_URL for preview/download links
// e.g. "https://google-drive-jtkg.onrender.com/api" → "https://google-drive-jtkg.onrender.com"
const BACKEND_ORIGIN = BASE_URL.replace(/\/api\/?$/, '') || '';

export const getFiles = (view = 'all') =>
  api.get('/files', { params: { view } });

export const uploadFile = (formData, onUploadProgress) =>
  api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const starFile = (id) => api.patch(`/files/${id}/star`);

export const trashFile = (id) => api.patch(`/files/${id}/trash`);

export const restoreFile = (id) => api.patch(`/files/${id}/restore`);

export const deleteFile = (id) => api.delete(`/files/${id}`);

export const downloadFile = (filename) => {
  const url = `${BASE_URL}/files/download/${filename}`;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getPreviewUrl = (filename) =>
  `${BACKEND_ORIGIN}/uploads/${filename}`;
