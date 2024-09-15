import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Pagination, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AcceptedBikes() {
    const [bikes, setBikes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const bikesPerPage = 5;
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        // Fetch bikes from the API
        axios.get('http://localhost:8080/bike/all')
            .then(response => {
                // Convert byte arrays to base64 strings
                const bikesWithImages = response.data.map(bike => ({
                    ...bike,
                    image: bike.image ? bike.image : null
                }));
                setBikes(bikesWithImages);
            })
            .catch(error => {
                console.error("There was an error fetching the bikes!", error);
            });
    }, []);

    // Filter bikes based on search and status
    const filteredBikes = bikes.filter(bike => {
        // Only include bikes with status "Accepted"
        const isAccepted = bike.status.toLowerCase() === 'accepted';

        // Apply search filter
        const matchesSearch = search ? 
            bike.brand.toLowerCase().includes(search.toLowerCase()) ||
            bike.model.toLowerCase().includes(search.toLowerCase()) ||
            bike.number.toLowerCase().includes(search.toLowerCase()) ||
            bike.year.toString().includes(search) ||
            bike.rating.toString().includes(search) 
            : true;

        return isAccepted && matchesSearch;
    });

    // Calculate the indices of the bikes to display
    const indexOfLastBike = currentPage * bikesPerPage;
    const indexOfFirstBike = indexOfLastBike - bikesPerPage;
    const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate pagination items
    const totalPages = Math.ceil(filteredBikes.length / bikesPerPage);
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

    return (
        <Container className='mt-3'>
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group controlId="search">
                        <Form.Control
                            type="text"
                            placeholder="Search by Brand, Model, Number, Year, or Rating"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Brand</th>
                                <th>Model</th>
                                <th>Number</th>
                                <th>Year</th>
                                <th>KM</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentBikes.map(bike => (
                                <tr key={bike.id}>
                                    <td>
                                        {bike.image && (
                                            <img
                                                src={`data:image/jpeg;base64,${bike.image}`}
                                                alt={bike.model}
                                                style={{ width: '100px', height: 'auto' }}
                                            />
                                        )}
                                    </td>
                                    <td>{bike.brand}</td>
                                    <td>{bike.model}</td>
                                    <td>{bike.number}</td>
                                    <td>{bike.year}</td>
                                    <td>{bike.km}</td>
                                    <td>{bike.rating}</td>
                                    <td>{bike.status}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            onClick={() => navigate('/staffBikeDetails', { state: { bike } })} // Pass bike information
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
        </Container>
    );
}

export default AcceptedBikes;
