import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import HotelSearch from './components/HotelSearch';
import HotelDetail from './components/HotelDetail';
import MyBookings from './components/MyBookings';
import AdminPanel from './components/AdminPanel';
import HotelList from './pages/HotelList';
import AIChat from './components/AIChat';
import RegisterPage from './components/RegisterPage';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/"
          element={
            token ? (
              <>
                <HotelSearch />
                <AIChat />
              </>
            ) : <Navigate to="/login" />
          }
        />

        <Route
          path="/hotel-detail/:hotelId"
          element={token ? <HotelDetail /> : <Navigate to="/login" />}
        />

        <Route
          path="/my-bookings"
          element={token ? <MyBookings /> : <Navigate to="/login" />}
        />

        <Route
          path="/admin"
          element={token ? <AdminPanel /> : <Navigate to="/login" />}
        />

        <Route
          path="/hotels"
          element={token ? <HotelList /> : <Navigate to="/login" />}
        />

        <Route
          path="/ai-chat"
          element={token ? <AIChat /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
