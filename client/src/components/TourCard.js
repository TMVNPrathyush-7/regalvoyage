import React from 'react';
import { Card, CardContent, Typography, Button, Box, Grid, Avatar } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';

const sampleFlightImg = 'https://img.icons8.com/color/96/000000/airplane-take-off.png';
const sampleHotelImg = 'https://img.icons8.com/color/96/000000/hotel-building.png';

const TourCard = ({ tour, onBook }) => (
  <Card sx={{ minHeight: 350, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
    <CardContent>
      <Typography variant="h6" fontWeight={700} gutterBottom>{tour.name}</Typography>
      <Typography variant="body2" color="text.secondary" mb={1}>{tour.description}</Typography>
      <Typography variant="subtitle2">Cost: ₹{tour.cost}</Typography>
      <Typography variant="subtitle2" mb={2}>Date: {new Date(tour.date).toLocaleDateString()}</Typography>
      {/* Flights */}
      {tour.flights && tour.flights.length > 0 && (
        <Box mb={1}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.5}>Flights:</Typography>
          <Grid container spacing={1}>
            {tour.flights.map((flight, idx) => (
              <Grid item xs={12} key={idx}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={sampleFlightImg} alt="Flight" sx={{ width: 32, height: 32 }} />
                  <Typography variant="body2">
                    {flight.airline} ({flight.from} → {flight.to}) - ₹{flight.price}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
      {/* Hotels */}
      {tour.hotels && tour.hotels.length > 0 && (
        <Box mb={1}>
          <Typography variant="subtitle2" fontWeight={600} mb={0.5}>Hotels:</Typography>
          <Grid container spacing={1}>
            {tour.hotels.map((hotel, idx) => (
              <Grid item xs={12} key={idx}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Avatar src={sampleHotelImg} alt="Hotel" sx={{ width: 32, height: 32 }} />
                  <Typography variant="body2">
                    {hotel.name} ({hotel.stars}★) - ₹{hotel.pricePerNight}/night
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </CardContent>
    {onBook && <Button variant="contained" color="primary" onClick={() => onBook(tour._id)} sx={{ m: 2 }}>Book</Button>}
  </Card>
);

export default TourCard; 