// src/components/TransporterDashboard.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import '../Css/TransporterDashboard.css';
// import orderService from '../Services/orderService';
import transporterService from '../Services/transporterService';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransporterDashboard = () => {
    const [socket, setSocket] = useState(null);

    const [orders, setOrders] = useState([]);
    // console.log(orders);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        fetchOrders();
        const newSocket = io('http://localhost:3000'); // Replace with your server URL
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
        // console.log("object")
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('receiveReply', (replyMessage) => {
                console.log('Received reply from transporter:', replyMessage);
                // setReceivedReply(replyMessage); // Update received reply state
            });
        }
    }, [socket]);

    // console.log(price)
    const handleOrderSelection = (orderId) => {
        // console.log(orderId);
        setSelectedOrderId(orderId);
    };

    const fetchOrders = async () => {
        try {
            const email = localStorage.getItem('transporterEmail');
            const response = await transporterService.getOrders(email);
            // const response = await axios.get('/api/orderIds');
            console.log(response)
            setOrders(response);
        } catch (error) {
            console.error('Error fetching order IDs:', error);
        }
    };

    // console.log(orders);

    const sendReply = async (order) => {
        console.log(order);

        const replyData = {
            orderID: order.orderID,
            from: order.from,
            to: order.to,
            quantity: order.quantity,
            pickupAddress: order.pickupAddress,
            manufacturer: order.manufacturer,
            price: price,
            transporter: localStorage.getItem('transporterEmail'),
          };

        console.log(replyData);

        if (socket) {
            socket.emit('sendReply', replyData);
        }

        const response = await transporterService.deleteOrders(selectedOrderId);
        console.log(response);
        fetchOrders();

        toast.success("Register Successful", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
        });
    };

    return (
        <div className="transporter-dashboard">
            <h2>Transporter Dashboard</h2>
            {orders.length === 0 ? (
                <p>No Messages</p>
            ) : (
                <div className="order-list">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className={`order-item ${selectedOrderId === order.orderID ? 'selected' : ''}`}
                            onClick={() => handleOrderSelection(order.orderID)}
                        >
                            <div className="order-info">
                                <div className="order-id">Order ID: {order.orderID}</div>
                                <div>Manufacturer: {order.manufacturer}</div>
                                <div>From: {order.from}</div>
                                <div>To: {order.to}</div>
                                <div>Quantity: {order.quantity}</div>
                                <div className="pickup-address">Pickup Address: {order.pickupAddress}</div>
                            </div>
                            {selectedOrderId === order.orderID && (
                                <div className="reply-section">
                                    <input
                                        type="number"
                                        placeholder="Enter Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    <button onClick={() => sendReply(order)}>Reply</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>


    );
};

export default TransporterDashboard;









// // components/TransporterDashboard.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import '../Css/TransporterDashboard.css';

// const TransporterDashboard = () => {
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     fetchMessages();
//   }, []);

//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get('/api/messages');
//       console.log(response)
//       setMessages(response.data);
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

//   return (
//     <div className="transporter-dashboard">
//       <h2>Transporter Dashboard</h2>
//       <div className="messages-list">
//         {messages.map((message) => (
//           <div key={message._id} className="message-item">
//             <span>Order ID: {message.orderID}</span>
//             <span>From: {message.from}</span>
//             <span>To: {message.to}</span>
//             <span>Quantity: {message.quantity}</span>
//             <span>Pickup Address: {message.pickupAddress}</span>
//             <span>Transporter: {message.transporter}</span>
//             <span>Price: {message.price}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TransporterDashboard;

