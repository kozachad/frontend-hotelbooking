import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/MyBookings.css";

function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.userId;

      try {
        const response = await axios.get(
          `https://hotelservicegateway.azurewebsites.net/api/booking/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(response.data);
      } catch (error) {
        console.error(error);
        alert("Failed to load bookings");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="my-bookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p className="no-bookings">No bookings found.</p>}

      <div className="bookings-grid">
        {bookings.map((booking) => (
          <div className="booking-card" key={booking.bookingId}>
            <p><strong>Booking ID:</strong> {booking.bookingId}</p>
            <p><strong>Hotel ID:</strong> {booking.hotelId}</p>
            <p><strong>Room ID:</strong> {booking.roomId}</p>
            <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> {booking.guestCount}</p>
            <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
            <p><strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;
