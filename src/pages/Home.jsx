import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  // Simulated login status (replace with real logic in future)
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  const handleBookNow = () => {
    if (!isLoggedIn) {
      alert('Please log in to continue.');
      navigate('/signin');
    } else {
      navigate('/booking');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
        <h1 className="text-2xl font-extrabold text-blue-600">Railway Express 🚆</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/signin')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">
          Book Train Tickets in Seconds
        </h2>
        <p className="max-w-2xl text-lg md:text-xl text-gray-700 mb-10">
          Easily search for trains, book tickets, manage your bookings, track trains in real-time,
          and enjoy seamless payments — all in one platform powered by GUI Agents and AI Automation!
        </p>
        <button
          onClick={handleBookNow}
          className="bg-indigo-600 text-white px-8 py-3 text-lg font-semibold rounded-full hover:bg-indigo-700 shadow-md transition"
        >
          🚀 Book Now
        </button>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner text-center py-4">
        <p className="text-gray-600 text-sm">
          Developed by <strong>Collector Appa</strong> & <strong>Collector Amma</strong> ❤️ | Contact: <a href="mailto:amuthancp@example.com" className="text-blue-500 hover:underline">amuthancp@example.com</a>
        </p>
      </footer>
    </div>
  );
};

export default Home;
