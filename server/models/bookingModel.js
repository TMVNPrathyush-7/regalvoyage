const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resourceType: { type: String, enum: ['tour', 'flight', 'hotel'], required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'resourceType' },
  flightId: { type: mongoose.Schema.Types.ObjectId }, // for flight bookings
  hotelId: { type: mongoose.Schema.Types.ObjectId }, // for hotel bookings
  numTravellers: { type: Number }, // for flights/tours
  numGuests: { type: Number }, // for hotels
  bookingDate: { type: Date, default: Date.now },
  travelDate: { type: Date },
  status: { type: String, default: 'pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 