import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { parseISO, eachDayOfInterval, differenceInDays, isWeekend } from 'date-fns';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaPhone, FaImage, FaMoneyBillWave } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';

function BookingForm() {
  const location = useLocation();
  const { bike } = location.state || {};
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [license, setLicense] = useState(null);
  const [phone, setPhone] = useState('');
  const [dates, setDates] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [customer, setCustomer] = useState(null);
  const [availableBookings, setAvailableBookings] = useState([]);

  const today = new Date();
  const ratePerDay = bike?.rentalRate?.ratePerDay || 50;
  const bikeEndDate = bike?.toDate ? new Date(bike.toDate).setDate(new Date(bike.toDate).getDate() - 1) : null;

  useEffect(() => {
    const fetchCustomerData = async () => {
      const id = sessionStorage.getItem("customerId");
      console.log(bike.fromDate);
      
      if (id) {
        try {
          const response = await axios.get(`http://localhost:8080/customer/${id}`);
          const customerData = response.data;
          setCustomer(customerData);
          setName(customerData.name || '');
          setAge(customerData.age || '');
        } catch (error) {
          setError('Failed to fetch customer data.');
        }
      }
    };

    fetchCustomerData();
  }, []);

  useEffect(() => {
    const fetchAvailableBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/booking/available/${bike.id}`);
        setAvailableBookings(response.data);
      } catch (error) {
        setError('Failed to fetch available bookings.');
      }
    };

    if (bike?.id) {
      fetchAvailableBookings();
    }
  }, [bike.id]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (endDate && date >= endDate) {
      setEndDate(null);
      setTotalAmount(0);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);

    if (startDate && date) {
      if (startDate <= date && date <= bikeEndDate) {
        if (isDateBlocked(startDate, date)) {
          setError('Selected dates overlap with existing bookings.');
          setTotalAmount(0);
        } else {
          const range = eachDayOfInterval({ start: startDate, end: date });
          setDates(range);
          const numberOfDays = differenceInDays(date, startDate) + 1; 
          setTotalAmount(numberOfDays * ratePerDay);
          setError(''); 
        }
      } else if (date > bikeEndDate) {
        setError('End date must be on or before the bike’s available end date.');
        setTotalAmount(0); 
      } else {
        setError('End date must be after start date.');
        setTotalAmount(0); // Reset total amount on error
      }
    }
  };

  const isDateBlocked = (startDate, endDate) => {
    for (const booking of availableBookings) {
      const bookingStart = new Date(booking.fromDate);
      const bookingEnd = new Date(booking.toDate);

      if (startDate <= bookingEnd && endDate >= bookingStart ) {
        return true;
      }
    }
    return false;
  };

  const isDateUnavailable = (date) => {
    return availableBookings.some(booking => {
      const bookingStart = new Date(booking.fromDate);
      const bookingEnd = new Date(booking.toDate);
      const dayBeforeBookingStart = new Date(bookingStart);
      dayBeforeBookingStart.setDate(dayBeforeBookingStart.getDate());
      return (date >= bookingStart && date <= bookingEnd) || date.toDateString() === dayBeforeBookingStart.toDateString();
    });
  };

  const validateForm = () => {
    if (!name || !age || !startDate || !endDate || !license || !phone) {
      setError('Please fill in all fields and upload a license image.');
      return false;
    }

    if (parseInt(age, 10) < 18) {
      setError('You must be at least 18 years old to book.');
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      setError('Phone number must be exactly 10 digits.');
      return false;
    }

    if (isDateBlocked(startDate, endDate)) {
      setError('Selected dates overlap with existing bookings.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('startDate', startDate.toISOString().split('T')[0]);
    formData.append('endDate', endDate.toISOString().split('T')[0]);
    formData.append('license', license);
    formData.append('totalAmount', totalAmount);
    formData.append('bikeId', bike.id);
    formData.append('customerId', customer.id);
    formData.append('status', "Pending");
    formData.append('phone', phone);

    try {
      await axios.post('http://localhost:8080/booking/addBooking', formData);
      setSuccess('Booking successful!');
      await Swal.fire({
        title: "Booking Application Submitted",
        icon: "success"
      });
      navigate('/');
    } catch (err) {
      setError('Failed to submit the booking.');
    }
  };

  const handleFileChange = (e) => {
    setLicense(e.target.files[0]);
  };

  if (!bike) {
    return <Alert variant="danger">No bike information available.</Alert>;
  }

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <div className="bg-light p-4 rounded shadow-sm">
            <h2 className="text-center mb-4">Booking Form</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaUser className="me-2" /> Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="License Holder Name"
                  readOnly
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                />
              </Form.Group>
              <Form.Group controlId="formAge" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaUser className="me-2" /> Age
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="formPhone" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaPhone className="me-2" /> Phone Number
                </Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Form.Group>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="formStartDate">
                    <Form.Label className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> Start Date
                    </Form.Label>
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      minDate={today}
                      maxDate={bikeEndDate}
                      filterDate={(date) => !isDateUnavailable(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="formEndDate">
                    <Form.Label className="d-flex align-items-center">
                      <FaCalendarAlt className="me-2" /> End Date
                    </Form.Label>
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      minDate={startDate || today}
                      maxDate={bikeEndDate}
                      filterDate={(date) => !isDateUnavailable(date)}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formLicense" className="mb-3">
                <Form.Label className="d-flex align-items-center">
                  <FaImage className="me-2" /> License Image
                </Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Form.Group>
              <div className="mb-3">
                <h4>Total Amount: {totalAmount.toFixed(2)}</h4>
              </div>
              <Button variant="primary" type="submit" className="w-100">
                Submit Booking
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default BookingForm;
