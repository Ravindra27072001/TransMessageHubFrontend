import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import '../Css/ManufacturerDashboard.css';
import manufacturerService from '../Services/manufacturerService';
import orderService from '../Services/orderService';
import messageService from '../Services/messageService';
import io from 'socket.io-client';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManufacturerForm = () => {

    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [replies, setReplies] = useState([]);

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


    const [transporters, setTransporters] = useState([]);
    const [pickupAddress, setPickupAddress] = useState('');

    useEffect(() => {
        fetchTransporters();
        showReplies();

        connectSocket();
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('receiveReply', async (data) => {
                console.log('Received reply from transporter:', data);
                console.log(data)

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
                    console.log("wedsjghnbds")
                    await messageService.replyFromTransporter(messageData);
                    console.log("ejhgdghsah")
                    // showReplies();

                } catch (error) {
                    console.error('Error fetching replies:', error);
                }


                // getOrdersByOrderId();
            });
        }
    }, [socket]);

    const showReplies = async () => {
        try {
            console.log("object")
            const response = await messageService.showReplies(localStorage.getItem('manufacturerEmail'));
            console.log(response.data);
            setReplies(response.data);
            console.log(replies);
        } catch (error) {
            console.error('Error fetching orderId:', error);
        }
    }

    const fetchTransporters = async () => {
        try {
            const response = await manufacturerService.getTransportersLists();
            console.log(response);
            console.log(response[0].email)

            const data = response.filter(user => user.role === 'Transporter');
            console.log(data);


            const userData = response.find((user) => user.email === localStorage.getItem('manufacturerEmail'));
            console.log(userData.pickupAddress);

            if (userData) {
                setPickupAddress(userData.pickupAddress || '');
            }

            setTransporters(data);

            const getOrders = await orderService.getOrders(localStorage.getItem('manufacturerEmail'));
            console.log(getOrders);
            setMessages(getOrders);

            // console.log(messages);


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
            console.log(messageData);
            console.log(localStorage.getItem('manufacturerEmail'));
            const response = await orderService.sendOrdersToTransporter(messageData);

            console.log(response)


            // const newMessage = {
            //     ...messageData,
            //     sentBy: 'Manufacturer', // Indicate who sent the message
            // };

            toast.success("Order sent successfully", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            });

            console.log('Message sent successfully:');
        } catch (error) {
            toast.error("Something went wrong..", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1000,
            });
            console.error('Error sending message:', error);
        }
    }


    console.log(pickupAddress, "Pickup")
    console.log(replies);
    console.log(messages)

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
                        {({ values, handleChange, handleSubmit }) => (
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
