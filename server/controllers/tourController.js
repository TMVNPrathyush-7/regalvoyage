const Tour = require('../models/tourModel');

async function getTours(req, res) {
  try {
    const tours = await Tour.find().sort({ date: 1 });
    res.json(tours);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tours', error: err.message });
  }
}

async function addTour(req, res) {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create tour', error: err.message });
  }
}

async function editTour(req, res) {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tour);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update tour', error: err.message });
  }
}

async function deleteTour(req, res) {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    res.json({ message: 'Tour deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete tour', error: err.message });
  }
}

// Get all flights (with parent tour reference)
async function getAllFlights(req, res) {
  try {
    const tours = await Tour.find();
    const flights = [];
    tours.forEach(tour => {
      (tour.flights || []).forEach(flight => {
        flights.push({ ...flight.toObject(), tour: { _id: tour._id, name: tour.name } });
      });
    });
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
}

// Get single flight by ID (with parent tour reference)
async function getFlightById(req, res) {
  try {
    const tours = await Tour.find();
    for (const tour of tours) {
      const flight = (tour.flights || []).find(f => f._id.toString() === req.params.id);
      if (flight) {
        return res.json({ ...flight.toObject(), tour: { _id: tour._id, name: tour.name } });
      }
    }
    res.status(404).json({ error: 'Flight not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flight' });
  }
}

// Get all hotels (with parent tour reference)
async function getAllHotels(req, res) {
  try {
    const tours = await Tour.find();
    const hotels = [];
    tours.forEach(tour => {
      (tour.hotels || []).forEach(hotel => {
        hotels.push({ ...hotel.toObject(), tour: { _id: tour._id, name: tour.name } });
      });
    });
    res.json(hotels);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
}

// Get single hotel by ID (with parent tour reference)
async function getHotelById(req, res) {
  try {
    const tours = await Tour.find();
    for (const tour of tours) {
      const hotel = (tour.hotels || []).find(h => h._id.toString() === req.params.id);
      if (hotel) {
        return res.json({ ...hotel.toObject(), tour: { _id: tour._id, name: tour.name } });
      }
    }
    res.status(404).json({ error: 'Hotel not found' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
}

// Add a hotel to a tour
async function addHotel(req, res) {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    tour.hotels.push(req.body);
    await tour.save();
    res.status(201).json(tour.hotels[tour.hotels.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add hotel', error: err.message });
  }
}

// Edit a hotel in a tour
async function editHotel(req, res) {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    const hotel = tour.hotels.id(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    Object.assign(hotel, req.body);
    await tour.save();
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit hotel', error: err.message });
  }
}

// Delete a hotel from a tour
async function deleteHotel(req, res) {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    const hotel = tour.hotels.id(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    hotel.remove();
    await tour.save();
    res.json({ message: 'Hotel deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete hotel', error: err.message });
  }
}

// Add a flight to a tour
async function addFlight(req, res) {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    tour.flights.push(req.body);
    await tour.save();
    res.status(201).json(tour.flights[tour.flights.length - 1]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add flight', error: err.message });
  }
}

// Edit a flight in a tour
async function editFlight(req, res) {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    const flight = tour.flights.id(req.params.flightId);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    Object.assign(flight, req.body);
    await tour.save();
    res.json(flight);
  } catch (err) {
    res.status(500).json({ message: 'Failed to edit flight', error: err.message });
  }
}

// Delete a flight from a tour
async function deleteFlight(req, res) {
  try {
    const tour = await Tour.findById(req.params.tourId);
    if (!tour) return res.status(404).json({ message: 'Tour not found' });
    const flight = tour.flights.id(req.params.flightId);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    flight.remove();
    await tour.save();
    res.json({ message: 'Flight deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete flight', error: err.message });
  }
}

module.exports = {
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
}; 