// Test script for Selenium automation
const { runSeleniumBooking } = require('./Selenium/seleniumRunner');

async function testAutomation() {
  console.log('🧪 Testing Selenium automation...');
  
  const testBookingDetails = {
    from: "Chennai",
    to: "Trichy", 
    date: "2025-01-15",
    passengers: 2,
    class: "AC 3-Tier",
    name: "Amuthan"
  };

  try {
    console.log('Test booking details:', testBookingDetails);
    const result = await runSeleniumBooking(testBookingDetails);
    console.log('✅ Automation test successful!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Automation test failed:', error.message);
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testAutomation();
}

module.exports = { testAutomation };
