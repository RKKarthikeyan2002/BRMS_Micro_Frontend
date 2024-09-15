// src/BookingDetails.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

function BookingDetails() {
    const location = useLocation();
    const { booking } = location.state || {};
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [status, setStatus] = useState(booking?.status || '');

    if (!booking) {
        return <p>No booking information available.</p>;
    }

    // Update booking status
    const updateBookingStatus = (newStatus) => {
        const formData = new FormData();
        formData.append('status', newStatus);
        axios.patch(`http://localhost:8080/booking/${booking.id}`, formData)
            .then(response => {
                setStatus(newStatus);
                navigate("/adminBookingRequests");
            })
            .catch(error => {
                console.error("There was an error updating the booking status!", error);
            });
    };

    const handleAccept = () => {
        updateBookingStatus('Confirmed');
    };

    const handleReject = () => {
        updateBookingStatus('Rejected');
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
                                    <p><strong>Status:</strong> {status}</p>

                                    <div className="mt-3">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('license')}
                                            className="me-2"
                                        >
                                            View License
                                        </Button>
                                    </div>

                                    {status === 'Pending' && (
                                        <div className='mt-3'>
                                            <Button
                                                variant="success"
                                                onClick={handleAccept}
                                                className="me-2"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={handleReject}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    )}
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
        </Container>
    );
}

export default BookingDetails;
