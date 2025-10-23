// src/pages/AdminSignin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Home.css'; // ✅ Reuse same styles as Home

const AdminSignin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = form;

    // ✅ Hardcoded Admin Credentials
    if (email === 'admin@gmail.com' && password === 'admin2228') {
      localStorage.setItem('token', 'admin-token');
      localStorage.setItem('role', 'admin');
      alert('Admin login successful!');
      navigate('/admin');
    } else {
      alert('Invalid admin credentials!');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)' },
    tap: { scale: 0.95 },
  };

  return (
    <div className="home-container">
      <motion.header
        className="home-header"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h1 className="home-title">
          Railway Express 🚆
        </h1>
        <div className="header-buttons">
          <motion.button
            onClick={() => navigate('/')}
            className="btn btn-primary"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Back to Home
          </motion.button>
        </div>
      </motion.header>

      <motion.main
        className="home-main"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          className="signin-card"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2
            className="home-heading"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            Admin Login 🔑
          </motion.h2>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}
          >
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Admin Password"
              value={form.password}
              onChange={handleChange}
              className="form-input"
            />

            <motion.button
              type="submit"
              className="btn btn-warning"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Sign In
            </motion.button>
          </form>
        </motion.div>
      </motion.main>

      <motion.footer
        className="home-footer"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ delay: 0.4 }}
      >
        <p className="footer-text">
          Developed with ❤️ by{' '}
          <a href="mailto:amuthancp@example.com" className="footer-link">
            Railway Express Team
          </a>
        </p>
      </motion.footer>
    </div>
  );
};

export default AdminSignin;
