import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Pagination, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewAllBooking() {
    const [bookings, setBookings] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true); // Add loading state
    const bookingsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch bookings from the API
        axios.get('http://localhost:8080/booking/all')
            .then(response => {
                setBookings(response.data);
                setLoading(false); // Set loading to false once data is fetched
            })
            .catch(error => {
                console.error("There was an error fetching the bookings!", error);
                setLoading(false); // Set loading to false even if there's an error
            });
    }, []);

    // Filter bookings based on search and status
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = search ? 
            booking.bike.brand.toLowerCase().includes(search.toLowerCase()) ||
            booking.bike.model.toLowerCase().includes(search.toLowerCase()) ||
            booking.name.toLowerCase().includes(search.toLowerCase()) ||
            booking.bike.number.toLowerCase().includes(search.toLowerCase()) ||
            booking.status.toLowerCase().includes(search.toLowerCase())
            : true;

        const matchesStatus = statusFilter ? booking.status.toLowerCase() === statusFilter.toLowerCase() : true;

        return matchesSearch && matchesStatus;
    });

    // Calculate the indices of the bookings to display
    const indexOfLastBooking = currentPage * bookingsPerPage;
    const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
    const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate pagination items
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
    const paginationItems = [];
    for (let number = 1; number <= totalPages; number++) {
        paginationItems.push(
            <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
            >
                {number}
            </Pagination.Item>
        );
    }

    const formatDate = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    return (
        <Container className='mt-3'>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group controlId="search">
                        <Form.Control
                            type="text"
                            placeholder="Search by Bike Brand, Model, Customer Name, Booking Number, or Status"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            {loading ? (
                <Row className="justify-content-center mb-4">
                    <Col className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p>Loading bookings...</p>
                    </Col>
                </Row>
            ) : filteredBookings.length === 0 ? (
                <Row className="mb-4">
                    <Col>
                        <Alert variant="info">
                            No bookings available.
                        </Alert>
                    </Col>
                </Row>
            ) : (
                <>
                    <Row className="mb-4">
                        <Col>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Booking Image</th>
                                        <th>Bike Number</th>
                                        <th>Customer Name</th>
                                        <th>Customer Age</th>
                                        <th>Booking From Date</th>
                                        <th>Booking To Date</th>
                                        <th>Booking Status</th>
                                        <th>Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentBookings.map(booking => (
                                        <tr key={booking.id}>
                                            <td>
                                                {booking.bike.image && (
                                                    <img
                                                        src={`data:image/jpeg;base64,${booking.bike.image}`}
                                                        alt={booking.bike.model}
                                                        style={{ width: '100px', height: 'auto' }} // Adjust size as needed
                                                    />
                                                )}
                                            </td>
                                            <td>{booking.bike.number}</td>
                                            <td>{booking.name}</td>
                                            <td>{booking.age}</td>
                                            <td>{formatDate(booking.fromDate)}</td>
                                            <td>{formatDate(booking.toDate)}</td>
                                            <td>{booking.status}</td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    onClick={() => navigate('/staffbookingdetails', { state: { booking } })}
                                                >
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />
                        {paginationItems}
                        <Pagination.Next
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </>
            )}
        </Container>
    );
}

export default ViewAllBooking;
