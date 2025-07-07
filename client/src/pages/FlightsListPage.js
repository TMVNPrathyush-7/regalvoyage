import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Grid, Card, CardContent, Button, TextField, MenuItem, Slider, CircularProgress, useMediaQuery, useTheme
} from '@mui/material';
import axios from 'axios';

const FlightsListPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Filtering/sorting state
  const [price, setPrice] = useState([0, 100000]);
  const [airline, setAirline] = useState('');
  const [sort, setSort] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  useEffect(() => {
    async function fetchFlights() {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('/api/tours/flights');
        setFlights(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to load flights');
      }
      setLoading(false);
    }
    fetchFlights();
  }, []);

  // Unique options
  const airlineOptions = Array.from(new Set(flights.map(f => f.airline))).sort();
  const fromOptions = Array.from(new Set(flights.map(f => f.from))).sort();
  const toOptions = Array.from(new Set(flights.map(f => f.to))).sort();

  // Filter and sort
  let filteredFlights = flights.filter(f =>
    f.price >= price[0] &&
    f.price <= price[1] &&
    (airline === '' || f.airline === airline) &&
    (from === '' || f.from === from) &&
    (to === '' || f.to === to)
  );
  if (sort === 'priceLowHigh') filteredFlights = filteredFlights.sort((a, b) => a.price - b.price);
  if (sort === 'priceHighLow') filteredFlights = filteredFlights.sort((a, b) => b.price - a.price);

  return (
    <Container maxWidth="lg" sx={{ mt: isMobile ? 3 : 6 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} gutterBottom>
        Flights
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
            max={100000}
            step={500}
          />
        </Box>
        <TextField
          select
          label="Airline"
          value={airline}
          onChange={e => setAirline(e.target.value)}
          size="small"
          sx={{ minWidth: isMobile ? 0 : 140, flex: isMobile ? 1 : undefined }}
        >
          <MenuItem value="">All</MenuItem>
          {airlineOptions.map(a => <MenuItem key={a} value={a}>{a}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="From"
          value={from}
          onChange={e => setFrom(e.target.value)}
          size="small"
          sx={{ minWidth: isMobile ? 0 : 120, flex: isMobile ? 1 : undefined }}
        >
          <MenuItem value="">All</MenuItem>
          {fromOptions.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="To"
          value={to}
          onChange={e => setTo(e.target.value)}
          size="small"
          sx={{ minWidth: isMobile ? 0 : 120, flex: isMobile ? 1 : undefined }}
        >
          <MenuItem value="">All</MenuItem>
          {toOptions.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
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
        </TextField>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error" mt={4}>{error}</Typography>
      ) : (
        <Grid container spacing={isMobile ? 1.5 : 3}>
          {Array.isArray(flights) && flights.map(flight => (
            <Grid item xs={12} sm={6} md={4} key={flight._id}>
              <Card sx={{ borderRadius: 3, boxShadow: 2, minWidth: isMobile ? '90vw' : 0, maxWidth: isMobile ? '95vw' : 'none', mx: isMobile ? 'auto' : 0 }}>
                {flight.images?.[0] && (
                  <img
                    src={flight.images[0]}
                    alt={flight.airline}
                    style={{ height: isMobile ? 60 : 80, objectFit: 'contain', width: '100%', background: '#f5f5f5', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                )}
                <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                  <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={600}>{flight.airline}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>{flight.from} → {flight.to}</Typography>
                  <Typography variant="subtitle2">Price: ₹{flight.price}</Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>Part of: {flight.tour?.name}</Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1, width: isMobile ? '100%' : 'auto' }} onClick={() => navigate(`/flights/${flight._id}`)}>
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

export default FlightsListPage; 