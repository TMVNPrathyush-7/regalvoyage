import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getUserBookings = async (token) => {
  // TODO: Implement get user bookings API call
  return axios.get(`${API_URL}/api/bookings/user`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getAllBookings = async (token) => {
  // TODO: Implement get all bookings API call (admin)
  return axios.get(`${API_URL}/api/bookings`, { headers: { Authorization: `Bearer ${token}` } });
};

export const bookTour = async (tourId, numTravellers, travelDate, token) => {
  return axios.post(`${API_URL}/api/bookings`, { tourId, numTravellers, travelDate }, { headers: { Authorization: `Bearer ${token}` } });
};

export const bookFlight = async (tourId, flightId, numTravellers, travelDate, token) => {
  return axios.post(`${API_URL}/api/bookings/flights`, { tourId, flightId, numTravellers, travelDate }, { headers: { Authorization: `Bearer ${token}` } });
};

export const bookHotel = async (tourId, hotelId, numGuests, travelDate, token) => {
  return axios.post(`${API_URL}/api/bookings/hotels`, { tourId, hotelId, numGuests, travelDate }, { headers: { Authorization: `Bearer ${token}` } });
};

export const cancelBooking = async (bookingId, token) => {
  return axios.patch(`${API_URL}/api/bookings/${bookingId}/cancel`, {}, { headers: { Authorization: `Bearer ${token}` } });
}; 