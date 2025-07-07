const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: String,
  from: String,
  to: String,
  price: Number,
  images: [String]
}, { _id: true });

const hotelSchema = new mongoose.Schema({
  name: String,
  stars: Number,
  pricePerNight: Number,
  images: [String]
}, { _id: true });

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  cost: { type: Number, required: true },
  date: { type: Date, required: true },
  images: [String],
  flights: [flightSchema],
  hotels: [hotelSchema]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour; 