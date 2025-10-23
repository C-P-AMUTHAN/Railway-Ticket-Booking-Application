const nodemailer = require('nodemailer');

// Create reusable transporter using SMTP config. If SMTP credentials are not
// provided, create an Ethereal test account (useful for local development).
const createTransporter = async () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (user && pass) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass }
    });
  }

  // Fallback: create an Ethereal test account
  console.warn('[emailService] SMTP credentials not found, creating Ethereal test account for development');
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
};

// Generate HTML template for ticket email
const generateTicketEmailHTML = (ticket) => {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const passengerRows = ticket.passengers.map((p, i) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${i + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${p.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${p.age}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${p.gender}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${p.travelClass || 'Sleeper'}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px;">
        <h1 style="margin: 0;">Your Train Ticket is Confirmed!</h1>
      </div>
      
      <div style="margin-top: 20px; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1f2937; margin-bottom: 20px;">Booking Details</h2>
        
        <div style="margin-bottom: 20px;">
          <p style="margin: 5px 0;"><strong>PNR:</strong> ${ticket.pnr}</p>
          <p style="margin: 5px 0;"><strong>From:</strong> ${ticket.from}</p>
          <p style="margin: 5px 0;"><strong>To:</strong> ${ticket.to}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${formatDate(ticket.date)}</p>
          <p style="margin: 5px 0;"><strong>Booked On:</strong> ${formatDate(ticket.bookedAt)}</p>
        </div>

        <h3 style="color: #1f2937;">Passenger Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f3f4f6;">
              <th style="padding: 8px; border: 1px solid #ddd;">#</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Age</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Gender</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Class</th>
            </tr>
          </thead>
          <tbody>
            ${passengerRows}
          </tbody>
        </table>

        <div style="margin-top: 20px;">
          <p style="margin: 5px 0;"><strong>Total Cost:</strong> ₹${ticket.totalCost}</p>
        </div>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #6b7280; font-size: 0.875rem;">
            Your e-ticket has been attached to this email. You can also download it from your bookings page.
          </p>
        </div>
      </div>
      
      <div style="margin-top: 20px; text-align: center; color: #6b7280; font-size: 0.875rem;">
        <p>This is an automated message, please do not reply.</p>
        <p>© ${new Date().getFullYear()} Indian Railways. All rights reserved.</p>
      </div>
    </div>
  `;
};

// Send ticket confirmation email
const sendTicketEmail = async (ticket) => {
  try {
    const transporter = await createTransporter();

    const fromAddress = process.env.SMTP_USER ? `"Indian Railways" <${process.env.SMTP_USER}>` : '"Indian Railways" <no-reply@example.com>';

    const info = await transporter.sendMail({
      from: fromAddress,
      to: ticket.email,
      subject: `Train Ticket Confirmation - PNR: ${ticket.pnr}`,
      html: generateTicketEmailHTML(ticket),
      attachments: ticket.pdfBuffer ? [{
        filename: `ticket_${ticket.pnr}.pdf`,
        content: ticket.pdfBuffer
      }] : []
    });

    console.log('Email send attempt:', { messageId: info && info.messageId });

    // If using Ethereal, log preview URL
    if (nodemailer.getTestMessageUrl && nodemailer.getTestMessageUrl(info)) {
      console.log('[emailService] Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId, preview: nodemailer.getTestMessageUrl ? nodemailer.getTestMessageUrl(info) : undefined };
  } catch (error) {
    console.error('Error sending email:', error && error.stack ? error.stack : error);
    return { success: false, error: error && error.message ? error.message : String(error) };
  }
};

module.exports = {
  sendTicketEmail
};