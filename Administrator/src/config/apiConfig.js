// apiConfig.js

const API_BASE_URL = "http://localhost:8000/api"; 


const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login/`,
  REGISTER: `${API_BASE_URL}/register/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  GET_USER_DATA: `${API_BASE_URL}/me/`,
  LOGOUT: `${API_BASE_URL}/logout/`,
  TRANSACTIONS: `${API_BASE_URL}/transactions/`,           // Pour POST et GET via DRF generic view
  LIST_TRANSACTIONS: `${API_BASE_URL}/transactions/list/`, // Pour la fonction list_transactions
  CREATE_TRANSACTION: `${API_BASE_URL}/transactions/create/`, // Si besoin d’un endpoint séparé

};

export default API_ENDPOINTS;
