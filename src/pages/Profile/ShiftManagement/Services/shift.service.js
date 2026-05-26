import { get, patch, post, put, remove } from "../../../../config/api/api.service";

const BASE = "video-kyc/agent-shift";

export const getShiftList = (params) => {
    return get(`${BASE}/list`, params);
};

export const createShift = (data) => {
    return post(`${BASE}/create`, data);
};

export const updateShift = (id, data) => {
    return put(`${BASE}/${id}`, data);
};

export const getShiftDetail = (id) => {
    return get(`${BASE}/${id}`);
};

export const setDefaultShift = (id) => {
    return patch(`${BASE}/set-default/${id}`);
};

export const deleteShift = (id) => {
    return remove(`${BASE}/${id}`);
};

export const UpdateShift = (id, data) => {
    return patch(`${BASE}/${id}`, data);
};
