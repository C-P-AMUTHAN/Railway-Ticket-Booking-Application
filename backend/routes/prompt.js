// backend/routes/prompt.js
const express = require('express');
const router = express.Router();
const promptController = require('../controllers/promptController');

// POST /api/prompt/book
router.post('/book', promptController.handlePromptBooking);

// optional: also accept GET ?prompt=... for quick testing
router.get('/book', (req, res, next) => {
  // forward query to controller (normalize to req.body.prompt)
  req.body = req.body || {};
  if (req.query && req.query.prompt) req.body.prompt = req.query.prompt;
  return promptController.handlePromptBooking(req, res, next);
});

module.exports = router;
