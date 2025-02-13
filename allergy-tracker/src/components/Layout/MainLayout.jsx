import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MainLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="main-layout">
      <nav className="main-nav">
        <div className="nav-logo">
          <Link to="/dashboard">Allergy Tracker</Link>
        </div>
        <div className="nav-menu">
          {currentUser ? (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/reactions">Reactions</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </nav>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer className="main-footer">
        <p>&copy; {new Date().getFullYear()} Allergy Tracker</p>
      </footer>
    </div>
  );
};

export default MainLayout;