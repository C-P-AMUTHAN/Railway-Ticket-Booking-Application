// src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const inputStyle = {
  width: '100%',
  height: '2.5rem',
  border: '1px solid #d1d5db',
  padding: '0.75rem',
  borderRadius: '0.375rem',
  outline: 'none',
  transition: 'border-color 0.3s, box-shadow 0.3s',
};

const AdminDashboard = () => {
  const [train, setTrain] = useState({
    name: "",
    number: "",
    from: "",
    to: "",
    date: "",
    departureTime: "",
    arrivalTime: "",
    ac2Tier: "",
    ac3Tier: "",
    sleeper: ""
  });

  const handleChange = (e) => {
    setTrain({ ...train, [e.target.name]: e.target.value });
  };

  const handleAddTrain = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/trains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(train),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Train added successfully!");
        setTrain({
          name: "",
          number: "",
          from: "",
          to: "",
          date: "",
          departureTime: "",
          arrivalTime: "",
          ac2Tier: "",
          ac3Tier: "",
          sleeper: ""
        });
      } else {
        alert(data.message || "Failed to add train");
      }
    } catch (err) {
      alert("❌ Error adding train");
    }
  };

  const navigate = useNavigate();

  return (
    <div className="home-container">
      <motion.header
        className="home-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="home-title">🚆 Admin Dashboard</h1>
      </motion.header>

      <motion.main
        className="home-main"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="home-heading">Add Train Details</h2>
        <form
          onSubmit={handleAddTrain}
          style={{
            display: "grid",
            gap: "1rem",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <input name="name" value={train.name} onChange={handleChange} placeholder="Train Name" required style={inputStyle} />
          <input name="number" value={train.number} onChange={handleChange} placeholder="Train Number" required style={inputStyle} />
          <input name="from" value={train.from} onChange={handleChange} placeholder="From" required style={inputStyle} />
          <input name="to" value={train.to} onChange={handleChange} placeholder="To" required style={inputStyle} />
          <input type="date" name="date" value={train.date} onChange={handleChange} required style={inputStyle} />
          <input name="departureTime" value={train.departureTime} onChange={handleChange} placeholder="Departure Time" required style={inputStyle} />
          <input name="arrivalTime" value={train.arrivalTime} onChange={handleChange} placeholder="Arrival Time" required style={inputStyle} />
          <input type="number" name="ac2Tier" value={train.ac2Tier} onChange={handleChange} placeholder="AC 2-tier Seats" required style={inputStyle} />
          <input type="number" name="ac3Tier" value={train.ac3Tier} onChange={handleChange} placeholder="AC 3-tier Seats" required style={inputStyle} />
          <input type="number" name="sleeper" value={train.sleeper} onChange={handleChange} placeholder="Sleeper Seats" required style={inputStyle} />
          <button type="submit" className="btn btn-primary">Add Train</button>
        </form>
        <button
          onClick={() => navigate('/train-details')}
          className="btn btn-success"
          style={{ marginTop: '1rem', width: '100%', maxWidth: '500px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
        >
          View Train Details
        </button>
      </motion.main>
    </div>
  );
};

export default AdminDashboard;
