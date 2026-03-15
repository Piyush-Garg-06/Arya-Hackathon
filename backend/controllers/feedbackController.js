/**
 * Feedback Controller
 * Handles AI chatbot conversations, career advice, and general feedback.
 */

const ollamaService = require('../services/ollamaService');
const PROMPT_TEMPLATES = require('../utils/promptTemplates');
const User = require('../models/User');

/**
 * AI Chat endpoint
 * POST /api/ai/chat
 */
exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be a string',
      });
    }

    // Get user profile for context
    let userProfile = {};
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (user) {
        userProfile = {
          name: user.name,
          currentSkills: user.currentSkills,
          desiredCareer: user.desiredCareer,
          level: user.level,
        };
      }
    }

    const prompt = PROMPT_TEMPLATES.CAREER_ADVICE(message, userProfile);
    const response = await ollamaService.generateAIResponse(prompt);

    res.status(200).json({
      success: true,
      response,
      provider: 'ollama',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI Chat Error:', error.message);

    // Fallback response when AI is unavailable
    res.status(200).json({
      success: true,
      response: generateFallbackResponse(req.body?.message || 'Hello'),
      provider: 'fallback',
      timestamp: new Date().toISOString(),
      note: 'AI service temporarily unavailable, here\'s some helpful advice instead.',
    });
  }
};

/**
 * Get personalized career advice
 * POST /api/ai/career-advice
 */
exports.getCareerAdvice = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const advice = await ollamaService.generateCareerAdvice({
      name: user.name,
      currentSkills: user.currentSkills,
      desiredCareer: user.desiredCareer,
      level: user.level,
    });

    res.status(200).json({
      success: true,
      data: {
        advice,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fallback response generator for when AI is unavailable
 */
function generateFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
    return "🤖 [Ollama Powered Fallback] Great question about careers! Here's my advice:\n\n1. **Identify your strengths**: List skills you enjoy using\n2. **Research market demand**: Look at job postings in your area\n3. **Build projects**: Create a portfolio showcasing your abilities\n4. **Network**: Connect with professionals in your target field\n5. **Keep learning**: Take online courses to fill skill gaps\n\nRemember, career growth is a marathon, not a sprint. Start small and stay consistent!";
  }

  if (lowerMessage.includes('interview')) {
    return "🤖 [Ollama Powered Fallback] Interview preparation tips:\n\n1. **Research the company**: Understand their mission and products\n2. **Practice common questions**: Prepare STAR method stories\n3. **Prepare questions**: Ask about team culture and challenges\n4. **Dress professionally**: First impressions matter\n5. **Follow up**: Send a thank-you email within 24 hours\n\nYou've got this! Confidence comes from preparation.";
  }

  if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
    return "🤖 [Ollama Powered Fallback] Skill development strategy:\n\n1. **Start with fundamentals**: Master basics before advanced topics\n2. **Practice daily**: Even 30 minutes helps\n3. **Build projects**: Apply what you learn immediately\n4. **Get feedback**: Join communities or find a mentor\n5. **Teach others**: Explaining reinforces your understanding\n\nConsistent practice beats talent every time!";
  }

  return "🤖 [Ollama Powered Fallback] Thanks for reaching out! I'm here to help with:\n\n• Career guidance and planning\n• Interview preparation\n• Skill assessment and development\n• Job search strategies\n• Industry insights\n\nFeel free to ask me anything specific about your career journey. What would you like to focus on today?";
}
