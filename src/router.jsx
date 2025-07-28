import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BookingForm from './pages/BookingForm';
import PaymentPage from './pages/PaymentPage';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';
import TrainTracking from './pages/TrainTracking';
import CoachPosition from './pages/coach-position';
import Profile from './pages/Profile';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

// Simple protected route wrapper to check login status
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
};

// Error page for unmatched routes
const ErrorPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-300">
    <div className="p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg text-center">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">404 - Page Not Found</h2>
      <p className="text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
      <a href="/" className="text-indigo-600 hover:underline font-medium">
        Return to Home
      </a>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/results',
    element: <ProtectedRoute><SearchResults /></ProtectedRoute>,
  },
  {
    path: '/booking',
    element: <ProtectedRoute><BookingForm /></ProtectedRoute>,
  },
  {
    path: '/book/:trainId',
    element: <ProtectedRoute><BookingForm /></ProtectedRoute>,
  },
  {
    path: '/payment',
    element: <ProtectedRoute><PaymentPage /></ProtectedRoute>,
  },
  {
    path: '/confirmation',
    element: <ProtectedRoute><Confirmation /></ProtectedRoute>,
  },
  {
    path: '/bookings',
    element: <ProtectedRoute><MyBookings /></ProtectedRoute>,
  },
  {
    path: '/track',
    element: <ProtectedRoute><TrainTracking /></ProtectedRoute>,
  },
  {
    path: '/coach',
    element: <ProtectedRoute><CoachPosition /></ProtectedRoute>,
  },
  {
    path: '/profile',
    element: <ProtectedRoute><Profile /></ProtectedRoute>,
  },
  {
    path: '/signin',
    element: <Signin />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
]);

export default router;