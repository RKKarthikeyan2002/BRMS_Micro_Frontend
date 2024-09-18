import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Pagination, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

function AllBikes() {
    const [bikes, setBikes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [loading, setLoading] = useState(true); // New loading state
    const bikesPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBikes = async () => {
            try {
                const response = await axios.get('http://localhost:8080/bike/all');
                const bikesWithImages = response.data.map(bike => ({
                    ...bike,
                    image: bike.image ? bike.image : null
                }));
                setBikes(bikesWithImages);
            } catch (error) {
                console.error("There was an error fetching the bikes!", error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };
        fetchBikes();
    }, []);

    const currentDate = new Date().toISOString().split('T')[0];
    useEffect(() => {
        bikes.forEach(bike => {
            if (bike.toDate === currentDate && bike.status.toLowerCase() !== 'closed') {
                handleCommission(bike);
            }
        });
    }, [bikes, currentDate]);

    const handleCommission = (bike) => {
        const formData = new FormData();
        formData.append('status', "Closed");
        axios.patch(`http://localhost:8080/bike/${bike.id}`, formData);
        const paymentData = new FormData();
        paymentData.append('bikeId', bike.id);
        axios.post('http://localhost:8080/mail/bikeCommission', paymentData)
            .then(response => {
                console.log("Additional request successful:", response.data);
            })
            .catch(error => {
                console.error("There was an error with the additional request!", error);
            });
    };

    const filteredBikes = bikes.filter(bike => {
        const matchesSearch = search ? 
            bike.brand.toLowerCase().includes(search.toLowerCase()) ||
            bike.model.toLowerCase().includes(search.toLowerCase()) ||
            bike.number.toLowerCase().includes(search.toLowerCase()) ||
            bike.year.toString().includes(search) ||
            bike.rating.toString().includes(search) 
            : true;

        const matchesStatus = statusFilter ? bike.status.toLowerCase() === statusFilter.toLowerCase() : true;

        return matchesSearch && matchesStatus && bike.status.toLowerCase() !== 'closed';
    });

    const indexOfLastBike = currentPage * bikesPerPage;
    const indexOfFirstBike = indexOfLastBike - bikesPerPage;
    const currentBikes = filteredBikes.slice(indexOfFirstBike, indexOfLastBike);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
            
            {loading ? (
                <Row className="justify-content-center mt-5">
                    <Col className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    </Col>
                </Row>
            ) : (
                <>
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
                        <Col md={4}>
                            <Form.Group controlId="statusFilter">
                                <Form.Control
                                    as="select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">All</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Accepted">Accepted</option>
                                    <option value="Available">Available</option>
                                    <option value="Closed">Closed</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <div className="d-flex justify-content-end mb-4">
                                <Button variant="success" as={Link} to="/adminBikeAdd" className="d-flex align-items-center shadow-lg hover:bg-success-subtle">
                                    <FaPlus size={18} className="me-2" />
                                    <span>Add Bike</span>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    {filteredBikes.length === 0 ? (
                        <Row className="mb-4">
                            <Col>
                                <Alert variant="info">
                                    No bikes available.
                                </Alert>
                            </Col>
                        </Row>
                    ) : (
                        <>
                            <Row className="mb-4">
                                <Col>
                                    <Table striped hover className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
                                        <thead className='bg-gray-800 text-white'>
                                            <tr>
                                                <th>Image</th>
                                                <th>Brand</th>
                                                <th>Model</th>
                                                <th>Number</th>
                                                <th>Year</th>
                                                <th>KM</th>
                                                <th>Status</th>
                                                <th>Details</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentBikes.map(bike => (
                                                <tr key={bike.id} className='border-b'>
                                                    <td className='py-2 px-2'>
                                                        {bike.image && (
                                                            <img
                                                                src={`data:image/jpeg;base64,${bike.image}`}
                                                                alt={bike.model}
                                                                className="w-24 h-14 object-cover rounded"
                                                            />
                                                        )}
                                                    </td>
                                                    <td>{bike.brand}</td>
                                                    <td>{bike.model}</td>
                                                    <td>{bike.number}</td>
                                                    <td>{bike.year}</td>
                                                    <td>{bike.km}</td>
                                                    <td>{bike.status}</td>
                                                    <td>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => navigate('/adminbikedetails', { state: { bike } })} // Pass bike information
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
                </>
            )}
        </Container>
    );
}

export default AllBikes;
