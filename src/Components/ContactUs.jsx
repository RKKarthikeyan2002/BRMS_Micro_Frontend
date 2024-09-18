import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('');

  const contactMethods = [
    {
      icon: <FaEnvelope className="w-6 h-6 text-indigo-600" />,
      contact: "Support@example.com"
    },
    {
      icon: <FaPhone className="w-6 h-6 text-indigo-600" />,
      contact: "+1 (555) 000-000"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6 text-indigo-600" />,
      contact: "Madurai, Tamil Nadu, India"
    },
  ];

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', message: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post('http://localhost:8080/contact/request', formData)
        .then((response) => {
            console.log(response.data);
        });
      setFormStatus('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' });
      navigate("/");
    } catch (error) {
      console.error('Error sending message:', error);
      setFormStatus('Failed to send message.');
    }
  };

  return (
    <main className="py-14 bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <div className="max-w-4xl mx-auto gap-12 flex flex-col lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 space-y-6"
          >
            <h3 className="text-indigo-600 font-semibold text-xl md:text-2xl">
              Feedback Form
            </h3>
            <p className="text-gray-800 text-3xl font-semibold sm:text-4xl">
              Give your feedbacks So we can imporve our R K BIKES
            </p>
            <p className="text-gray-600">
            </p>
            <ul className="mt-6 space-y-4">
              {contactMethods.map((item, idx) => (
                <li key={idx} className="flex items-center gap-x-4 p-4 bg-white shadow-md rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex-none text-indigo-600">
                    {item.icon}
                  </div>
                  <p className="text-gray-700">{item.contact}</p>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 mt-8 lg:mt-0"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-lg shadow-md space-y-6"
            >
              {formStatus && <p className={`text-center ${formStatus.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{formStatus}</p>}
              <div>
                <label className="font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full mt-2 px-4 py-3 text-gray-600 bg-gray-100 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-indigo-600 focus:ring-indigo-600`}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              <div>
                <label className="font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full mt-2 px-4 py-3 text-gray-600 bg-gray-100 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-indigo-600 focus:ring-indigo-600`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div>
                <label className="font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={`w-full mt-2 h-36 px-4 py-3 text-gray-600 bg-gray-100 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-indigo-600 focus:ring-indigo-600`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full px-4 py-3 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-colors duration-150"
              >
                Submit
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default ContactUs;
