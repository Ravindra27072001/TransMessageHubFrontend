// services/messageService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const messageService = {
    
    replyFromTransporter: async (receivedReply) => {
        try {
            console.log(receivedReply);
            const response = await axios.post(`${API_URL}/receivedReply`, {receivedReply});
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    
    showReplies: async (email) => {
        try {
            const response = await axios.get(`${API_URL}/showReplies/${email}`);
            return response;
        } catch (error) {
            throw error.response.data;
        }
    },
};

export default messageService;
