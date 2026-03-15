require('dotenv').config();
const mongoose = require('mongoose');

async function reset() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const collections = await mongoose.connection.db.collections();
    
    for (const collection of collections) {
      if (collection.collectionName === 'careerpaths') {
        console.log(`Dropping collection: ${collection.collectionName}`);
        await collection.drop();
        console.log('Collection dropped successfully.');
      }
    }

    console.log('✨ Database sanitized for CareerPath.');

  } catch (error) {
    console.error('❌ Reset Failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

reset();
