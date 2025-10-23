const mongoose = require('mongoose');
require('dotenv').config();

const Train = require('./models/Train');

async function migrateTrainFields() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/railway-booking');

    console.log('Connected to MongoDB');

    // Find all trains and update field names
    const trains = await Train.find({});

    for (const train of trains) {
      const update = {};

      if (train.firstClassAC !== undefined) {
        update.ac2Tier = train.firstClassAC;
        update.$unset = { ...update.$unset, firstClassAC: 1 };
      }

      if (train.secondClass !== undefined) {
        update.ac3Tier = train.secondClass;
        update.$unset = { ...update.$unset, secondClass: 1 };
      }

      if (train.thirdClass !== undefined) {
        update.sleeper = train.thirdClass;
        update.$unset = { ...update.$unset, thirdClass: 1 };
      }

      if (Object.keys(update).length > 0) {
        await Train.findByIdAndUpdate(train._id, update);
        console.log(`Updated train ${train._id}`);
      }
    }

    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateTrainFields();
