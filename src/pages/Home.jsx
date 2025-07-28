import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

  const handleBookNow = () => {
    if (!isLoggedIn) {
      alert('Please log in to continue.');
      navigate('/signin');
    } else {
      navigate('/results');
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
    <div className="home-container">
      <motion.header
        className="home-header"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="home-title">
          Railway Express 🚆
        </h1>
        <div className="header-buttons">
          <motion.button
            onClick={() => navigate('/signin')}
            className="btn btn-primary"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign In
          </motion.button>
          <motion.button
            onClick={() => navigate('/signup')}
            className="btn btn-success"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Sign Up
          </motion.button>
        </div>
      </motion.header>

      <motion.main
        className="home-main"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ delay: 0.2 }}
      >
        <motion.h2
          className="home-heading"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Book Train Tickets in <span>Seconds</span>
        </motion.h2>
        <motion.p
          className="home-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Seamlessly search for trains, book tickets, manage bookings, track trains in real-time,
          and enjoy secure payments — all in one platform powered by AI Automation!
        </motion.p>
        <motion.button
          onClick={handleBookNow}
          className="book-now-btn"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <span>🚀 Book Now</span>
        </motion.button>
      </motion.main>

      <motion.footer
        className="home-footer"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ delay: 0.4 }}
      >
        <p className="footer-text">
          Developed with ❤️ by{' '}
          <a href="mailto:amuthancp@example.com" className="footer-link">
            Railway Express Team
          </a>
        </p>
      </motion.footer>
    </div>
  );
};

export default Home;