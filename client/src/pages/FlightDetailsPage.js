import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { getTours, bookTour } from '../services/tourService';
import axios from 'axios';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import LuggageIcon from '@mui/icons-material/Luggage';
import { bookFlight } from '../services/bookingService';
import Rating from '@mui/material/Rating';

const API_URL = process.env.REACT_APP_API_URL;

const FlightDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [travellers, setTravellers] = useState(1);
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingError, setBookingError] = useState('');
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [travelDate, setTravelDate] = useState('');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitReviewError, setSubmitReviewError] = useState('');
  const [submitReviewSuccess, setSubmitReviewSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    async function fetchFlight() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/api/tours/flights/${id}`);
        setFlight(res.data);
        setTour(res.data.tour);
      } catch (err) {
        setError('Failed to load flight details');
      }
      setLoading(false);
    }
    fetchFlight();
  }, [id]);

  useEffect(() => {
    fetchReviews();
    if (token && flight) fetchUserBookings();
    // eslint-disable-next-line
  }, [id, flight, token]);

  const fetchReviews = async () => {
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await axios.get(`${API_URL}/api/reviews?resourceType=flight&resourceId=${id}`);
      setReviews(res.data);
    } catch (err) {
      setReviewError('Failed to load reviews');
    }
    setReviewLoading(false);
  };

  const fetchUserBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bookings/user`, { headers: { Authorization: `Bearer ${token}` } });
      setUserBookings(res.data);
    } catch {}
  };

  const hasBooked = user && userBookings.some(b => b.resourceType === 'flight' && b.flightId === flight._id);

  const handleBookNow = () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setOpen(true);
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    setBookingError('');
    try {
      await bookFlight(tour._id, flight._id, travellers, travelDate, token);
      setBookingMsg('Booking successful! Check your dashboard for details.');
      setOpen(false);
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitReviewError('');
    setSubmitReviewSuccess('');
    try {
      await axios.post(`${API_URL}/api/reviews`, {
        resourceType: 'flight',
        resourceId: id,
        rating: myRating,
        comment: myComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitReviewSuccess('Review submitted!');
      setMyRating(0);
      setMyComment('');
      fetchReviews();
    } catch (err) {
      setSubmitReviewError(err?.response?.data?.message || 'Failed to submit review');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (error || !flight || !tour) return <Alert severity="error" sx={{ mt: 6 }}>{error || 'Flight not found'}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: isMobile ? 3 : 6 }}>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} gutterBottom>
          {flight.airline} ({flight.from} → {flight.to})
        </Typography>
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} gap={isMobile ? 1.5 : 3} mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <FlightTakeoffIcon color="primary" fontSize={isMobile ? 'small' : 'medium'} />
            <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Departure: {flight.departureTime || '10:00 AM'}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <FlightLandIcon color="primary" fontSize={isMobile ? 'small' : 'medium'} />
            <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Arrival: {flight.arrivalTime || '12:30 PM'}</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon color="primary" fontSize={isMobile ? 'small' : 'medium'} />
            <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Duration: {flight.duration || '2h 30m'}</Typography>
          </Box>
        </Box>
        <Typography variant={isMobile ? 'body1' : 'subtitle1'} color="text.secondary" gutterBottom>
          Price: ₹{flight.price}
        </Typography>
        <Typography variant={isMobile ? 'body2' : 'subtitle2'} gutterBottom>
          Flight Number: {flight.flightNumber || 'N/A'} | Class: {flight.class || 'Economy'}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LuggageIcon color="primary" fontSize={isMobile ? 'small' : 'medium'} />
          <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Baggage: {flight.baggage || '15kg checked, 7kg cabin'}</Typography>
        </Box>
        <Typography variant={isMobile ? 'body2' : 'subtitle2'} gutterBottom>
          Part of Tour: {tour.name}
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleBookNow} sx={{ width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1rem' : undefined }}>
            Book Now
          </Button>
        </Box>
        {bookingMsg && <Alert severity="success" sx={{ mt: 3 }}>{bookingMsg}</Alert>}
        {bookingError && <Alert severity="error" sx={{ mt: 3 }}>{bookingError}</Alert>}
      </Paper>
      {/* Booking Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={isMobile} maxWidth={isMobile ? 'xs' : 'sm'}>
        <DialogTitle>Book Flight</DialogTitle>
        <form onSubmit={handleBooking}>
          <DialogContent>
            <TextField
              label="Number of Travellers"
              type="number"
              value={travellers}
              onChange={e => setTravellers(e.target.value)}
              fullWidth
              required
              inputProps={{ min: 1 }}
              sx={{ my: 2 }}
            />
            <TextField
              label="Travel Date"
              type="date"
              value={travelDate}
              onChange={e => setTravelDate(e.target.value)}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              sx={{ my: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
            <Button onClick={() => setOpen(false)} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Confirm Booking</Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* Reviews Section */}
      <Paper elevation={2} sx={{ mt: 4, p: isMobile ? 2 : 3, borderRadius: 3 }}>
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600} gutterBottom>Flight Reviews</Typography>
        {reviews.length > 0 && (
          <Box mb={2} display="flex" alignItems="center" gap={1}>
            <Rating value={Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))} precision={0.1} readOnly size={isMobile ? 'small' : 'medium'} />
            <Typography variant={isMobile ? 'body2' : 'subtitle2'}>{(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} / 5 ({reviews.length} reviews)</Typography>
          </Box>
        )}
        {reviewLoading ? (
          <CircularProgress size={24} />
        ) : reviewError ? (
          <Alert severity="error">{reviewError}</Alert>
        ) : reviews.length === 0 ? (
          <Typography>No reviews yet. Be the first to review this flight!</Typography>
        ) : (
          reviews.map((r, idx) => (
            <Box key={r._id || idx} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Rating value={r.rating} readOnly size="small" />
                <Typography variant={isMobile ? 'body2' : 'subtitle2'}>{r.user?.name || 'User'}</Typography>
                <Typography variant="caption" color="text.secondary">{new Date(r.date).toLocaleDateString()}</Typography>
              </Box>
              <Typography variant="body2">{r.comment}</Typography>
            </Box>
          ))
        )}
        {/* Add Review Form */}
        {token && hasBooked && (
          <Box mt={3}>
            <Typography variant={isMobile ? 'body1' : 'subtitle1'} fontWeight={600}>Leave a Review</Typography>
            <form onSubmit={handleReviewSubmit}>
              <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'stretch' : 'center'} gap={2} mb={2}>
                <Rating
                  name="rating"
                  value={myRating}
                  onChange={(_, value) => setMyRating(value)}
                  required
                  size={isMobile ? 'medium' : 'large'}
                />
                <TextField
                  label="Comment"
                  value={myComment}
                  onChange={e => setMyComment(e.target.value)}
                  required
                  fullWidth
                  size={isMobile ? 'small' : 'medium'}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Submit</Button>
              </Box>
              {submitReviewError && <Alert severity="error" sx={{ mb: 2 }}>{submitReviewError}</Alert>}
              {submitReviewSuccess && <Alert severity="success" sx={{ mb: 2 }}>{submitReviewSuccess}</Alert>}
            </form>
          </Box>
        )}
        {token && !hasBooked && (
          <Alert severity="info" sx={{ mt: 2 }}>You must book this flight to leave a review.</Alert>
        )}
      </Paper>
    </Container>
  );
};

export default FlightDetailsPage; 