import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.nav
      className="mt-4"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="flex justify-center space-x-6 md:space-x-8 lg:space-x-10 flex-wrap">
        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className={`text-indigo-600 font-medium text-lg hover:text-indigo-800 hover:underline transition-colors ${
              location.pathname === '/' ? 'text-indigo-800 font-semibold' : ''
            }`}
          >
            Home
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/bookings"
            className={`text-indigo-600 font-medium text-lg hover:text-indigo-800 hover:underline transition-colors ${
              location.pathname === '/bookings' ? 'text-indigo-800 font-semibold' : ''
            }`}
          >
            My Bookings
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/track"
            className={`text-indigo-600 font-medium text-lg hover:text-indigo-800 hover:underline transition-colors ${
              location.pathname === '/track' ? 'text-indigo-800 font-semibold' : ''
            }`}
          >
            Track Train
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/coach"
            className={`text-indigo-600 font-medium text-lg hover:text-indigo-800 hover:underline transition-colors ${
              location.pathname === '/coach' ? 'text-indigo-800 font-semibold' : ''
            }`}
          >
            Coach Position
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/profile"
            className={`text-indigo-600 font-medium text-lg hover:text-indigo-800 hover:underline transition-colors ${
              location.pathname === '/profile' ? 'text-indigo-800 font-semibold' : ''
            }`}
          >
            Profile
          </Link>
        </motion.div>
        {isLoggedIn ? (
          <motion.div variants={itemVariants}>
            <Link
              to="/signin"
              onClick={() => {
                localStorage.removeItem('loggedIn');
                window.location.href = '/signin'; // Simple logout redirect
              }}
              className="text-red-600 font-medium text-lg hover:text-red-800 hover:underline transition-colors"
            >
              Logout
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <Link
                to="/signin"
                className={`text-green-600 font-medium text-lg hover:text-green-800 hover:underline transition-colors ${
                  location.pathname === '/signin' ? 'text-green-800 font-semibold' : ''
                }`}
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/signup"
                className={`text-green-600 font-medium text-lg hover:text-green-800 hover:underline transition-colors ${
                  location.pathname === '/signup' ? 'text-green-800 font-semibold' : ''
                }`}
              >
                Sign Up
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;