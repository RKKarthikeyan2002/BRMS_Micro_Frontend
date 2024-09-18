import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';

function OwnerBikeDetails() {
    const location = useLocation();
    const { bike } = location.state || {};

    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [contentType, setContentType] = useState('');
    const [showVideoModal, setShowVideoModal] = useState(false);

    if (!bike) {
        return <p>No bike information available.</p>;
    }

    const handleViewDocument = (documentType) => {
        const documentBase64 = bike[documentType];
        if (documentBase64) {
            let type = 'application/pdf';
            
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
                                            src={bike.image}
                                            alt={bike.model}
                                            style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                                        />
                                    )}
                                    {bike.video && (
                                        <div className="mb-3">
                                            <h6>Bike Video</h6>
                                            <Button
                                                variant="info"
                                                onClick={handleShowVideo}
                                            >
                                                Show Video
                                            </Button>
                                        </div>
                                    )}
                                </Col>
                                <Col md={8}>
                                    <h5>{bike.brand} {bike.model}</h5>
                                    <p><strong>Number:</strong> {bike.number}</p>
                                    <p><strong>Year:</strong> {bike.year}</p>
                                    <p><strong>KM:</strong> {bike.km}</p>
                                    <p><strong>Rating:</strong> {bike.rating}</p>
                                    <p><strong>Status:</strong> {bike.status}</p>
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
                        <video controls style={{ width: '100%', height: '500px', objectFit: 'cover' }}>
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

            <Modal show={showVideoModal} onHide={handleCloseVideoModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Bike Video</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {bike.video && (
                        <video controls className="w-100" style={{ maxHeight: '500px' }} autoPlay loop>
                            <source src={`data:video/mp4;base64,${bike.video}`} type="video/mp4"/>
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
        </Container>
    );
}

export default OwnerBikeDetails;
