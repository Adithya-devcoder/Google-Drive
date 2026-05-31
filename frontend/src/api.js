import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
});

export const getFiles = () => api.get('/files');

export const uploadFile = (formData, onUploadProgress) =>
  api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const downloadFile = (filename) => {
  const url = `${BASE_URL}/files/download/${filename}`;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const deleteFile = (id) => api.delete(`/files/${id}`);
