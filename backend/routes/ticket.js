const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Train = require('../models/Train');
const PDFDocument = require('pdfkit');
const { sendTicketEmail } = require('../services/emailService');

const jwt = require('jsonwebtoken');
const { Readable } = require('stream');

// Helper: Generate PDF and return as buffer
const generatePDFBuffer = async (ticket) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 30 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // normalize values for PDF generation
      const from = ticket.from || '-';
      const to = ticket.to || '-';
      const pnr = ticket.pnr || (`PNR${Math.floor(Math.random()*1e9)}`);
      const trainNumber = ticket.trainNumber || '';
      const trainName = ticket.trainName || '';
      const trainDisplay = trainNumber && trainName ? `${trainNumber} / ${trainName}` : 
                          trainNumber ? trainNumber : 
                          trainName ? trainName : 'TRAIN NAME / NO';
      const travelClass = ticket.travelClass || (ticket.passengers && ticket.passengers[0] && ticket.passengers[0].travelClass) || '-';
      const quota = ticket.quota || 'GENERAL (GN)';
      const distance = ticket.distance || 0;
      const departureTime = ticket.departureTime || '';
      const arrivalTime = ticket.arrivalTime || '';
      const bookingDate = ticket.bookedAt ? new Date(ticket.bookedAt) : new Date();
      const travelDate = ticket.date ? new Date(ticket.date) : null;
      const dateText = travelDate ? travelDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
      const passengers = Array.isArray(ticket.passengers) ? ticket.passengers : [];
      const totalFare = ticket.totalCost != null ? ticket.totalCost : 0;
      const convenienceFee = ticket.convenienceFee || 23.60;
      const pgCharges = ticket.pgCharges || 0;
      const transactionId = ticket.transactionId || `10000${Math.floor(Math.random()*1e9)}`;
      const invoiceNumber = ticket.invoiceNumber || `PS24${pnr.slice(-11)}`;
      const gstin = ticket.gstin || '07AAAGM0289C1ZL';
      const contact = ticket.phone || ticket.email || '-';

      // Generate PDF content (reuse existing PDF generation logic)
      doc.font('Helvetica-Bold').fontSize(14).text('INDIAN RAILWAYS', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`PNR: ${pnr}`, { align: 'left' });
      doc.moveDown();
      doc.text(`From: ${from}`);
      doc.text(`To: ${to}`);
      doc.text(`Date: ${dateText}`);
      doc.moveDown();
      doc.text('Passenger Details:');
      passengers.forEach((p, i) => {
        doc.text(`${i + 1}. ${p.name} (${p.age}, ${p.gender}) - ${p.travelClass || travelClass}`);
      });
      doc.moveDown();
      doc.text(`Total Fare: ₹${totalFare}`);
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// POST /api/tickets
router.post('/', async (req, res) => {
  try {
  const payload = { ...req.body };
  console.log('[ticket.js] Incoming ticket payload:', payload);

    // Try to attach userId from Authorization Bearer token if available
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!payload.userId && auth && auth.startsWith('Bearer ')) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // adjust depending on your token shape
        payload.userId = decoded && (decoded.id || decoded._id || decoded.userId) ? (decoded.id || decoded._id || decoded.userId) : undefined;
      } catch (e) {
        // ignore token errors
      }
    }

    // If from/to/date missing but trainId provided, populate from train doc
    if ((!payload.from || !payload.to || !payload.date) && payload.trainId) {
      try {
        const train = await Train.findById(payload.trainId).lean();
        if (train) {
          payload.from = payload.from || train.from;
          payload.to = payload.to || train.to;
          // if train has a date or you want to use payload.date, prefer payload.date
          payload.date = payload.date || train.date || payload.date;
        }
      } catch (e) {
        console.warn('Could not populate train data for ticket:', e.message || e);
      }
    }

    // Normalize date if provided (accept ISO string)
    if (payload.date) payload.date = new Date(payload.date);

  // Ensure email/phone are present on payload (some clients may send nested fields)
  if (!payload.email && req.body && req.body.email) payload.email = req.body.email;
  if (!payload.phone && req.body && req.body.phone) payload.phone = req.body.phone;

  const ticket = new Ticket(payload);
     const saved = await ticket.save();

     // Generate PDF buffer for email attachment
     try {
       const pdfBuffer = await generatePDFBuffer(saved);
       // Send confirmation email with PDF attachment if email is provided
      if (saved.email) {
        console.log('[ticket.js] Attempting to send confirmation email to:', saved.email);
        const emailResult = await sendTicketEmail({ ...saved.toObject(), pdfBuffer });
        console.log('[ticket.js] Email send result:', emailResult);
      } else {
        console.log('[ticket.js] No email provided on ticket, skipping email send');
      }
     } catch (emailError) {
       console.error('Error sending confirmation email:', emailError);
       // Don't fail the request if email fails
     }

     const pdfUrl = `/api/tickets/${saved._id}/pdf`;
    return res.status(201).json({ ...saved.toObject(), pdfUrl });
  } catch (err) {
    console.error('Save ticket error:', err);
    // return validation details for debugging
    return res.status(500).json({ message: 'Failed to save ticket', error: err && err.toString ? err.toString() : err });
  }
});

