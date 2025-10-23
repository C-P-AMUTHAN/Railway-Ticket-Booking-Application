const User = require('../models/User'); // note capital 'U'
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ User signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser._id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, role: 'user' } });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

// ✅ User signin
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });

    res.status(200).json({ token, user: { id: user._id, name: user.name, role: 'user' } });
  } catch (error) {
    res.status(500).json({ message: 'Signin failed', error });
  }
};

// ✅ Admin signin (predefined credentials)
exports.adminSignin = async (req, res) => {
  const { email, password } = req.body;

  // Predefined in .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPass) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = jwt.sign({ id: 'admin', role: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  });

  res.status(200).json({ token, user: { id: 'admin', name: 'Admin', role: 'admin' } });
};

// ✅ Current user fetch
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      return res.json({ id: 'admin', name: 'Admin', email: process.env.ADMIN_EMAIL, role: 'admin' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
