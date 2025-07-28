import React from 'react';
import { motion } from 'framer-motion';

const MyBookings = () => {
  const bookings = [
    { id: 1, name: 'Shatabdi Express', date: '2025-06-10' },
    { id: 2, name: 'Intercity Express', date: '2025-06-11' },
  ];

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
    background: 'linear-gradient(to right, #4b5bff, #8b5cf6)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const bookingItemStyle = {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s',
  };

  const hoverBookingItemStyle = {
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    transform: 'scale(1.02)',
  };

  const textStyle = {
    color: '#1f2937',
    fontSize: '1rem',
  };

  const dateStyle = {
    color: '#4b5563',
    fontSize: '1rem',
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
          My Bookings 📋
        </motion.h2>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map((b) => (
            <motion.li
              key={b.id}
              style={bookingItemStyle}
              whileHover={{ ...hoverBookingItemStyle }}
            >
              <span style={textStyle}>
                <span style={{ fontWeight: '600' }}>{b.name}</span> -{' '}
                <span style={dateStyle}>{b.date}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default MyBookings;