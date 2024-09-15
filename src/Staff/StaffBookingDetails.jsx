import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function StaffBookingDetails() {
    const location = useLocation();
    const { booking } = location.state || {};
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [status, setStatus] = useState(booking?.status || '');
    const [showDamageModal, setShowDamageModal] = useState(false);
    const [damageDescription, setDamageDescription] = useState('');
    const [damageAmount, setDamageAmount] = useState('');
    const [damageImage, setDamageImage] = useState(null);

    if (!booking) {
        return <p>No booking information available.</p>;
    }

    const handlePay = () => {
        var options = {
            key: "rzp_test_9vsq6MuVh66nrN",
            key_secret: "rJ3Eo3YAa0At1idkuoADsd9A",
            amount: '1' * 100,
            currency: "INR",
            name: "R K BIKES",
            description: "Test Transaction",
            handler: function (response) {
                savePaymentInfo(response.razorpay_payment_id);
            },
            notes: {
                address: "R K Bike office"
            },
            prefill: {
                name: booking.name,
                email: booking.customer.email,
                contact: "9360425657"
            },
            theme: {
                color: "#F37254"
            }
        };
        var rzp1 = new window.Razorpay(options);
        rzp1.open();
    };

    const savePaymentInfo = async (paymentId) => {
        try {
            const formData = new FormData();
            formData.append('paymentId', paymentId);
            if (booking.advanceStatus !== 'paid') {
                formData.append('name', 'Balance amount');
            } else {
                formData.append('name', 'Advance amount');
            }
            formData.append('amount', booking.advance);
            formData.append('bookingId', booking.id);

            const response = await axios.post('http://localhost:8080/payments/save', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set the content type for FormData
                }
            });
            console.log('Payment info saved:', response.data);

            const formData1 = new FormData();
            formData1.append('status', "paid");

            if (booking.advanceStatus !== 'paid') {
                await axios.patch(`http://localhost:8080/booking/advanceStatus/${booking.id}`, formData1);
                updateBookingStatus("Rented");
            } else {
                await axios.patch(`http://localhost:8080/booking/totalStatus/${booking.id}`, formData1);
                updateBookingStatus("Closed");
            }

            navigate("/");
        } catch (error) {
            console.error('Error saving payment info:', error);
        }
    };

    const updateBookingStatus = (newStatus) => {
        const formData = new FormData();
        formData.append('status', newStatus);
        axios.patch(`http://localhost:8080/booking/${booking.id}`, formData)
            .then(response => {
                setStatus(newStatus);
                navigate("/staffHome");
            })
            .catch(error => {
                console.error("There was an error updating the booking status!", error);
            });
    };

    const handleViewDocument = (documentType) => {
        const documentBase64 = booking[documentType];
        if (documentBase64) {
            let type = 'image'; // Assuming document is PDF, adjust if necessary
            setContentType(type);
            setModalContent(`data:${type};base64,${documentBase64}`);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    const handleAddDamage = () => {
        const formData = new FormData();
        formData.append('amount', damageAmount);
        formData.append('description', damageDescription);
        formData.append('image', damageImage);
        formData.append('bike', booking.bike.id);

        axios.post('http://localhost:8080/damage/add', formData)
        .then(response => {
            const updatedTotalAmount = booking.totalAmount + parseFloat(damageAmount);

            const bookingData = new FormData();
            bookingData.append('totalAmount', updatedTotalAmount);

            return axios.patch(`http://localhost:8080/booking/addDamageAmount/${booking.id}`, bookingData);
        })
        .then(() => {
            console.log('Damage added and total amount updated');
            setShowDamageModal(false);
            navigate(0); 
        })
        .catch(error => {
            console.error('Error adding damage:', error);
        });
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header as="h5">Booking Details</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    {booking.bike.image && (
                                        <img
                                            src={`data:image/jpeg;base64,${booking.bike.image}`}
                                            alt={booking.bike.model}
                                            style={{ width: '100%', height: 'auto', height: '400px' }}
                                        />
                                    )}
                                </Col>
                                <Col md={6}>
                                    <h5>{booking.bike.number}</h5>
                                    <h5>{booking.bike.brand}</h5>
                                    <h5>{booking.bike.model}</h5>
                                    <h5>{booking.name}</h5>
                                    <p><strong>Age:</strong> {booking.age}</p>
                                    <p><strong>From Date:</strong> {new Date(booking.fromDate).toLocaleDateString()}</p>
                                    <p><strong>To Date:</strong> {new Date(booking.toDate).toLocaleDateString()}</p>
                                    <p><strong>Advance amount:</strong> {booking.advance}</p>
                                    <p><strong>Advance Status:</strong> {booking.advanceStatus}</p>
                                    <p><strong>Total amount:</strong> {booking.totalAmount}</p>
                                    <p><strong>Status:</strong> {status}</p>

                                    <div className="mt-3">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('license')}
                                            className="me-2"
                                        >
                                            View License
                                        </Button>
                                        {booking.status !== 'Closed' && (
                                            booking.status === 'Confirmed' && booking.advanceStatus !== 'paid' ? (
                                                <Button
                                                    variant="primary"
                                                    onClick={handlePay}
                                                    className="me-2"
                                                >
                                                    Pay Advance
                                                </Button>
                                            ) : booking.status !== 'Rented' ? (
                                                <Button
                                                    variant="success"
                                                    onClick={() => updateBookingStatus('Rented')}
                                                    className="me-2"
                                                >
                                                    Mark as Rented
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="success"
                                                    className="me-2"
                                                    onClick={handlePay}
                                                >
                                                    Pay Balance Amount
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Document View</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {contentType.startsWith('image') ? (
                        <img
                            src={modalContent}
                            alt="Document"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    ) : contentType.startsWith('video') ? (
                        <video controls style={{ width: '100%', height: 'auto' }}>
                            <source src={modalContent} type={contentType} />
                            Your browser does not support the video tag.
                        </video>
                    ) : contentType.startsWith('application/pdf') ? (
                        <iframe
                            src={modalContent}
                            style={{ width: '100%', height: '500px' }}
                            title="PDF Document"
                        />
                    ) : (
                        <p>No content available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDamageModal} onHide={() => setShowDamageModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Add Damage</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="damageDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter damage description"
                                value={damageDescription}
                                onChange={(e) => setDamageDescription(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="damageAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter damage amount"
                                value={damageAmount}
                                onChange={(e) => setDamageAmount(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="damageImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setDamageImage(e.target.files[0])}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddDamage}>
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDamageModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default StaffBookingDetails;
