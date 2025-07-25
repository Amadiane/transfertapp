// apiConfig.js

const API_BASE_URL = "http://localhost:8000/api"; 

const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login/`,
  REGISTER: `${API_BASE_URL}/register/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  GET_USER_DATA: `${API_BASE_URL}/me/`,
  LOGOUT: `${API_BASE_URL}/logout/`,
};

export default API_ENDPOINTS;
