import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaFilePdf, FaCalendarAlt, FaEdit, FaBicycle, FaChevronDown } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

function BikeApplication() {
  const [formData, setFormData] = useState({
    number: '',
    brand: '',
    model: '',
    year: '',
    description: '',
    aadhar: null,
    rc: null,
    image: null,
    video: null,
    km: '',
    bikeTypeName: '',
    customerId: '',
    fromDate: '',
    toDate: ''
  });

  const [selectedBikeTypeDescription, setSelectedBikeTypeDescription] = useState('');
  const [bikeTypes, setBikeTypes] = useState([]);
  const [brands, setBrands] = useState([
    { name: 'Honda', models: ['CBR 1000RR', 'CBR 600RR', 'CBR 500R', 'CBR 300R', 'CRF 450R'] },
    { name: 'Yamaha', models: ['YZF-R1', 'YZF-R6', 'MT-09', 'MT-07', 'FZ-09'] },
    { name: 'Suzuki', models: ['GSX-R1000', 'GSX-R600', 'V-Strom 650', 'SV650', 'Boulevard M109R'] },
    { name: 'Kawasaki', models: ['Ninja ZX-6R', 'Ninja ZX-10R', 'Z900', 'Versys 650', 'Vulcan S'] },
    { name: 'Bajaj', models: ['Pulsar 220F', 'Pulsar NS200', 'Dominar 400', 'Avenger Cruise 220', 'RS200'] },
    { name: 'Royal Enfield', models: ['Classic 350', 'Bullet 500', 'Interceptor 650', 'Continental GT 650', 'Himalayan'] },
    { name: 'TVS', models: ['Apache RTR 160', 'Apache RTR 200', 'NTorq 125', 'Jupiter', 'Raider'] },
    { name: 'Hero', models: ['Splendor Plus', 'Passion Pro', 'Xtreme 160R', 'Karizma ZMR', 'Maestro Edge'] },
    { name: 'Ducati', models: ['Panigale V4', 'Monster 1200', 'Multistrada 1260', 'Scrambler Icon', 'Hypermotard 950'] },
    { name: 'BMW', models: ['S1000RR', 'R1250GS', 'F850GS', 'K1600GTL', 'G310R'] }
  ]);

  const [selectedModels, setSelectedModels] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/bikeType/allName')
      .then(response => {
        setBikeTypes(response.data);
      })
      .catch(error => {
        console.error('Error fetching bike types!', error);
      });

    const customerId = sessionStorage.getItem('customerId');
    if (customerId) {
      setFormData(prevFormData => ({
        ...prevFormData,
        customerId
      }));
    }
  }, []);

  useEffect(() => {
    if (formData.fromDate) {
      const fromDateObj = new Date(formData.fromDate);
      const minToDate = new Date(fromDateObj.setDate(fromDateObj.getDate() + 10));
      const minToDateString = minToDate.toISOString().split('T')[0];

      if (!formData.toDate || formData.toDate < minToDateString) {
        setFormData(prevFormData => ({
          ...prevFormData,
          toDate: minToDateString
        }));
      }
    }
  }, [formData.fromDate]);

  useEffect(() => {
    if (formData.brand) {
      const selectedBrand = brands.find(brand => brand.name === formData.brand);
      if (selectedBrand) {
        setSelectedModels(selectedBrand.models);
      }
    }
  }, [formData.brand, brands]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'aadhar' || name === 'rc' || name === 'image') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleBikeTypeChange = (e) => {
    const selectedName = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      bikeTypeName: selectedName
    }));
    axios.get(`http://localhost:8080/bikeType/${selectedName}`)
      .then(response => {
        setSelectedBikeTypeDescription(response.data ? response.data.description : '');
      })
      .catch(error => {
        console.error('Error fetching bike type details!', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    axios.post('http://localhost:8080/bike/add', data)
      .then(response => {
        console.log('Bike added successfully:', response.data);
        navigate("/mybikes");
      })
      .catch(error => {
        console.error('Error adding bike!', error);
      });
  };

  return (
    <Container className="my-4 p-4 bg-light rounded shadow-sm" style={{ maxWidth: '800px' }}>
      <h2 className="mb-4 text-primary">Add New Bike</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNumber">
              <Form.Label className="d-flex align-items-center"><FaEdit className="me-2" /> Number</Form.Label>
              <FormControl
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                placeholder="Enter bike number"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBrand">
              <Form.Label className="d-flex align-items-center"><FaBicycle className="me-2" /> Brand</Form.Label>
              <Form.Control
                as="select"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select Bike Brand</option>
                {brands.map(brand => (
                  <option key={brand.name} value={brand.name}>{brand.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formModel">
              <Form.Label className="d-flex align-items-center"><FaEdit className="me-2" /> Model</Form.Label>
              <Form.Control
                as="select"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              >
                <option value="">Select Bike Model</option>
                {selectedModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formYear">
              <Form.Label className="d-flex align-items-center"><FaCalendarAlt className="me-2" /> Year</Form.Label>
              <FormControl
                type="text"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                placeholder="Enter bike year"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formKm">
              <Form.Label className="d-flex align-items-center"><FaCalendarAlt className="me-2" /> Kilo Meter</Form.Label>
              <FormControl
                type="text"
                name="km"
                value={formData.km}
                onChange={handleChange}
                required
                placeholder="Enter bike kilometer"
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBikeType">
              <Form.Label className="d-flex align-items-center"><FaEdit className="me-2" /> Bike Type</Form.Label>
              <Form.Control
                as="select"
                name="bikeTypeName"
                value={formData.bikeTypeName}
                onChange={handleBikeTypeChange}
                required
              >
                <option value="">Select Bike Type</option>
                {bikeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formBikeTypeDescription" className="mb-3">
          <Form.Label>Bike Type Description</Form.Label>
          <FormControl
            type="text"
            value={selectedBikeTypeDescription}
            readOnly
            placeholder="Bike type description"
          />
        </Form.Group>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formFromDate">
              <Form.Label className="d-flex align-items-center"><FaCalendarAlt className="me-2" /> From Date</Form.Label>
              <FormControl
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formToDate">
              <Form.Label className="d-flex align-items-center"><FaCalendarAlt className="me-2" /> To Date</Form.Label>
              <FormControl
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                min={formData.fromDate ? new Date(new Date(formData.fromDate).setDate(new Date(formData.fromDate).getDate() + 10)).toISOString().split('T')[0] : ''}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="formAadhar">
              <Form.Label className="d-flex align-items-center"><FaFilePdf className="me-2" /> Aadhar (PDF)</Form.Label>
              <FormControl
                type="file"
                name="aadhar"
                accept="application/pdf"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="formRc">
              <Form.Label className="d-flex align-items-center"><FaFilePdf className="me-2" /> RC (PDF)</Form.Label>
              <FormControl
                type="file"
                name="rc"
                accept="application/pdf"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="formImage" className="mb-3">
          <Form.Label className="d-flex align-items-center"><FaCamera className="me-2" /> Bike Image</Form.Label>
          <FormControl
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          <FaEdit className="me-2" /> Submit
        </Button>
      </Form>
    </Container>
  );
}

export default BikeApplication;
