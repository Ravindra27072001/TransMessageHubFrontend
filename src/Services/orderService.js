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

  replyToOrder: async (orderId, price) => {
    try {
      await axios.post(`${API_URL}/reply`, { orderId, price });
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default orderService;
