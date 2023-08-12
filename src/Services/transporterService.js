import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const orderService = {
    getOrders: async (email) => {
        try {
            const response = await axios.get(`${API_URL}/orders/${email}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    deleteOrders: async (orderId) => {
        try {
            const response = await axios.delete(`${API_URL}/deleteOrders/${orderId}`);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
}

export default orderService;