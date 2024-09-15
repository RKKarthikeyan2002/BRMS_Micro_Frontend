import React, { useEffect, useState } from 'react';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaPhoneAlt, FaUser } from 'react-icons/fa';
import { IoMdLogIn } from 'react-icons/io';
import { HiOutlineLogin } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import { TbMotorbike } from 'react-icons/tb';
import { PiPersonSimpleBikeBold } from 'react-icons/pi';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navigate = useNavigate();
    
    const customerId = sessionStorage.getItem('customerId');
    const isLoggedIn = !!customerId;

    const navigation = [
        { title: "Bikes", path: "/bikes", icon: <TbMotorbike /> },
        { title: "Contact Us", path: "#integrations", icon: <FaPhoneAlt /> },
    ];

    const handleLogout = () => {
        // Clear session storage and redirect to login
        sessionStorage.removeItem('customerId');
        navigate('/');
    };

    return (
        <nav className="bg-gradient-to-r sticky top-0 z-50 from-blue-500 to-indigo-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="text-lg font-semibold">R K BIKES</div>
                <button 
                    className="md:hidden p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
                <div className={`md:flex md:items-center md:space-x-6 ${isOpen ? 'block' : 'hidden'}`}>
                    <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0">
                        {navigation.map((item, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors">
                                <Link
                                    to={item.path}
                                    className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-white hover:bg-opacity-20 transition text-white no-underline"
                                >
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        ))}
                        {!isLoggedIn ? (
                            <>
                                <li className="flex items-center space-x-2">
                                    <Link to="/login" className="flex items-center space-x-2 py-2 px-4 rounded-md bg-gray-800 hover:bg-gray-700 transition no-underline">
                                        <IoMdLogIn size={20} />
                                        <span>Log In</span>
                                    </Link>
                                </li>
                                <li className="flex items-center space-x-2 ml-4">
                                    <Link to="/signup" className="flex items-center space-x-2 py-2 px-4 rounded-md bg-yellow-500 text-black hover:bg-yellow-400 transition  no-underline">
                                        <HiOutlineLogin size={20} />
                                        <span>Sign In</span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link
                                        to="/mybikes"
                                        className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-white hover:bg-opacity-20 transition text-white no-underline"
                                    >
                                        <PiPersonSimpleBikeBold className="inline-block mr-2" />
                                        My Bike
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/customerBookings"
                                        className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-white hover:bg-opacity-20 transition text-white no-underline"
                                    >
                                        <PiPersonSimpleBikeBold className="inline-block mr-2" />
                                        My Bookings
                                    </Link>
                                </li>
                                <li className="relative group flex items-center space-x-2">
                                    <button
                                        className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-white hover:bg-opacity-20 transition"
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    >
                                        <FaUserCircle size={20} />
                                        <span>Profile</span>
                                    </button>
                                    <div className={`absolute right-0 top-full w-48 bg-white text-black shadow-lg rounded-md ${isProfileOpen ? 'block' : 'hidden'} group-hover:block`}>
                                        <ul className="py-2 text-center">
                                            <li>
                                                <Link
                                                    to="/customerProfile"
                                                    className="flex items-center px-4 py-2 hover:bg-gray-200 text-black no-underline transition-colors duration-200"
                                                    onClick={() => setIsProfileOpen(false)}
                                                >
                                                    <FaUser className="inline-block mr-2" />
                                                    My Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    className="flex items-center px-4 py-2 hover:bg-gray-200 text-black no-underline transition-colors duration-200 w-full text-left"
                                                    onClick={handleLogout}
                                                >
                                                    <FaSignOutAlt className="inline-block mr-2" />
                                                    Logout
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <div 
                className={`absolute right-0 top-full w-48 bg-white text-black shadow-lg rounded-md ${isProfileOpen ? 'block' : 'hidden'} transition-transform transform ${isProfileOpen ? 'scale-100' : 'scale-90'} opacity-100 ${isProfileOpen ? 'opacity-100' : 'opacity-0'}`}
            >
                <ul className="py-2">
                    <li>
                        <Link
                            to="/customerProfile"
                            className="flex items-center px-4 py-2 hover:bg-gray-200 text-black no-underline transition-colors duration-200"
                            onClick={() => setIsProfileOpen(false)}
                        >
                            <FaUser className="text-xl mr-2" />
                            My Profile
                        </Link>
                    </li>
                    <li>
                        <button
                            className="flex items-center px-4 py-2 hover:bg-gray-200 text-black no-underline transition-colors duration-200 w-full text-left"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt className="text-xl mr-2" />
                            Logout
                        </button>
                    </li>
                </ul>
            </div> */}
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
