import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedTrain = location.state?.selectedTrain;
  
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store booking details in localStorage or state management
    const bookingDetails = {
      train: selectedTrain,
      passenger: { name, age, email, phone },
      bookingDate: new Date().toISOString(),
    };
    localStorage.setItem('currentBooking', JSON.stringify(bookingDetails));
    navigate('/payment');
  };

  // If no train is selected, redirect back to search
  if (!selectedTrain) {
    navigate('/results');
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(12px)',
    padding: '2rem',
    borderRadius: '0.75rem',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxWidth: '32rem',
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

  const inputStyle = {
    width: '100%',
    height: '2.5rem',
    border: '1px solid #d1d5db',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    fontSize: '1rem',
  };

  const buttonStyle = {
    width: '100%',
    backgroundColor: '#4b5bff',
    color: 'white',
    padding: '0.75rem',
    borderRadius: '0.375rem',
    fontSize: '1.125rem',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
  };

  const hoverButtonStyle = {
    backgroundColor: '#3b4dd8',
  };

  const trainInfoStyle = {
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginBottom: '1.5rem',
    border: '1px solid #e2e8f0',
  };

  const trainTitleStyle = {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '0.5rem',
  };

  const trainDetailStyle = {
    color: '#6b7280',
    fontSize: '0.875rem',
    margin: '0.25rem 0',
  };

  const priceStyle = {
    color: '#059669',
    fontWeight: '600',
    fontSize: '1.125rem',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff, #f3e8ff)' }}>
      <motion.form
        onSubmit={handleSubmit}
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
          Passenger Details ✈️
        </motion.h2>

        {/* Selected Train Information */}
        <div style={trainInfoStyle}>
          <h3 style={trainTitleStyle}>Selected Train</h3>
          <p style={trainDetailStyle}>
            <span style={{ fontWeight: '500' }}>Train:</span> {selectedTrain.name}
          </p>
          <p style={trainDetailStyle}>
            <span style={{ fontWeight: '500' }}>Route:</span> {selectedTrain.source} → {selectedTrain.destination}
          </p>
          <p style={trainDetailStyle}>
            <span style={{ fontWeight: '500' }}>Time:</span> {selectedTrain.time}
          </p>
          <p style={trainDetailStyle}>
            <span style={{ fontWeight: '500' }}>Class:</span> {selectedTrain.class}
          </p>
          <p style={priceStyle}>
            <span style={{ fontWeight: '500' }}>Price:</span> {selectedTrain.price}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <input
              placeholder="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <input
              placeholder="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              style={inputStyle}
            />
          </div>
          <motion.button
            type="submit"
            style={buttonStyle}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onMouseEnter={(e) => Object.assign(e.target.style, hoverButtonStyle)}
            onMouseLeave={(e) => Object.assign(e.target.style, buttonStyle)}
          >
            Proceed to Payment
          </motion.button>
        </div>
        <style>
          {`
            input:focus {
              border-color: #4b5bff;
              box-shadow: 0 0 0 3px rgba(75, 91, 255, 0.2);
            }
          `}
        </style>
      </motion.form>
    </div>
  );
};

export default BookingForm;