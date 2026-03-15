/**
 * Centralized prompt templates for AI Career Coach
 * All prompts designed for structured JSON responses from Gemini
 */

const PROMPT_TEMPLATES = {
  // 1. Quiz / Interest Analysis (Tier: Unsure)
  INTEREST_ANALYSIS: (answers) => `
You are an expert career counselor. Analyze the following quiz answers and provide a comprehensive career assessment for someone who is UNSURE (interest nahi pata).

User Answers:
${JSON.stringify(answers, null, 2)}

Respond ONLY with valid JSON in EXACTLY this format:
{
  "interestProfile": {
    "problemSolving": <number 0-10>,
    "creativity": <number 0-10>,
    "analyticalThinking": <number 0-10>,
    "communication": <number 0-10>,
    "leadership": <number 0-10>,
    "technical": <number 0-10>
  },
  "aiAnalysis": "<short diagnostic analysis paragraph>",
  "recommendedCareers": [
    {
      "careerName": "<career name>",
      "matchPercentage": <number 0-100>,
      "description": "<why this suits them>",
      "learningRoadmap": [
        {
          "stepNumber": 1,
          "title": "<step title>",
          "description": "<short details>",
          "estimatedDuration": "<e.g., 2 weeks>",
          "resources": ["URL or resource name"]
        }
      ]
    }
  ]
}

Provide 3 recommended careers.`,

  // 2. Career Recommendation (Tier: Explorer)
  CAREER_RECOMMENDATION: (userProfile) => `
You are an expert career advisor. Based on the following user profile (who knows their primary interest), recommend suitable career paths and next steps.

User Profile:
- Current Skills: ${userProfile.currentSkills?.join(', ') || 'Not specified'}
- Desired Career: ${userProfile.desiredCareer || 'Not specified'}

Respond ONLY with valid JSON in EXACTLY this format:
{
  "recommendations": [
    {
      "careerName": "<career name>",
      "matchScore": <number 0-10>,
      "description": "<detailed match explanation>",
      "skillGap": ["missing_skill1", "missing_skill2"],
      "learningRoadmap": [
        {
          "stepNumber": 1,
          "title": "<step title>",
          "description": "<short details>",
          "estimatedDuration": "<duration>",
          "resources": ["resource"]
        }
      ],
      "nextSteps": ["action1", "action2"]
    }
  ],
  "summary": "<overall advice for growth>"
}

Provide 3 recommendations.`,

  // 3. Skill Gap Analysis (Detailed for Explorer)
  SKILL_GAP: (desiredCareer, currentSkills) => `
You are an expert career coach. Perform a deep skill gap analysis for someone wanting to become a ${desiredCareer}.

Current Skills: ${currentSkills.join(', ')}

Respond ONLY with valid JSON in EXACTLY this format:
{
  "missingSkills": [
    {
      "skill": "<skill name>",
      "priority": "high|medium|low"
    }
  ],
  "availableRoles": ["role1", "role2"],
  "learningRoadmap": [
    {
      "stepNumber": 1,
      "title": "<step title>",
      "description": "<short details>",
      "estimatedDuration": "<duration>",
      "resources": ["resource"]
    }
  ],
  "estimatedTimeline": "<timeline>"
}

Be practical and specific.`,

  // 4. Interview Question Generation
  INTERVIEW_QUESTION: (careerRole, difficultyLevel) => `
You are an expert interviewer for ${careerRole} positions. Generate 3 interview questions at the ${difficultyLevel} difficulty level.

Include:
- 1 Technical question
- 1 Behavioral question  
- 1 Problem-solving question

Respond ONLY with valid JSON in EXACTLY this format:
{
  "questions": [
    {
      "questionId": "q1",
      "questionText": "<the question>",
      "category": "technical|behavioral|problem-solving",
      "expectedKeyPoints": ["point1", "point2"]
    }
  ]
}

Keep questions direct and appropriate for the ${difficultyLevel} level.`,

  // 5. Answer Evaluation
  ANSWER_EVALUATION: (question, userAnswer) => `
You are an expert interview evaluator. Evaluate the following interview answer fairly.

Question: ${question}
User Answer: ${userAnswer}

Respond ONLY with valid JSON in EXACTLY this format:
{
  "aiScore": <number 0-10>,
  "strengths": ["short_strength1"],
  "weaknesses": ["short_weakness1"],
  "improvedAnswer": "<concise improved version>",
  "communicationScore": <number 0-10>,
  "technicalAccuracy": <number 0-10>,
  "feedback": "<very concise feedback, 1-2 sentences max>"
}

Be brief but accurate. Focus on the most critical feedback.`,

  // 6. Career Advice / AI Chatbot
  CAREER_ADVICE: (message, userProfile = {}) => `
You are an expert AI Career Coach with 20 years of experience in career counseling, interview preparation, and professional development. Provide helpful, actionable career advice.

${userProfile.name ? `User: ${userProfile.name}` : ''}
${userProfile.currentSkills?.length ? `Current Skills: ${userProfile.currentSkills.join(', ')}` : ''}
${userProfile.desiredCareer ? `Desired Career: ${userProfile.desiredCareer}` : ''}
${userProfile.level ? `Level: ${userProfile.level}` : ''}

User's Message: ${message}

Provide detailed, actionable advice. Be encouraging and professional. Structure your response clearly with actionable steps when relevant. Keep responses to 2-4 paragraphs.`,

  // 7. Session Feedback
  SESSION_FEEDBACK: (session, answers, avgScore) => `
You are an expert interview coach. Generate comprehensive feedback for a completed mock interview session.

Session Details:
- Role: ${session.careerRole}
- Difficulty: ${session.difficultyLevel}
- Average Score: ${avgScore.toFixed(1)}/10
- Number of questions answered: ${answers.length}

Questions & Performance:
${answers.map((a, i) => `Q${i + 1}: ${a.question}\nScore: ${a.aiScore}/10`).join('\n\n')}

Provide constructive feedback highlighting overall strengths, areas for improvement, and specific recommendations for preparation. Keep it encouraging but honest.`,

  // 8. Career Transition Analysis (Tier: Professional)
  CAREER_TRANSITION: (currentRole, targetRole, yearsOfExperience, motivationIssue = false) => `
You are a senior career transition specialist. Analyze the transition from ${currentRole} to ${targetRole} for a PROFESSIONAL with ${yearsOfExperience} years of experience.
${motivationIssue ? "The user is also experiencing motivation issues in their current role." : ""}

Respond ONLY with valid JSON in EXACTLY this format:
{
  "feasibilityScore": <number 0-10>,
  "transferableSkills": ["skill1", "skill2"],
  "skillGaps": ["gap1", "gap2"],
  "transitionStrategy": "<short strategic paragraph>",
  "estimatedTimebox": "<e.g., 6 months>",
  "learningRoadmap": [
    {
      "stepNumber": 1,
      "title": "<step title>",
      "description": "<short details>",
      "estimatedDuration": "<duration>",
      "resources": ["resource"]
    }
  ],
  "alternativeOptions": ["option1", "option2"],
  "motivationAdvice": "${motivationIssue ? "<short advice for motivation>" : "N/A"}"
}

Be realistic and highly practical.`,

  // 9. Interview Hint
  INTERVIEW_HINT: (question, category) => `
You are an interview coach. Provide a subtle, helpful hint for the following interview question without giving away the full answer.

Question: ${question}
Category: ${category}

Respond ONLY with valid JSON in EXACTLY this format:
{
  "hint": "<short helpful hint>",
  "keyConcepts": ["concept1", "concept2"],
  "avoidPitfalls": ["pitfall1", "pitfall2"]
}

Keep the hint concise and encouraging.`,

  // 10. Job & Company Recommendations (Gamification Integration)
  JOB_RECOMMENDATIONS: (userProfile, rank, topPercentile) => `
You are a talent scout. Based on a user's top performance (Rank: ${rank}, Top ${topPercentile}%) and their profile, recommend premium companies and roles they are now ready to apply for.

User Profile:
- Skills: ${userProfile.currentSkills?.join(', ')}
- Goal: ${userProfile.desiredCareer}
- Current Level: ${userProfile.level}

Respond ONLY with valid JSON in EXACTLY this format:
{
  "recommendedRoles": [
    {
      "role": "<role title>",
      "description": "<why this role is a good fit>",
      "targetCompanies": ["Company A", "Company B"],
      "estimatedSalary": "<estimated salary range>"
    }
  ],
  "marketValueAnalysis": "<paragraph describing user's market value based on their high ranking>"
}

Focus on high-growth companies and roles that match a top-tier performer's profile.`,
};

module.exports = PROMPT_TEMPLATES;
