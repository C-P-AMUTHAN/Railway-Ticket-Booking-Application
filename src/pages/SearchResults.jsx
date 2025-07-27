import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SearchResults = () => {
  const trains = [
    { id: 1, name: 'Shatabdi Express', time: '10:00 AM', class: 'AC' },
    { id: 2, name: 'Intercity Express', time: '01:00 PM', class: 'Sleeper' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200">
      <motion.div
        className="p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Available Trains</h2>
        <div className="space-y-4">
          {trains.map((train) => (
            <motion.div
              key={train.id}
              className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <p className="text-gray-800">
                <span className="font-semibold">{train.name}</span> - {train.time} - {train.class}
              </p>
              <Link to={`/book/${train.id}`} className="text-indigo-600 hover:underline font-medium">
                Book Now
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SearchResults;