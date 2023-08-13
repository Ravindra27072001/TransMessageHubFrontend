import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import '../Css/ManufacturerDashboard.css';

import manufacturerService from '../Services/manufacturerService';
import messageService from '../Services/messageService';
import io from 'socket.io-client';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManufacturerForm = () => {

    const [socket, setSocket] = useState(null);
    const [replies, setReplies] = useState([]);
    const [transporters, setTransporters] = useState([]);
    const [pickupAddress, setPickupAddress] = useState('');
    const [refreshPage, setRefreshPage] = useState(false);


    useEffect(() => {
        fetchTransporters();
        showReplies();

        connectSocket();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [refreshPage]);

    useEffect(() => {
        if (socket) {
            socket.on('receiveReplyFromTransporter', async (data) => {
                console.log('Received reply from transporter:', data);
                setRefreshPage(prevState => !prevState);

                const messageData = {
                    orderID: data.orderID,
                    from: data.from,
                    to: data.to,
                    quantity: data.quantity,
                    pickupAddress: data.pickupAddress,
                    price: data.price,
                    transporter: data.transporter,
                    manufacturer: data.manufacturer,
                };
                try {
                    await messageService.replyFromTransporter(messageData);
                    
                } catch (error) {
                    console.error('Error fetching replies:', error);
                }

            });
        }
    }, [socket]);

    const connectSocket = () => {
        const newSocket = io('http://localhost:3000');
        newSocket.emit('joinManufacturer', localStorage.getItem('manufacturerEmail'));
        setSocket(newSocket);
    };

    const generateUniqueOrderID = () => {
        const prefix = 'XB';
        const randomNumber = Math.floor(Math.random() * 1000);
        return `${prefix}${randomNumber}`;
    };

    const showReplies = async () => {
        try {
            const response = await messageService.showReplies(localStorage.getItem('manufacturerEmail'));
            console.log(response.data);
            setReplies(response.data);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    }

    const fetchTransporters = async () => {
        try {
            const response = await manufacturerService.getTransportersLists();
            // console.log(response);

            const data = response.filter(user => user.role === 'Transporter');
            // console.log(data);


            const userData = response.find((user) => user.email === localStorage.getItem('manufacturerEmail'));
            // console.log(userData.pickupAddress);

            if (userData) {
                setPickupAddress(userData.pickupAddress || '');
            }
            setTransporters(data);

        } catch (error) {
            console.error('Error fetching transporters:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
            const messageData = {
                orderID: values.orderID,
                from: values.from,
                to: values.to,
                quantity: values.quantity,
                pickupAddress: pickupAddress,
                transporter: values.transporter,
                manufacturer: localStorage.getItem('manufacturerEmail'),
            };
            // console.log(messageData);
            // console.log(localStorage.getItem('manufacturerEmail'));
            // const response = await orderService.sendOrdersToTransporter(messageData);
            // console.log(response)

            if (socket) {
                socket.emit('sendOrderToTransporter', messageData);
            }    

            toast.success("Order sent successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            });

            // console.log('Message sent successfully:');
        } catch (error) {
            toast.error("Something went wrong...", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            });
            // console.error('Error sending message:', error);
        }
    }

    return (
        <div>
            <div className="form-container">
                <div className="manufacturer-form">
                    <h2>Manufacturer Form</h2>
                    <Formik
                        initialValues={{
                            orderID: generateUniqueOrderID(),
                            from: '',
                            to: '',
                            quantity: '',
                            transporter: '',
                        }}
                        onSubmit={handleSubmit}
                    >
                        {({ values, handleChange }) => (
                            <Form>

                                <div className="form-row selectors">
                                    <label>Order ID:</label>
                                    <Field type="text" name="orderID" readOnly />

                                    <label>From:</label>
                                    <Field type="text" name="from" />

                                    <label>To:</label>
                                    <Field type="text" name="to" />
                                </div>

                                <div className="form-row quantity-transporter">
                                    <label>Quantity:</label>
                                    <Field as="select" name="quantity">
                                        <option value="">Select Quantity</option>
                                        <option value="1">1 ton</option>
                                        <option value="2">2 ton</option>
                                        <option value="3">3 ton</option>
                                    </Field>

                                    <label>Pickup Address:</label>
                                    <Field type="text" name="pickupAddress" readOnly value={pickupAddress} />
                                </div>

                                <div className="form-row quantity-transporter">
                                    <label>Transporter:</label>
                                    <Field as="select" name="transporter" value={values.transporter} onChange={handleChange}>
                                        <option value="">Select Transporter</option>
                                        {transporters.map((transporter) => (
                                            <option key={transporter._id} value={transporter.email}>
                                                {transporter.email}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                <button type="submit">Submit</button>
                            </Form>
                        )}
                    </Formik>
                </div>


            </div>
            <div className="form-container">
                <h2>Messages</h2>
                <div className="messages">
                    {replies.map((reply) => (
                        <div key={reply._id}>
                            <div className="message-content">
                                <p className="order-id">Order ID: {reply.orderID}</p>
                                <p className="location">From: {reply.from}</p>
                                <p className="location">To: {reply.to}</p>
                                <p className="quantity">Quantity: {reply.quantity} ton</p>
                                <p className="address">Pickup Address: {reply.pickupAddress}</p>
                                <p className="transporter">Transporter: {reply.transporter}</p>
                                <p className="price">Price: {reply.price}</p>
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>

        </div>

    );
};

export default ManufacturerForm;
