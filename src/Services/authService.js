// // client/src/services/authService.js
// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api';

// const authService = {
//   register: (username, password, role) => {
//     return axios.post(`${API_URL}/register`, { username, password, role });
//   },
//   login: (username, password) => {
//     return axios.post(`${API_URL}/login`, { username, password })
//       .then(response => {
//         localStorage.setItem('token', response.data.token);
//         return response.data.token;
//       });
//   },
// };

// export default authService;



// client/src/services/authService.js
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
      // localStorage.setItem('token', response.data.token);
      // localStorage.setItem('email', response.data.email);
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default authService;

