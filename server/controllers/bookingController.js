const Booking = require('../models/bookingModel');

async function bookTour(req, res) {
  try {
    const booking = await Booking.create({
      user: req.user.id,
      resourceType: 'tour',
      resourceId: req.body.tourId,
      numTravellers: req.body.numTravellers,
      travelDate: req.body.travelDate,
      status: 'booked',
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to book tour', error: err.message });
  }
}

async function bookFlight(req, res) {
  try {
    const booking = await Booking.create({
      user: req.user.id,
      resourceType: 'flight',
      resourceId: req.body.tourId,
      flightId: req.body.flightId,
      numTravellers: req.body.numTravellers,
      travelDate: req.body.travelDate,
      status: 'booked',
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to book flight', error: err.message });
  }
}

async function bookHotel(req, res) {
  try {
    const booking = await Booking.create({
      user: req.user.id,
      resourceType: 'hotel',
      resourceId: req.body.tourId,
      hotelId: req.body.hotelId,
      numGuests: req.body.numGuests,
      travelDate: req.body.travelDate,
      status: 'booked',
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to book hotel', error: err.message });
  }
}

async function userBookings(req, res) {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'resourceId',
        select: '-__v',
        model: 'Tour'
      });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
}

async function allBookings(req, res) {
  try {
    const bookings = await Booking.find()
      .populate('user')
      .populate({
        path: 'resourceId',
        select: '-__v',
        model: 'Tour'
      });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all bookings', error: err.message });
  }
}

async function cancelBooking(req, res) {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Only allow owner or admin
    if (booking.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel booking', error: err.message });
  }
}

module.exports = { bookTour, bookFlight, bookHotel, userBookings, allBookings, cancelBooking }; 