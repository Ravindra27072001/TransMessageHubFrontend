// src/components/Login.js
import React, { useState } from 'react';
import {Link, useNavigate } from 'react-router-dom';
import authService from '../Services/authService';
import '../Css/RegistrationForm.css'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const response = await authService.login(email, password);
      console.log(response)
      if (response) {
        // navigate('/dashboard'); // Redirect to dashboard page after successful login
        // console.log(userRole);
        localStorage.setItem('token', response.data.token);
        const userRole = response.data.role; // Replace with actual role retrieval logic
        toast.success("Login Successful", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 1000,
        });
        if (userRole === 'Manufacturer') {
          localStorage.setItem('manufacturerEmail', response.data.email);
          setTimeout(() => {
            navigate('/manufacturer-dashboard');
          }, 1500);
          
        } else if (userRole === 'Transporter') {
          localStorage.setItem('transporterEmail', response.data.email);
          setTimeout(() => {
            navigate('/transporter-dashboard');
          }, 1500);
          
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Email or password is incorrect. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="register-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group"> 
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button className="register-button" type="submit">Login</button>
      </form>
      <div className="register-link">
        Don't have an account? <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
