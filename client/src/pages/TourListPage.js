import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Paper, Tabs, Tab, Grid, Card, CardMedia, CardContent, Button, TextField, InputAdornment, MenuItem, CircularProgress, Alert, useMediaQuery, useTheme
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTours } from '../services/tourService';
import Autocomplete from '@mui/material/Autocomplete';
import Rating from '@mui/material/Rating';
import Slider from '@mui/material/Slider';

const navTabs = [
  { label: 'Flights', icon: <FlightTakeoffIcon />, path: '/flights' },
  { label: 'Hotels', icon: <HotelIcon />, path: '/hotels' },
  { label: 'Homestays', icon: <HomeWorkIcon />, path: '/homestays' },
  { label: 'Holiday Packages', icon: <BeachAccessIcon />, path: '/packages' },
  { label: 'Trains', icon: <TrainIcon />, path: '/trains' },
  { label: 'Buses', icon: <DirectionsBusIcon />, path: '/buses' },
];

// List of popular cities/airports
const cityOptions = [
  'Delhi', 'Mumbai', 'Bengaluru', 'Chennai', 'Goa', 'Paris', 'London', 'Tokyo', 'Bali', 'New York',
  'Hyderabad', 'Kolkata', 'Pune', 'Singapore', 'Dubai', 'Bangkok', 'Sydney', 'Toronto', 'Los Angeles', 'San Francisco'
];

const TourListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // Determine active tab from URL
  const activeTab = navTabs.find(tab => location.pathname.startsWith(tab.path))?.label || 'Flights';

  // Data state
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTours() {
      setLoading(true);
      setError('');
      try {
        const res = await getTours();
        setTours(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError('Failed to load tours');
      }
      setLoading(false);
    }
    fetchTours();
  }, []);

  // Filtering and sorting state for tours
  const [tourPrice, setTourPrice] = useState([0, 300000]);
  const [tourDestination, setTourDestination] = useState('');
  const [tourSort, setTourSort] = useState('');
  // Get unique destinations from tours
  const tourDestOptions = Array.from(new Set(tours.map(t => t.name.split(' ').slice(-1)[0])));
  // Filter and sort tours
  let filteredTours = tours.filter(t =>
    t.cost >= tourPrice[0] &&
    t.cost <= tourPrice[1] &&
    (tourDestination === '' || t.name.includes(tourDestination))
  );
  if (tourSort === 'priceLowHigh') filteredTours = filteredTours.sort((a, b) => a.cost - b.cost);
  if (tourSort === 'priceHighLow') filteredTours = filteredTours.sort((a, b) => b.cost - a.cost);

  return (
    <Box sx={{ background: '#f7f9fb', minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="lg" sx={{ pt: isMobile ? 3 : 6, pb: 2 }}>
        {/* Hero Section */}
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={700} gutterBottom>
          {activeTab} Booking
        </Typography>
        <Typography variant={isMobile ? 'body2' : 'subtitle1'} color="text.secondary" gutterBottom>
          Discover amazing destinations and book your perfect travel experience
        </Typography>
        {/* Loading/Error States */}
        {loading && <Box display="flex" justifyContent="center" my={6}><CircularProgress /></Box>}
        {error && <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>}
        {/* Tours Section */}
        {!loading && !error && (
          <Box sx={{ mt: isMobile ? 3 : 6 }}>
            <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={600} gutterBottom>
              Tours
            </Typography>
            {/* Filter and sort controls */}
            <Box display="flex" alignItems={isMobile ? 'stretch' : 'center'} gap={isMobile ? 2 : 3} mb={2} flexDirection={isMobile ? 'column' : 'row'}>
              <Box minWidth={isMobile ? 0 : 200} flex={isMobile ? 1 : undefined}>
                <Typography variant="body2">Price Range (₹)</Typography>
                <Slider
                  value={tourPrice}
                  onChange={(_, newValue) => setTourPrice(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={300000}
                  step={1000}
                />
              </Box>
              <Box minWidth={isMobile ? 0 : 160} flex={isMobile ? 1 : undefined}>
                <Typography variant="body2">Destination</Typography>
                <TextField
                  select
                  value={tourDestination}
                  onChange={e => setTourDestination(e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">All</MenuItem>
                  {tourDestOptions.map(d => (
                    <MenuItem key={d} value={d}>{d}</MenuItem>
                  ))}
                </TextField>
              </Box>
              <Box minWidth={isMobile ? 0 : 160} flex={isMobile ? 1 : undefined}>
                <Typography variant="body2">Sort By</Typography>
                <TextField
                  select
                  value={tourSort}
                  onChange={e => setTourSort(e.target.value)}
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                  <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                </TextField>
              </Box>
            </Box>
            <Box sx={{ display: isMobile ? 'block' : 'flex', gap: isMobile ? 0 : 3, overflowX: isMobile ? 'unset' : 'auto', pb: 2, flexDirection: isMobile ? 'column' : 'row' }}>
              {Array.isArray(filteredTours) && filteredTours.map(tour => (
                <Card key={tour._id} sx={{ minWidth: isMobile ? '90vw' : 300, maxWidth: isMobile ? '95vw' : 320, borderRadius: 3, boxShadow: 3, mx: isMobile ? 'auto' : 0, mb: isMobile ? 2 : 0 }}>
                  <CardMedia
                    component="img"
                    height={isMobile ? 120 : 140}
                    image={tour.images?.[0] || 'https://via.placeholder.com/140x140'}
                    alt={tour.name}
                    sx={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                  />
                  <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
                    <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight={700} gutterBottom>{tour.name}</Typography>
                    <Rating value={4.5} precision={0.5} readOnly size="small" sx={{ mb: 1 }} />
                    <Typography variant="body2" color="text.secondary" mb={1}>{tour.description}</Typography>
                    <Typography variant="subtitle2">Cost: ₹{tour.cost}</Typography>
                    <Typography variant="subtitle2" mb={2}>Date: {new Date(tour.date).toLocaleDateString()}</Typography>
                    <Button variant="outlined" color="primary" sx={{ mt: 1, width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1rem' : undefined }} onClick={() => navigate(`/tours/${tour._id}`)}>
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default TourListPage; 