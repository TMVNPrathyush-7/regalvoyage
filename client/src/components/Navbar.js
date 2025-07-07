import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar, Tabs, Tab, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, useMediaQuery, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import HotelIcon from '@mui/icons-material/Hotel';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const navTabs = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  { label: 'Flights', icon: <FlightTakeoffIcon />, path: '/flights' },
  { label: 'Hotels', icon: <HotelIcon />, path: '/hotels' },
  { label: 'Tours', icon: <BeachAccessIcon />, path: '/tours' },
];

const Navbar = ({ isAdmin, isAuthenticated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  // Determine active tab
  const currentTab = navTabs.findIndex(tab => tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path));
  const [tabValue, setTabValue] = useState(currentTab === -1 ? 0 : currentTab);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const newTab = navTabs.findIndex(tab => tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path));
    setTabValue(newTab === -1 ? 0 : newTab);
  }, [location.pathname]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(navTabs[newValue].path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Drawer content for mobile
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navTabs.map((tab, idx) => (
          <ListItem button key={tab.label} onClick={() => navigate(tab.path)} selected={tabValue === idx}>
            <ListItemIcon>{tab.icon}</ListItemIcon>
            <ListItemText primary={tab.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => navigate(isAdmin ? "/admin" : "/profile")}> 
          <ListItemText primary="Dashboard" />
        </ListItem>
        {token && user ? (
          <>
            <ListItem>
              <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{user.name ? user.name[0] : 'U'}</Avatar>
              <Typography sx={{ color: '#222', fontWeight: 500 }}>{user.name}</Typography>
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: '#1976d2' }} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button onClick={() => navigate('/login')}>
              <ListItemText primary="Login" sx={{ color: '#1976d2' }} />
            </ListItem>
            <ListItem button onClick={() => navigate('/signup')}>
              <ListItemText primary="Sign Up" sx={{ color: '#1976d2' }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ mb: 2 }}>
      <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        {/* Logo and Brand */}
        <Box display="flex" alignItems="center" sx={{ mr: 2 }}>
          <FlightTakeoffIcon sx={{ color: '#1976d2', fontSize: 32, mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontWeight: 700,
              color: '#222',
              textDecoration: 'none',
              fontSize: '1.5rem',
            }}
          >
            RegalVoyage
          </Typography>
        </Box>
        {/* Desktop Tabs and Auth */}
        {!isMobile && (
          <>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              sx={{ flexGrow: 1, minWidth: 400 }}
            >
              {navTabs.map((tab, idx) => (
                <Tab
                  key={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  label={tab.label}
                  sx={{ fontWeight: 500, color: '#444', minWidth: 120 }}
                />
              ))}
            </Tabs>
            <Box display="flex" alignItems="center" gap={1}>
              <Button color="inherit" component={Link} to={isAdmin ? "/admin" : "/profile"} sx={{ fontWeight: 500, color: '#444' }}>
                Dashboard
              </Button>
              {token && user ? (
                <>
                  <Typography sx={{ color: '#222', fontWeight: 500, mr: 1 }}>{user.name}</Typography>
                  <IconButton color="inherit" onClick={() => navigate('/profile')} sx={{ p: 0 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {user.name ? user.name[0] : 'U'}
                    </Avatar>
                  </IconButton>
                  <Button color="inherit" onClick={handleLogout} sx={{ ml: 1, color: '#1976d2' }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/login" sx={{ color: '#1976d2' }}>
                    Login
                  </Button>
                  <Button color="inherit" component={Link} to="/signup" sx={{ color: '#1976d2' }}>
                    Sign Up
                  </Button>
                </>
              )}
            </Box>
          </>
        )}
        {/* Mobile Hamburger */}
        {isMobile && (
          <IconButton color="primary" edge="end" onClick={() => setDrawerOpen(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
        )}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {drawerContent}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 