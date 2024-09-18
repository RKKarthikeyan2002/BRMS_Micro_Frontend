import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Badge, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaCalendarAlt, FaTachometerAlt, FaStar, FaPlus } from 'react-icons/fa';

function MyBikes() {
  const [bikes, setBikes] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const customerId = sessionStorage.getItem('customerId');
    if (customerId) {
      setCustomerId(customerId);

      axios.get(`http://localhost:8080/bike/${customerId}`)
        .then(response => {
          const bikesWithImages = response.data.map(bike => ({
            ...bike,
            image: bike.image ? `data:image/jpeg;base64,${bike.image}` : null
          }));
          setBikes(bikesWithImages);
        })
        .catch(error => {
          console.error("There was an error fetching the bikes!", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="d-flex justify-content-end mb-4">
        <Button variant="success" as={Link} to="/addBike" className="d-flex align-items-center shadow-lg hover:bg-success-subtle">
          <FaPlus size={18} className="me-2" />
          <span>Rent My Bike</span>
        </Button>
      </div>

      <Container>
        {bikes.length === 0 ? (
          <div className="text-center mt-5">
            <h4>You have no rented bikes.</h4>
            <p>Start renting bikes by clicking the button above.</p>
          </div>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4}>
            {bikes.map(bike => (
              <Col key={bike.id} className="mb-4 d-flex align-items-stretch">
                <Card className="shadow-lg border-0 rounded-lg w-100 hover:scale-105 transition-transform duration-300 ease-in-out">
                  {bike.image && (
                    <Card.Img
                      variant="top"
                      src={bike.image}
                      alt={`${bike.brand} ${bike.model}`}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body className="bg-light d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title className="text-primary mb-2">{bike.brand} {bike.model}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">Number: {bike.number}</Card.Subtitle>
                      <Card.Text>
                        <div className="d-flex align-items-center mb-1">
                          <FaCalendarAlt className="me-2 text-secondary" />
                          <span><strong>Year:</strong> {bike.year}</span>
                        </div>
                        <div className="d-flex align-items-center mb-1">
                          <FaTachometerAlt className="me-2 text-secondary" />
                          <span><strong>KM:</strong> {bike.km}</span>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                          <Badge bg={bike.status === 'Available' ? 'success' : bike.status === 'Rejected' ? 'danger' : 'warning'} className="me-2">
                            {bike.status}
                          </Badge>
                        </div>
                      </Card.Text>
                    </div>
                    <Button 
                      variant="primary"
                      onClick={() => navigate('/ownerBike', { state: { bike } })}
                      className="w-100 d-flex align-items-center"
                    >
                      <FaEye className="me-2" />
                      View Details
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default MyBikes;
