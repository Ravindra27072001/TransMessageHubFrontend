// services/orderService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const orderService = {

  sendOrdersToTransporter: async (messageData) => {
    try {
      const response = await axios.post(`${API_URL}/sendOrdersToTransporter`, messageData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getOrders: async (email) => {
    try {
      // console.log("jhdfjhsdhfvsdhvhsmdvc")
      const response = await axios.get(`${API_URL}/getOrders/${email}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getOrdersByOrderId: async (orderId) => {
    try {
      // console.log("jhdfjhsdhfvsdhvhsmdvc")
      const response = await axios.get(`${API_URL}/getOrders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },


  replyToOrder: async (orderId, price) => {
    try {
      await axios.post(`${API_URL}/reply`, { orderId, price });
    } catch (error) {
      throw error.response.data;
    }
  },

  // Add more methods for fetching orders and handling order-related actions
};

export default orderService;
