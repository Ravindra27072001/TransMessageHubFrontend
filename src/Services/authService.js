// client/src/services/authService.js
import axios from 'axios';

// const API_URL = 'http://localhost:3000/api';

const authService = {
  register: async (email, username, password, role, pickupAddress) => {
    try {
      // console.log(username,password,role);
      await axios.post(`${process.env.REACT_APP_BASE_URL}/register`, {email, username, password, role, pickupAddress });
    } catch (error) {
      throw error.response.data;
    }
  },
  login: async (email, password) => {
    try {
      console.log(process.env);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/login`, { email, password });
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('email', response.data.email);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default authService;

