import React, { useState, useEffect } from 'react';
import { parseISO, eachDayOfInterval } from 'date-fns';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function BookBike() {
  const location = useLocation();
  const { bike } = location.state || {};
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dates, setDates] = useState([]);
  const [error, setError] = useState('');
  const [customerStatus, setCustomerStatus] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState({
    rating: '',
    comment: ''
  });

  useEffect(() => {
    const customerId = sessionStorage.getItem('customerId');
    if (!customerId) {
      navigate('/login');
      return;
    }

    const fetchCustomerStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/customer/${customerId}`);
        setCustomerStatus(response.data.status);
      } catch (error) {
        console.error("There was an error fetching customer data!", error);
      }
    };

    fetchCustomerStatus();
  }, [navigate]);

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

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);
    if (endDate && new Date(selectedStartDate) >= new Date(endDate)) {
      setEndDate(''); 
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleGenerateDates = () => {
    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      if (start <= end) {
        const range = eachDayOfInterval({ start, end });
        setDates(range);
        setError('');
      } else {
        setError('End date must be after start date.');
      }
    } else {
      setError('Please select both start and end dates.');
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReview((prevReview) => ({
      ...prevReview,
      [name]: value
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
        const customerId = sessionStorage.getItem('customerId');

        // Create a new FormData object
        const formData = new FormData();
        formData.append('rating', review.rating);
        formData.append('comment', review.comment);
        formData.append('bike.id', bike.id);
        formData.append('customer.id', customerId);

        // Send the FormData object with axios
        await axios.post(`http://localhost:8080/review`, formData);

        setReview({ rating: '', comment: '' });
        handleCloseModal();

        // Refresh reviews after submission
        const response = await axios.get(`http://localhost:8080/review/${bike.id}`);
        setReviews(response.data);
      } catch (error) {
          console.error("There was an error submitting the review!", error);
      }
  };

  if (!bike) {
    return <Alert variant="danger">No bike information available.</Alert>;
  }

  return (
    <Container className="mt-4 p-3">
      <Row className="mb-4">
        <Col>
          <Card style={{ minHeight: '400px' }}>
            <Card.Header as="h5">Bike Details</Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  {bike.image && (
                    <Card.Img
                      variant="top"
                      src={`data:image/jpeg;base64,${bike.image}`}
                      alt={bike.model}
                      style={{
                        height: '400px',
                        width: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                </Col>
                <Col md={6}>
                  <Row>
                    <Col md={6}>
                      <Card.Text>
                        <strong>Brand:</strong> {bike.brand}<br />
                        <strong>Model:</strong> {bike.model}<br />
                        <strong>Number:</strong> {bike.number}<br />
                        <strong>Year:</strong> {bike.year}<br />
                      </Card.Text>
                      <strong style={{ fontSize: '1.5rem', color: '#28a745' }}>Price Per Day:</strong><br />
                      <span style={{ fontSize: '1.25rem' }}>₹ {bike.rentalRate ? bike.rentalRate.ratePerDay : 'Not Available'}</span><br/>
                    </Col>
                    <Col md={6}>
                      <Card.Text>
                        <strong>Description:</strong> {bike.description}<br />
                        <strong>Mileage:</strong> {bike.km}<br />
                        <strong>Rating:</strong> {bike.rating}<br />
                        <strong>Status:</strong> {bike.status}<br/>
                      </Card.Text>
                      <strong style={{ fontSize: '1.5rem', color: '#007bff' }}>Reviews:</strong><br />
                      <span style={{ fontSize: '1.25rem' }}>{bike.rating} ⭐</span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-end">
              {customerStatus.toLowerCase() === 'no' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => navigate('/bookingForm', { state: { bike } })}
                  >
                    Book Bike
                  </Button>
                </>
              )}
            </Card.Footer>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header as="h5">Customer Reviews</Card.Header>
            <Card.Body>
              <div className='text-end mb-3'>
              <Button
                    variant="secondary"
                    className="ms-2"
                    onClick={handleShowModal}
                  >
                    Add Review
                  </Button>
              </div>
                  
              {reviews.length > 0 ? (
                reviews.map(review => (
                  <Card key={review.id} className="mb-3 text-start">
                    <Card.Body>
                      <Card.Title>{review.customer ? review.customer.name : 'Anonymous'}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">{review.date}</Card.Subtitle>
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

      {/* Add Review Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitReview}>
          <Form.Group className="mb-3" controlId="formRating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              as="select"
              name="rating"
              value={review.rating}
              onChange={handleReviewChange}
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
            <Form.Group className="mb-3" controlId="formComment">
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                name="comment"
                value={review.comment}
                onChange={handleReviewChange}
                rows={3}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default BookBike;
