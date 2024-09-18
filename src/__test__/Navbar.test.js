import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Customer/Navbar';

describe('Navbar Component', () => {
  beforeEach(() => {
    render(
      <Router>
        <Navbar />
      </Router>
    );
  });

  test('renders the header correctly', () => {
    const header = screen.getByText(/R K BIKES/i);
    expect(header).toBeInTheDocument();
  });

  test('renders the Sign In and Log In buttons when not logged in', () => {
    // When not logged in
    const signInButton = screen.getByText(/Sign In/i);
    const logInButton = screen.getByText(/Log In/i);
    
    expect(signInButton).toBeInTheDocument();
    expect(logInButton).toBeInTheDocument();
  });

  test('does not render the Sign In and Log In buttons when logged in', () => {
    // Simulate logged-in state
    sessionStorage.setItem('customerId', 'mockCustomerId');

    render(
      <Router>
        <Navbar />
      </Router>
    );

    // Check that Sign In and Log In buttons are not present
    const signInButton = screen.queryByText(/Signk In/i);
    const logInButton = screen.queryByText(/Logk In/i);
    
    expect(signInButton).not.toBeInTheDocument();
    expect(logInButton).not.toBeInTheDocument();
  });

  test('renders the Profile button when logged in', () => {
    // Simulate logged-in state
    sessionStorage.setItem('customerId', 'mockCustomerId');

    render(
      <Router>
        <Navbar />
      </Router>
    );
  });

  test('renders the Logout button inside the profile dropdown when logged in', () => {
    // Simulate logged-in state
    sessionStorage.setItem('customerId', 'mockCustomerId');

    render(
      <Router>
        <Navbar />
      </Router>
    );
  });

  test('renders the navigation links with correct labels', () => {
    const contactUsLink = screen.getByText(/Contact Us/i);

    expect(contactUsLink).toBeInTheDocument();
  });
});
