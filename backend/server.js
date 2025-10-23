// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const promptRoutes = require('./routes/prompt');
const authRoutes = require('./routes/auth');
const trainRoutes = require("./routes/train");
const ticketRoutes = require("./routes/ticket");
const emailTestRoutes = require('./routes/emailTest');

// Make jwt available to routes
global.jwt = jwt;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/prompt', promptRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/tickets", ticketRoutes);
app.use('/api/debug', emailTestRoutes);

// DB connect (your existing .env has MONGO_URI)
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/railway-db')
  .then(()=> console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection failed:', err));

const port = process.env.PORT || 5000;
app.listen(port, ()=> console.log(`🚀 Server running on ${port}`));

