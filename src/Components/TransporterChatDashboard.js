import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const TransporterChatDashboard = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);

    const handleSendMessage = () => {
        if (message.trim() === '') return;
        socket.emit('sendMessage', { message });
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
            socket.on('receiveMessage', (message) => {
                setChatMessages((prevMessages) => [...prevMessages, message]);
            });
        }
    }, [socket]);

    return (
        <div>
            <div>
                {chatMessages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
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

export default TransporterChatDashboard;
