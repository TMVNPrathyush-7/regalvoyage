import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getTours = async () => {
  // TODO: Implement get tours API call
  return axios.get(`${API_URL}/api/tours`);
};

export const updateTour = async (tourId, data, token) => {
  // TODO: Implement update tour API call (admin)
  return axios.put(`${API_URL}/api/tours/${tourId}`, data, { headers: { Authorization: `Bearer ${token}` } });
}; 