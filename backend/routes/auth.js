const express = require('express');
const router = express.Router();
const { signup, signin, adminSignin, getCurrentUser } = require('../controllers/authController');

router.post('/signup', signup);          // user signup
router.post('/signin', signin);          // user signin
router.post('/admin/signin', adminSignin); // admin signin
router.get('/me', getCurrentUser);

module.exports = router;
