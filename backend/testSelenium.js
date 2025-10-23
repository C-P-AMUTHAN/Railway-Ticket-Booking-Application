const fs = require('fs');
const path = require('path');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { runSeleniumBooking } = require('./Selenium/seleniumRunner');

const downloadsDir = path.join(__dirname, '..', 'downloads'); // ensure this folder exists or create it

// ensure downloads directory exists
if (!fs.existsSync(downloadsDir)) fs.mkdirSync(downloadsDir, { recursive: true });

// Set Chrome prefs so PDF downloads automatically
const chromePrefs = {
    'download.default_directory': downloadsDir.replace(/\\/g, '\\\\'),
    'download.prompt_for_download': false,
    'profile.default_content_settings.popups': 0,
    'plugins.always_open_pdf_externally': true
};
const chromeOptions = new chrome.Options().setUserPreferences(chromePrefs).addArguments('--no-sandbox', '--disable-dev-shm-usage');

// build driver with options
const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

// helper: try several selectors to locate the second passenger input
async function waitForSecondPassengerName(timeout = 10000) {
    const selectors = [
        'input[data-testid="passenger-name-1"]',                      // recommended frontend attr
        'input[data-index="1"][name*="name"]',                        // alternate attribute
        '.passenger:nth-of-type(2) input[name*="name"]',              // generic nth-child
        'input[name="passengerName[1]"]',                             // some common naming
        'input[name="passengers[1].name"]'
    ];

    const start = Date.now();
    while (Date.now() - start < timeout) {
        for (const sel of selectors) {
            try {
                const el = await driver.findElement(By.css(sel));
                if (el) return el;
            } catch (err) {
                // not found, try next selector
            }
        }
        await driver.sleep(250);
    }
    throw new Error('Second passenger name input not found after waiting');
}

// helper: fill passenger by index (0-based)
async function fillPassenger(index, { name, age, gender, cls }) {
    // try to use data-testid first (recommended)
    const nameSelectors = [
        `input[data-testid="passenger-name-${index}"]`,
        `input[data-index="${index}"][name*="name"]`,
        `.passenger:nth-of-type(${index + 1}) input[name*="name"]`
    ];
    const ageSelectors = [
        `input[data-testid="passenger-age-${index}"]`,
        `input[data-index="${index}"][name*="age"]`,
        `.passenger:nth-of-type(${index + 1}) input[name*="age"]`
    ];
    const genderSelectors = [
        `select[data-testid="passenger-gender-${index}"]`,
        `select[data-index="${index}"][name*="gender"]`,
        `.passenger:nth-of-type(${index + 1}) select[name*="gender"]`
    ];
    const classSelectors = [
        `select[data-testid="passenger-class-${index}"]`,
        `select[data-index="${index}"][name*="class"]`,
        `.passenger:nth-of-type(${index + 1}) select[name*="class"]`
    ];

    async function findAndFill(selectors, value, isSelect = false) {
        for (const sel of selectors) {
            try {
                const el = await driver.findElement(By.css(sel));
                await driver.executeScript('arguments[0].scrollIntoView({block:"center"});', el);
                try { await el.clear(); } catch (e) {}
                if (isSelect) {
                    await el.sendKeys(value);
                } else {
                    await el.sendKeys(String(value));
                }
                return true;
            } catch (err) {
                // try next selector
            }
        }
        return false;
    }

    const okName = await findAndFill(nameSelectors, name, false);
    const okAge = await findAndFill(ageSelectors, age, false);
    const okGender = await findAndFill(genderSelectors, gender, true);
    const okClass = await findAndFill(classSelectors, cls, true);

    if (!okName || !okAge) {
        throw new Error(`Failed to fill passenger ${index + 1} required fields`);
    }
}

async function testBooking() {
  const bookingDetails = {
    from: 'Chennai',
    to: 'Mumbai',
    date: '2025-10-30',
    class: 'Sleeper',
    passengers: 2,
    passengerDetails: [
      { name: 'John Doe', age: 30, gender: 'Male' },
      { name: 'Jane Doe', age: 28, gender: 'Female' }
    ],
    phone: '9876543210',
    email: 'test@example.com'
  };

  try {
    console.log('Starting Selenium test via runSeleniumBooking...');
    const result = await runSeleniumBooking(bookingDetails, (progress, message) => {
      console.log(`Progress: ${progress}% - ${message}`);
    });
    console.log('runSeleniumBooking result:', result);
  } catch (error) {
    console.error('runSeleniumBooking failed:', error.message || error);
  }
}

async function main() {
    try {
        // Run the higher-level test (this likely drives the full flow)
        await testBooking();

        // If you also want to perform lower-level driver actions from here,
        // keep them wrapped in async code. Example: try to click Add Passenger and fill second passenger.
        // (This block is defensive — it will attempt to find and fill fields if present.)
        try {
            const addBtn = await driver.findElement(By.css('button[data-testid="add-passenger"], button#add-passenger, button.add-passenger, button[aria-label="Add Passenger"]'));
            await driver.executeScript('arguments[0].scrollIntoView();', addBtn);
            await addBtn.click();

            // wait for the second passenger inputs to appear
            await waitForSecondPassengerName(10000); // 10s
            await fillPassenger(1, { name: 'Jane Doe', age: 28, gender: 'Female', cls: 'Sleeper' });
            console.log('Filled second passenger via direct driver operations');
        } catch (err) {
            console.warn('Direct driver passenger filling skipped or failed:', err.message);
        }

        // Try to click download button (if present)
        try {
            const downloadBtn = await driver.findElement(By.css('button[data-testid="download-ticket"], a.download-ticket, button#download-pdf'));
            await driver.executeScript('arguments[0].scrollIntoView();', downloadBtn);
            await downloadBtn.click();

            // wait for new file in downloadsDir
            const waitForFile = (dir, timeout = 20000) => new Promise((resolve, reject) => {
                const start = Date.now();
                const initial = new Set(fs.readdirSync(dir));
                const iv = setInterval(() => {
                    const now = Date.now();
                    const files = fs.readdirSync(dir);
                    for (const f of files) {
                        if (!initial.has(f) && f.toLowerCase().endsWith('.pdf')) {
                            clearInterval(iv);
                            return resolve(path.join(dir, f));
                        }
                    }
                    if (now - start > timeout) {
                        clearInterval(iv);
                        return reject(new Error('PDF not found in downloads folder after waiting'));
                    }
                }, 500);
            });

            const pdfPath = await waitForFile(downloadsDir, 20000);
            console.log('PDF downloaded to:', pdfPath);
        } catch (err) {
            console.warn('No explicit download button found or download failed:', err.message);
            // fallback: try to find a link href to a PDF and download via node fetch
            try {
                const link = await driver.findElement(By.css('a[href$=".pdf"]'));
                const href = await link.getAttribute('href');
                if (href) {
                    const fetch = require('node-fetch');
                    const resp = await fetch(href);
                    const buf = await resp.buffer();
                    const out = path.join(downloadsDir, `ticket_${Date.now()}.pdf`);
                    fs.writeFileSync(out, buf);
                    console.log('PDF fetched and saved to', out);
                }
            } catch (err2) {
                console.warn('Fallback PDF fetch failed:', err2.message);
            }
        }

    } finally {
        try { await driver.quit(); } catch (e) {}
    }
}

main().catch(err => {
    console.error('Unhandled error in main:', err);
    process.exitCode = 1;
});
