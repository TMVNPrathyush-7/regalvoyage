import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, TextField, Button, Box, Alert, useMediaQuery, useTheme } from '@mui/material';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/profile'); // Redirect to profile/dashboard page
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: isMobile ? 4 : 8 }}>
      <Card>
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Typography variant={isMobile ? 'h6' : 'h5'} align="center" gutterBottom>
            Login to Your Account
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              margin="normal"
              size={isMobile ? 'small' : 'medium'}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              margin="normal"
              size={isMobile ? 'small' : 'medium'}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, fontSize: isMobile ? '1rem' : undefined }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
          <Box mt={2} textAlign="center">
            Don't have an account?{' '}
            <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
              Sign up
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage; 