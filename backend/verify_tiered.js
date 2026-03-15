const axios = require('axios');

async function verifyTieredPrompts() {
  const OLLAMA_URL = 'http://localhost:11434/api/generate';
  const MODEL = 'llama3.1:latest';

  const testCases = [
    {
      name: 'Discovery (Unsure)',
      prompt: `You are a career discovery assistant. Analyze these interests: ["Building websites", "Designing interfaces"]. Respond ONLY with valid JSON: {"recommendedCareers": [{"careerName": "Frontend Dev", "matchPercentage": 90, "description": "test", "initialRoadmap": ["step1"]}]}`
    },
    {
      name: 'Explorer (Skill Gap)',
      prompt: `Analyze skill gap for "Frontend Developer" with current skills: ["HTML"]. Respond ONLY with JSON: {"recommendations": [{"careerName": "Frontend Developer", "matchScore": 8, "description": "test", "skillGap": ["React"], "nextSteps": ["Learn React"]}]}`
    },
    {
      name: 'Professional (Transition)',
      prompt: `Analyze transition from "Accountant" to "Data Analyst". Respond ONLY with JSON: {"feasibilityScore": 7, "transferableSkills": ["Math"], "skillGaps": ["SQL"], "transitionStrategy": "Strategy here", "estimatedTimebox": "6 months", "alternativeOptions": ["Business Analyst"]}`
    }
  ];

  for (const test of testCases) {
    console.log(`\nTesting ${test.name}...`);
    try {
      const response = await axios.post(OLLAMA_URL, {
        model: MODEL,
        prompt: test.prompt,
        stream: false,
        format: 'json',
        options: { num_predict: 256 }
      });

      console.log('Response:', response.data.response);
      JSON.parse(response.data.response);
      console.log('✅ Valid JSON');
    } catch (error) {
      console.error(`❌ Failed ${test.name}:`, error.message);
    }
  }
}

verifyTieredPrompts();
