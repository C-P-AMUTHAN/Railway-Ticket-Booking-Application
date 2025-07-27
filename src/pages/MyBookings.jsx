import React from 'react';
import { motion } from 'framer-motion';

const MyBookings = () => {
  const bookings = [
    { id: 1, name: 'Shatabdi Express', date: '2025-06-10' },
    { id: 2, name: 'Intercity Express', date: '2025-06-11' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200">
      <motion.div
        className="p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">My Bookings</h2>
        <ul className="space-y-4">
          {bookings.map((b) => (
            <motion.li
              key={b.id}
              className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <span className="font-semibold text-gray-800">{b.name}</span> -{' '}
              <span className="text-gray-600">{b.date}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default MyBookings;