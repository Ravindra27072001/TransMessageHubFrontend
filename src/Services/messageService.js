// services/messageService.js
import axios from 'axios';

// const API_URL = 'http://localhost:3000/api';

const messageService = {
    
    replyFromTransporter: async (receivedReply) => {
        try {
            console.log(receivedReply);
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/receivedReply`, {receivedReply});
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    
    showReplies: async (email) => {
        try {
            // console.log(receivedReply);
            // const response = await axios.post(`${API_URL}/login`, { email, password });
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/showReplies/${email}`);
            return response;
        } catch (error) {
            throw error.response.data;
        }
    },

    

    // searchMessages: async (searchQuery) => {
    //     try {
    //         const response = await axios.get(`${API_URL}/messages?search=${searchQuery}`);
    //         return response.data;
    //     } catch (error) {
    //         throw error.response.data;
    //     }
    // },

    // Add more methods for sending, updating, and deleting messages
};

export default messageService;
