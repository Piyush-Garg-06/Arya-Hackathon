require('dotenv').config();

async function testHuggingFace() {
  const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  
  console.log('='.repeat(50));
  console.log('🧪 TESTING HUGGING FACE API');
  console.log('='.repeat(50));
  console.log('');
  
  console.log('📍 Step 1: Checking API key...');
  if (!HF_API_KEY) {
    console.error('❌ ERROR: HUGGINGFACE_API_KEY not found!');
    return;
  }
  console.log('✅ API Key exists');
  console.log('🔑 Key preview:', HF_API_KEY.substring(0, 15) + '...');
  console.log('');
  
  console.log('📍 Step 2: Testing API call...');
  
  const systemPrompt = 'You are a helpful assistant.';
  const userMessage = 'Say "Hello, this is a test!"';
  
  const url = 'https://router.huggingface.co/v1/chat/completions';
  
  const body = {
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 500,
    temperature: 0.7
  };
  
  console.log('🌐 URL:', url);
  console.log('📝 Request body:', JSON.stringify(body, null, 2));
  console.log('');
  
  try {
    console.log('📤 Sending request...');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
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
      
      if (response.status === 401) {
        console.log('\n💡 FIX: Your API key might be invalid. Check it at:');
        console.log('https://huggingface.co/settings/tokens');
      }
      
      if (response.status === 503) {
        console.log('\n💡 INFO: Model is loading. Wait 10 seconds and try again.');
      }
      
      return;
    }
    
    const data = await response.json();
    console.log('✅ SUCCESS! Raw response:');
    console.log(JSON.stringify(data, null, 2));
    console.log('');
    
    const aiText = data.choices?.[0]?.message?.content;
    if (aiText) {
      console.log('🎉 AI Response:', aiText);
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

testHuggingFace().catch(console.error);
