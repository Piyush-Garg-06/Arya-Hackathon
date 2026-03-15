require('dotenv').config();
const ollamaService = require('./services/ollamaService');

async function verifyMockAndFallback() {
  console.log('🧪 VERIFYING OLLAMA SERVICE');
  console.log('='.repeat(40));

  // 1. Check initial state
  console.log(`Initial state: useMock = ${ollamaService.useMock}`);

  // 2. Test a JSON response (Questions)
  console.log('\nTesting generateInterviewQuestions...');
  try {
    const result = await ollamaService.generateInterviewQuestions('Frontend Developer', 'intermediate');
    if (result && result.questions && Array.isArray(result.questions)) {
      console.log('✅ Received Questions:', result.questions.length);
      console.log('First Question:', result.questions[0].questionText);
      console.log('Keys check:', Object.keys(result.questions[0]).join(', '));
    } else {
      console.error('❌ Failed: Invalid questions structure', result);
    }
  } catch (err) {
    console.error('❌ Failed Question Gen:', err.message);
  }

  // 3. Test evaluation
  console.log('\nTesting evaluateAnswer...');
  try {
    const evaluation = await ollamaService.evaluateAnswer('What is React?', 'It is a UI library.');
    if (evaluation && evaluation.aiScore !== undefined) {
      console.log('✅ Received Evaluation. Score:', evaluation.aiScore);
      console.log('Feedback:', evaluation.feedback);
      console.log('Keys check:', Object.keys(evaluation).join(', '));
    } else {
      console.error('❌ Failed: Invalid evaluation structure', evaluation);
    }
  } catch (err) {
    console.error('❌ Failed Evaluation:', err.message);
  }

  console.log('\n' + '='.repeat(40));
  console.log(`Final state: useMock = ${ollamaService.useMock}`);
}

verifyMockAndFallback();
