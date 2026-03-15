require('dotenv').config();

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  console.log('='.repeat(50));
  console.log('🧪 GEMINI API TEST');
  console.log('='.repeat(50));
  console.log('');
  
  // Check if key exists
  console.log('📍 Step 1: Checking API key...');
  if (!apiKey) {
    console.error('❌ ERROR: GEMINI_API_KEY not found in .env file!');
    return;
  }
  console.log('✅ API Key exists');
  console.log('🔑 Key preview:', apiKey.substring(0, 15) + '...');
  console.log('📏 Key length:', apiKey.length);
  console.log('');
  
  // Validate format
  console.log('📍 Step 2: Validating key format...');
  if (!apiKey.startsWith('AIzaSy')) {
    console.error('❌ ERROR: Invalid key format! Should start with AIzaSy');
    return;
  }
  console.log('✅ Key format is valid');
  console.log('');
  
  // Test API call
  console.log('📍 Step 3: Testing API call...');
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const body = {
    contents: [{
      parts: [{
        text: 'Say "Hello, this is a test!"'
      }]
    }]
  };
  
  console.log('🌐 URL:', url.replace(apiKey, '[KEY_HIDDEN]'));
  console.log('📝 Request:', JSON.stringify(body, null, 2));
  console.log('');
  
  try {
    console.log('📤 Sending request...');
    // In node environment, we might need a different way to check singleton state if we were importing it
    // But for this standalone test, we just check the response status as usual
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    console.log('📥 Response status:', response.status, response.statusText);
    console.log('');
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ ERROR RESPONSE:');
      console.error(JSON.stringify(errorData, null, 2));
      console.log('');
      console.error('Error details:', errorData.error?.message);
      return;
    }
    
    const data = await response.json();
    console.log('✅ SUCCESS! Raw response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      console.log('🎉 AI Response:', text);
    } else {
      console.log('⚠️ No text in response');
    }
    
  } catch (error) {
    console.error('💥 REQUEST FAILED:');
    console.error(error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('');
  console.log('='.repeat(50));
}

// Run the test
testGeminiAPI().catch(console.error);
