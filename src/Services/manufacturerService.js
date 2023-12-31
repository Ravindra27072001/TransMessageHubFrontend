import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const manufacturerService = {
  getTransportersLists: async () => {
    try {
      const response = await axios.get(`${API_URL}/transporters`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default manufacturerService;
