import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentPage = () => {
  const navigate = useNavigate();

  const handlePayment = () => {
    navigate('/confirmation');
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200">
      <motion.div
        className="p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Payment Gateway</h2>
        <motion.button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition-all duration-300"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Pay Now
        </motion.button>
      </motion.div>
    </div>
  );
};

export default PaymentPage;