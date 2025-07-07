const express = require('express');
const router = express.Router();
const { bookTour, bookFlight, bookHotel, userBookings, allBookings, cancelBooking } = require('../controllers/bookingController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, bookTour);
router.post('/flights', authenticateToken, bookFlight);
router.post('/hotels', authenticateToken, bookHotel);
router.get('/user', authenticateToken, userBookings);
router.get('/', authenticateToken, requireAdmin, allBookings);
router.patch('/:id/cancel', authenticateToken, cancelBooking);

module.exports = router; 