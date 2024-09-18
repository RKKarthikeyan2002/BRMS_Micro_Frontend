// src/BookingDetails.js
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaIdCard, FaImage } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';

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
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
          }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('status', newStatus);
                await axios.patch(`http://localhost:8080/booking/${booking.id}`, formData)
                    .then(async response => {
                        setStatus(newStatus);
                        await Swal.fire({
                            title: "Status Updated!",
                            text: "Booking status has been updated.",
                            icon: "success"
                        });
                    })
                    .catch(error => {
                        console.error("There was an error updating the booking status!", error);
                    });
                    const mailData = new FormData();
                    mailData.append('status', newStatus);
                    mailData.append('customerName', booking.customer.name);
                    mailData.append('customerMail', booking.customer.email);
                    mailData.append('bikeNo', booking.bike.number);
                    await axios.post(`http://localhost:8080/mail/bookingStatus`, mailData)
                    navigate("/adminBookingRequests");
            }
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
            let type = 'image';
            setContentType(type);
            setModalContent(`data:${type};base64,${documentBase64}`);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container className="my-4">
            <Row>
                <Col>
                    <Card className="shadow-lg rounded">
                        <Card.Header as="h5" className="bg-primary text-white">
                            Booking Details
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="text-center">
                                    {booking.bike.image ? (
                                        <img
                                            src={`data:image/jpeg;base64,${booking.bike.image}`}
                                            alt={booking.bike.model}
                                            style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover' }}
                                            className="rounded mb-3"
                                        />
                                    ) : (
                                        <FaImage size={100} color="#aaa" />
                                    )}
                                </Col>
                                <Col md={6}>
                                    <div className="mb-3">
                                        <h5>{booking.bike.number}</h5>
                                        <h5>{booking.bike.brand} {booking.bike.model}</h5>
                                    </div>
                                    <div className="mb-3">
                                        <p><strong>Name:</strong> {booking.name}</p>
                                        <p><strong>Age:</strong> {booking.age}</p>
                                        <p><strong>Phone:</strong> {booking.phone}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p><strong>From Date:</strong> {new Date(booking.fromDate).toLocaleDateString()}</p>
                                        <p><strong>To Date:</strong> {new Date(booking.toDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="mb-3">
                                        <p><strong>Status:</strong> {status}</p>
                                    </div>

                                    <div className="mb-3">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('license')}
                                            className="me-2"
                                        >
                                            <FaIdCard className="me-2" />
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
                                                <FaCheckCircle className="me-2" />
                                                Accept
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={handleReject}
                                            >
                                                <FaTimesCircle className="me-2" />
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
