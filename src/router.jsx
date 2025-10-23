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
import PromptBooking from './pages/PromptBooking';
import AdminSignin from './pages/AdminSignin';
import AdminDashboard from './pages/AdminDashboard';
import TrainDetails from "./pages/TrainDetails";

// ✅ ProtectedRoute for user
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return token && role === 'user' ? children : <Navigate to="/signin" replace />;
};

// ✅ ProtectedRoute for admin
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return token && role === 'admin' ? children : <Navigate to="/admin-signin" replace />;
};

// ✅ Error page
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
  { path: '/', element: <Home />, errorElement: <ErrorPage /> },

  // User Routes
  { path: '/results', element: <ProtectedRoute><SearchResults /></ProtectedRoute> },
  { path: '/booking', element: <ProtectedRoute><BookingForm /></ProtectedRoute> },
  { path: '/book/:trainId', element: <ProtectedRoute><BookingForm /></ProtectedRoute> },
  { path: '/payment', element: <ProtectedRoute><PaymentPage /></ProtectedRoute> },
  { path: '/confirmation', element: <ProtectedRoute><Confirmation /></ProtectedRoute> },
  { path: '/bookings', element: <ProtectedRoute><MyBookings /></ProtectedRoute> },
  { path: '/track', element: <ProtectedRoute><TrainTracking /></ProtectedRoute> },
  { path: '/coach', element: <ProtectedRoute><CoachPosition /></ProtectedRoute> },
  { path: '/profile', element: <ProtectedRoute><Profile /></ProtectedRoute> },

  // Auth Routes
  { path: '/signin', element: <Signin /> },
  { path: '/signup', element: <Signup /> },

  // Prompt booking
  { path: '/prompt-booking', element: <PromptBooking /> },

  // Admin Routes
  { path: '/admin-signin', element: <AdminSignin /> },
  { path: '/admin', element: <AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute> },

  { path: '/train-details', element: <AdminProtectedRoute><TrainDetails /></AdminProtectedRoute> },
]); 

export default router;
