import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (email, password, role) => {
  // TODO: Implement login API call
  return axios.post(`${API_URL}/api/auth/login`, { email, password, role });
};

export const signup = async (name, email, password) => {
  // TODO: Implement signup API call
  return axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
};

export const getCurrentUser = () => {
  // TODO: Implement JWT-based user retrieval
  return JSON.parse(localStorage.getItem('user'));
}; 