import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUppercase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Manual validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Invalid email address');
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password must contain at least one uppercase letter, one number, and one special character');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    console.log(formData);
    

    try {
      const response = await axios.post('http://localhost:8080/customer/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log(response.data);
      navigate("/login");
    } catch {
      setError('Error signing up');
    }
  };

  return (
    <main className="flex flex-col md:flex-row w-full min-h-screen">
      <div className="relative flex-1 hidden md:flex items-center justify-center bg-gradient-to-r from-gray-400 to-indigo-600 text-white p-12">
        <div className="relative z-10 max-w-md text-center">
          <h3 className="text-4xl font-bold mt-8">Start your journey with our bike</h3>
          <p className="mt-4 text-lg">Create an account and get access to all features.</p>
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-700 to-indigo-700 opacity-60 blur-3xl"></div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-100 p-6 sm:p-8">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-8">
          <img src="https://floatui.com/logo.svg" width={150} alt="Logo" className="mx-auto lg:hidden" />
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800">Sign Up</h3>
            <p className="mt-2 text-gray-600">Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Log in</Link></p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label className="font-medium flex items-center">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="Name"
                />
              </label>
            </div>
            <div className="relative">
              <label className="font-medium flex items-center">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="Email"
                />
              </label>
            </div>
            <div className="relative">
              <label className="font-medium flex items-center">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </label>
            </div>
            <div className="relative">
              <label className="font-medium flex items-center">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 border rounded-lg shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </label>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 text-white font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md transition duration-150"
            >
              Create Account
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default SignUp;
