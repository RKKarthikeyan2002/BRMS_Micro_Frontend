import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function UpdateBike() {
    const location = useLocation();
    const { bike } = location.state || {};
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ type: '', src: '' });
    const [status, setStatus] = useState(bike?.status || '');
    const [videoFile, setVideoFile] = useState(null);
    const [rentalRate, setRentalRate] = useState({ ratePerHour: '', ratePerDay: '' });

    if (!bike) {
        return <p>No bike information available.</p>;
    }

    // Handle video file change
    const handleVideoChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    // Upload video file
    const updateBike = () => {
        if (!videoFile) {
            alert("Please select a video file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('ratePerHour', rentalRate.ratePerHour)
        formData.append('ratePerDay', rentalRate.ratePerDay);
        formData.append('bikeId', bike.id);

        axios.post(`http://localhost:8080/bike/updateBike`, formData)
            .then(response => {
                alert("Bike Updated successfully.");
                navigate("/staffHome")
            })
            .catch(error => {
                console.error("There was an error uploading the video!", error);
            });
    };

    const handleRentalRateChange = (event) => {
        const { name, value } = event.target;
        setRentalRate(prevRate => ({
            ...prevRate,
            [name]: value
        }));
    };

    const handleViewDocument = (documentType) => {
        const documentData = bike[documentType];
        if (!documentData) {
            alert("No document available.");
            return;
        }
        const mimeType = 'application/pdf';
        const src = `data:${mimeType};base64,${documentData}`;
        setModalContent({
            type: mimeType,
            src
        });
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header as="h5">Bike Details</Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4}>
                                    {bike.image && (
                                        <img
                                            src={`data:image/jpeg;base64,${bike.image}`}
                                            alt={bike.model}
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    )}
                                </Col>
                                <Col md={8}>
                                    <h5>{bike.brand} {bike.model}</h5>
                                    <p><strong>Number:</strong> {bike.number}</p>
                                    <p><strong>Year:</strong> {bike.year}</p>
                                    <p><strong>KM:</strong> {bike.km}</p>
                                    <p><strong>Rating:</strong> {bike.rating}</p>
                                    <p><strong>Status:</strong> {status}</p>

                                    <div className="mt-3">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('aadhar')}
                                            className="me-2"
                                        >
                                            View Aadhar
                                        </Button>
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('rc')}
                                        >
                                            View RC
                                        </Button>
                                    </div>

                                    {/* File input for video upload */}
                                    <Form.Group className="mt-3">
                                        <Form.Label>Upload Bike Video</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                        />
                                    </Form.Group>

                                    {/* Rental Rate Form */}
                                    <Form className="mt-4">
                                        <Form.Group controlId="ratePerHour">
                                            <Form.Label>Rate Per Hour</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ratePerHour"
                                                value={rentalRate.ratePerHour}
                                                onChange={handleRentalRateChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="ratePerDay">
                                            <Form.Label>Rate Per Day</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ratePerDay"
                                                value={rentalRate.ratePerDay}
                                                onChange={handleRentalRateChange}
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            onClick={updateBike}
                                            className="mt-2"
                                        >
                                            Update Bike
                                        </Button>
                                    </Form>
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
                    {modalContent.type.startsWith('image') && (
                        <img
                            src={modalContent.src}
                            alt="Document"
                            style={{ width: '100%', height: 'auto' }}
                        />
                    )}
                    {modalContent.type.startsWith('video') && (
                        <video
                            controls
                            src={modalContent.src}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    )}
                    {modalContent.type.startsWith('application/pdf') && (
                        <iframe
                            src={modalContent.src}
                            style={{ width: '100%', height: '500px' }}
                            frameBorder="0"
                        />
                    )}
                    {!modalContent.type.startsWith('image') && !modalContent.type.startsWith('video') && !modalContent.type.startsWith('application/pdf') && (
                        <p>No preview available</p>
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

export default UpdateBike;
