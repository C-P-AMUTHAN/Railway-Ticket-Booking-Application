import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  const handleBookNow = () => {
    if (!isLoggedIn) {
      alert('Please log in to continue.');
      navigate('/signin');
    } else {
      navigate('/booking');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200 text-gray-900 font-sans">
      <motion.header
        className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
          Railway Express 🚆
        </h1>
        <div className="flex space-x-4">
          <motion.button
            onClick={() => navigate('/signin')}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign In
          </motion.button>
          <motion.button
            onClick={() => navigate('/signup')}
            className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign Up
          </motion.button>
        </div>
      </motion.header>

      <motion.main
        className="flex-grow flex flex-col items-center justify-center text-center px-6 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ delay: 0.2 }}
      >
        <motion.h2
          className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Book Train Tickets in <span className="text-indigo-600">Seconds</span>
        </motion.h2>
        <motion.p
          className="max-w-3xl text-lg md:text-xl text-gray-600 mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Seamlessly search for trains, book tickets, manage bookings, track trains in real-time,
          and enjoy secure payments — all in one platform powered by AI Automation!
        </motion.p>
        <motion.button
          onClick={handleBookNow}
          className="bg-indigo-600 text-white px-10 py-4 text-lg font-semibold rounded-full hover:bg-indigo-700 shadow-xl transition-all duration-300 flex items-center space-x-2"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span>🚀 Book Now</span>
        </motion.button>
      </motion.main>

      <motion.footer
        className="bg-white/80 backdrop-blur-md shadow-inner text-center py-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ delay: 0.4 }}
      >
        <p className="text-gray-600 text-sm">
          Developed with ❤️ by{' '}
          <a href="mailto:amuthancp@example.com" className="text-indigo-600 hover:underline font-medium">
            Railway Express Team
          </a>
        </p>
      </motion.footer>
    </div>
  );
};

export default Home;