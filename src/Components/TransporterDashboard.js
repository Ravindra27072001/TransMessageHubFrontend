import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import '../Css/TransporterDashboard.css';
import transporterService from '../Services/transporterService';
import orderService from '../Services/orderService';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransporterDashboard = () => {

    const [socket, setSocket] = useState(null);
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [price, setPrice] = useState('');
    const [refreshDashboard, setRefreshDashboard] = useState(false);

    useEffect(() => {
        fetchOrders();
        const newSocket = io('http://localhost:3000');
        newSocket.emit('joinTransporter', localStorage.getItem('transporterEmail'));
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [refreshDashboard]);

    useEffect(() => {
        if (socket) {
            socket.on('receiveReplyFromManufacturer', async (replyMessage) => {
                console.log('Received reply from Manufacturer:', replyMessage);

                const response = await orderService.sendOrdersToTransporter(replyMessage);
                console.log(response)
                setRefreshDashboard(prevState => !prevState);
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
            socket.emit('sendReplyToManufacturer', replyData);
        }

        const response = await transporterService.deleteOrders(selectedOrderId);
        console.log(response);
        fetchOrders();

        toast.success("Reply Sent", {
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
