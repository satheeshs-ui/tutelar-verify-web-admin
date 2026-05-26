import api from "./axiosInstance";

export const get = (url, params) => api.get(url, { params });
export const post = (url, data) => api.post(url, data);
export const patch = (url, data) => api.patch(url, data);
export const put = (url, data) => api.put(url, data);
export const remove = (url, data) => api.delete(url, { data });

// Upload
export const upload = (url, formData, onProgress) =>
    api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => onProgress(Math.round((e.loaded * 100) / e.total)),
    });
