import React from 'react'
import Navbar from '../Customer/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './Login';
import SignUp from '../Customer/SignUp';
import AdminNavbar from '../Admin/AdminNavbar';
import Bikes from './Bikes';
import MyBikes from '../BikeOwner/MyBikes';
import BikeApplication from '../BikeOwner/BikeApplication';
import AllBikes from '../Admin/AllBikes';
import BikeDetails from '../Admin/BikeDetails';
import ViewAllStaff from '../Admin/ViewAllStaff';
import AddStaff from '../Staff/AddStaff';
import StaffNavbar from '../Staff/StaffNavbar';
import ViewAllBooking from '../Staff/ViewAllBooking';
import AcceptedBikes from '../Staff/AcceptedBikes';
import UpdateBike from '../Staff/UpdateBike';
import BookBike from '../Customer/BookBike';
import BookingForm from '../Customer/BookingForm';
import BookingDetails from '../Admin/BookingDetails';
import MyBookings from '../Customer/MyBookings';
import BookingRequest from '../Admin/BookingRequest';
import CustomerBookingDetails from '../Customer/CustomerBookingDetails';
import StaffBookingDetails from '../Staff/StaffBookingDetails';
import CustomerProfile from '../Customer/CustomerProfile';
import AdminProfile from '../Admin/AdminProfile';
import StaffProfile from '../Staff/StaffProfile';
import OwnerBikeDetails from '../BikeOwner/OwnerBikeDetails';
import Footer from './Footer';
import TeamSection from './TeamSection';
import ContactUs from './ContactUs';
import Hero from './Hero';
import AdminBikeApplication from '../Admin/AdminBikeApplication';

function AppRouter() {
  return (
    <div>
        <Router>
            <Routes>
                <Route path="/" element={<> <Navbar/> <Hero /> <Bikes /> <TeamSection /> <Footer /> </>} />
                <Route path="/login" element={<> <Navbar /> <Login /> </>} />
                <Route path="/signup" element={<> <Navbar /> <SignUp /> </>} />
                <Route path="/contactUs" element={<> <Navbar /> <ContactUs /> </>} />

                
                <Route path="/mybikes" element={<> <Navbar /> <MyBikes /> </>} />
                <Route path="/addBike" element={<> <Navbar /> <BikeApplication /> </>} />
                <Route path="/addBike" element={<> <Navbar /> <BikeApplication /> </>} />
                <Route path="/viewBikeDetails" element={<> <Navbar /> <BookBike /> </>} />
                <Route path="/bookingForm" element={<> <Navbar /> <BookingForm /> </>} />
                <Route path="/customerBookings" element={<> <Navbar /> <MyBookings /> </>} />
                <Route path="/customerBookingDetails" element={<> <Navbar /> <CustomerBookingDetails /> </>} />
                <Route path="/customerProfile" element={<> <Navbar /> <CustomerProfile /> </>} />
                <Route path="/ownerBike" element={<> <Navbar /> <OwnerBikeDetails /> </>} />


                <Route path="/adminHome" element={<> <AdminNavbar /> <AllBikes /> </>} />
                <Route path="/adminbikedetails" element={<> <AdminNavbar /> <BikeDetails /> </>} />
                <Route path="/staffs" element={<> <AdminNavbar /> <ViewAllStaff /> </>} />
                <Route path="/addStaff" element={<> <AdminNavbar /> <AddStaff /> </>} />
                <Route path="/adminBookingRequests" element={<> <AdminNavbar /> <BookingRequest /> </>} />
                <Route path="/adminBookingDetails" element={<> <AdminNavbar /> <BookingDetails /> </>} />
                <Route path="/adminProfile" element={<> <AdminNavbar /> <AdminProfile /> </>} />
                <Route path="/adminBikeAdd" element={<> <AdminNavbar /> <AdminBikeApplication /> </>} />


                <Route path="/staffHome" element={<> <StaffNavbar /> <ViewAllBooking /> </>} />
                <Route path="/staffBike" element={<> <StaffNavbar /> <AcceptedBikes /> </>} />
                <Route path="/staffBikeDetails" element={<> <StaffNavbar /> <UpdateBike /> </>} />
                <Route path="/staffbookingdetails" element={<> <StaffNavbar /> <StaffBookingDetails /> </>} />
                <Route path="/staffProfile" element={<> <StaffNavbar /> <StaffProfile /> </>} />
            </Routes>
        </Router>
    </div>
  )
}

export default AppRouter
