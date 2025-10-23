import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.nav
      className="navigation"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <div className="nav-container">
        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/bookings"
            className={`nav-link ${location.pathname === '/bookings' ? 'active' : ''}`}
          >
            My Bookings
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/track"
            className={`nav-link ${location.pathname === '/track' ? 'active' : ''}`}
          >
            Track Train
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/coach"
            className={`nav-link ${location.pathname === '/coach' ? 'active' : ''}`}
          >
            Coach Position
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/profile"
            className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
          >
            Profile
          </Link>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Link
            to="/prompt-booking"
            className={`nav-link ${location.pathname === '/prompt-booking' ? 'active' : ''}`}
          >
            Prompt Booking
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
              className="nav-link logout"
            >
              Logout
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.div variants={itemVariants}>
              <Link
                to="/signin"
                className={`nav-link signin ${location.pathname === '/signin' ? 'active' : ''}`}
              >
                Sign In
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                to="/signup"
                className={`nav-link signup ${location.pathname === '/signup' ? 'active' : ''}`}
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