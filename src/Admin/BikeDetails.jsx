import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Badge, Alert } from 'react-bootstrap';
import { FaCamera, FaFilePdf, FaVideo, FaThumbsUp, FaThumbsDown, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function BikeDetails() {
    const location = useLocation();
    const { bike } = location.state || {};
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [status, setStatus] = useState(bike?.status || '');
    const [reviews, setReviews] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [userLocation, setUserLocation] = useState(null);
    const [showPaymentsModal, setShowPaymentsModal] = useState(false);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/review/${bike.id}`);
                setReviews(response.data);
            } catch (error) {
                console.error("There was an error fetching reviews!", error);
            }
        };

        if (bike && bike.id) {
            fetchReviews();
        }
    }, [bike]);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                error => console.error("Error getting geolocation", error)
            );
        }
    }, []);

    if (!bike) {
        return <p className="text-center">No bike information available.</p>;
    }

    const updateBikeStatus = (newStatus) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#28a745",
            cancelButtonColor: "#dc3545",
            confirmButtonText: "Yes"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('status', newStatus);
                try {
                    await axios.patch(`http://localhost:8080/bike/${bike.id}`, formData);
                    setStatus(newStatus);
                    await Swal.fire({
                        title: "Status Updated!",
                        text: "Bike status has been updated.",
                        icon: "success",
                        confirmButtonColor: "#28a745"
                    });
                    const mailData = new FormData();
                    mailData.append('status', newStatus);
                    mailData.append('customerName', bike.customer.name);
                    mailData.append('customerMail', bike.customer.email);
                    mailData.append('bikeNo', bike.number);
                    await axios.post(`http://localhost:8080/mail/bikeStatus`, mailData);
                    navigate("/adminHome");
                } catch (error) {
                    console.error("There was an error updating the bike status!", error);
                }
            }
        });
    };

    const handleAccept = () => {
        updateBikeStatus('Accepted');
    };

    const handleReject = () => {
        updateBikeStatus('Rejected');
    };

    const handleViewDocument = (documentType) => {
        const documentBase64 = bike[documentType];
        if (documentBase64) {
            let type = documentType === 'aadhar' || documentType === 'rc' ? 'application/pdf' : 'image/jpeg';

            setContentType(type);
            setModalContent(`data:${type};base64,${documentBase64}`);
            setShowModal(true);
        }
    };

    const handleCloseModal = () => setShowModal(false);

    const handleShowVideo = () => {
        setShowVideoModal(true);
    };

    const handleCloseVideoModal = () => {
        setShowVideoModal(false);
    };

    const handleTrack = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }),
                error => console.error("Error getting geolocation", error)
            );
        }
        setShowMap(true);
    };

    const handleCloseMap = () => setShowMap(false);

    const fetchPayments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/payments/all/bike/${bike.id}`);
            setPayments(response.data);
            setShowPaymentsModal(true);
        } catch (error) {
            console.error('Error fetching payment details:', error);
        }
    };

    return (
        <Container className='my-4'>
            <Row className="shadow-lg rounded-lg border border-primary bg-light p-3">
                <Col>
                    <Card>
                        <Card.Header as="h5" className="bg-primary text-white">
                            Bike Details
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4} className="d-flex flex-column align-items-center">
                                    {bike.image && (
                                        <img
                                            src={`data:image/jpeg;base64,${bike.image}`}
                                            alt={bike.model}
                                            className="img-fluid rounded shadow-sm mb-3"
                                            style={{ maxHeight: '300px' }}
                                        />
                                    )}
                                    {bike.video && (
                                        <div className="mb-3">
                                            <h6>Bike Video</h6>
                                            <Button
                                                variant="info"
                                                onClick={handleShowVideo}
                                            >
                                                <FaVideo className="me-2" /> Show Video
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                                <Col md={8}>
                                    <p><strong>Owner Name:</strong> {bike.customer.name}</p>
                                    <p><strong>Owner Email:</strong> {bike.customer.email}</p>
                                    <h5>{bike.brand} {bike.model}</h5>
                                    <p><strong>Number:</strong> {bike.number}</p>
                                    <p><strong>Year:</strong> {bike.year}</p>
                                    <p><strong>KM:</strong> {bike.km}</p>
                                    <p><strong>Status:</strong> <Badge pill bg={status === 'Accepted' || status === 'Available' ? 'success' : status === 'Rejected' ? 'danger' : 'warning'}>{status}</Badge></p>

                                    <div className="mt-3">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('aadhar')}
                                            className="me-2"
                                        >
                                            <FaFilePdf className="me-2" /> View Aadhar
                                        </Button>
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('rc')}
                                        >
                                            <FaFilePdf className="me-2" /> View RC
                                        </Button><br/>
                                        {status === 'Rented' && 
                                            <Button
                                                variant="info"
                                                onClick={handleTrack}
                                                className="m-2"
                                            >
                                                <FaMapMarkerAlt className="me-2" /> Track
                                            </Button>
                                        }
                                        <Button
                                            variant="info"
                                            onClick={fetchPayments}
                                            className="mt-2"
                                        >
                                            Show Payments
                                        </Button>
                                    </div>

                                    {status === 'Pending' && (
                                        <div className='mt-3'>
                                            <Button
                                                variant="success"
                                                onClick={handleAccept}
                                                className="align-item-center me-2"
                                            >
                                                <FaThumbsUp className="d-flex me-2" /> Accept
                                            </Button>
                                            <Button
                                                variant="danger"
                                                onClick={handleReject}
                                            >
                                                <FaThumbsDown className="me-2" /> Reject
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header as="h5">Customer Reviews</Card.Header>
                        <Card.Body>
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <Card key={review.id} className="mb-3 text-start">
                                        <Card.Body>
                                            <Card.Title>{review.customer ? review.customer.name : 'Anonymous'}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{(review.date)}</Card.Subtitle>
                                            <Card.Text>
                                                <strong>Rating:</strong> {review.rating} ⭐<br />
                                                <strong>Comment:</strong> {review.comment}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <Alert variant="info">No reviews yet.</Alert>
                            )}
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
                            className="img-fluid rounded shadow-sm"
                            style={{ maxHeight: '500px' }}
                        />
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

            <Modal show={showVideoModal} onHide={handleCloseVideoModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Bike Video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bike.video && (
                        <video controls className="w-100" style={{ maxHeight: '500px' }} autoPlay loop>
                            <source src={`data:video/mp4;base64,${bike.video}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseVideoModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showMap} onHide={handleCloseMap} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Track Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MapContainer center={userLocation || { lat: 51.505, lng: -0.09 }} zoom={13} style={{ height: '500px', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {userLocation && (
                            <Marker position={userLocation}>
                                <Popup>{bike.number}</Popup>
                            </Marker>
                        )}
                        {bike.location && (
                            <Marker position={bike.location}>
                                <Popup>Bike location</Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseMap}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPaymentsModal} onHide={() => setShowPaymentsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Payment Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {payments.length > 0 ? (
                        payments.map((payment, index) => (
                            <Card key={index} className="mb-3 text-start">
                                <Card.Body>
                                    <Card.Title>Payment {index + 1}</Card.Title>
                                    <p><strong>Name:</strong> {payment.booking.customer.name}</p>
                                    <p><strong>Type:</strong> {payment.name}</p>
                                    <p><strong>Amount:</strong> {payment.amount}</p>
                                    <p><strong>Status:</strong> Paid</p>
                                </Card.Body>
                            </Card>
                        ))
                    ) : (
                        <p>No payment details available.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPaymentsModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default BikeDetails;
