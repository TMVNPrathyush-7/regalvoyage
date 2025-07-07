import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, CircularProgress, Grid, Card, CardMedia, CardContent, Rating, Divider, ImageList, ImageListItem, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';
import { getTours } from '../services/tourService';
import { bookTour } from '../services/bookingService';

const TourDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [travellers, setTravellers] = useState(1);
  const [bookingMsg, setBookingMsg] = useState('');
  const [bookingError, setBookingError] = useState('');
  const token = localStorage.getItem('token');
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitReviewError, setSubmitReviewError] = useState('');
  const [submitReviewSuccess, setSubmitReviewSuccess] = useState('');
  const userId = localStorage.getItem('userId'); // Assume you store userId on login
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [travelDate, setTravelDate] = useState('');

  useEffect(() => {
    async function fetchTour() {
      setLoading(true);
      setError('');
      try {
        const res = await getTours();
        const found = res.data.find(t => t._id === id);
        setTour(found);
      } catch (err) {
        setError('Failed to load tour details');
      }
      setLoading(false);
    }
    fetchTour();
  }, [id]);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [id]);

  const fetchReviews = async () => {
    setReviewLoading(true);
    setReviewError('');
    try {
      const res = await axios.get(`/api/reviews?resourceType=tour&resourceId=${id}`);
      setReviews(res.data);
    } catch (err) {
      setReviewError('Failed to load reviews');
    }
    setReviewLoading(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmitReviewError('');
    setSubmitReviewSuccess('');
    try {
      await axios.post('/api/reviews', {
        resourceType: 'tour',
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
      await bookTour(id, travellers, travelDate, token);
      setBookingMsg('Booking successful! Check your dashboard for details.');
      setOpen(false);
    } catch (err) {
      setBookingError('Booking failed. Please try again.');
    }
  };

  // Sample images and reviews (replace with real data if available)
  const images = tour?.images || [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
  ];
  const avgRating = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : null;

  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (error || !tour) return <Alert severity="error" sx={{ mt: 6 }}>{error || 'Tour not found'}</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: isMobile ? 3 : 6 }}>
      {/* Image Gallery */}
      <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 2 }}>
        <CardMedia
          component="img"
          height={isMobile ? 180 : 320}
          image={images[0]}
          alt={tour.name}
          sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
        {images.length > 1 && (
          <ImageList cols={isMobile ? 2 : 3} rowHeight={isMobile ? 70 : 100} sx={{ m: 0, p: isMobile ? 1 : 2 }}>
            {images.slice(1).map((img, idx) => (
              <ImageListItem key={idx}>
                <img src={img} alt={`Tour ${idx + 2}`} loading="lazy" style={{ borderRadius: 8, width: '100%', height: '100%', objectFit: 'cover' }} />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Card>
      <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3 }}>
        <Grid container spacing={isMobile ? 2 : 3} direction={isMobile ? 'column-reverse' : 'row'}>
          <Grid item xs={12} md={8}>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} gutterBottom>
              {tour.name}
            </Typography>
            <Typography variant={isMobile ? 'body1' : 'subtitle1'} color="text.secondary" gutterBottom>
              {tour.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {/* Itinerary section */}
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600} gutterBottom>Itinerary</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {tour.itinerary || 'Day 1: Arrival and city tour. Day 2: Sightseeing. Day 3: Leisure and departure.'}
            </Typography>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600} gutterBottom>Inclusions</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {tour.inclusions || 'Accommodation, breakfast, sightseeing, transfers.'}
            </Typography>
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600} gutterBottom>Exclusions</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {tour.exclusions || 'Flights, personal expenses, meals not mentioned.'}
            </Typography>
            <Divider sx={{ my: 2 }} />
            {/* Reviews section */}
            <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600} gutterBottom>Customer Reviews</Typography>
            {avgRating && (
              <Box mb={2} display="flex" alignItems="center" gap={1}>
                <Rating value={Number(avgRating)} precision={0.1} readOnly size={isMobile ? 'small' : 'medium'} />
                <Typography variant={isMobile ? 'body2' : 'subtitle2'}>{avgRating} / 5 ({reviews.length} reviews)</Typography>
              </Box>
            )}
            {reviewLoading ? (
              <CircularProgress size={24} />
            ) : reviewError ? (
              <Alert severity="error">{reviewError}</Alert>
            ) : reviews.length === 0 ? (
              <Typography>No reviews yet. Be the first to review this tour!</Typography>
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
            {token && (
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
                      multiline
                      minRows={1}
                      sx={{ flex: 1 }}
                      size={isMobile ? 'small' : 'medium'}
                    />
                    <Button type="submit" variant="contained" disabled={myRating === 0 || !myComment} sx={{ width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1rem' : undefined }}>Submit</Button>
                  </Box>
                  {submitReviewError && <Alert severity="error">{submitReviewError}</Alert>}
                  {submitReviewSuccess && <Alert severity="success">{submitReviewSuccess}</Alert>}
                </form>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4}>
            {/* Summary Card */}
            <Card sx={{ p: isMobile ? 1.5 : 2, mb: 2, borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={700} gutterBottom>Summary</Typography>
                <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Cost: ₹{tour.cost}</Typography>
                <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Date: {new Date(tour.date).toLocaleDateString()}</Typography>
                <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Duration: {tour.duration || '3 Days'}</Typography>
                <Typography variant={isMobile ? 'body2' : 'subtitle2'}>Destination: {tour.destination || tour.name.split(' ').slice(-1)[0]}</Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary" fullWidth onClick={handleBookNow} sx={{ fontSize: isMobile ? '1rem' : undefined }}>
                    Book Now
                  </Button>
                </Box>
                {bookingMsg && <Alert severity="success" sx={{ mt: 2 }}>{bookingMsg}</Alert>}
                {bookingError && <Alert severity="error" sx={{ mt: 2 }}>{bookingError}</Alert>}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      {/* Booking Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth={isMobile} maxWidth={isMobile ? 'xs' : 'sm'}>
        <DialogTitle>Book Tour</DialogTitle>
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
              size={isMobile ? 'small' : 'medium'}
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
    </Container>
  );
};

export default TourDetailsPage; 