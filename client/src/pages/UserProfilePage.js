import React, { useEffect, useState } from 'react';
import { Container, Card, CardContent, Typography, Button, Avatar, Grid, Divider, Box, CircularProgress, Alert, useMediaQuery, useTheme, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { getUserBookings, cancelBooking } from '../services/bookingService';

const UserProfilePage = () => {
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cancelId, setCancelId] = useState(null);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  const [detailsBooking, setDetailsBooking] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    async function fetchBookings() {
      setLoading(true);
      setError('');
      try {
        const res = await getUserBookings(token);
        setBookings(res.data);
      } catch (err) {
        setError('Failed to load bookings');
      }
      setLoading(false);
    }
    if (token) fetchBookings();
    else setLoading(false);
  }, [token]);

  const handleCancel = async () => {
    setCancelError('');
    setCancelSuccess('');
    try {
      await cancelBooking(cancelId, token);
      setCancelSuccess('Booking cancelled successfully.');
      setBookings(bookings => bookings.map(b => b._id === cancelId ? { ...b, status: 'cancelled' } : b));
      setCancelId(null);
    } catch (err) {
      setCancelError('Failed to cancel booking.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems={isMobile ? 'flex-start' : 'center'} direction={isMobile ? 'column' : 'row'}>
            <Grid item>
              <Avatar sx={{ width: isMobile ? 48 : 64, height: isMobile ? 48 : 64 }} src={user.avatar}>
                {user.name ? user.name[0] : 'U'}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant={isMobile ? 'h6' : 'h5'}>{user.name}</Typography>
              <Typography color="text.secondary">{user.email}</Typography>
            </Grid>
            <Grid item>
              <Button variant="outlined" sx={{ width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1rem' : undefined }}>Edit Profile</Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <Typography variant={isMobile ? 'subtitle1' : 'h6'}>My Bookings</Typography>
        <Divider sx={{ mb: 2 }} />
        {cancelSuccess && <Alert severity="success" sx={{ mb: 2 }}>{cancelSuccess}</Alert>}
        {cancelError && <Alert severity="error" sx={{ mb: 2 }}>{cancelError}</Alert>}
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : bookings.length === 0 ? (
        <Typography color="text.secondary">No bookings yet.</Typography>
      ) : (
        bookings.map((booking) => {
          const { resourceType, resourceId, travelDate, numTravellers, numGuests, status, flightId, hotelId } = booking;
          let title = '', subtitle = '', extra = '';
          if (resourceType === 'flight' && resourceId && flightId) {
            const flight = resourceId.flights?.find(f => f._id === flightId || f._id === (flightId && flightId.toString && flightId.toString()));
            if (flight) {
              title = `${flight.airline} (${flight.from} → ${flight.to})`;
              subtitle = `Price: ₹${flight.price}`;
              extra = `Travellers: ${numTravellers}`;
            } else {
              title = 'Unknown Flight Booking';
            }
          } else if (resourceType === 'hotel' && resourceId && hotelId) {
            const hotel = resourceId.hotels?.find(h => h._id === hotelId || h._id === (hotelId && hotelId.toString && hotelId.toString()));
            if (hotel) {
              title = `${hotel.name} (${hotel.stars}★)`;
              subtitle = `Price per night: ₹${hotel.pricePerNight}`;
              extra = `Guests: ${numGuests}`;
            } else {
              title = 'Unknown Hotel Booking';
            }
          } else if (resourceType === 'tour' && resourceId) {
            title = resourceId.name;
            subtitle = `Cost: ₹${resourceId.cost}`;
            extra = `Travellers: ${numTravellers}`;
          } else {
            title = 'Unknown Booking';
          }
          return (
            <Card key={booking._id} sx={{ mb: 2, width: isMobile ? '100%' : 'auto', cursor: 'pointer' }} onClick={() => setDetailsBooking(booking)}>
              <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                <Typography variant={isMobile ? 'subtitle1' : 'subtitle1'} fontWeight={600}>{title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>{subtitle}</Typography>
                {travelDate && (
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {resourceType === 'hotel' ? 'Check-in' : 'Travel'} Date: {new Date(travelDate).toLocaleDateString()}
                  </Typography>
                )}
                {extra && (
                  <Typography variant="body2" color="text.secondary" mb={1}>{extra}</Typography>
                )}
                <Typography variant="body2" color="text.secondary">Status: {status}</Typography>
                {(status === 'pending' || status === 'confirmed' || status === 'booked') && (
                  <Button variant="outlined" color="error" sx={{ mt: 1 }} onClick={e => { e.stopPropagation(); setCancelId(booking._id); }}>
                    Cancel
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })
      )}
      {/* Booking Details Dialog */}
      <Dialog open={!!detailsBooking} onClose={() => setDetailsBooking(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent dividers>
          {detailsBooking && (() => {
            const b = detailsBooking;
            const { resourceType, resourceId, travelDate, numTravellers, numGuests, status, bookingDate, flightId, hotelId } = b;
            let flight, hotel;
            if (resourceType === 'flight' && resourceId && flightId) {
              flight = resourceId.flights?.find(f => f._id === flightId || f._id === (flightId && flightId.toString && flightId.toString()));
            }
            if (resourceType === 'hotel' && resourceId && hotelId) {
              hotel = resourceId.hotels?.find(h => h._id === hotelId || h._id === (hotelId && hotelId.toString && hotelId.toString()));
            }
            return <>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Type: {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}</Typography>
              <Typography variant="body2" mb={1}>Booking Date: {bookingDate ? new Date(bookingDate).toLocaleDateString() : 'N/A'}</Typography>
              <Typography variant="body2" mb={1}>Status: {status}</Typography>
              {travelDate && <Typography variant="body2" mb={1}>{resourceType === 'hotel' ? 'Check-in' : 'Travel'} Date: {new Date(travelDate).toLocaleDateString()}</Typography>}
              {resourceType === 'flight' && flight && <>
                <Typography variant="body2" mb={1}>Airline: {flight.airline}</Typography>
                <Typography variant="body2" mb={1}>Route: {flight.from} → {flight.to}</Typography>
                <Typography variant="body2" mb={1}>Price: ₹{flight.price}</Typography>
                <Typography variant="body2" mb={1}>Travellers: {numTravellers}</Typography>
              </>}
              {resourceType === 'flight' && !flight && <Typography variant="body2" mb={1}>Flight details not found.</Typography>}
              {resourceType === 'hotel' && hotel && <>
                <Typography variant="body2" mb={1}>Hotel: {hotel.name}</Typography>
                <Typography variant="body2" mb={1}>Stars: {hotel.stars}★</Typography>
                <Typography variant="body2" mb={1}>Price per night: ₹{hotel.pricePerNight}</Typography>
                <Typography variant="body2" mb={1}>Guests: {numGuests}</Typography>
              </>}
              {resourceType === 'hotel' && !hotel && <Typography variant="body2" mb={1}>Hotel details not found.</Typography>}
              {resourceType === 'tour' && resourceId && <>
                <Typography variant="body2" mb={1}>Tour: {resourceId.name}</Typography>
                <Typography variant="body2" mb={1}>Cost: ₹{resourceId.cost}</Typography>
                <Typography variant="body2" mb={1}>Travellers: {numTravellers}</Typography>
                <Typography variant="body2" mb={1}>Date: {resourceId.date ? new Date(resourceId.date).toLocaleDateString() : 'N/A'}</Typography>
              </>}
            </>;
          })()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsBooking(null)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!cancelId} onClose={() => setCancelId(null)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to cancel this booking?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelId(null)}>No</Button>
          <Button onClick={handleCancel} color="error" variant="contained">Yes, Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfilePage; 