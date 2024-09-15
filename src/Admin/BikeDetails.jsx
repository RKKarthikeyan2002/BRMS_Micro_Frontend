import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';

function BikeDetails() {
    const location = useLocation();
    const { bike } = location.state || {};
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [status, setStatus] = useState(bike?.status || '');

    if (!bike) {
        return <p>No bike information available.</p>;
    }

    // Update bike status
    const updateBikeStatus = (newStatus) => {
        const formData = new FormData();
        formData.append('status', newStatus);

        axios.patch(`http://localhost:8080/bike/${bike.id}`, formData)
            .then(response => {
                setStatus(newStatus);
                navigate("/adminHome");
            })
            .catch(error => {
                console.error("There was an error updating the bike status!", error);
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
            let type;
            type = 'application/pdf';
            
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

export default BikeDetails;
