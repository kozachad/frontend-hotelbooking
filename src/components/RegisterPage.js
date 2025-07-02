import React, { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "User"
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        passwordHash: formData.password, // plain text gönderiyorsan buraya password yaz
        role: formData.role
      };

      const response = await axios.post(
        "https://hotelservicegateway.azurewebsites.net/api/Auth/register",
        payload
      );

      setMessage("User registered successfully!");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Registration failed.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f2f2f2"
    }}>
      <div style={{
        background: "#fff",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: "350px"
      }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          <option value="User">User</option>
          <option value="Admin">Admin</option>
        </select>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
            marginTop: "10px"
          }}
        >
          Register
        </button>

        {message && (
          <p style={{ marginTop: "15px", color: message.includes("failed") ? "red" : "green", textAlign: "center" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "16px"
};

export default RegisterPage;
