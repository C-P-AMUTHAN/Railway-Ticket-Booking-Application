import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';

const App = () => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-200 to-blue-300 text-gray-900 font-sans">
      {/* Header with Navigation */}
      <motion.header
        className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-10 p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 text-center tracking-wide"
          variants={itemVariants}
        >
          🚆 Railway Express
        </motion.h1>
        <Navigation />
      </motion.header>

      {/* Test Color */}
      <main className="p-6 flex-grow">
        <div className="text-red-500 text-2xl">Test Color</div>
        <Outlet />
      </main>

      {/* Footer */}
      <motion.footer
        className="bg-white/90 backdrop-blur-md shadow-inner p-4 text-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.p
          className="text-gray-600 text-sm"
          variants={itemVariants}
        >
          © 2025 by{' '}
          <a href="mailto:amuthancp@example.com" className="text-indigo-600 hover:underline font-medium">
            Amuthan & Collector Amma 🚂
          </a>
        </motion.p>
      </motion.footer>
    </div>
  );
};

export default App;