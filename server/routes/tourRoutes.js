const express = require('express');
const router = express.Router();
const {
  getTours,
  addTour,
  editTour,
  deleteTour,
  getAllFlights,
  getFlightById,
  getAllHotels,
  getHotelById,
  addHotel,
  editHotel,
  deleteHotel,
  addFlight,
  editFlight,
  deleteFlight
} = require('../controllers/tourController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', getTours);
router.post('/', authenticateToken, requireAdmin, addTour);
router.put('/:id', authenticateToken, requireAdmin, editTour);
router.delete('/:id', authenticateToken, requireAdmin, deleteTour);

// Flights CRUD (admin-only for create, update, delete)
router.get('/flights', getAllFlights);
router.get('/flights/:id', getFlightById);
router.post('/:tourId/flights', authenticateToken, requireAdmin, addFlight);
router.put('/:tourId/flights/:flightId', authenticateToken, requireAdmin, editFlight);
router.delete('/:tourId/flights/:flightId', authenticateToken, requireAdmin, deleteFlight);

// Hotels CRUD (admin-only for create, update, delete)
router.get('/hotels', getAllHotels);
router.get('/hotels/:id', getHotelById);
router.post('/:tourId/hotels', authenticateToken, requireAdmin, addHotel);
router.put('/:tourId/hotels/:hotelId', authenticateToken, requireAdmin, editHotel);
router.delete('/:tourId/hotels/:hotelId', authenticateToken, requireAdmin, deleteHotel);

module.exports = router; 