import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import TourListPage from './pages/TourListPage';
import SignupPage from './pages/SignupPage';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import FlightDetailsPage from './pages/FlightDetailsPage';
import HotelDetailsPage from './pages/HotelDetailsPage';
import TourDetailsPage from './pages/TourDetailsPage';
import HomePage from './pages/HomePage';
import FlightsListPage from './pages/FlightsListPage';
import HotelsListPage from './pages/HotelsListPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      setIsAuthenticated(true);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  return (
    <Router>
      <Navbar isAdmin={isAdmin} isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
        <Route path="/profile" element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <UserProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin} adminOnly={true}>
            <AdminDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightsListPage />} />
        <Route path="/hotels" element={<HotelsListPage />} />
        <Route path="/tours" element={<TourListPage />} />
        <Route path="/signup" element={<SignupPage setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
        <Route path="/flights/:id" element={<FlightDetailsPage />} />
        <Route path="/hotels/:id" element={<HotelDetailsPage />} />
        <Route path="/tours/:id" element={<TourDetailsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
