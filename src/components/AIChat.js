import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../styles/AIChat.css";

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [hotelOptions, setHotelOptions] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);

    try {
      const token = localStorage.getItem("token");
      const aiResponse = await axios.post(
        "https://hotelservicegateway.azurewebsites.net/api/AI",
        { message: input },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      console.log("Input:", input);
      console.log("AI RESPONSE:", aiResponse.data);

      // Eğer AI cevabında city varsa otel ara
      if (aiResponse.data.city) {
        const params = {};
        if (aiResponse.data.city) params.city = aiResponse.data.city;
        if (aiResponse.data.startDate) params.startDate = aiResponse.data.startDate;
        if (aiResponse.data.endDate) params.endDate = aiResponse.data.endDate;
        if (aiResponse.data.guestCount != null) params.guestCount = aiResponse.data.guestCount;
        const hotelRes = await axios.get(
          `https://hotelservicegateway.azurewebsites.net/api/Hotel/search`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            params
          }
        );

        console.log("HOTELS:", hotelRes.data);

        setHotelOptions(hotelRes.data);

        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: `Here are some hotels in ${aiResponse.data.city} for your dates:`
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "Sorry, I couldn't extract booking details." }
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Oops! An error occurred." }
      ]);
    }

    setInput("");
  };

  const reserveRoom = async (hotel) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.sub || decoded.userId;
      

      const bookingPayload = {
        hotelId: hotel.hotelId,
        userId: userId, // Token'dan userId alınabilir
        roomId: hotel.rooms?.[0]?.roomId || null,
        checkInDate: hotel.startDate,
        checkOutDate: hotel.endDate,
        guestCount: hotel.guestCount,
        totalPrice: hotel.rooms?.[0]?.pricePerNight || 0
      };

      const res = await axios.post(
        "https://hotelservicegateway.azurewebsites.net/api/Booking",
        bookingPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `✅ Your booking at ${hotel.name} is confirmed! Booking ID: ${res.data.bookingId}`
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Booking failed!" }
      ]);
    }
  };

  return (
    <div className="ai-chat-window">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.sender}`}>
            {msg.text}
          </div>
        ))}

        {hotelOptions.length > 0 && (
          <div className="hotel-list">
            {hotelOptions.map((hotel) => (
              <div className="hotel-card" key={hotel.hotelId}>
                <h4>🏨 {hotel.name}</h4>
                <p>📍 {hotel.city}</p>
                <p>⭐ {hotel.rating} | 💰 {hotel.pricePerNight} TL/night</p>
                <p>✅ {hotel.description}</p>
                <button onClick={() => reserveRoom(hotel)}>
                  Reserve Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="chat-input">
        <textarea
          rows={2}
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
        ></textarea>
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default AIChat;
