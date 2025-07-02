import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import "../styles/AdminPanel.css";

function AdminPanel() {
  const [hotels, setHotels] = useState([]);
  const [newHotel, setNewHotel] = useState({
    name: "",
    city: "",
    country: "",
    address: "",
    description: ""
  });
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [editHotelData, setEditHotelData] = useState(null);

  const [rooms, setRooms] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [newRoom, setNewRoom] = useState({
    roomType: "",
    totalCount: 0,
    availableCount: 0,
    pricePerNight: 0,
    startDate: "",
    endDate: ""
  });
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editRoomData, setEditRoomData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.role;

    if (role !== "Admin") {
      alert("Unauthorized!");
      navigate("/");
    } else {
      loadHotels();
    }
  }, [navigate]);

  const loadHotels = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "https://hotelservicegateway.azurewebsites.net/api/hotel",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setHotels(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddHotel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://hotelservicegateway.azurewebsites.net/api/hotel",
        newHotel,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Hotel added!");
      setNewHotel({
        name: "",
        city: "",
        country: "",
        address: "",
        description: ""
      });
      await loadHotels();
    } catch (error) {
      console.error(error);
      alert("Failed to add hotel.");
    }
  };

  const handleEditHotelClick = (hotel) => {
    setEditingHotelId(hotel.hotelId);
    setEditHotelData({
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      address: hotel.address,
      description: hotel.description
    });
  };

  const handleUpdateHotel = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://hotelservicegateway.azurewebsites.net/api/hotel/${editingHotelId}`,
        editHotelData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Hotel updated!");
      await loadHotels();
      setEditingHotelId(null);
      setEditHotelData(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update hotel.");
    }
  };

  const loadRooms = async (hotelId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://hotelservicegateway.azurewebsites.net/api/room/search?hotelId=${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setRooms(res.data);
      setSelectedHotelId(hotelId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://hotelservicegateway.azurewebsites.net/api/room",
        {
          hotelId: selectedHotelId,
          ...newRoom
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Room added!");
      setNewRoom({
        roomType: "",
        totalCount: 0,
        availableCount: 0,
        pricePerNight: 0,
        startDate: "",
        endDate: ""
      });
      await loadRooms(selectedHotelId);
    } catch (error) {
      console.error(error);
      alert("Failed to add room.");
    }
  };

  const handleEditRoomClick = (room) => {
    setEditingRoomId(room.roomId);
    setEditRoomData({
      roomType: room.roomType,
      totalCount: room.totalCount,
      availableCount: room.availableCount,
      pricePerNight: room.pricePerNight,
      startDate: room.startDate ? room.startDate.substring(0, 10) : "",
      endDate: room.endDate ? room.endDate.substring(0, 10) : ""
    });
  };

  const handleUpdateRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://hotelservicegateway.azurewebsites.net/api/room/${editingRoomId}`,
        {
          hotelId: selectedHotelId,
          ...editRoomData
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Room updated!");
      await loadRooms(selectedHotelId);
      setEditingRoomId(null);
      setEditRoomData(null);
    } catch (error) {
      console.error(error);
      alert("Failed to update room.");
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://hotelservicegateway.azurewebsites.net/api/room/${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Room deleted!");
      await loadRooms(selectedHotelId);
    } catch (error) {
      console.error(error);
      alert("Failed to delete room.");
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Admin Panel</h2>

      <h3>Hotels</h3>
      <ul>
        {hotels.map((hotel) => (
          <li key={hotel.hotelId}>
            {hotel.name} - {hotel.city}
            <button onClick={() => handleEditHotelClick(hotel)}>Edit</button>{" "}
            <button onClick={() => loadRooms(hotel.hotelId)}>View Rooms</button>
          </li>
        ))}
      </ul>

      <h3>Add Hotel</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={newHotel.name}
        onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
      /><br />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={newHotel.city}
        onChange={(e) => setNewHotel({ ...newHotel, city: e.target.value })}
      /><br />
      <input
        type="text"
        name="country"
        placeholder="Country"
        value={newHotel.country}
        onChange={(e) => setNewHotel({ ...newHotel, country: e.target.value })}
      /><br />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={newHotel.address}
        onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })}
      /><br />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={newHotel.description}
        onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
      /><br />
      <button onClick={handleAddHotel}>Add Hotel</button>

      {editingHotelId && (
        <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px" }}>
          <h4>Edit Hotel</h4>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={editHotelData.name}
            onChange={(e) => setEditHotelData({ ...editHotelData, name: e.target.value })}
          /><br />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={editHotelData.city}
            onChange={(e) => setEditHotelData({ ...editHotelData, city: e.target.value })}
          /><br />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={editHotelData.country}
            onChange={(e) => setEditHotelData({ ...editHotelData, country: e.target.value })}
          /><br />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={editHotelData.address}
            onChange={(e) => setEditHotelData({ ...editHotelData, address: e.target.value })}
          /><br />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={editHotelData.description}
            onChange={(e) => setEditHotelData({ ...editHotelData, description: e.target.value })}
          /><br />
          <button onClick={handleUpdateHotel}>Save Hotel</button>
          <button onClick={() => {
            setEditingHotelId(null);
            setEditHotelData(null);
          }}>Cancel</button>
        </div>
      )}

      {selectedHotelId && (
        <>
          <h3>Rooms for Selected Hotel</h3>
          <ul>
            {rooms.map((r) => (
              <li key={r.roomId}>
                {r.roomType} - Available: {r.availableCount} - ${r.pricePerNight}
                <button onClick={() => handleEditRoomClick(r)}>Edit</button>{" "}
                <button onClick={() => handleDeleteRoom(r.roomId)}>Delete</button>
              </li>
            ))}
          </ul>

          <h4>Add Room</h4>
          <input
            type="text"
            placeholder="Room Type"
            value={newRoom.roomType}
            onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })}
          /><br />
          <input
            type="number"
            placeholder="Total Count"
            value={newRoom.totalCount}
            onChange={(e) => setNewRoom({ ...newRoom, totalCount: e.target.value })}
          /><br />
          <input
            type="number"
            placeholder="Available Count"
            value={newRoom.availableCount}
            onChange={(e) => setNewRoom({ ...newRoom, availableCount: e.target.value })}
          /><br />
          <input
            type="number"
            placeholder="Price Per Night"
            value={newRoom.pricePerNight}
            onChange={(e) => setNewRoom({ ...newRoom, pricePerNight: e.target.value })}
          /><br />
          <input
            type="date"
            value={newRoom.startDate}
            onChange={(e) => setNewRoom({ ...newRoom, startDate: e.target.value })}
          /><br />
          <input
            type="date"
            value={newRoom.endDate}
            onChange={(e) => setNewRoom({ ...newRoom, endDate: e.target.value })}
          /><br />
          <button onClick={handleAddRoom}>Add Room</button>
        </>
      )}

      {editingRoomId && (
        <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "15px" }}>
          <h4>Edit Room</h4>
          <input
            type="text"
            name="roomType"
            placeholder="Room Type"
            value={editRoomData.roomType}
            onChange={(e) => setEditRoomData({ ...editRoomData, roomType: e.target.value })}
          /><br />
          <input
            type="number"
            name="totalCount"
            placeholder="Total Count"
            value={editRoomData.totalCount}
            onChange={(e) => setEditRoomData({ ...editRoomData, totalCount: e.target.value })}
          /><br />
          <input
            type="number"
            name="availableCount"
            placeholder="Available Count"
            value={editRoomData.availableCount}
            onChange={(e) => setEditRoomData({ ...editRoomData, availableCount: e.target.value })}
          /><br />
          <input
            type="number"
            name="pricePerNight"
            placeholder="Price Per Night"
            value={editRoomData.pricePerNight}
            onChange={(e) => setEditRoomData({ ...editRoomData, pricePerNight: e.target.value })}
          /><br />
          <input
            type="date"
            name="startDate"
            value={editRoomData.startDate}
            onChange={(e) => setEditRoomData({ ...editRoomData, startDate: e.target.value })}
          /><br />
          <input
            type="date"
            name="endDate"
            value={editRoomData.endDate}
            onChange={(e) => setEditRoomData({ ...editRoomData, endDate: e.target.value })}
          /><br />
          <button onClick={handleUpdateRoom}>Save Changes</button>
          <button onClick={() => {
            setEditingRoomId(null);
            setEditRoomData(null);
          }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
