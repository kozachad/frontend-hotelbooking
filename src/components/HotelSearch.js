import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/HotelSearch.css";

function HotelSearch() {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [hotels, setHotels] = useState([]);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = `https://hotelservicegateway.azurewebsites.net/api/hotel/search?city=${city}&startDate=${startDate}&endDate=${endDate}&guestCount=${guestCount}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setHotels(response.data);
    } catch (error) {
      console.error(error);
      alert('Error fetching hotels.');
    }
  };

  return (
    <div className="hotel-search-container">
      <h2>Search Hotels</h2>

      <div className="search-form">
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={e => setCity(e.target.value)}
        />

        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
        />

        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />

        <input
          type="number"
          min="1"
          value={guestCount}
          onChange={e => setGuestCount(e.target.value)}
          placeholder="Guests"
        />

        <button className="search-btn" onClick={handleSearch}>Search</button>
      </div>

      <div className="hotel-list">
        {hotels.map(hotel => (
          <div key={hotel.hotelId} className="hotel-card">
            <h3>{hotel.name}</h3>
            <p><strong>Location:</strong> {hotel.city}, {hotel.country}</p>
            <p>{hotel.address}</p>
            <p>{hotel.description}</p>
            <Link to={`/hotel-detail/${hotel.hotelId}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelSearch;
