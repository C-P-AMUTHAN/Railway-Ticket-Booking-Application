const express = require('express');
const router = express.Router();
const { sendTicketEmail } = require('../services/emailService');

// POST /api/debug/email - body: { email, subject, ticket }
router.post('/email', async (req, res) => {
  try {
    const { email, subject, ticket } = req.body;
    if (!email) return res.status(400).json({ message: 'email is required' });

    const t = ticket || {
      pnr: 'PNRTEST',
      from: 'TestCity',
      to: 'DestCity',
      date: new Date().toISOString(),
      bookedAt: new Date().toISOString(),
      passengers: [{ name: 'Test User', age: 30, gender: 'Other' }],
      totalCost: 0,
      email
    };

    const result = await sendTicketEmail({ ...t, email, subject: subject || 'Test Ticket' });
    return res.json(result);
  } catch (err) {
    console.error('[emailTest] send error:', err);
    return res.status(500).json({ message: 'Failed to send test email', error: err && err.message ? err.message : String(err) });
  }
});

module.exports = router;
