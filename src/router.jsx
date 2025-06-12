import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BookingForm from './pages/BookingForm';
import PaymentPage from './pages/PaymentPage';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';
import TrainTracking from './pages/TrainTracking';
import CoachPosition from './pages/coach-position'; // Use actual file name
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/results',
    element: <SearchResults />,
  },
  {
    path: '/booking',
    element: <BookingForm />,
  },
  {
    path: '/payment',
    element: <PaymentPage />,
  },
  {
    path: '/confirmation',
    element: <Confirmation />,
  },
  {
    path: '/bookings',
    element: <MyBookings />,
  },
  {
    path: '/track',
    element: <TrainTracking />,
  },
  {
    path: '/coach',
    element: <CoachPosition />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
]);

export default router;
