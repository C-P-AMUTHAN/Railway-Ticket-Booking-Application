import React from 'react';
import { motion } from 'framer-motion';

const Confirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200">
      <motion.div
        className="p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">Booking Confirmed!</h2>
        <p className="text-gray-600 text-center">
          Your ticket has been booked successfully. Check{' '}
          <span className="text-indigo-600 font-semibold">"My Bookings"</span> for more details.
        </p>
      </motion.div>
    </div>
  );
};

export default Confirmation;