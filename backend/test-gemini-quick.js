require('dotenv').config();

async function quickTest() {
  const key = process.env.GEMINI_API_KEY;
  console.log('🧪 Testing Gemini API...\n');
  
  if (!key) {
    console.error('❌ No GEMINI_API_KEY found in .env!');
    return;
  }
  
  console.log('✅ API Key exists:', key.substring(0, 15) + '...');
  
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${key}`;
  
  const body = {
    contents: [{
      parts: [{
        text: 'Say "Hello! This is a test."'
      }]
    }]
  };
  
  console.log('\n📤 Sending request...');
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    console.log('📥 Status:', res.status, res.statusText);
    
    if (!res.ok) {
      const err = await res.json();
      console.error('\n❌ ERROR:', JSON.stringify(err, null, 2));
      
      if (res.status === 429) {
        console.log('\n💡 You hit rate limit. Wait 30 seconds.');
      } else if (res.status === 403) {
        console.log('\n💡 API key might be invalid.');
      }
      return;
    }
    
    const data = await res.json();
    console.log('\n✅ SUCCESS! Response:', JSON.stringify(data, null, 2));
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      console.log('\n🎉 AI Said:', text);
    }
    
  } catch (error) {
    console.error('💥 Error:', error.message);
  }
}

quickTest().catch(console.error);
