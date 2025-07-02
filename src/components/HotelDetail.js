import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import "../styles/HotelDetail.css";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function HotelDetail() {
  const { hotelId } = useParams();

  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      try {
        const hotelResponse = await axios.get(
          `https://hotelservicegateway.azurewebsites.net/api/Hotel/${hotelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setHotel(hotelResponse.data);
      } catch (error) {
        console.error("Hotel load error:", error);
      }

      try {
        const commentResponse = await axios.get(
          `https://hotelservicegateway.azurewebsites.net/api/Comments/${hotelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setComments(commentResponse.data);
      } catch (error) {
        console.error("Comments load error:", error);
      }

      try {
        const roomResponse = await axios.get(
          `https://hotelservicegateway.azurewebsites.net/api/Room/search?hotelId=${hotelId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setRooms(roomResponse.data);
      } catch (error) {
        console.error("Rooms load error:", error);
        alert("Error loading rooms.");
      }
    };

    fetchData();
  }, [hotelId]);

  const handleBookRoom = async () => {
    if (!selectedRoom) {
      alert("Please select a room first.");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.userId;

      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = Math.abs(end - start);
      const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalPrice = selectedRoom.pricePerNight * nights;

      const booking = {
        userId,
        hotelId,
        roomId: selectedRoom.roomId,
        checkInDate,
        checkOutDate,
        guestCount,
        totalPrice
      };

      const response = await axios.post(
        'https://hotelservicegateway.azurewebsites.net/api/Booking',
        booking,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessage(`Booking successful! Booking ID: ${response.data.bookingId}`);
    } catch (error) {
      console.error(error);
      setMessage("Booking failed.");
    }
  };

  const handleAddComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.userId;

      const comment = {
        hotelId,
        userId,
        rating,
        text: newComment
      };

      await axios.post(
        'https://hotelservicegateway.azurewebsites.net/api/Comments',
        comment,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const response = await axios.get(
        `https://hotelservicegateway.azurewebsites.net/api/Comments/${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setComments(response.data);
      setNewComment('');
      setRating(5);
    } catch (error) {
      console.error(error);
      alert("Failed to add comment.");
    }
  };

  const handleShowChart = () => {
    setShowChart(!showChart);
  };

  const ratingCounts = comments.reduce((acc, curr) => {
    acc[curr.rating] = (acc[curr.rating] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(ratingCounts).sort(),
    datasets: [
      {
        label: 'Number of Comments',
        data: Object.keys(ratingCounts).sort().map(key => ratingCounts[key]),
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }
    ]
  };

  return (
    <div className="hotel-detail">
      {hotel ? (
        <>
          <div className="hotel-header">
            <h2>{hotel.name}</h2>
            <p>{hotel.city}, {hotel.country}</p>
            <p>{hotel.address}</p>
            <p>{hotel.description}</p>
          </div>

          <h3>Available Rooms</h3>
          <div className="hotel-rooms">
            {rooms.map(room => (
              <div className="room-card" key={room.roomId}>
                <p><strong>Type:</strong> {room.roomType}</p>
                <p><strong>Available:</strong> {room.availableCount}</p>
                <p><strong>Price per night:</strong> ${room.pricePerNight}</p>
                <button onClick={() => setSelectedRoom(room)}>
                  Select Room
                </button>
              </div>
            ))}
          </div>

          {selectedRoom && (
            <div className="booking-form">
              <h4>Booking for {selectedRoom.roomType}</h4>
              <input
                type="date"
                value={checkInDate}
                onChange={e => setCheckInDate(e.target.value)}
              /><br />
              <input
                type="date"
                value={checkOutDate}
                onChange={e => setCheckOutDate(e.target.value)}
              /><br />
              <input
                type="number"
                min="1"
                value={guestCount}
                onChange={e => setGuestCount(e.target.value)}
              /><br />
              <button onClick={handleBookRoom}>Book Room</button>
              <p>{message}</p>
            </div>
          )}

          <div className="comments-section">
            <h3 style={{ cursor: 'pointer', color: '#4facfe' }} onClick={handleShowChart}>
              Comments {showChart ? "(click to hide chart)" : "(click to show chart)"}
            </h3>

            {showChart && (
              <div className="chart-container">
                <Bar data={chartData} />
              </div>
            )}

            {comments.map(comment => (
              <div key={comment.commentId} className="comment-card">
                <p><strong>User ID:</strong> {comment.userId}</p>
                <p><strong>Rating:</strong> {comment.rating} ⭐</p>
                <p>{comment.text}</p>
                <p><small>{new Date(comment.createdAt).toLocaleString()}</small></p>
              </div>
            ))}

            <div className="add-comment">
              <h4>Add a Comment</h4>
              <textarea
                placeholder="Write your comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                rows="4"
              /><br />
              <input
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={e => setRating(parseInt(e.target.value))}
              /><br />
              <button onClick={handleAddComment}>Submit Comment</button>
            </div>
          </div>
        </>
      ) : (
        <p>Loading hotel...</p>
      )}
    </div>
  );
}

export default HotelDetail;
