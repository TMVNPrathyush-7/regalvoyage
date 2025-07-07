import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import TourIcon from '@mui/icons-material/TravelExplore';

const BookingCard = ({ booking }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <TourIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>
          {booking.tour?.name || booking.tourName}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <EventIcon color="action" />
        <Typography variant="body2">
          {booking.tour?.date ? new Date(booking.tour.date).toLocaleDateString() : booking.date}
        </Typography>
      </Box>
      <Chip label={booking.status} color={booking.status === 'confirmed' ? 'success' : 'warning'} size="small" />
    </CardContent>
  </Card>
);

export default BookingCard; 