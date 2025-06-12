import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BookingForm from './pages/BookingForm';
import PaymentPage from './pages/PaymentPage';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';
import TrainTracking from './pages/TrainTracking';
import CoachPosition from './pages/coach-position'; // or coach-position if you renamed it
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans">
        <header className="bg-blue-800 text-white p-4 shadow-lg">
          <h1 className="text-3xl font-bold text-center">🚆 Railway Booking System</h1>
          <nav className="mt-2 flex justify-center space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/bookings" className="hover:underline">My Bookings</Link>
            <Link to="/track" className="hover:underline">Track Train</Link>
            <Link to="/coach" className="hover:underline">Coach Position</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
          </nav>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<SearchResults />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/confirmation" element={<Confirmation />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/track" element={<TrainTracking />} />
            <Route path="/coach" element={<CoachPosition />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <footer className="bg-blue-800 text-white text-center p-2">
          © 2025 by Amuthan & Collector Amma 🚂
        </footer>
      </div>
    </Router>
  );
}

export default App;
