import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [name, setName] = useState('Amuthan');
  const [email, setEmail] = useState('amuthan@example.com');

  const handleSave = () => {
    alert('Profile updated successfully.');
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-100 to-purple-200">
      <motion.div
        className="p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Profile Management</h2>
        <div className="space-y-4">
          <input
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:border-indigo-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:border-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 transition-all duration-300"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;