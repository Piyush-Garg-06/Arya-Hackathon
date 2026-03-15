require('dotenv').config();
const mongoose = require('mongoose');
const CareerPath = require('./models/CareerPath');

async function test() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const mockPayload = {
      userId: '657890abcdef1234567890ab', // Mock ID
      careerName: "Full Stack Developer", 
      description: "Building end-to-end web applications using modern stacks like MERN or Next.js.",
      matchPercentage: 95,
      learningRoadmap: [
        { stepNumber: 1, title: "Frontend Mastery", description: "HTML, CSS, and Advanced JavaScript ES6+.", estimatedDuration: "3 weeks", resources: ["MDN", "FreeCodeCamp"] },
        { stepNumber: 2, title: "Backend & APIs", description: "Node.js, Express, and RESTful API design.", estimatedDuration: "4 weeks", resources: ["Node.js Docs", "Postman"] }
      ],
      estimatedTimeline: 'Flexible',
      difficulty: 'beginner'
    };

    console.log('Attempting to create CareerPath...');
    
    // Check indexes
    const indexes = await CareerPath.collection.getIndexes();
    console.log('Current Indexes:', JSON.stringify(indexes, null, 2));

    const result = await CareerPath.create(mockPayload);
    console.log('✅ Success! First insert:', result._id);

    console.log('Attempting second insert with same careerName...');
    try {
      const result2 = await CareerPath.create(mockPayload);
      console.log('✅ Success! Second insert allowed:', result2._id);
    } catch (dupError) {
      console.error('❌ Duplicate Insert Failed:', dupError.message);
      if (dupError.code === 11000) {
        console.log('⚠️ CONFIRMED: Unique constraint detected even if not in schema.');
      }
    }

  } catch (error) {
    console.error('❌ Failed!');
    if (error.name === 'ValidationError') {
      console.error('Validation Errors:', JSON.stringify(error.errors, null, 2));
    } else {
      console.error(error);
    }
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

test();
