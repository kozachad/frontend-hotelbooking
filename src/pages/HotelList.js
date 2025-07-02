import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/HotelList.css";

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [roomsByHotel, setRoomsByHotel] = useState({});
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [discountRate, setDiscountRate] = useState(0);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const decoded = jwtDecode(token);
          setUserLoggedIn(true);
          setDiscountRate(0.15);
        }

        // Hotels
        const response = await axios.get(
          "https://hotelservicegateway.azurewebsites.net/api/Hotel",
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : undefined,
          }
        );
        setHotels(response.data);

        // Rooms for each hotel
        const roomsData = {};
        for (let hotel of response.data) {
          const roomRes = await axios.get(
            `https://hotelservicegateway.azurewebsites.net/api/Room/search?hotelId=${hotel.hotelId}`,
            {
              headers: token
                ? { Authorization: `Bearer ${token}` }
                : undefined,
            }
          );
          roomsData[hotel.hotelId] = roomRes.data;
        }
        setRoomsByHotel(roomsData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHotels();
  }, []);

  const getMinRoomPrice = (hotelId) => {
    const rooms = roomsByHotel[hotelId];
    if (!rooms || rooms.length === 0) return null;
    const minPrice = Math.min(...rooms.map((r) => r.pricePerNight));
    return minPrice;
  };

  return (
    <div className="hotel-page">
      <div className="map-container">
        <MapContainer
          center={[37.0344, 27.4305]}
          zoom={6}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {hotels.map((hotel) => (
            <Marker
              key={hotel.hotelId}
              position={[
                hotel.latitude || 37.0344,
                hotel.longitude || 27.4305,
              ]}
            >
              <Popup>
                <strong>{hotel.name}</strong>
                <br />
                <a href={`/hotel-detail/${hotel.hotelId}`}>
                  Go to details
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="hotel-list">
        {hotels.map((hotel) => {
          const minPrice = getMinRoomPrice(hotel.hotelId);

          let originalPriceText = "-";
          let discountedPriceText = "-";

          if (minPrice != null) {
            originalPriceText = `${minPrice.toFixed(2)} $`;
            if (userLoggedIn) {
              const discounted = minPrice * (1 - discountRate);
              discountedPriceText = `${discounted.toFixed(2)} $`;
            }
          }

          return (
            <div className="hotel-card" key={hotel.hotelId}>
              <div className="hotel-image">
                {hotel.imageUrl ? (
                  <img src={hotel.imageUrl} alt={hotel.name} />
                ) : (
                  <div className="no-image">No Image</div>
                )}
              </div>
              <div className="hotel-info">
                <h3>{hotel.name}</h3>
                <p className="location">
                  {hotel.city}, {hotel.country}
                </p>
                <p className="desc">{hotel.description}</p>
                {minPrice != null ? (
                  <p className="price">
                    {userLoggedIn ? (
                      <>
                        <span className="original">
                          {originalPriceText}
                        </span>{" "}
                        <span className="discounted">
                          {discountedPriceText} (Discounted!)
                        </span>
                      </>
                    ) : (
                      <span>{originalPriceText}</span>
                    )}
                  </p>
                ) : (
                  <p className="price">No rooms available</p>
                )}
                <a href={`/hotel-detail/${hotel.hotelId}`}>
                  <button className="details-btn">View Details</button>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HotelList;
