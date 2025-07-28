import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Confirmation = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxWidth: '28rem',
    width: '100%',
  };

  const titleStyle = {
    fontSize: '1.875rem',
    fontWeight: '800',
    color: 'transparent',
    background: 'linear-gradient(to right, #16a34a, #34d399)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    marginBottom: '1rem',
    textAlign: 'center',
  };

  const textStyle = {
    color: '#4b5563',
    fontSize: '1rem',
    textAlign: 'center',
  };

  const buttonStyle = {
    backgroundColor: '#4b5bff',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.375rem',
    fontSize: '1rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const hoverButtonStyle = {
    backgroundColor: '#3b4dd8',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff, #f3e8ff)' }}>
      <motion.div
        style={cardStyle}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          style={titleStyle}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          Booking Confirmed! 🎉
        </motion.h2>
        <p style={textStyle}>
          Your ticket has been booked successfully.{' '}
          <motion.button
            onClick={() => navigate('/bookings')}
            style={buttonStyle}
            whileHover={{ ...hoverButtonStyle }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            My Bookings
          </motion.button>{' '}
          for more details.
        </p>
      </motion.div>
    </div>
  );
};

export default Confirmation;