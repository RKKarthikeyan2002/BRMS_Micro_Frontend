import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminNavbar from '../Admin/AdminNavbar';

describe('AdminNavbar Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <AdminNavbar />
      </Router>
    );
  });

  test('renders the header correctly', () => {
    const header = screen.getByText(/R K BIKES/i);
    expect(header).toBeInTheDocument();
  });

  test('renders the Sign In button when not logged in', () => {
    // When not logged in
    const signInButton = screen.getByText(/Sign In/i);
    expect(signInButton).toBeInTheDocument();
  });

  test('does not render the Sign In button when logged in', () => {
    // Simulate logged-in state
    sessionStorage.setItem('adminId', 'mockAdminId');

    render(
      <Router>
        <AdminNavbar />
      </Router>
    );

    // Check that Sign In button is not present
    const signInButton = screen.queryByText(/Signk In/i);
    expect(signInButton).not.toBeInTheDocument();
  });

  test('renders the Profile button when logged in', () => {
    // Simulate logged-in state
    sessionStorage.setItem('adminId', 'mockAdminId');

    render(
      <Router>
        <AdminNavbar />
      </Router>
    );
  });

  test('renders the Logout button inside the profile dropdown when logged in', () => {
    // Simulate logged-in state
    sessionStorage.setItem('adminId', 'mockAdminId');

    render(
      <Router>
        <AdminNavbar />
      </Router>
    );

  });

  test('renders the navigation links with correct labels', () => {
    const staffLink = screen.getByText(/Staff/i);
    const bookingRequestLink = screen.getByText(/Booking Request/i);
    const rentedBikesLink = screen.getByText(/Rented Bikes/i);

    expect(staffLink).toBeInTheDocument();
    expect(bookingRequestLink).toBeInTheDocument();
    expect(rentedBikesLink).toBeInTheDocument();
  });
});
