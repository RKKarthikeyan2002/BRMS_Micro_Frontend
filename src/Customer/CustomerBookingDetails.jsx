import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

function CustomerBookingDetails() {
    const location = useLocation();
    const { booking } = location.state || {};
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [status, setStatus] = useState(booking?.status || '');
    const [advanceStatus, setAdvanceStatus] = useState('');
    const [paymentDetails, setPaymentDetails] = useState([]); // State to store payment details

    useEffect(() => {
        if (booking) {
            // Fetch payment details when booking is available
            const fetchPaymentDetails = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/payments/all/booking/${booking.id}`);
                    setPaymentDetails(response.data);
                } catch (error) {
                    console.error('Error fetching payment details:', error);
                }
            };

            fetchPaymentDetails();
        }
    }, [booking]);

    if (!booking) {
        return <p>No booking information available.</p>;
    }

    const handleViewDocument = (documentType) => {
        const documentBase64 = booking[documentType];
        if (documentBase64) {
            let type = 'image'; // Assuming document is image, adjust if necessary
            setContentType(type);
            setModalContent(`data:${type};base64,${documentBase64}`);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => setShowModal(false);

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
            formData.append('name', 'Advance amount');
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
            await axios.patch(`http://localhost:8080/booking/advanceStatus/${booking.id}`, formData1);
            
            navigate("/");
        } catch (error) {
            console.error('Error saving payment info:', error);
        }
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
                                    <h5>{booking.bike.brand} {booking.bike.model}</h5>
                                    <h5>{booking.name}</h5>
                                    <p><strong>Age:</strong> {booking.age}</p>
                                    <p><strong>Phone:</strong> {booking.phone}</p>
                                    <p><strong>From Date:</strong> {new Date(booking.fromDate).toLocaleDateString()}</p>
                                    <p><strong>To Date:</strong> {new Date(booking.toDate).toLocaleDateString()}</p>
                                    <p><strong>Status:</strong> {status}</p>

                                    <div className="mt-3">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('license')}
                                            className="me-2"
                                        >
                                            View License
                                        </Button>
                                        {booking.status === 'Confirmed' && booking.advanceStatus !== 'paid' && (
                                            <Button
                                                variant="success"
                                                onClick={handlePay}
                                            >
                                                Pay
                                            </Button>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                {paymentDetails.length > 0 ? (
                                    paymentDetails.map((payment, index) => (
                                        <Col key={index} md={4} className="mb-3">
                                            <Card>
                                                <Card.Header as="h5">Payment Details</Card.Header>
                                                <Card.Body>
                                                    <p><strong>Payment Type:</strong> {payment.name}</p>
                                                    <p><strong>Amount:</strong> {payment.amount}</p>
                                                    <p><strong>Status:</strong> Paid</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))
                                ) : (
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <p>No payment details available.</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                )}
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
        </Container>
    );
}

export default CustomerBookingDetails;
