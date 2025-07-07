import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, MenuItem, Slider, CircularProgress, Rating, useMediaQuery, useTheme
} from '@mui/material';
import axios from 'axios';

const HotelsListPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Filtering/sorting state
  const [price, setPrice] = useState([0, 50000]);
  const [stars, setStars] = useState('');
  const [sort, setSort] = useState('');
  const [tour, setTour] = useState('');

  useEffect(() => {
    async function fetchHotels() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/tours/hotels');
        setHotels(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to load hotels');
      }
      setLoading(false);
    }
    fetchHotels();
  }, []);

  // Unique options
  const starOptions = Array.from(new Set(hotels.map(h => h.stars))).sort();
  const tourOptions = Array.from(new Set(hotels.map(h => h.tour?.name))).sort();

  // Filter and sort
  let filteredHotels = hotels.filter(h =>
    h.pricePerNight >= price[0] &&
    h.pricePerNight <= price[1] &&
    (stars === '' || h.stars === Number(stars)) &&
    (tour === '' || h.tour?.name === tour)
  );
  if (sort === 'priceLowHigh') filteredHotels = filteredHotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
  if (sort === 'priceHighLow') filteredHotels = filteredHotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
  if (sort === 'starsHighLow') filteredHotels = filteredHotels.sort((a, b) => b.stars - a.stars);
  if (sort === 'starsLowHigh') filteredHotels = filteredHotels.sort((a, b) => a.stars - b.stars);

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 3 : 6 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} gutterBottom>
        Hotels
      </Typography>
      {/* Filter and sort controls */}
      <Box display="flex" alignItems={isMobile ? 'stretch' : 'center'} gap={isMobile ? 2 : 3} mb={3} flexWrap="wrap" flexDirection={isMobile ? 'column' : 'row'}>
        <Box minWidth={isMobile ? 0 : 200} flex={isMobile ? 1 : undefined}>
          <Typography variant="body2">Price Range (₹)</Typography>
          <Slider
            value={price}
            onChange={(_, v) => setPrice(v)}
            valueLabelDisplay="auto"
            min={0}
            max={50000}
            step={500}
          />
        </Box>
        <TextField
          select
          label="Stars"
          value={stars}
          onChange={e => setStars(e.target.value)}
          size="small"
          sx={{ minWidth: isMobile ? 0 : 120, flex: isMobile ? 1 : undefined }}
        >
          <MenuItem value="">All</MenuItem>
          {starOptions.map(s => <MenuItem key={s} value={s}>{s}★</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Tour"
          value={tour}
          onChange={e => setTour(e.target.value)}
          size="small"
          sx={{ minWidth: isMobile ? 0 : 140, flex: isMobile ? 1 : undefined }}
        >
          <MenuItem value="">All</MenuItem>
          {tourOptions.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Sort By"
          value={sort}
          onChange={e => setSort(e.target.value)}
          size="small"
          sx={{ minWidth: isMobile ? 0 : 140, flex: isMobile ? 1 : undefined }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
          <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
          <MenuItem value="starsHighLow">Stars: High to Low</MenuItem>
          <MenuItem value="starsLowHigh">Stars: Low to High</MenuItem>
        </TextField>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" mt={4}>{error}</Typography>
      ) : (
        <Grid container spacing={isMobile ? 1.5 : 3}>
          {Array.isArray(hotels) && hotels.map(hotel => (
            <Grid item xs={12} sm={6} md={4} key={hotel._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, minWidth: isMobile ? '90vw' : 0, maxWidth: isMobile ? '95vw' : 'none', mx: isMobile ? 'auto' : 0 }}>
                {hotel.images?.[0] && (
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    style={{ height: isMobile ? 100 : 140, objectFit: 'cover', width: '100%', background: '#f5f5f5', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                )}
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>{hotel.name} ({hotel.stars}★)</Typography>
                  <Rating value={hotel.stars || 4} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
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
      )}
    </Container>
  );
};

export default HotelsListPage; 