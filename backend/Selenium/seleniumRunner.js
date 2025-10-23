const fs = require('fs');
const path = require('path');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const Ticket = require('../models/Ticket');

// Helper: wait for element by CSS, then return it
async function waitForCss(driver, selector, timeout = 10000) {
  return await driver.wait(until.elementLocated(By.css(selector)), timeout);
}

// Helper: fill passenger inputs reliably for given index (0-based)
async function waitAndFillPassenger(driver, index, { name, age, gender, travelClass }) {
  const nameSel = `input[data-testid="passenger-name-${index}"], input[name*="passengers"][name*="name"]`;
  const ageSel = `input[data-testid="passenger-age-${index}"], input[name*="passengers"][name*="age"]`;
  const genderSel = `select[data-testid="passenger-gender-${index}"], select[name*="passengers"][name*="gender"]`;
  const classSel = `select[data-testid="passenger-class-${index}"], select[name*="passengers"][name*="class"]`;

  const nameEl = await waitForCss(driver, nameSel);
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', nameEl);
  try { await nameEl.clear(); } catch (e) {}
  await nameEl.sendKeys(name);

  const ageEl = await waitForCss(driver, ageSel);
  try { await ageEl.clear(); } catch (e) {}
  await ageEl.sendKeys(String(age));

  const genderEl = await waitForCss(driver, genderSel);
  await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', genderEl);
  await genderEl.sendKeys(gender);

  const classEl = await waitForCss(driver, classSel);
  await classEl.sendKeys(travelClass);
}

