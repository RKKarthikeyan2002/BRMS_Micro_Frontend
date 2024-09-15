import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert, InputGroup } from 'react-bootstrap';
import { Person, Envelope, CheckCircle, XCircle } from 'react-bootstrap-icons';

function AddStaff() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/staff/addStaff', {
        name,
        email,
        password: 'rk123', // Fixed password
      });
      setSuccess(true);
      setError('');
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      setSuccess(false);
    }
  };

  return (
    <Container className="mt-4" style={{ maxWidth: '600px' }}>
      <div className="text-center mb-4">
        <h2>Add Staff</h2>
      </div>
      <Form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
        <Form.Group controlId="formName">
          <InputGroup className="mb-3">
            <InputGroup.Text><Person /></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ borderRadius: '0.25rem' }}
            />
          </InputGroup>
        </Form.Group>

        <Form.Group controlId="formEmail">
          <InputGroup className="mb-3">
            <InputGroup.Text><Envelope /></InputGroup.Text>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ borderRadius: '0.25rem' }}
            />
          </InputGroup>
        </Form.Group>

        <Button 
          variant="success" 
          type="submit" 
          className="w-100 mb-3" 
          style={{ borderRadius: '0.25rem' }}
        >
          Add Staff
        </Button>
      </Form>

      {success && (
        <Alert variant="success" className="fade show mt-3" style={{ transition: 'opacity 0.5s ease-in-out' }}>
          <CheckCircle className="me-2" /> Staff added successfully!
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="fade show mt-3" style={{ transition: 'opacity 0.5s ease-in-out' }}>
          <XCircle className="me-2" /> {error}
        </Alert>
      )}
    </Container>
  );
}

export default AddStaff;
