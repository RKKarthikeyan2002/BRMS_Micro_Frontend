import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { FaEye, FaUpload, FaEdit } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import Swal from 'sweetalert2';

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

    const handleVideoChange = (event) => {
        setVideoFile(event.target.files[0]);
    };

    const updateBike = async () => {
        if (!videoFile) {
            alert("Please select a video file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('ratePerHour', rentalRate.ratePerHour);
        formData.append('ratePerDay', rentalRate.ratePerDay);
        formData.append('bikeId', bike.id);

        await axios.post(`http://localhost:8080/bike/updateBike`, formData)
            .then(async response => {
                await Swal.fire({
                    title: "Bike Status Updated!",
                    icon: "success",
                    confirmButtonColor: "#28a745"
                });
                navigate("/staffHome");
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
        const mimeType = documentType === 'aadhar' ? 'application/pdf' : 'image/jpeg';
        const src = `data:${mimeType};base64,${documentData}`;
        setModalContent({ type: mimeType, src });
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    return (
        <Container fluid className="p-4">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow-lg border-primary w-200">
                        <Card.Header as="h4" className="bg-primary text-white">
                            <FaEdit className="me-2" /> Update Bike Details
                        </Card.Header>
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col md={4} className="text-center">
                                    {bike.image && (
                                        <img
                                            src={`data:image/jpeg;base64,${bike.image}`}
                                            alt={bike.model}
                                            className="img-fluid rounded"
                                        />
                                    )}
                                </Col>
                                <Col md={8}>
                                    <h4 className="text-primary">{bike.brand} {bike.model}</h4>
                                    <p><strong>Number:</strong> {bike.number}</p>
                                    <p><strong>Year:</strong> {bike.year}</p>
                                    <p><strong>KM:</strong> {bike.km}</p>
                                    <p><strong>Status:</strong> {status}</p>

                                    <div className="mt-3">
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('aadhar')}
                                            className=" align-items-center me-2"
                                        >
                                            <FaEye className="me-2" /> View Aadhar
                                        </Button>
                                        <Button
                                            variant="info"
                                            onClick={() => handleViewDocument('rc')}
                                            className=" align-items-center"
                                        >
                                            <FaEye className="me-2" /> View RC
                                        </Button>
                                    </div>

                                    <Form.Group className="mt-4">
                                        <Form.Label>Upload Bike Video</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="video/*"
                                            onChange={handleVideoChange}
                                        />
                                    </Form.Group>

                                    <Form className="mt-4">
                                        <Form.Group controlId="ratePerHour">
                                            <Form.Label>Rate Per Hour</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ratePerHour"
                                                value={rentalRate.ratePerHour}
                                                onChange={handleRentalRateChange}
                                                placeholder="Enter rate per hour"
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="ratePerDay">
                                            <Form.Label>Rate Per Day</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="ratePerDay"
                                                value={rentalRate.ratePerDay}
                                                onChange={handleRentalRateChange}
                                                placeholder="Enter rate per day"
                                            />
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            onClick={updateBike}
                                            className="d-flex align-items-center mt-2"
                                        >
                                            <FaUpload className="me-2" /> Update Bike
                                        </Button>
                                    </Form>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} size="lg" animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Document View</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalContent.type.startsWith('image') && (
                        <img
                            src={modalContent.src}
                            alt="Document"
                            className="img-fluid"
                        />
                    )}
                    {modalContent.type.startsWith('video') && (
                        <video
                            controls
                            src={modalContent.src}
                            className="w-100"
                        />
                    )}
                    {modalContent.type.startsWith('application/pdf') && (
                        <iframe
                            src={modalContent.src}
                            className="w-100"
                            style={{ height: '500px' }}
                            frameBorder="0"
                        />
                    )}
                    {!modalContent.type.startsWith('image') && !modalContent.type.startsWith('video') && !modalContent.type.startsWith('application/pdf') && (
                        <p>No preview available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal} className="d-flex align-items-center">
                        <AiOutlineClose className="me-2" /> Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default UpdateBike;
