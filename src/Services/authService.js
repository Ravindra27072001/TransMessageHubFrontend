import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const authService = {
  register: async (email, username, password, role, pickupAddress) => {
    try {
      // console.log(username,password,role);
      await axios.post(`${API_URL}/register`, {email, username, password, role, pickupAddress });
    } catch (error) {
      throw error.response.data;
    }
  },
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default authService;