// generate and return ticket PDF (ERS full layout)
router.get('/:id/pdf', async (req, res) => {
  try {
    const id = req.params.id;
    const ticket = await Ticket.findById(id).lean();
    if (!ticket) return res.status(404).send('Ticket not found');

    // normalize values
    const from = ticket.from || '-';
    const to = ticket.to || '-';
    const pnr = ticket.pnr || (`PNR${Math.floor(Math.random()*1e9)}`);
    const trainNumber = ticket.trainNumber || '';
    const trainName = ticket.trainName || '';
    // Combine train number and name properly
    const trainDisplay = trainNumber && trainName ? `${trainNumber} / ${trainName}` : 
                        trainNumber ? trainNumber : 
                        trainName ? trainName : 'TRAIN NAME / NO';
    const travelClass = ticket.travelClass || (ticket.passengers && ticket.passengers[0] && ticket.passengers[0].travelClass) || '-';
    const quota = ticket.quota || 'GENERAL (GN)';
    const distance = ticket.distance || 0;
    const departureTime = ticket.departureTime || '';
    const arrivalTime = ticket.arrivalTime || '';
    const bookingDate = ticket.bookedAt ? new Date(ticket.bookedAt) : new Date();
    const travelDate = ticket.date ? new Date(ticket.date) : null;
    const dateText = travelDate ? travelDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const passengers = Array.isArray(ticket.passengers) ? ticket.passengers : [];
    const totalFare = ticket.totalCost != null ? ticket.totalCost : 0;
    const convenienceFee = ticket.convenienceFee || 23.60;
    const pgCharges = ticket.pgCharges || 0;
    const transactionId = ticket.transactionId || `10000${Math.floor(Math.random()*1e9)}`;
    const invoiceNumber = ticket.invoiceNumber || `PS24${pnr.slice(-11)}`;
    const gstin = ticket.gstin || '07AAAGM0289C1ZL';
    const contact = ticket.phone || ticket.email || '-';

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="ticket-${pnr}.pdf"`);

    const doc = new PDFDocument({ size: 'A4', margin: 30 });
    doc.pipe(res);

    // Utility positions
    const pageWidth = doc.page.width - 60;
    const leftX = 30;
    const colWidth = pageWidth / 2 - 10;
    let y = 20;

    // Header Section
    doc.font('Helvetica-Bold').fontSize(10).text('WL', leftX, y);
    y += 15;
    doc.fontSize(14).text('INDIAN RAILWAYS', leftX, y, { width: pageWidth, align: 'center' });
    y += 20;
    doc.fontSize(12).text('Electronic Reservation Slip (ERS)-Normal User', leftX, y, { width: pageWidth, align: 'center' });
    y += 15;
    doc.text('RI IRCTC', leftX, y, { width: pageWidth, align: 'center' });
    y += 25;

    // Title and Header (smaller fonts)
    doc.font('Helvetica-Bold').fontSize(20).text('INDIAN RAILWAYS', leftX, y, { width: pageWidth, align: 'center' });
    y += 20;
    doc.fontSize(14).text('Electronic Reservation Slip (ERS)-Normal User', leftX, y, { width: pageWidth, align: 'center' });
    y += 25;

    // WL status at top right
    doc.font('Helvetica-Bold').fontSize(10).text('WL', leftX + pageWidth - 20, y - 35);

    // RI at bottom left
    doc.font('Helvetica-Bold').fontSize(10).text('RI', leftX, y - 15);

    // IRCTC at bottom right
    doc.font('Helvetica-Bold').fontSize(10).text('IRCTC', leftX + pageWidth - 50, y - 15);

    // Draw top border
    doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).stroke();
    y += 15;

    // Booked From section
    doc.font('Helvetica-Bold').fontSize(10).text('Booked From', leftX, y);
    doc.font('Helvetica').text(`${from} Start Date* ${dateText}`, leftX + 90, y);
    y += 18;

    // PNR and Quota
    doc.font('Helvetica-Bold').text('PNR', leftX, y);
    doc.font('Helvetica').text(pnr, leftX + 40, y);
    doc.font('Helvetica-Bold').text('Quota', leftX + 180, y);
    doc.font('Helvetica').text(quota, leftX + 220, y);
    y += 18;

    // Passenger Details header
    doc.font('Helvetica-Bold').fontSize(12).text('Passenger Details', leftX, y);
    y += 18;

    // Boarding At and Train details
    doc.font('Helvetica-Bold').fontSize(10).text('Boarding At', leftX, y);
    doc.font('Helvetica').text(`${from} Departure* ${departureTime} ${dateText}`, leftX + 90, y);
    y += 18;

    doc.font('Helvetica-Bold').text('Train No./Name', leftX, y);
    doc.font('Helvetica').text(trainDisplay, leftX + 110, y);
    doc.font('Helvetica-Bold').text('Distance', leftX + 280, y);
    doc.font('Helvetica').text(`${distance} KM`, leftX + 330, y);
    y += 18;

    doc.font('Helvetica-Bold').text('To', leftX, y);
    doc.font('Helvetica').text(to, leftX + 40, y);
    doc.font('Helvetica-Bold').text('Arrival*', leftX + 180, y);
    doc.font('Helvetica').text(`${arrivalTime} ${travelDate ? new Date(travelDate.getTime() + 24*60*60*1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}`, leftX + 220, y);
    y += 18;

    doc.font('Helvetica-Bold').text('Class', leftX, y);
    doc.font('Helvetica').text(travelClass, leftX + 40, y);
    doc.font('Helvetica-Bold').text('Booking Date', leftX + 180, y);
    doc.font('Helvetica').text(bookingDate.toLocaleString('en-IN'), leftX + 250, y);
    y += 25;

    // Draw separator line
    doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).stroke();
    y += 15;

    // Passenger table
    const headers = ['#', 'Name', 'Age', 'Gender', 'Booking Status', 'Current Status'];
    const colWidths = [25, 120, 40, 50, 80, 80];
    let xPos = leftX;

    headers.forEach((header, i) => {
        doc.font('Helvetica-Bold').fontSize(9).text(header, xPos, y);
        xPos += colWidths[i];
    });
    y += 12;

    // Draw header separator
    doc.moveTo(leftX, y).lineTo(leftX + pageWidth, y).stroke();
    y += 8;

    // Passenger rows
    passengers.forEach((passenger, index) => {
        xPos = leftX;
        doc.font('Helvetica').fontSize(9)
            .text(String(index + 1), xPos, y);
        xPos += colWidths[0];

        doc.text(passenger.name || '-', xPos, y);
        xPos += colWidths[1];

        doc.text(String(passenger.age || '-'), xPos, y);
        xPos += colWidths[2];

        doc.text(passenger.gender || '-', xPos, y);
        xPos += colWidths[3];
        
        doc.text(ticket.bookingStatus || 'CONFIRMED', xPos, y);
        xPos += colWidths[4];
        
        doc.text(ticket.currentStatus || 'CONFIRMED', xPos, y);
        
        y += 15;
    });
    y += 15;

    // Acronyms section
    doc.font('Helvetica-Bold').fontSize(8).text('Acronyms', leftX, y);
    y += 10;
    doc.font('Helvetica').fontSize(7)
      .text('POWL: POOLED QUOTA WAITLIST    RSWL: ROAD-SIDE WAITLIST    RLWL: REMOTE LOCATION WAITLIST', leftX, y, { width: pageWidth });
    y += 12;

    // Transaction ID and IR note
    doc.font('Helvetica').fontSize(8)
      .text(`Transaction ID: ${transactionId}    IR recovers only 57% of cost of travel on an average.`, leftX, y);
    y += 15;

    // Payment Details
    doc.font('Helvetica-Bold').fontSize(9).text('Payment Details', leftX, y);
    y += 10;

    doc.font('Helvetica').fontSize(8)
      .text('Ticket Fare', leftX, y)
      .text(`₹ ${totalFare.toFixed(2)}`, leftX + 180, y);
    y += 10;

    doc.text('IRCTC Convenience Fee (Incl. of GST)', leftX, y)
      .text(`₹ ${convenienceFee.toFixed(2)}`, leftX + 180, y);
    y += 10;

    doc.text('Total Fare (all inclusive)', leftX, y)
      .text(`₹ ${(totalFare + convenienceFee).toFixed(2)}`, leftX + 180, y);
    y += 10;

    doc.text('PG Charges as applicable (Additional)', leftX, y)
      .text(`₹ ${pgCharges.toFixed(2)}`, leftX + 180, y);
    y += 15;

    // Important Notes
    const notes = [
        '⚫ Beware of fraudulent customer care number. For any assistance, use only the IRCTC e-ticketing Customer care number:14646.',
        '⚫ IRCTC Convenience Fee is charged per e-ticket irrespective of number of passengers on the ticket.',
        '⚫ The printed Departure and Arrival Times are liable to change. Please Check correct departure, arrival from Railway Station Enquiry or Dial 139 or SMS RAIL to 139.',
        '⚫ This ticket is booked on a personal User ID, its sale/purchase is an offence u/s 143 of the Railways Act, 1989.',
        '⚫ Prescribed original ID proof is required while travelling along with SMS/VRM/ERS otherwise will be treated as without ticket and penalized as per Railway Rules.',
        '⚫ Amount Deducted? Ticket Not Booked? No Worries! Reuse the deducted amount for your next booking with IRCTC iPay'
    ];

    doc.font('Helvetica').fontSize(7);
    notes.forEach(note => {
        doc.text(note, leftX, y, { width: pageWidth - 20 });
        y += 8;
    });
    y += 10;

    // GST Details
    doc.font('Helvetica-Bold').fontSize(8).text('Indian Railways GST Details:', leftX, y);
    y += 10;

    doc.font('Helvetica').fontSize(7)
      .text(`Invoice Number: ${invoiceNumber}    Address: Indian Railways New Delhi`, leftX, y);
    y += 8;

    doc.text(`Supplier Information:    SAC Code: 996421    GSTIN: ${gstin}`, leftX, y);
    y += 8;

    doc.text('Recipient Information:    GSTIN: NA    Name: NA    Address: NA', leftX, y);

    // finalize
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Failed to generate PDF');
  }
});

module.exports = router;
