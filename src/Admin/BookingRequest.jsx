import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BookingRequest() {
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState(''); // New state for search term
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await axios.get('http://localhost:8080/booking/all');
                setBookings(response.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    // Filter bookings based on search term
    const filteredBookings = bookings.filter(booking => {
        const searchLower = search.toLowerCase();
        return (
            booking.name.toLowerCase().includes(searchLower) ||
            booking.id.toString().includes(searchLower) ||
            booking.age.toString().includes(searchLower) ||
            new Date(booking.fromDate).toLocaleDateString().toLowerCase().includes(searchLower) ||
            new Date(booking.toDate).toLocaleDateString().toLowerCase().includes(searchLower) ||
            booking.status.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Container>
            <h1 className="my-4">Bookings</h1>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group controlId="search">
                        <Form.Control
                            type="text"
                            placeholder="Search by ID, Name, Age, Dates, or Status"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            {loading ? (
                <div className="text-center mt-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : filteredBookings.length === 0 ? (
                <Alert variant="info">
                    No bookings available.
                </Alert>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>From Date</th>
                            <th>To Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map(booking => (
                            <tr key={booking.id}>
                                <td>{booking.id}</td>
                                <td>{booking.name}</td>
                                <td>{booking.age}</td>
                                <td>{new Date(booking.fromDate).toLocaleDateString()}</td>
                                <td>{new Date(booking.toDate).toLocaleDateString()}</td>
                                <td>{booking.status}</td>
                                <td>
                                    <Button variant="primary" onClick={() => navigate('/adminBookingDetails', { state: { booking } })}>View</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
}

export default BookingRequest;
