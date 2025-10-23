const mongoose = require('mongoose');
const Train = require('./models/Train');

async function checkTrains() {
  try {
    await mongoose.connect('mongodb://localhost:27017/railway-booking');
    console.log('Connected to MongoDB');

    const trains = await Train.find();
    console.log(`Found ${trains.length} trains in database:`);

    trains.forEach((train, index) => {
      console.log(`${index + 1}. ${train.name} (${train.number}) - ${train.from} → ${train.to} on ${train.date}`);
    });

    // Check for trains on 2026-01-01
    const searchDate = new Date('2026-01-01');
    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    const trainsOnDate = await Train.find({
      from: { $regex: /^Mumbai$/i },
      to: { $regex: /^Delhi$/i },
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    console.log(`\nTrains from Mumbai to Delhi on 2026-01-01: ${trainsOnDate.length}`);
    trainsOnDate.forEach(train => {
      console.log(`- ${train.name} (${train.number})`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkTrains();
