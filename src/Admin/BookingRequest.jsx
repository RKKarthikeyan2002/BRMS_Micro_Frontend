import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BookingRequest() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      axios.get('http://localhost:8080/booking/all')
        .then(response => {
          // Assuming the response data is in response.data
          setBookings(response.data);
        })
        .catch(err => {
          // Handle error here
          console.error('Error fetching data:', err);
          setError('Failed to fetch bookings');
        });
    }, []);
  
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
                    <Button variant="primary" onClick={() => navigate('/adminBookingDetails', { state: { booking } })}>View</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
}

export default BookingRequest
