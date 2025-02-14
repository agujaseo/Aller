import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ReactionsProvider } from './contexts/ReactionsContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import MainLayout from './components/Layout/MainLayout';

// Auth Pages
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

// Protected Pages
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/profile/ProfilePage';
import ReactionsPage from './pages/reactions/ReactionsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ReactionsProvider>
          <MainLayout>
            <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/reactions" 
              element={
                <PrivateRoute>
                  <ReactionsPage />
                </PrivateRoute>
              } 
            />

            {/* Default Redirect */}
            <Route 
              path="*" 
              element={<Login />} 
            />
          </Routes>
        </MainLayout>
      </ReactionsProvider>
    </AuthProvider>
    </Router>
  );
}

export default App;