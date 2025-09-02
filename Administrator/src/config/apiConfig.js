// apiConfig.js

// const API_BASE_URL = "http://localhost:8000/api"; 
const API_BASE_URL = "http://102.164.134.4:8000/api"; 
// const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";


const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login/`,
  REGISTER: `${API_BASE_URL}/register/`,
  REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  GET_USER_DATA: `${API_BASE_URL}/me/`,
  USERS: `${API_BASE_URL}/users/`,
  LIST_USERS: `${API_BASE_URL}/users/`, 
  LOGOUT: `${API_BASE_URL}/logout/`,
  // Transactions
  TRANSACTIONS: `${API_BASE_URL}/transactions/`,              // GET (list) & POST (create)
  DISTRIBUER_TRANSACTION: (id) => `${API_BASE_URL}/transactions/${id}/distribuer/`,      // PATCH distribuer
  ANNULER_DISTRIBUTION: (id) => `${API_BASE_URL}/transactions/${id}/annuler_distribution/`, // PATCH annuler distribution
  UPDATE_TRANSACTION: (id) => `${API_BASE_URL}/transactions/${id}/`,   // PUT/PATCH update transaction
  DELETE_TRANSACTION: (id) => `${API_BASE_URL}/transactions/${id}/`,   // DELETE transaction
  TRANSACTION_REPORT: `${API_BASE_URL}/transactions/report/`,


};

export default API_ENDPOINTS;
