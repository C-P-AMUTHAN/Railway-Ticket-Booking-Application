// backend/controllers/promptController.js
const chrono = require('chrono-node');

// parsePrompt: best-effort offline parser for the new format.
// Format: "Book [number] [class] tickets from [from] to [to] on [date]. Passengers: [name1, age1, gender1]; [name2, age2, gender2]; etc. Contact: [phone], [email]"
function parsePrompt(prompt) {
  const lower = prompt.toLowerCase();

  // Extract number of tickets (passengers)
  let passengersCount = 1;
  const paxMatch = lower.match(/book\s+(\d+)/);
  if (paxMatch) {
    passengersCount = parseInt(paxMatch[1], 10);
  }

  // Extract class
  let travelClass = "Sleeper";
  if (lower.includes("ac 3") || lower.includes("ac3")) travelClass = "AC 3-Tier";
  else if (lower.includes("ac 2") || lower.includes("ac2")) travelClass = "AC 2-Tier";
  else if (lower.includes("ac")) travelClass = "AC 3-Tier";
  else if (lower.includes("sleeper")) travelClass = "Sleeper";

  // Extract from, to
  const fromMatch = lower.match(/from\s+([A-Za-z\s]+?)(?:\s+to\s|\s+on\s|$)/);
  const toMatch = lower.match(/to\s+([A-Za-z\s]+?)(?:\s+on\s|$)/);
  const from = fromMatch ? fromMatch[1].trim().split(' ')[0] : "";
  const to = toMatch ? toMatch[1].trim().split(' ')[0] : "";

  // Extract date
  const parsedDates = chrono.parse(prompt);
  let date = "";
  if (parsedDates && parsedDates.length) {
    const dt = parsedDates[0].start.date();
    date = dt.toISOString().slice(0,10); // YYYY-MM-DD
  } else {
    const datePatterns = [
      /(\d{4}-\d{2}-\d{2})/,
      /(\d{2}\/\d{2}\/\d{4})/,
      /(\d{2}-\d{2}-\d{4})/,
    ];
    for (const pattern of datePatterns) {
      const match = prompt.match(pattern);
      if (match) {
        date = match[1];
        break;
      }
    }
  }

  // Extract passengers details
  const passengersSection = prompt.match(/passengers:\s*(.+?)(?:\s*contact|$)/i);
  let passengers = [];
  if (passengersSection) {
    const paxList = passengersSection[1].split(';').map(p => p.trim());
    passengers = paxList.map(p => {
      const parts = p.split(',').map(x => x.trim());
      if (parts.length >= 3) {
        return { name: parts[0], age: parseInt(parts[1], 10), gender: parts[2] };
      }
      return null;
    }).filter(p => p);
  }
  // If no passengers section, fallback to old logic or default
  if (passengers.length === 0) {
    passengers = [{ name: "Guest", age: 25, gender: "Male" }];
  }

  // Extract contact
  const contactMatch = lower.match(/contact:\s*([0-9]+),\s*([^\s]+)/);
  let phone = "", email = "";
  if (contactMatch) {
    phone = contactMatch[1];
    email = contactMatch[2];
  }

  console.log('Parsed booking details:', { from, to, date, passengersCount, class: travelClass, passengers, phone, email });

  return { from, to, date, passengers: passengersCount, class: travelClass, passengerDetails: passengers, phone, email };
}

const { runSeleniumBooking } = require('../Selenium/seleniumRunner');

// Helper: parse natural-language booking prompt into a bookingDetails object
function parseBookingFromPrompt(input) {
    if (!input) return {};
    if (typeof input === 'object') return input;
    const s = String(input).replace(/\s+/g, ' ').trim();

    const out = {
        passengers: []
    };

    // Book <count> <class> tickets
    const bookMatch = s.match(/Book\s+(\d+)\s+([A-Za-z0-9\-\s]+?)\s+tickets/i);
    if (bookMatch) {
        out.passengersCount = parseInt(bookMatch[1], 10);
        out.class = bookMatch[2].trim();
    }

    // from <from> to <to> on <YYYY-MM-DD>
    const routeMatch = s.match(/from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+?)\s+on\s+(\d{4}-\d{2}-\d{2})/i);
    if (routeMatch) {
        out.from = routeMatch[1].trim();
        out.to = routeMatch[2].trim();
        out.date = routeMatch[3];
    } else {
        const rt = s.match(/from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+)/i);
        if (rt) { out.from = rt[1].trim(); out.to = rt[2].trim(); }
        const d = s.match(/(\d{4}-\d{2}-\d{2})/);
        if (d) out.date = d[1];
    }

    // Passengers: Name, Age, Gender; Name2, Age2, Gender2
    const passengersPart = (s.match(/Passengers?\s*[:\-]\s*(.+?)(?:Contact|$)/i) || [])[1];
    if (passengersPart) {
        const groups = passengersPart.split(/;|\|/).map(x => x.trim()).filter(Boolean);
        for (const g of groups) {
            const cols = g.split(/\s*,\s*/);
            const name = cols[0] ? cols[0].trim() : 'Passenger';
            const age = cols[1] ? parseInt(cols[1], 10) : null;
            const gender = cols[2] ? cols[2].replace(/\.$/, '').trim() : '';
            out.passengers.push({ name, age: age || null, gender });
        }
        if (!out.passengersCount) out.passengersCount = out.passengers.length;
    }

    // Contact: phone and email
    const contactPart = (s.match(/Contact\s*[:\-]\s*([^\n]+)/i) || [])[1] || '';
    const emailMatch = contactPart.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const phoneMatch = contactPart.match(/(\+?\d{7,15})/);
    if (emailMatch) out.email = emailMatch[1];
    if (phoneMatch) out.phone = phoneMatch[1];

    return out;
}

exports.handlePromptBooking = async (req, res) => {
  try {
    // accept prompt from POST body, or query string (GET), or raw body object
    const rawPrompt = (req.body && req.body.prompt) ? req.body.prompt
                    : (req.query && req.query.prompt) ? req.query.prompt
                    : (req.body && Object.keys(req.body).length ? req.body : undefined);
    const bookingDetails = parseBookingFromPrompt(rawPrompt || req.query || {});
    console.log('Parsed booking details:', bookingDetails);

    // include test-user credentials from env if available so Selenium can sign in in the browser
    bookingDetails.email = bookingDetails.email || process.env.TEST_USER_EMAIL;
    bookingDetails.password = bookingDetails.password || process.env.TEST_USER_PASSWORD;

    // Run automation and return result to client (includes pdfPath when available).
    // Note: this waits for the automation to finish — acceptable for prompt flow.
    const result = await runSeleniumBooking(bookingDetails, (pct, msg) => console.log(`Progress: ${pct}% - ${msg}`));
    console.log('Automation finished:', result);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Prompt parse/start error:', err);
    return res.status(500).json({ error: 'Failed to start automation' });
  }
};
