const axios = require('axios');
const PROMPT_TEMPLATES = require('../utils/promptTemplates');

class OllamaService {
  constructor() {
    this.baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
    this.model = process.env.OLLAMA_MODEL || 'llama3.1:latest';
    this.useMock = process.env.USE_MOCK_AI === 'true';

    console.log(`🦙 OllamaService: Using model ${this.model} at ${this.baseUrl}`);
    
    if (this.useMock) {
      console.log('🤖 OllamaService: Running in MOCK MODE (Force enabled via env)');
    }
  }

  /**
   * Generate AI response from a prompt using Ollama
   */
  async generateAIResponse(prompt, options = {}) {
    if (this.useMock) {
      return this.getMockResponse(prompt);
    }

    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    console.log(`📡 [${requestId}] AI Request started (${this.model})...`);

    try {
      // Add speed optimization hint to non-JSON prompts
      const optimizedPrompt = options.json ? prompt : `${prompt}\n\nBe highly concise.`;

      const payload = {
        model: this.model,
        prompt: optimizedPrompt,
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          top_k: options.topK || 40,
          top_p: options.topP || 0.95,
          num_predict: options.maxOutputTokens || 512, // Reduced for faster demo response
        }
      };

      if (options.json) {
        payload.format = 'json';
      }

      const response = await axios.post(`${this.baseUrl}/api/generate`, payload);

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ [${requestId}] AI Response received in ${duration}s`);

      if (response.data && response.data.response) {
        return response.data.response;
      } else {
        throw new Error('Invalid response from Ollama API');
      }
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.error(`❌ [${requestId}] AI Error after ${duration}s:`, error.message);
      
      if (this.useMock) {
        console.warn('⚠️ Ollama error. Falling back to MOCK MODE.');
        return this.getMockResponse(prompt);
      }
      
      throw new Error(`AI service (Ollama) failed: ${error.message}`);
    }
  }

  /**
   * Generate AI response and parse as JSON
   */
  async generateJSONResponse(prompt) {
    if (this.useMock) {
      return this.getMockJSONResponse(prompt);
    }

    try {
      // Add explicit instruction to the prompt for Ollama
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY a valid JSON object. No preamble, no explanation, no markdown formatting.`;
      
      const requestId = Math.random().toString(36).substring(7);
      const response = await this.generateAIResponse(jsonPrompt, {
        temperature: 0.1,
        json: true
      });

      let cleanedResponse = response.trim();
      
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\s*/g, '').replace(/```\s*/g, '');
      }

      const firstBrace = cleanedResponse.indexOf('{');
      const lastBrace = cleanedResponse.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);
      }

      try {
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error(`❌ [${requestId}] JSON Parse Error at pos ${parseError.at || 'unknown'}:`, parseError.message);
        console.log('⚠️ Falling back to MOCK JSON because of parse failure.');
        return this.getMockJSONResponse(prompt);
      }
    } catch (error) {
      console.error('❌ Ollama JSON Generation Error:', error.message);
      console.log('⚠️ Falling back to MOCK JSON because of API/network failure.');
      return this.getMockJSONResponse(prompt);
    }
  }

  /**
   * Mock data generation for text responses (Copied from GeminiService)
   */
  getMockResponse(prompt) {
    if (prompt.includes('career advice')) {
      return "🤖 [Ollama Powered Mock] Based on your profile, I recommend focusing on building a strong portfolio and networking within your target industry. Start by contributing to open-source projects or taking on freelance work to demonstrate your skills. Your background shows great potential for growth!";
    }
    if (prompt.includes('feedback')) {
      return "🤖 [Ollama Powered Mock] You performed well overall. Your communication was clear and you demonstrated a solid understanding of the core concepts. To improve, try to provide more specific examples using the STAR method (Situation, Task, Action, Result) in your answers.";
    }
    return "🤖 [Ollama Powered Mock] This is a simulated AI response. The service is currently in mock mode or Ollama had an error.";
  }

  /**
   * Mock data generation for JSON responses (Copied from GeminiService)
   */
  getMockJSONResponse(prompt) {
    const p = prompt.toLowerCase();
    
    // Priority 1: Quiz / Discovery (Must be specific to avoid matching 'answers' in evaluation)
    if (p.includes('quiz answers') || p.includes('interest nahi pata') || p.includes('unsure')) {
      return {
        interestProfile: {
          analytical: 85,
          creative: 70,
          technical: 90,
          social: 40
        },
        aiAnalysis: "🚀 [Ollama Powered Mock] You show a strong interest in technology and analytical problem-solving. Your profile suits engineering or data-focused roles.",
        recommendedCareers: [
          { 
            careerName: "Full Stack Developer (Ollama Powered)", 
            matchPercentage: 95, 
            description: "[Ollama Powered] Building end-to-end web applications using modern stacks like MERN or Next.js.",
            requiredSkills: ["JavaScript", "React", "Node.js", "MongoDB"],
            learningRoadmap: [
              { stepNumber: 1, title: "Frontend Mastery", description: "HTML, CSS, and Advanced JavaScript ES6+.", estimatedDuration: "3 weeks", resources: ["MDN", "FreeCodeCamp"] },
              { stepNumber: 1, title: "Backend & APIs", description: "Node.js, Express, and RESTful API design.", estimatedDuration: "4 weeks", resources: ["Node.js Docs", "Postman"] }
            ]
          },
          { 
            careerName: "AI/ML Engineer (Ollama Powered)", 
            matchPercentage: 88, 
            description: "[Ollama Powered] Designing and implementing machine learning models and AI-driven solutions.",
            requiredSkills: ["Python", "TensorFlow", "Data Science", "Math"],
            learningRoadmap: [
              { stepNumber: 1, title: "Python for Data Science", description: "Master NumPy, Pandas, and Matplotlib.", estimatedDuration: "2 weeks", resources: ["Kaggle", "Python.org"] },
              { stepNumber: 2, title: "Machine Learning Basics", description: "Supervised and Unsupervised learning concepts.", estimatedDuration: "5 weeks", resources: ["Andrew Ng Course", "Fast.ai"] }
            ]
          },
          { 
            careerName: "Product Designer (UI/UX) (Ollama Powered)", 
            matchPercentage: 82, 
            description: "[Ollama Powered] Creating beautiful and intuitive user experiences for digital products.",
            requiredSkills: ["Figma", "User Research", "Prototyping", "Design Systems"],
            learningRoadmap: [
              { stepNumber: 1, title: "Design Principles", description: "Typography, color theory, and layout.", estimatedDuration: "2 weeks", resources: ["Dribbble", "Behance"] },
              { stepNumber: 2, title: "Prototyping with Figma", description: "creating interactive mockups and user flows.", estimatedDuration: "3 weeks", resources: ["Figma Academy", "YouTube"] }
            ]
          }
        ]
      };
    }

    // Priority 2: Skill Gap Analysis
    if (p.includes('skill gap')) {
      return {
        missingSkills: [
          { skill: "Advanced React Patterns [Ollama Powered]", priority: "high" },
          { skill: "System Design [Ollama Powered]", priority: "medium" }
        ],
        availableRoles: ["Senior Frontend Engineer (Ollama Powered)", "Product Engineer (Ollama Powered)"],
        learningRoadmap: [
          {
            stepNumber: 1,
            title: "Study Design Patterns (Ollama Powered)",
            description: "[Ollama Powered] Master singleton, factory, and composite patterns in JS.",
            estimatedDuration: "1 week",
            resources: ["Refactoring.guru"]
          }
        ],
        estimatedTimeline: "3 months [Ollama Powered]"
      };
    }

    // Priority 3: Career Transition
    if (p.includes('transition')) {
      return {
        feasibilityScore: 7,
        transferableSkills: ["Problem Solving", "Communication"],
        skillGaps: ["Domain Specific Knowledge"],
        transitionStrategy: "Leverage your current experience while building a side project in the new field.",
        estimatedTimebox: "4 months",
        learningRoadmap: [
          {
            stepNumber: 1,
            title: "Market Research",
            description: "Identify key companies and skills in the target industry.",
            estimatedDuration: "2 weeks",
            resources: ["LinkedIn", "Indeed"]
          }
        ],
        alternativeOptions: ["Stay in current role", "Internal transfer"],
        motivationAdvice: "Focus on small wins to stay motivated."
      };
    }

    // Priority 4: Interview Questions
    if (p.includes('interview questions')) {
      const roleMatch = prompt.match(/for a (.*) position/);
      const role = roleMatch ? roleMatch[1] : 'Software Engineer';
      return {
        questions: [
          {
            questionId: "q1",
            questionText: `Tell me about yourself and your interest in the ${role} role?`,
            category: "behavioral",
            expectedKeyPoints: ["Background", "Motivation", "Role alignment"]
          }
        ]
      };
    }

    // Priority 5: Evaluation (Only if not discovery)
    if (p.includes('evaluate') || p.includes('answer evaluation')) {
      return {
        aiScore: 8,
        strengths: ["Clear communication"],
        weaknesses: ["Technical depth"],
        improvedAnswer: "Add metrics.",
        communicationScore: 8,
        technicalAccuracy: 7,
        feedback: "Good start."
      };
    }

    // Default Fallback (Discovery-safe)
    return {
      interestProfile: { technical: 5, creativity: 5, problemSolving: 5, communication: 5, leadership: 5, analyticalThinking: 5 },
      aiAnalysis: "Fallback data provided due to no keyword match.",
      recommendedCareers: [
        { 
          careerName: "Software Developer", 
          matchPercentage: 70, 
          description: "Universal recommendation.",
          requiredSkills: ["Programming"],
          learningRoadmap: [{ stepNumber: 1, title: "Basics", description: "Learn variables.", estimatedDuration: "1 day", resources: [] }]
        }
      ]
    };
  }

  // Interface methods to match requirements
  async analyzeQuizAnswers(answers) {
    const prompt = PROMPT_TEMPLATES.INTEREST_ANALYSIS(answers);
    return await this.generateJSONResponse(prompt);
  }

  async analyzeSkillGap(desiredCareer, currentSkills) {
    const prompt = PROMPT_TEMPLATES.SKILL_GAP(desiredCareer, currentSkills);
    return await this.generateJSONResponse(prompt);
  }

  async generateInterviewQuestions(careerRole, difficultyLevel) {
    const prompt = PROMPT_TEMPLATES.INTERVIEW_QUESTION(careerRole, difficultyLevel);
    return await this.generateJSONResponse(prompt);
  }

  async evaluateAnswer(question, userAnswer) {
    const prompt = PROMPT_TEMPLATES.ANSWER_EVALUATION(question, userAnswer);
    return await this.generateJSONResponse(prompt);
  }

  async generateCareerAdvice(userProfile) {
    const prompt = PROMPT_TEMPLATES.CAREER_RECOMMENDATION(userProfile);
    return await this.generateAIResponse(prompt);
  }
}

module.exports = new OllamaService();