async function runSeleniumBooking(bookingDetails = {}, progressCb = () => {}) {
  const downloadsDir = path.join(__dirname, '..', 'downloads');
  if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

  const headlessEnv = process.env.HEADLESS;
  const headless = headlessEnv === undefined ? true : String(headlessEnv).toLowerCase() === 'true';
  console.log('[seleniumRunner] ENV HEADLESS=', process.env.HEADLESS, '=> parsed headless=', headless);
  progressCb(15, 'Starting browser');

  const chromeOpts = new chrome.Options();
  chromeOpts.addArguments('--no-sandbox', '--disable-dev-shm-usage');
  if (headless) chromeOpts.addArguments('--headless=new');
  chromeOpts.setUserPreferences({
    'download.default_directory': downloadsDir.replace(/\\/g, '\\\\'),
    'download.prompt_for_download': false,
    'plugins.always_open_pdf_externally': true,
  });

  let driver;
  const DRIVER_CREATE_TIMEOUT = Number(process.env.DRIVER_CREATE_TIMEOUT_MS || 60000);
  try {
    console.log(`[seleniumRunner] creating chrome driver (timeout ${DRIVER_CREATE_TIMEOUT}ms)`);
    driver = await Promise.race([
      new Builder().forBrowser('chrome').setChromeOptions(chromeOpts).build(),
      new Promise((_, rej) => setTimeout(() => rej(new Error('Driver creation timed out')), DRIVER_CREATE_TIMEOUT))
    ]);
    console.log('[seleniumRunner] driver created');
  } catch (err) {
    console.warn('[seleniumRunner] default driver creation failed:', err && err.message ? err.message : err);
    progressCb(0, 'Default driver creation failed: ' + (err && err.message ? err.message : String(err)));
    
    try {
      console.log('[seleniumRunner] trying chromedriver package fallback');
      const chromedriver = require('chromedriver');
      const service = new chrome.ServiceBuilder(chromedriver.path);
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(chromeOpts)
        .setChromeService(service)
        .build();
      console.log('[seleniumRunner] driver created via chromedriver package fallback');
    } catch (err2) {
      console.error('[seleniumRunner] chromedriver fallback failed:', err2 && err2.message ? err2.message : err2);
      throw err2;
    }
  }

  const result = { success: false };
  try {
    progressCb(20, 'Navigating to signin page');
    console.log('[seleniumRunner] open signin page:', 'http://localhost:5173/signin');
    await driver.get('http://localhost:5173/signin');

    // Fill login form
    const email = process.env.TEST_USER_EMAIL;
    const password = process.env.TEST_USER_PASSWORD;
    if (email && password) {
      const emailInput = await waitForCss(driver, 'input[type="email"]');
      const passwordInput = await waitForCss(driver, 'input[type="password"]');
      await emailInput.sendKeys(email);
      await passwordInput.sendKeys(password);
      await passwordInput.sendKeys(Key.RETURN);
      await driver.sleep(1000);
    }

    progressCb(30, 'Opening booking page');
    console.log('[seleniumRunner] open booking page:', 'http://localhost:5173/booking');
    await driver.get('http://localhost:5173/booking');

    // Fill search form
    progressCb(40, 'Filling search form');
    const fromInput = await waitForCss(driver, 'input[name="from"]');
    const toInput = await waitForCss(driver, 'input[name="to"]');
    const dateInput = await waitForCss(driver, 'input[name="date"]');

    await fromInput.sendKeys(bookingDetails.from);
    await toInput.sendKeys(bookingDetails.to);
    // Ensure date is provided in YYYY-MM-DD; React's controlled input expects a full value.
    const normalizeDateForInput = (d) => {
      if (!d) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
      try {
        const parsed = new Date(d);
        if (!isNaN(parsed.valueOf())) return parsed.toISOString().split('T')[0];
      } catch (e) {}
      // fallback to original string
      return d;
    };
    const dateValue = normalizeDateForInput(bookingDetails.date);
    // Send keys then set value via JS and dispatch input event to ensure React sees the change
    try {
      await dateInput.clear();
      await dateInput.sendKeys(dateValue);
      await driver.executeScript("arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input', { bubbles: true }));", dateInput, dateValue);
    } catch (err) {
      // fallback to sendKeys only
      await dateInput.sendKeys(bookingDetails.date);
    }

    const searchButton = await driver.findElement(By.css('button[type="submit"]'));
    await searchButton.click();

    // Wait for and click first "Book Now" button
    progressCb(55, 'Waiting for search results');
    await driver.wait(until.elementLocated(By.xpath('//button[contains(text(), "Book Now")]')), 10000);
    const bookButtons = await driver.findElements(By.xpath('//button[contains(text(), "Book Now")]'));
    if (bookButtons.length === 0) throw new Error('No Book Now buttons found');
    
    progressCb(65, 'Selected train, opening booking form');
    await bookButtons[0].click();
    await driver.sleep(1000);

    // Fill passenger details
    progressCb(70, 'Filling passengers');
    const passengers = bookingDetails.passengers || [];
    for (let i = 0; i < passengers.length; i++) {
      if (i > 0) {
        const addButton = await driver.findElement(By.css('button[data-testid="add-passenger"]'));
        await addButton.click();
        await driver.sleep(300);
      }
      await waitAndFillPassenger(driver, i, {
        name: passengers[i].name,
        age: passengers[i].age,
        gender: passengers[i].gender,
        travelClass: bookingDetails.class || 'Sleeper'
      });
    }

    // Fill contact details
    progressCb(85, 'Filling contact details');
    const phoneInput = await waitForCss(driver, 'input[type="tel"]');
    const emailInput = await waitForCss(driver, 'input[type="email"]');
    await phoneInput.sendKeys(bookingDetails.phone);
    await emailInput.sendKeys(bookingDetails.email);

    // Submit booking
    progressCb(90, 'Submitting booking');
    const submitButton = await driver.findElement(By.css('button[type="submit"]'));
    await submitButton.click();

    // Wait for confirmation
    progressCb(95, 'Waiting for confirmation and ticket');
    await driver.sleep(2000);

    // Try to save ticket in DB
    try {
      const ticket = new Ticket({
        pnr: 'PNR' + Math.floor(Math.random() * 1000000000),
        from: bookingDetails.from,
        to: bookingDetails.to,
        date: new Date(bookingDetails.date),
        passengers: bookingDetails.passengers,
        totalCost: 400,
        bookedAt: new Date()
      });
      const saved = await ticket.save();
      console.log('[seleniumRunner] saved ticket:', saved._id);
      
      // Set PDF path for frontend
      const pdfUrl = `/api/tickets/${saved._id}/pdf`;
      result.pdfPath = `http://localhost:5000${pdfUrl}`;
    } catch (err) {
      console.error('[seleniumRunner] failed to save ticket:', err);
    }

    progressCb(100, 'Automation completed');
    console.log('[seleniumRunner] automation completed successfully');
    result.success = true;
    result.message = 'Automation finished';
    result.bookingDetails = bookingDetails;
    return result;
  } catch (err) {
    console.error('[seleniumRunner] automation error:', err);
    progressCb(0, 'Automation error: ' + (err && err.message ? err.message : String(err)));
    throw err;
  } finally {
    try {
      await driver.quit();
    } catch (e) {
      console.warn('[seleniumRunner] driver quit error:', e);
    }
  }
}

module.exports = { runSeleniumBooking };