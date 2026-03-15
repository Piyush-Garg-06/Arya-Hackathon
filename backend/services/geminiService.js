const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.useMock = process.env.USE_MOCK_AI === 'true';
    
    if (this.apiKey && !this.useMock) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      } catch (error) {
        console.error('Failed to initialize Gemini AI:', error.message);
        this.useMock = true;
      }
    } else {
      this.useMock = true;
    }

    if (this.useMock) {
      console.log('🤖 GeminiService: Running in MOCK MODE (API key missing or limit reached)');
    }
  }

  /**
   * Generate AI response from a prompt
   */
  async generateAIResponse(prompt, options = {}) {
    if (this.useMock) {
      return this.getMockResponse(prompt);
    }

    try {
      const generationConfig = {
        temperature: options.temperature || 0.7,
        topK: options.topK || 40,
        topP: options.topP || 0.95,
        maxOutputTokens: options.maxOutputTokens || 2048,
        ...options,
      };

      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
      });

      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error.message);
      
      // Fallback to mock on rate limit or other service errors
      if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('limit')) {
        console.warn('⚠️ Gemini Rate Limit reached. Falling back to MOCK MODE.');
        this.useMock = true;
        return this.getMockResponse(prompt);
      }

      if (error.message.includes('API key')) {
        throw new Error('Invalid Gemini API key');
      }
      
      throw new Error(`AI service failed: ${error.message}`);
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
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Respond ONLY with valid JSON. Do not include any explanation or markdown formatting.`;
      
      const response = await this.generateAIResponse(jsonPrompt, {
        temperature: 0.3,
        maxOutputTokens: 2048,
      });

      let cleanedResponse = response.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/```\s*/g, '').replace(/```\s*/g, '');
      }

      try {
        return JSON.parse(cleanedResponse);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError.message);
        console.error('Raw response:', cleanedResponse);
        // Fallback to mock on parse error
        return this.getMockJSONResponse(prompt);
      }
    } catch (error) {
      console.error('Gemini JSON Generation Error:', error.message);
      if (this.useMock) return this.getMockJSONResponse(prompt);
      throw error;
    }
  }

  /**
   * Mock data generation for text responses
   */
  getMockResponse(prompt) {
    if (prompt.includes('career advice')) {
      return "Based on your profile, I recommend focusing on building a strong portfolio and networking within your target industry. Start by contributing to open-source projects or taking on freelance work to demonstrate your skills. Your background shows great potential for growth!";
    }
    if (prompt.includes('feedback')) {
      return "You performed well overall. Your communication was clear and you demonstrated a solid understanding of the core concepts. To improve, try to provide more specific examples using the STAR method (Situation, Task, Action, Result) in your answers.";
    }
    return "This is a simulated AI response. The service is currently in mock mode due to API limits, but the platform functionality remains fully operational for your testing.";
  }

  /**
   * Mock data generation for JSON responses
   */
  getMockJSONResponse(prompt) {
    // Determine which mock JSON to return based on prompt content
    if (prompt.includes('interview questions')) {
      const roleMatch = prompt.match(/for a (.*) position/);
      const role = roleMatch ? roleMatch[1] : 'Software Engineer';
      return {
        questions: [
          {
            questionId: "q1",
            questionText: `Tell me about yourself and your interest in the ${role} role?`,
            category: "behavioral",
            expectedKeyPoints: ["Background", "Motivation", "Role alignment"]
          },
          {
            questionId: "q2",
            questionText: "What is your biggest technical challenge so far?",
            category: "technical",
            expectedKeyPoints: ["Challenge description", "Action taken", "Result"]
          },
          {
            questionId: "q3",
            questionText: "How do you handle working in a high-pressure environment?",
            category: "behavioral",
            expectedKeyPoints: ["Prioritization", "Stress management", "Communication"]
          },
          {
            questionId: "q4",
            questionText: "Explain a concept you learned recently that excited you?",
            category: "technical",
            expectedKeyPoints: ["Clarity", "Enthusiasm", "Technical depth"]
          },
          {
            questionId: "q5",
            questionText: "Where do you see yourself in five years?",
            category: "behavioral",
            expectedKeyPoints: ["Ambition", "Stability", "Growth"]
          }
        ]
      };
    }

    if (prompt.includes('Evaluate the following')) {
      return {
        aiScore: 8,
        strengths: ["Clear communication", "Structured thinking"],
        weaknesses: ["Could be more specific", "Lacked quantitative results"],
        improvedAnswer: "I would recommend structuring your answer with more specific examples. For instance, mention how your actions led to a 20% increase in efficiency.",
        communicationScore: 9,
        technicalAccuracy: 7,
        feedback: "Great job! You have a very professional tone. Just work on adding more details to your technical explanations."
      };
    }

    if (prompt.includes('quiz answers')) {
      return {
        interestProfile: {
          problemSolving: 8,
          creativity: 7,
          analyticalThinking: 9,
          communication: 6,
          leadership: 5,
          technical: 8
        },
        aiAnalysis: "Your results indicate a strong affinity for analytical tasks and technical problem-solving. You enjoy diving deep into complex challenges and finding structured solutions.",
        recommendedCareers: [
          {
            careerName: "Software Engineer",
            matchPercentage: 92,
            description: "Building systems and solving complex problems with code.",
            requiredSkills: ["Problem Solving", "Logic", "Technical Aptitude"]
          },
          {
            careerName: "Data Analyst",
            matchPercentage: 85,
            description: "Interpreting data to help businesses make better decisions.",
            requiredSkills: ["Analysis", "Reporting", "Attention to Detail"]
          }
        ]
      };
    }

    if (prompt.includes('skill gap analysis')) {
      return {
        missingSkills: [
          { skill: "System Design", priority: "high", estimatedLearningTime: "1 month" },
          { skill: "Advanced Algorithms", priority: "medium", estimatedLearningTime: "3 weeks" }
        ],
        learningRoadmap: [
          {
            stepNumber: 1,
            title: "Master Data Structures",
            description: "Deep dive into trees, graphs, and hash maps.",
            resources: ["Coursera", "LeetCode"],
            estimatedDuration: "2 weeks"
          }
        ],
        estimatedTimeline: "3 months"
      };
    }

    // Default mock JSON
    return { success: true, message: "Mock data provided" };
  }

  /**
   * Analyze quiz answers and generate career recommendations
   */
  async analyzeQuizAnswers(answers) {
    const prompt = `Analyze the following quiz answers: ${JSON.stringify(answers)}`;
    return await this.generateJSONResponse(prompt);
  }

  /**
   * Analyze skill gaps and create learning roadmap
   */
  async analyzeSkillGap(desiredCareer, currentSkills) {
    const prompt = `Perform a skill gap analysis for ${desiredCareer}. Current: ${currentSkills.join(', ')}`;
    return await this.generateJSONResponse(prompt);
  }

  /**
   * Generate interview questions
   */
  async generateInterviewQuestions(careerRole, difficultyLevel) {
    const prompt = `Generate interview questions for a ${careerRole} position at ${difficultyLevel} level.`;
    return await this.generateJSONResponse(prompt);
  }

  /**
   * Evaluate interview answer
   */
  async evaluateAnswer(question, userAnswer) {
    const prompt = `Evaluate the following interview answer: Question: ${question} Answer: ${userAnswer}`;
    return await this.generateJSONResponse(prompt);
  }

  /**
   * Generate personalized career advice
   */
  async generateCareerAdvice(userProfile) {
    const prompt = `Based on the following user profile, provide personalized career advice: ${JSON.stringify(userProfile)}`;
    return await this.generateAIResponse(prompt);
  }
}

module.exports = new GeminiService();
