import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Badge, Spinner, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { AiOutlineEuro } from 'react-icons/ai';

function Bikes() {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/bike/all')
      .then(response => {
        const bikesWithImages = response.data.map(bike => ({
          ...bike,
          image: bike.image ? bike.image : null,
        }));
        setBikes(bikesWithImages);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the bikes!", error);
        setLoading(false);
      });
  }, []);

  const filteredBikes = bikes.filter(bike => {
    return (
      bike.brand.toLowerCase().includes(search.toLowerCase()) ||
      bike.model.toLowerCase().includes(search.toLowerCase()) ||
      bike.year.toString().includes(search)
    );
  });

  const handleBookBike = (bike) => () => {
    const customerId = sessionStorage.getItem('customerId');
    if (!customerId) {
      alert("please login!!!");
      return;
    }
    navigate('/viewBikeDetails', { state: { bike } })
  }

  return (
    <Container className='mt-4'>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3} className='text-end'>
              <Form.Group controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search by Brand, Model, Year"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    border: '1px solid #ced4da',
                    borderRadius: '4px'        
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          {filteredBikes.length == 0 ? (
            <Row className="justify-content-center">
              <Col xs={12} md={8} className="text-center">
                <h4>No bikes found</h4>
              </Col>
            </Row>
          ) : (
            <Row>
              {filteredBikes
                .filter(bike => bike.status.toLowerCase() === 'available' || bike.status.toLowerCase() === 'rented')
                .map(bike => (
                  <Col key={bike.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <Card className="h-100 position-relative shadow-lg border-0 rounded-3 overflow-hidden transition-transform hover:transform hover:scale-105">
                      {bike.status.toLowerCase() === 'available' && (
                        <Badge bg="success" className="position-absolute top-0 end-0 m-2 p-2 text-wrap" style={{ fontSize: '0.75rem' }}>
                          Available
                        </Badge>
                      )}
                      {bike.status.toLowerCase() === 'rented' && (
                        <Badge bg="warning" text="dark" className="position-absolute top-0 end-0 m-2 p-2 text-wrap" style={{ fontSize: '0.75rem' }}>
                          Rented
                        </Badge>
                      )}
                      <Card.Img
                        variant="top"
                        src={bike.image ? `data:image/jpeg;base64,${bike.image}` : 'https://via.placeholder.com/400x200?text=No+Image'}
                        alt={bike.model}
                        className="img-fluid"
                        style={{ height: '180px', objectFit: 'cover' }}
                      />
                      <Card.Body>
                        <Card.Title className="text-primary d-flex align-items-center mb-3">
                          <FaCar className="me-2" /> {bike.brand} {bike.model}
                        </Card.Title>
                        <Row>
                          <Card.Subtitle className="mb-2 text-muted d-flex align-items-center">
                            <FaCalendarAlt className="me-2" />{bike.number}
                          </Card.Subtitle>
                          <Card.Text>
                            <div className="d-flex align-items-center mb-2">
                              <strong className="me-2">Year:</strong> {bike.year}
                            </div>
                            <div className="d-flex align-items-center mb-2">
                              <strong className="me-2">KM:</strong> {bike.km}
                            </div>
                          </Card.Text>
                        </Row>
                        <hr className="" /> 
                        <Row className="d-flex align-items-center mb-3">
                          <Col xs={12} md={6} className="d-flex align-items-center">
                            <Badge bg="black" className="me-3 p-2 text-center d-flex align-items-center" style={{ minWidth: '120px' }}>
                              <strong className="me-2">Per Day:</strong> ₹{bike.rentalRate.ratePerDay}
                            </Badge>
                              <Button variant="primary" onClick={handleBookBike(bike)} className='d-flex align-items-center' style={{ fontSize: '0.875rem', padding: '0.5rem 1rem', minWidth: '120px' }}>
                                <FaInfoCircle className="me-2" /> View Details
                              </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}

export default Bikes;
