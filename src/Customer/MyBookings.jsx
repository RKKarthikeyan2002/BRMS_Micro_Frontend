import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve customerId from sessionStorage
  const customerId = sessionStorage.getItem('customerId');

  useEffect(() => {
    axios.get('http://localhost:8080/booking/all')
      .then(response => {
        const allBookings = response.data;

        const filteredBookings = allBookings.filter(booking => booking.customer.id == customerId);

        setBookings(filteredBookings);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError('Failed to fetch bookings');
      });
  }, [customerId]); 

  return (
    <Container>
      <h1 className="my-4">Bookings</h1>
      {error && <div className="alert alert-danger">{error}</div>}
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
          {bookings.map(booking => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.name}</td>
              <td>{booking.age}</td>
              <td>{new Date(booking.fromDate).toLocaleDateString()}</td>
              <td>{new Date(booking.toDate).toLocaleDateString()}</td>
              <td>{booking.status}</td>
              <td>
                <Button variant="primary" onClick={() => navigate('/customerBookingDetails', { state: { booking } })}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default MyBookings;
