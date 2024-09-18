import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Pagination, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewAllStaff() {
    const [staff, setStaff] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const staffPerPage = 7;

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await axios.get('http://localhost:8080/staff/all', {
                    params: {
                        page: currentPage - 1, // Adjust for zero-based page index
                        size: staffPerPage
                    }
                });
                setStaff(response.data);
                setTotalPages(response.data.totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching staff data', error);
                setLoading(false);
            }
        };

        fetchStaff();
    }, [currentPage]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/staff/${id}`);
            setStaff(staff.filter(staffMember => staffMember.id !== id));
        } catch (error) {
            console.error('Error deleting staff member', error);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div style={{ padding: '20px' }}>
            <div className="d-flex justify-content-end mb-3">
                <Button variant="primary" href="/addStaff">
                    Add Staff
                </Button>
            </div>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Age</th>
                                <th>DOB</th>
                                <th>Address</th>
                                {/* <th>Actions</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map(staffMember => (
                                <tr key={staffMember.id}>
                                    <td>{staffMember.id}</td>
                                    <td>{staffMember.name}</td>
                                    <td>{staffMember.email}</td>
                                    <td>{staffMember.phone}</td>
                                    <td>{staffMember.age}</td>
                                    <td>{staffMember.dob}</td>
                                    <td>{staffMember.address}</td>
                                    {/* <td>
                                        <Button variant="danger" onClick={() => handleDelete(staffMember.id)}>
                                            Delete
                                        </Button>
                                    </td> */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <div className="d-flex justify-content-center">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages).keys()].map(number => (
                                <Pagination.Item
                                    key={number}
                                    active={number + 1 === currentPage}
                                    onClick={() => handlePageClick(number + 1)}
                                >
                                    {number + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
}

export default ViewAllStaff;
