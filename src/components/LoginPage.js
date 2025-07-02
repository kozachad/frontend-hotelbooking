import React, { useState } from 'react';
import axios from 'axios';
import '../styles/AuthPages.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://hotelservicegateway.azurewebsites.net/api/Auth/login',
        {
          email,
          password
        }
      );

      const token = response.data.token;
      localStorage.setItem('token', token);
      setMessage('Login successful!');
      console.log('JWT Token:', token);

      window.location.href = "/"; // örnek yönlendirme
    } catch (error) {
      console.error(error);
      setMessage('Login failed.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {message && <p className="auth-message">{message}</p>}
        <p className="auth-link">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
