import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [errors, setErrors] = useState({});
    const [captchaToken, setCaptchaToken] = useState(null);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 1) newErrors.password = 'Password is required';
        return newErrors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } 
        // else if (!captchaToken) {
        //     setError('Please complete the CAPTCHA');
        // } 
        else {
            setErrors({});
            try {
                const response = await axios.post('http://localhost:8080/login', {
                    email,
                    password
                });
                setEmail('');
                setPassword('');
                setError(null);
                if (response.data.role.toLowerCase() === 'admin') {
                    sessionStorage.setItem("adminId", response.data.id);
                    navigate('/adminHome');
                } else if (response.data.role.toLowerCase() === 'customer') {
                    sessionStorage.setItem("customerId", response.data.id);
                    navigate('/');
                } else if (response.data.role.toLowerCase() === 'staff') {
                    sessionStorage.setItem("staffId", response.data.id);
                    navigate('/staffHome');
                } else {
                    navigate('/');
                }
            } catch (error) {
                setError('Invalid email or password. Please try again.');
            }
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleCaptchaChange = (value) => {
        setCaptchaToken(value);
    };

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg">
                <motion.h1
                    className="text-center text-3xl font-extrabold text-indigo-700 mb-6"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Welcome Back!
                </motion.h1>

                {success && <p className="text-center text-green-500 mb-4">{success}</p>}
                

                <form
                    action="#"
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-lg p-6 shadow-xl bg-white"
                >
                    <p className="text-center text-lg font-medium text-gray-700 mb-4">Sign in to your account</p>

                    <div className="relative">
                        <label className="font-medium flex items-center">
                            {/* <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                            <input
                                type="text"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                placeholder="Email"
                            />
                        </label>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="relative">
                        <label className="font-medium flex items-center">
                            {/* <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-2 border rounded-lg shadow-sm focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-3 text-gray-400"
                            >
                                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </label>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* <div className="my-4">
                        <ReCAPTCHA
                            sitekey="6LdknzwqAAAAABy_UieQEtRMLqfZUVV1qIvkY7wd"
                            onChange={handleCaptchaChange}
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div> */}

                    <motion.button
                        type="submit"
                        className="w-full rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-lg transition-transform transform hover:scale-105"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaSignInAlt className="inline-block mr-2" />
                        Sign In
                    </motion.button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        Don't have an account?{' '}
                        <Link className="text-indigo-600 hover:underline" to="/signup">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
