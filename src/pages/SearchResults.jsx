import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchResults = () => {
  const navigate = useNavigate();
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState(null);

  // Sample train data - in a real app, this would come from an API
  const availableTrains = [
    { id: 1, name: 'Shatabdi Express', time: '10:00 AM', class: 'AC', source: 'Mumbai', destination: 'Delhi', price: '₹2500' },
    { id: 2, name: 'Intercity Express', time: '01:00 PM', class: 'Sleeper', source: 'Mumbai', destination: 'Delhi', price: '₹1800' },
    { id: 3, name: 'Rajdhani Express', time: '08:30 PM', class: 'AC', source: 'Mumbai', destination: 'Delhi', price: '₹3200' },
    { id: 4, name: 'Duronto Express', time: '06:00 AM', class: 'Sleeper', source: 'Mumbai', destination: 'Delhi', price: '₹1500' },
  ];

  const [filteredTrains, setFilteredTrains] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!source || !destination) {
      alert('Please select both source and destination');
      return;
    }
    
    // Filter trains based on source and destination
    const filtered = availableTrains.filter(train => 
      train.source.toLowerCase().includes(source.toLowerCase()) &&
      train.destination.toLowerCase().includes(destination.toLowerCase())
    );
    
    setFilteredTrains(filtered);
    setSearchPerformed(true);
  };

  const handleTrainSelect = (train) => {
    setSelectedTrain(train);
    // Navigate to booking form with train details
    navigate('/booking', { state: { selectedTrain: train } });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  const trainCardVariants = {
    hover: {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      borderColor: '#4b5bff',
      backgroundColor: '#f8fafc',
      transition: { duration: 0.2, ease: 'easeOut' }
    }
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

  const trainCardStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #e5e7eb',
    position: 'relative',
    zIndex: 1,
  };



  const textStyle = {
    color: '#1f2937',
    fontSize: '1rem',
    margin: '0.25rem 0',
  };

  const priceStyle = {
    color: '#059669',
    fontWeight: '600',
    fontSize: '1.125rem',
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
          Search Trains 🚂
        </motion.h2>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <input
                placeholder="From (e.g., Mumbai)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <div>
              <input
                placeholder="To (e.g., Delhi)"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
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
            >
              🔍 Search Trains
            </motion.button>
          </div>
        </form>

        {/* Search Results */}
        {searchPerformed && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '1rem' }}>
              Available Trains ({filteredTrains.length})
            </h3>
            {filteredTrains.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '1rem' }}>
                No trains found for the selected route. Please try different source and destination.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredTrains.map((train) => (
                  <motion.div
                    key={train.id}
                    style={trainCardStyle}
                    variants={trainCardVariants}
                    whileHover="hover"
                    onClick={() => handleTrainSelect(train)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.125rem' }}>
                        {train.name}
                      </h4>
                      <span style={priceStyle}>{train.price}</span>
                    </div>
                    <p style={textStyle}>
                      <span style={{ fontWeight: '500' }}>Time:</span> {train.time}
                    </p>
                    <p style={textStyle}>
                      <span style={{ fontWeight: '500' }}>Class:</span> {train.class}
                    </p>
                    <p style={textStyle}>
                      <span style={{ fontWeight: '500' }}>Route:</span> {train.source} → {train.destination}
                    </p>
                    <p style={{ color: '#4b5bff', fontWeight: '500', marginTop: '0.5rem' }}>
                      Click to select this train →
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        <style>
          {`
            input:focus {
              border-color: #4b5bff;
              box-shadow: 0 0 0 3px rgba(75, 91, 255, 0.2);
            }
          `}
        </style>
      </motion.div>
    </div>
  );
};

export default SearchResults;