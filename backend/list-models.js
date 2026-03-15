require('dotenv').config();

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  console.log('📋 Listing available models...\n');
  
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;
  
  const res = await fetch(url);
  console.log('Status:', res.status);
  
  const data = await res.json();
  console.log('Available models:\n');
  
  if (data.models) {
    data.models.forEach(model => {
      console.log(`- ${model.name}`);
    });
  }
}

listModels().catch(console.error);
