import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import './App.css';

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
    <div className="app-container">
      {/* Header with Navigation */}
      <motion.header
        className="app-header"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="app-title"
          variants={itemVariants}
        >
          🚆 Railway Express
        </motion.h1>
        <Navigation />
      </motion.header>

      {/* Test Color */}
      <main className="app-main">
        <div className="test-color">Test Color</div>
        <Outlet />
      </main>

      {/* Footer */}
      <motion.footer
        className="app-footer"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.p
          className="footer-text"
          variants={itemVariants}
        >
          © 2025 by{' '}
          <a href="mailto:amuthancp@example.com" className="footer-link">
            Amuthan & Collector Amma 🚂
          </a>
        </motion.p>
      </motion.footer>
    </div>
  );
};

export default App;