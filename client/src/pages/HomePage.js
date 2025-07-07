import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Tabs, Tab, Card, CardMedia, CardContent, Button, Grid, TextField, Autocomplete, Paper, Rating, Divider, Avatar, useTheme, useMediaQuery
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import StarIcon from '@mui/icons-material/Star';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import axios from 'axios';

const TABS = [
  { label: 'Flights', icon: <FlightTakeoffIcon /> },
  { label: 'Hotels', icon: <HotelIcon /> },
  { label: 'Tours', icon: <BeachAccessIcon /> },
];

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tab, setTab] = useState(0);
  const [tours, setTours] = useState([]);
  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  // Search state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [toursRes, flightsRes, hotelsRes] = await Promise.all([
        axios.get('/api/tours'),
        axios.get('/api/tours/flights'),
        axios.get('/api/tours/hotels'),
      ]);
      setTours(Array.isArray(toursRes.data) ? toursRes.data : []);
      setFlights(Array.isArray(flightsRes.data) ? flightsRes.data : []);
      setHotels(Array.isArray(hotelsRes.data) ? hotelsRes.data : []);
      setLoading(false);
    }
    fetchData();
  }, []);

  // For autocomplete options
  const cityOptions = Array.from(new Set([
    ...(Array.isArray(flights) ? flights.map(f => f.from) : []),
    ...(Array.isArray(flights) ? flights.map(f => f.to) : []),
    ...(Array.isArray(tours) ? tours.map(t => t.name.split(' ').slice(-1)[0]) : []),
  ])).filter(Boolean);

  // Hero search handler (demo only)
  const handleSearch = () => {
    if (tab === 0) navigate('/flights');
    else if (tab === 1) navigate('/hotels');
    else navigate('/tours');
  };

  return (
    <Box>
      {/* Hero Banner */}
      <Box sx={{
        background: 'linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.2)), url(https://images.unsplash.com/photo-1506744038136-46273834b3fb) center/cover',
        minHeight: isMobile ? 320 : 420,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        color: '#fff',
        pb: isMobile ? 3 : 6,
        px: isMobile ? 1 : 0
      }}>
        <Typography variant={isMobile ? 'h5' : 'h3'} fontWeight={700} sx={{ mb: 2, mt: isMobile ? 3 : 6, textShadow: '0 2px 8px #0008' }}>
          Explore the World with RegalVoyage
        </Typography>
        <Paper elevation={4} sx={{ p: isMobile ? 1.5 : 3, borderRadius: 3, minWidth: 0, maxWidth: 700, width: '100%', mt: 2 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered orientation={isMobile ? 'vertical' : 'horizontal'}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{ mb: isMobile ? 2 : 0 }}>
            {TABS.map((t, i) => <Tab key={t.label} icon={t.icon} label={t.label} />)}
          </Tabs>
          <Box display="flex" gap={2} mt={2} flexWrap="wrap" flexDirection={isMobile ? 'column' : 'row'}>
            <Autocomplete
              options={cityOptions}
              value={from}
              onChange={(_, v) => setFrom(v || '')}
              renderInput={params => <TextField {...params} label="From" size="small" />}
              sx={{ minWidth: 120, flex: 1 }}
            />
            <Autocomplete
              options={cityOptions}
              value={to}
              onChange={(_, v) => setTo(v || '')}
              renderInput={params => <TextField {...params} label="To" size="small" />}
              sx={{ minWidth: 120, flex: 1 }}
            />
            <TextField
              label="Date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 120, flex: 1 }}
            />
            <TextField
              label="Guests"
              type="number"
              value={guests}
              onChange={e => setGuests(e.target.value)}
              size="small"
              inputProps={{ min: 1 }}
              sx={{ minWidth: 100, flex: 1 }}
            />
            <Button variant="contained" color="primary" size="large" sx={{ minWidth: 120, width: isMobile ? '100%' : 'auto', mt: isMobile ? 1 : 0 }} onClick={handleSearch}>
              Search
            </Button>
          </Box>
        </Paper>
      </Box>
      {/* Recommended/Popular Sections */}
      <Container maxWidth="lg" sx={{ mt: isMobile ? 3 : 6, px: isMobile ? 0.5 : 2 }}>
        {/* Recommended Trips (Tours) */}
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} mb={2}>
          Recommended Trips
        </Typography>
        <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
          {Array.isArray(tours) && tours.slice(0, 6).map(tour => (
            <Grid item xs={12} sm={6} md={4} key={tour._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardMedia
                  component="img"
                  height={isMobile ? 120 : 160}
                  image={tour.images?.[0] || 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca'}
                  alt={tour.name}
                />
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>{tour.name}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>{tour.description}</Typography>
                  <Typography variant="subtitle2">Cost: ₹{tour.cost}</Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1, width: isMobile ? '100%' : 'auto' }} onClick={() => navigate(`/tours/${tour._id}`)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Popular Flights */}
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} mb={2}>
          Popular Flights
        </Typography>
        <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
          {Array.isArray(flights) && flights.slice(0, 6).map(flight => (
            <Grid item xs={12} sm={6} md={4} key={flight._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>{flight.airline}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>{flight.from} → {flight.to}</Typography>
                  <Typography variant="subtitle2">Price: ₹{flight.price}</Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1, width: isMobile ? '100%' : 'auto' }} onClick={() => navigate(`/flights/${flight._id}`)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Top Hotels */}
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} mb={2}>
          Top Hotels
        </Typography>
        <Grid container spacing={isMobile ? 1.5 : 3} sx={{ mb: isMobile ? 2 : 4 }}>
          {Array.isArray(hotels) && hotels.slice(0, 6).map(hotel => (
            <Grid item xs={12} sm={6} md={4} key={hotel._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                <CardMedia
                  component="img"
                  height={isMobile ? 100 : 140}
                  image={hotel.images?.[0] || 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429'}
                  alt={hotel.name}
                />
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>{hotel.name} ({hotel.stars}★)</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>Price per night: ₹{hotel.pricePerNight}</Typography>
                  <Typography variant="subtitle2">Part of: {hotel.tour?.name}</Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1, width: isMobile ? '100%' : 'auto' }} onClick={() => navigate(`/hotels/${hotel._id}`)}>
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Why Choose Us */}
        <Divider sx={{ my: isMobile ? 2 : 4 }} />
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} mb={2} align="center">
          Why Choose RegalVoyage?
        </Typography>
        <Grid container spacing={isMobile ? 1.5 : 3} justifyContent="center" sx={{ mb: isMobile ? 2 : 4 }}>
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <SupportAgentIcon sx={{ fontSize: isMobile ? 36 : 48, color: 'primary.main' }} />
              <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} fontWeight={600}>24x7 Support</Typography>
              <Typography variant="body2" color="text.secondary">We're here for you anytime, anywhere.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <PriceCheckIcon sx={{ fontSize: isMobile ? 36 : 48, color: 'primary.main' }} />
              <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} fontWeight={600}>Best Price Guarantee</Typography>
              <Typography variant="body2" color="text.secondary">Find a better price? We'll match it.</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Box textAlign="center">
              <ThumbUpIcon sx={{ fontSize: isMobile ? 36 : 48, color: 'primary.main' }} />
              <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} fontWeight={600}>Easy Booking</Typography>
              <Typography variant="body2" color="text.secondary">Book in just a few clicks, hassle-free.</Typography>
            </Box>
          </Grid>
        </Grid>
        {/* Customer Reviews */}
        <Divider sx={{ my: isMobile ? 2 : 4 }} />
        <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} mb={2} align="center">
          What Our Customers Say
        </Typography>
        <Grid container spacing={isMobile ? 1.5 : 3} justifyContent="center">
          {[
            { name: 'Amit S.', rating: 5, comment: 'Amazing experience! Highly recommended.' },
            { name: 'Priya K.', rating: 4, comment: 'Great service and value for money.' },
            { name: 'Rahul M.', rating: 5, comment: 'Booking was super easy and support was excellent.' },
          ].map((r, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, p: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: isMobile ? 28 : 32, height: isMobile ? 28 : 32 }}>{r.name[0]}</Avatar>
                    <Typography variant={isMobile ? 'subtitle2' : 'subtitle2'}>{r.name}</Typography>
                    <Rating value={r.rating} readOnly size="small" sx={{ ml: 1 }} />
                  </Box>
                  <Typography variant="body2">{r.comment}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage; 