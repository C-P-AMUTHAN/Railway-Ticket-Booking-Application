const mongoose = require('mongoose');
const Train = require('./models/Train');

async function addTestTrains() {
  try {
    await mongoose.connect('mongodb://localhost:27017/railway-booking');
    console.log('Connected to MongoDB');

    // Check existing trains
    const existingTrains = await Train.find();
    console.log(`Found ${existingTrains.length} existing trains`);

    if (existingTrains.length === 0) {
      // Add test trains
      const testTrains = [
        {
          name: "Rajdhani Express",
          number: "12951",
          from: "Mumbai",
          to: "Delhi",
          date: new Date("2026-01-01T00:00:00.000Z"),
          departureTime: "16:35",
          arrivalTime: "08:35"
        },
        {
          name: "Shatabdi Express",
          number: "12001",
          from: "Mumbai",
          to: "Delhi",
          date: new Date("2026-01-01T00:00:00.000Z"),
          departureTime: "06:25",
          arrivalTime: "12:15"
        },
        {
          name: "Duronto Express",
          number: "12259",
          from: "Mumbai",
          to: "Delhi",
          date: new Date("2026-01-01T00:00:00.000Z"),
          departureTime: "19:10",
          arrivalTime: "07:10"
        }
      ];

      for (const trainData of testTrains) {
        const train = new Train(trainData);
        await train.save();
        console.log(`Added train: ${train.name}`);
      }

      console.log('Test trains added successfully');
    } else {
      console.log('Trains already exist, skipping addition');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addTestTrains();
