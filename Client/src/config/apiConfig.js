// apiConfig.js

const API_BASE_URL = "http://localhost:8000/api"; // à ajuster selon ton backend

const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login/`,
  REGISTER: `${API_BASE_URL}/register/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  GET_USER_DATA: `${API_BASE_URL}/me/`,
};

export default API_ENDPOINTS;
