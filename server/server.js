const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const tourRoutes = require('./routes/tourRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://regalvoyage.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Travel Agency Reservation API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 