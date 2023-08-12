import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../Services/authService';
import '../Css/RegistrationForm.css';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: '',
    pickupAddress: '',
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const user = await authService.getUser();
        if (user.role === 'Manufacturer') {
          setFormData((prevData) => ({
            ...prevData,
            pickupAddress: user.pickupAddress || '',
          }));
        }
      } catch (error) {
        console.error('Error fetching user address:', error);
      }
    };
    fetchUserAddress();
  }, []);

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
      const { email, username, password, role, pickupAddress } = formData;
      console.log(formData);
      const result = await authService.register(email, username, password, role, pickupAddress);
      // console.log(result);
      toast.success("Register Successful", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000,
      });
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="">Select Role</option>
            <option value="Manufacturer">Manufacturer</option>
            <option value="Transporter">Transporter</option>
          </select>
        </div>
        {formData.role === 'Manufacturer' && (
          <div className="form-group">
            <label>Pickup Address:</label>
            <input type="text" name="pickupAddress" value={formData.pickupAddress} onChange={handleChange} />
          </div>
        )}
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
      <p>Already have an account? <Link to="/">Login here</Link></p>
    </div>
  );
};

export default Register;
