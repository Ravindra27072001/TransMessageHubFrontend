import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const ManufacturerChatDashboard = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;
        socket.emit('sendMessage', { transporter: selectedTransporter, message });
        setMessage('');
    };

    const connectSocket = () => {
        const newSocket = io('http://localhost:3000'); // Replace with your server URL
        setSocket(newSocket);
    };

    useEffect(() => {
        connectSocket();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (data) => {
                const { transporter, message } = data;
                if (transporter === selectedTransporter) {
                    setChatMessages((prevMessages) => [...prevMessages, message]);
                }
            });
        }
    }, [socket, selectedTransporter]);

    const [selectedTransporter, setSelectedTransporter] = useState('');

    // Fetch transporters and set selectedTransporter based on user interaction
    // ...

    return (
        <div>
            <div>
                {/* Display selectedTransporter and chatMessages */}
            </div>
            <div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ManufacturerChatDashboard;
