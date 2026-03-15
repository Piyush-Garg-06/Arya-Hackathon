require('dotenv').config();

async function testNewGeminiKey() {
  const key = process.env.GEMINI_API_KEY;
  
  console.log('='.repeat(50));
  console.log('🧪 TESTING NEW GEMINI API KEY');
  console.log('='.repeat(50));
  console.log('');
  
  console.log('📍 Step 1: Checking API key...');
  if (!key) {
    console.error('❌ ERROR: GEMINI_API_KEY not found!');
    return;
  }
  console.log('✅ API Key exists');
  console.log('🔑 Key preview:', key.substring(0, 20) + '...');
  console.log('');
  
  console.log('📍 Step 2: Testing API call...');
  
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`;
  
  const body = {
    contents: [{
      parts: [{
        text: 'Say "Hello! Your new Gemini API key is working perfectly!"'
      }]
    }]
  };
  
  console.log('🌐 URL:', url.replace(key, '[KEY_HIDDEN]'));
  console.log('📝 Request:', JSON.stringify(body, null, 2));
  console.log('');
  
  try {
    console.log('📤 Sending request...');
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    console.log('📥 Response status:', response.status, response.statusText);
    console.log('');
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ ERROR RESPONSE:');
      console.error(JSON.stringify(errorData, null, 2));
      console.log('');
      
      if (response.status === 429) {
        console.log('💡 Rate limit exceeded. Wait 30 seconds.');
      } else if (response.status === 403) {
        console.log('💡 API key invalid or insufficient permissions.');
      }
      return;
    }
    
    const data = await response.json();
    console.log('✅ SUCCESS! Raw response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      console.log('🎉 AI Response:', text);
      console.log('');
      console.log('✨ YOUR NEW GEMINI KEY IS WORKING! ✨');
    } else {
      console.log('⚠️ No text in response');
    }
    
  } catch (error) {
    console.error('💥 REQUEST FAILED:');
    console.error(error.message);
  }
  
  console.log('');
  console.log('='.repeat(50));
}

testNewGeminiKey().catch(console.error);
