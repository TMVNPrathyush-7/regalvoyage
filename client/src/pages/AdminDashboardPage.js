import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box, Typography, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl, useMediaQuery, useTheme, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL;

const AdminDashboardPage = () => {
  const [tab, setTab] = useState(0);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newTour, setNewTour] = useState({
    name: '',
    description: '',
    cost: '',
    date: '',
    images: ['']
  });
  const [addError, setAddError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editTour, setEditTour] = useState(null);
  const [editError, setEditError] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTour, setDeleteTour] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [hotels, setHotels] = useState([]);
  const [hotelLoading, setHotelLoading] = useState(false);
  const [addHotelOpen, setAddHotelOpen] = useState(false);
  const [newHotel, setNewHotel] = useState({
    name: '',
    stars: '',
    pricePerNight: '',
    images: [''],
    tourId: ''
  });
  const [addHotelError, setAddHotelError] = useState('');
  const [editHotelOpen, setEditHotelOpen] = useState(false);
  const [editHotel, setEditHotel] = useState(null);
  const [editHotelError, setEditHotelError] = useState('');
  const [deleteHotelOpen, setDeleteHotelOpen] = useState(false);
  const [deleteHotel, setDeleteHotel] = useState(null);
  const [deleteHotelError, setDeleteHotelError] = useState('');
  const [flights, setFlights] = useState([]);
  const [flightLoading, setFlightLoading] = useState(false);
  const [addFlightOpen, setAddFlightOpen] = useState(false);
  const [newFlight, setNewFlight] = useState({
    airline: '',
    from: '',
    to: '',
    price: '',
    images: [''],
    tourId: ''
  });
  const [addFlightError, setAddFlightError] = useState('');
  const [editFlightOpen, setEditFlightOpen] = useState(false);
  const [editFlight, setEditFlight] = useState(null);
  const [editFlightError, setEditFlightError] = useState('');
  const [deleteFlightOpen, setDeleteFlightOpen] = useState(false);
  const [deleteFlight, setDeleteFlight] = useState(null);
  const [deleteFlightError, setDeleteFlightError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (tab === 0) fetchTours();
    if (tab === 1) fetchHotels();
    if (tab === 2) fetchFlights();
  }, [tab]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/tours`);
      setTours(res.data);
    } catch (err) {
      // Handle error (show notification, etc.)
    }
    setLoading(false);
  };

  const fetchHotels = async () => {
    setHotelLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/tours/hotels`);
      setHotels(res.data);
    } catch (err) {
      // Handle error
    }
    setHotelLoading(false);
  };

  const fetchFlights = async () => {
    setFlightLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/tours/flights`);
      setFlights(res.data);
    } catch (err) {
      // Handle error
    }
    setFlightLoading(false);
  };

  const handleAddOpen = () => {
    setNewTour({ name: '', description: '', cost: '', date: '', images: [''] });
    setAddError('');
    setAddOpen(true);
  };
  const handleAddClose = () => setAddOpen(false);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setNewTour((prev) => ({ ...prev, images: [value] }));
    } else {
      setNewTour((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');
    try {
      await axios.post(`${API_URL}/api/tours`, {
        ...newTour,
        cost: Number(newTour.cost),
        date: new Date(newTour.date)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAddOpen(false);
      fetchTours();
    } catch (err) {
      setAddError(err?.response?.data?.message || 'Failed to add tour');
    }
  };

  const handleEditOpen = (tour) => {
    setEditTour({ ...tour, date: tour.date ? new Date(tour.date).toISOString().slice(0, 10) : '' });
    setEditError('');
    setEditOpen(true);
  };
  const handleEditClose = () => setEditOpen(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setEditTour((prev) => ({ ...prev, images: [value] }));
    } else {
      setEditTour((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      await axios.put(`${API_URL}/api/tours/${editTour._id}`, {
        ...editTour,
        cost: Number(editTour.cost),
        date: new Date(editTour.date)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditOpen(false);
      fetchTours();
    } catch (err) {
      setEditError(err?.response?.data?.message || 'Failed to update tour');
    }
  };

  const handleDeleteOpen = (tour) => {
    setDeleteTour(tour);
    setDeleteError('');
    setDeleteOpen(true);
  };
  const handleDeleteClose = () => setDeleteOpen(false);

  const handleDeleteConfirm = async () => {
    setDeleteError('');
    try {
      await axios.delete(`${API_URL}/api/tours/${deleteTour._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDeleteOpen(false);
      fetchTours();
    } catch (err) {
      setDeleteError(err?.response?.data?.message || 'Failed to delete tour');
    }
  };

  const handleAddHotelOpen = () => {
    setNewHotel({ name: '', stars: '', pricePerNight: '', images: [''], tourId: '' });
    setAddHotelError('');
    setAddHotelOpen(true);
  };
  const handleAddHotelClose = () => setAddHotelOpen(false);

  const handleAddHotelChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setNewHotel((prev) => ({ ...prev, images: [value] }));
    } else {
      setNewHotel((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddHotelSubmit = async (e) => {
    e.preventDefault();
    setAddHotelError('');
    try {
      await axios.post(`${API_URL}/api/tours/${newHotel.tourId}/hotels`, {
        name: newHotel.name,
        stars: Number(newHotel.stars),
        pricePerNight: Number(newHotel.pricePerNight),
        images: newHotel.images
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAddHotelOpen(false);
      fetchHotels();
    } catch (err) {
      setAddHotelError(err?.response?.data?.message || 'Failed to add hotel');
    }
  };

  const handleEditHotelOpen = (hotel) => {
    setEditHotel({
      ...hotel,
      stars: hotel.stars?.toString() || '',
      pricePerNight: hotel.pricePerNight?.toString() || '',
      images: hotel.images || [''],
      tourId: hotel.tour?._id || ''
    });
    setEditHotelError('');
    setEditHotelOpen(true);
  };
  const handleEditHotelClose = () => setEditHotelOpen(false);

  const handleEditHotelChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setEditHotel((prev) => ({ ...prev, images: [value] }));
    } else {
      setEditHotel((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditHotelSubmit = async (e) => {
    e.preventDefault();
    setEditHotelError('');
    try {
      await axios.put(`${API_URL}/api/tours/${editHotel.tourId}/hotels/${editHotel._id}`, {
        name: editHotel.name,
        stars: Number(editHotel.stars),
        pricePerNight: Number(editHotel.pricePerNight),
        images: editHotel.images
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditHotelOpen(false);
      fetchHotels();
    } catch (err) {
      setEditHotelError(err?.response?.data?.message || 'Failed to update hotel');
    }
  };

  const handleDeleteHotelOpen = (hotel) => {
    setDeleteHotel(hotel);
    setDeleteHotelError('');
    setDeleteHotelOpen(true);
  };
  const handleDeleteHotelClose = () => setDeleteHotelOpen(false);

  const handleDeleteHotelConfirm = async () => {
    setDeleteHotelError('');
    try {
      await axios.delete(`${API_URL}/api/tours/${deleteHotel.tour._id}/hotels/${deleteHotel._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDeleteHotelOpen(false);
      fetchHotels();
    } catch (err) {
      setDeleteHotelError(err?.response?.data?.message || 'Failed to delete hotel');
    }
  };

  const handleAddFlightOpen = () => {
    setNewFlight({ airline: '', from: '', to: '', price: '', images: [''], tourId: '' });
    setAddFlightError('');
    setAddFlightOpen(true);
  };
  const handleAddFlightClose = () => setAddFlightOpen(false);

  const handleAddFlightChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setNewFlight((prev) => ({ ...prev, images: [value] }));
    } else {
      setNewFlight((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFlightSubmit = async (e) => {
    e.preventDefault();
    setAddFlightError('');
    try {
      await axios.post(`${API_URL}/api/tours/${newFlight.tourId}/flights`, {
        airline: newFlight.airline,
        from: newFlight.from,
        to: newFlight.to,
        price: Number(newFlight.price),
        images: newFlight.images
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAddFlightOpen(false);
      fetchFlights();
    } catch (err) {
      setAddFlightError(err?.response?.data?.message || 'Failed to add flight');
    }
  };

  const handleEditFlightOpen = (flight) => {
    setEditFlight({
      ...flight,
      price: flight.price?.toString() || '',
      images: flight.images || [''],
      tourId: flight.tour?._id || ''
    });
    setEditFlightError('');
    setEditFlightOpen(true);
  };
  const handleEditFlightClose = () => setEditFlightOpen(false);

  const handleEditFlightChange = (e) => {
    const { name, value } = e.target;
    if (name === 'images') {
      setEditFlight((prev) => ({ ...prev, images: [value] }));
    } else {
      setEditFlight((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditFlightSubmit = async (e) => {
    e.preventDefault();
    setEditFlightError('');
    try {
      await axios.put(`${API_URL}/api/tours/${editFlight.tourId}/flights/${editFlight._id}`, {
        airline: editFlight.airline,
        from: editFlight.from,
        to: editFlight.to,
        price: Number(editFlight.price),
        images: editFlight.images
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setEditFlightOpen(false);
      fetchFlights();
    } catch (err) {
      setEditFlightError(err?.response?.data?.message || 'Failed to update flight');
    }
  };

  const handleDeleteFlightOpen = (flight) => {
    setDeleteFlight(flight);
    setDeleteFlightError('');
    setDeleteFlightOpen(true);
  };
  const handleDeleteFlightClose = () => setDeleteFlightOpen(false);

  const handleDeleteFlightConfirm = async () => {
    setDeleteFlightError('');
    try {
      await axios.delete(`${API_URL}/api/tours/${deleteFlight.tour._id}/flights/${deleteFlight._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setDeleteFlightOpen(false);
      fetchFlights();
    } catch (err) {
      setDeleteFlightError(err?.response?.data?.message || 'Failed to delete flight');
    }
  };

  const tourColumns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'cost', headerName: 'Cost', flex: 1, type: 'number' },
    { field: 'date', headerName: 'Date', flex: 1, valueGetter: (params) => {
      const d = new Date(params.value);
      return isNaN(d) ? '' : d.toLocaleDateString();
    } },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditOpen(params.row)}>Edit</Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteOpen(params.row)}>Delete</Button>
        </>
      )
    }
  ];

  const hotelColumns = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'stars', headerName: 'Stars', flex: 0.5, type: 'number' },
    { field: 'pricePerNight', headerName: 'Price/Night', flex: 1, type: 'number' },
    { field: 'tour', headerName: 'Tour', flex: 1, valueGetter: (params) => (params.row && params.row.tour && params.row.tour.name) ? params.row.tour.name : '' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditHotelOpen(params.row)}>Edit</Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteHotelOpen(params.row)}>Delete</Button>
        </>
      )
    }
  ];

  const flightColumns = [
    { field: 'airline', headerName: 'Airline', flex: 1 },
    { field: 'from', headerName: 'From', flex: 1 },
    { field: 'to', headerName: 'To', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1, type: 'number' },
    { field: 'tour', headerName: 'Tour', flex: 1, valueGetter: (params) => (params.row && params.row.tour && params.row.tour.name) ? params.row.tour.name : '' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEditFlightOpen(params.row)}>Edit</Button>
          <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteFlightOpen(params.row)}>Delete</Button>
        </>
      )
    }
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: isMobile ? 2 : 4, px: isMobile ? 1 : 0 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom>Admin Dashboard</Typography>
      <Paper elevation={3} sx={{ p: isMobile ? 1 : 2 }}>
        <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary"
          centered={!isMobile} variant={isMobile ? 'scrollable' : 'standard'} scrollButtons={isMobile ? 'auto' : false}>
          <Tab label="Tours" />
          <Tab label="Hotels" />
          <Tab label="Flights" />
        </Tabs>
        <Box sx={{ mt: isMobile ? 2 : 3 }}>
          {tab === 0 && (
            <>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', mb: 2, gap: isMobile ? 1 : 0 }}>
                <Button variant="contained" onClick={handleAddOpen} sx={{ width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1rem' : undefined }}>Add Tour</Button>
              </Box>
              {isMobile ? (
                <Alert severity="info" sx={{ mb: 2 }}>For best experience, use a desktop or tablet to manage tours.</Alert>
              ) : (
                <div style={{ height: 500, width: '100%' }}>
                  <DataGrid
                    rows={tours.map(t => ({ ...t, id: t._id }))}
                    columns={tourColumns}
                    loading={loading}
                    pageSize={7}
                    rowsPerPageOptions={[7, 14, 21]}
                    disableSelectionOnClick
                  />
                </div>
              )}
              <Dialog open={addOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Tour</DialogTitle>
                <form onSubmit={handleAddSubmit}>
                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Name" name="name" value={newTour.name} onChange={handleAddChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Description" name="description" value={newTour.description} onChange={handleAddChange} required multiline minRows={2} size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Cost" name="cost" value={newTour.cost} onChange={handleAddChange} required type="number" size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Date" name="date" value={newTour.date} onChange={handleAddChange} required type="date" InputLabelProps={{ shrink: true }} size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Image URL" name="images" value={newTour.images[0]} onChange={handleAddChange} required size={isMobile ? 'small' : 'medium'} />
                    {addError && <Typography color="error">{addError}</Typography>}
                  </DialogContent>
                  <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                    <Button onClick={handleAddClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Add</Button>
                  </DialogActions>
                </form>
              </Dialog>
              <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Tour</DialogTitle>
                <form onSubmit={handleEditSubmit}>
                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Name" name="name" value={editTour?.name || ''} onChange={handleEditChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Description" name="description" value={editTour?.description || ''} onChange={handleEditChange} required multiline minRows={2} size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Cost" name="cost" value={editTour?.cost || ''} onChange={handleEditChange} required type="number" size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Date" name="date" value={editTour?.date || ''} onChange={handleEditChange} required type="date" InputLabelProps={{ shrink: true }} size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Image URL" name="images" value={editTour?.images?.[0] || ''} onChange={handleEditChange} required size={isMobile ? 'small' : 'medium'} />
                    {editError && <Typography color="error">{editError}</Typography>}
                  </DialogContent>
                  <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                    <Button onClick={handleEditClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Save</Button>
                  </DialogActions>
                </form>
              </Dialog>
              <Dialog open={deleteOpen} onClose={handleDeleteClose} maxWidth="xs">
                <DialogTitle>Delete Tour</DialogTitle>
                <DialogContent>
                  <Typography>Are you sure you want to delete <b>{deleteTour?.name}</b>?</Typography>
                  {deleteError && <Typography color="error">{deleteError}</Typography>}
                </DialogContent>
                <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                  <Button onClick={handleDeleteClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                  <Button onClick={handleDeleteConfirm} color="error" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Delete</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          {tab === 1 && (
            <>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', mb: 2, gap: isMobile ? 1 : 0 }}>
                <Button variant="contained" onClick={handleAddHotelOpen} sx={{ width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1rem' : undefined }}>Add Hotel</Button>
              </Box>
              {isMobile ? (
                <Alert severity="info" sx={{ mb: 2 }}>For best experience, use a desktop or tablet to manage hotels.</Alert>
              ) : (
                <div style={{ height: 500, width: '100%' }}>
                  <DataGrid
                    rows={hotels.map(h => ({ ...h, id: h._id }))}
                    columns={hotelColumns}
                    loading={hotelLoading}
                    pageSize={7}
                    rowsPerPageOptions={[7, 14, 21]}
                    disableSelectionOnClick
                  />
                </div>
              )}
              <Dialog open={addHotelOpen} onClose={handleAddHotelClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Hotel</DialogTitle>
                <form onSubmit={handleAddHotelSubmit}>
                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Name" name="name" value={newHotel.name} onChange={handleAddHotelChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Stars" name="stars" value={newHotel.stars} onChange={handleAddHotelChange} required type="number" inputProps={{ min: 1, max: 5 }} size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Price per Night" name="pricePerNight" value={newHotel.pricePerNight} onChange={handleAddHotelChange} required type="number" size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Image URL" name="images" value={newHotel.images[0]} onChange={handleAddHotelChange} required size={isMobile ? 'small' : 'medium'} />
                    <FormControl required size={isMobile ? 'small' : 'medium'}>
                      <InputLabel id="tour-select-label">Tour</InputLabel>
                      <Select
                        labelId="tour-select-label"
                        name="tourId"
                        value={newHotel.tourId}
                        label="Tour"
                        onChange={handleAddHotelChange}
                      >
                        {tours.map(tour => (
                          <MenuItem key={tour._id} value={tour._id}>{tour.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {addHotelError && <Typography color="error">{addHotelError}</Typography>}
                  </DialogContent>
                  <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                    <Button onClick={handleAddHotelClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Add</Button>
                  </DialogActions>
                </form>
              </Dialog>
              <Dialog open={editHotelOpen} onClose={handleEditHotelClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Hotel</DialogTitle>
                <form onSubmit={handleEditHotelSubmit}>
                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Name" name="name" value={editHotel?.name || ''} onChange={handleEditHotelChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Stars" name="stars" value={editHotel?.stars || ''} onChange={handleEditHotelChange} required type="number" inputProps={{ min: 1, max: 5 }} size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Price per Night" name="pricePerNight" value={editHotel?.pricePerNight || ''} onChange={handleEditHotelChange} required type="number" size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Image URL" name="images" value={editHotel?.images?.[0] || ''} onChange={handleEditHotelChange} required size={isMobile ? 'small' : 'medium'} />
                    <FormControl required size={isMobile ? 'small' : 'medium'}>
                      <InputLabel id="edit-tour-select-label">Tour</InputLabel>
                      <Select
                        labelId="edit-tour-select-label"
                        name="tourId"
                        value={editHotel?.tourId || ''}
                        label="Tour"
                        onChange={handleEditHotelChange}
                      >
                        {tours.map(tour => (
                          <MenuItem key={tour._id} value={tour._id}>{tour.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {editHotelError && <Typography color="error">{editHotelError}</Typography>}
                  </DialogContent>
                  <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                    <Button onClick={handleEditHotelClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Save</Button>
                  </DialogActions>
                </form>
              </Dialog>
              <Dialog open={deleteHotelOpen} onClose={handleDeleteHotelClose} maxWidth="xs">
                <DialogTitle>Delete Hotel</DialogTitle>
                <DialogContent>
                  <Typography>Are you sure you want to delete <b>{deleteHotel?.name}</b>?</Typography>
                  {deleteHotelError && <Typography color="error">{deleteHotelError}</Typography>}
                </DialogContent>
                <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                  <Button onClick={handleDeleteHotelClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                  <Button onClick={handleDeleteHotelConfirm} color="error" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Delete</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
          {tab === 2 && (
            <>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'flex-end', mb: 2, gap: isMobile ? 1 : 0 }}>
                <Button variant="contained" onClick={handleAddFlightOpen} sx={{ width: isMobile ? '100%' : 'auto', fontSize: isMobile ? '1rem' : undefined }}>Add Flight</Button>
              </Box>
              {isMobile ? (
                <Alert severity="info" sx={{ mb: 2 }}>For best experience, use a desktop or tablet to manage flights.</Alert>
              ) : (
                <div style={{ height: 500, width: '100%' }}>
                  <DataGrid
                    rows={flights.map(f => ({ ...f, id: f._id }))}
                    columns={flightColumns}
                    loading={flightLoading}
                    pageSize={7}
                    rowsPerPageOptions={[7, 14, 21]}
                    disableSelectionOnClick
                  />
                </div>
              )}
              <Dialog open={addFlightOpen} onClose={handleAddFlightClose} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Flight</DialogTitle>
                <form onSubmit={handleAddFlightSubmit}>
                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Airline" name="airline" value={newFlight.airline} onChange={handleAddFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="From" name="from" value={newFlight.from} onChange={handleAddFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="To" name="to" value={newFlight.to} onChange={handleAddFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Price" name="price" value={newFlight.price} onChange={handleAddFlightChange} required type="number" size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Image/Logo URL" name="images" value={newFlight.images[0]} onChange={handleAddFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <FormControl required size={isMobile ? 'small' : 'medium'}>
                      <InputLabel id="flight-tour-select-label">Tour</InputLabel>
                      <Select
                        labelId="flight-tour-select-label"
                        name="tourId"
                        value={newFlight.tourId}
                        label="Tour"
                        onChange={handleAddFlightChange}
                      >
                        {tours.map(tour => (
                          <MenuItem key={tour._id} value={tour._id}>{tour.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {addFlightError && <Typography color="error">{addFlightError}</Typography>}
                  </DialogContent>
                  <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                    <Button onClick={handleAddFlightClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Add</Button>
                  </DialogActions>
                </form>
              </Dialog>
              <Dialog open={editFlightOpen} onClose={handleEditFlightClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Flight</DialogTitle>
                <form onSubmit={handleEditFlightSubmit}>
                  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField label="Airline" name="airline" value={editFlight?.airline || ''} onChange={handleEditFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="From" name="from" value={editFlight?.from || ''} onChange={handleEditFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="To" name="to" value={editFlight?.to || ''} onChange={handleEditFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Price" name="price" value={editFlight?.price || ''} onChange={handleEditFlightChange} required type="number" size={isMobile ? 'small' : 'medium'} />
                    <TextField label="Image/Logo URL" name="images" value={editFlight?.images?.[0] || ''} onChange={handleEditFlightChange} required size={isMobile ? 'small' : 'medium'} />
                    <FormControl required size={isMobile ? 'small' : 'medium'}>
                      <InputLabel id="edit-flight-tour-select-label">Tour</InputLabel>
                      <Select
                        labelId="edit-flight-tour-select-label"
                        name="tourId"
                        value={editFlight?.tourId || ''}
                        label="Tour"
                        onChange={handleEditFlightChange}
                      >
                        {tours.map(tour => (
                          <MenuItem key={tour._id} value={tour._id}>{tour.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {editFlightError && <Typography color="error">{editFlightError}</Typography>}
                  </DialogContent>
                  <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                    <Button onClick={handleEditFlightClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                    <Button type="submit" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Save</Button>
                  </DialogActions>
                </form>
              </Dialog>
              <Dialog open={deleteFlightOpen} onClose={handleDeleteFlightClose} maxWidth="xs">
                <DialogTitle>Delete Flight</DialogTitle>
                <DialogContent>
                  <Typography>Are you sure you want to delete <b>{deleteFlight?.airline}</b>?</Typography>
                  {deleteFlightError && <Typography color="error">{deleteFlightError}</Typography>}
                </DialogContent>
                <DialogActions sx={{ px: isMobile ? 2 : 3, pb: isMobile ? 2 : 3 }}>
                  <Button onClick={handleDeleteFlightClose} sx={{ fontSize: isMobile ? '1rem' : undefined }}>Cancel</Button>
                  <Button onClick={handleDeleteFlightConfirm} color="error" variant="contained" sx={{ fontSize: isMobile ? '1rem' : undefined }}>Delete</Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboardPage; 