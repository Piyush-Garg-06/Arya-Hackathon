import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  User,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authService } from "@/services/authService";
import { aiService } from "@/services/aiService";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatBot({ isFloating = false, onClose, onMinimize }: { isFloating?: boolean; onClose?: () => void; onMinimize?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Career Coach. I'm here to help you with career advice, interview preparation, and professional development. What would you like to discuss today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call real backend AI service
      const response = await aiService.generateChatResponse(input.trim());

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I apologize, but I'm having trouble processing your request right now. Please make sure the backend server is running and try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple response generator (replace with actual AI backend integration)
  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();

    if (
      lowerInput.includes("career") ||
      lowerInput.includes("job") ||
      lowerInput.includes("work")
    ) {
      return "I'd be happy to help you with your career! Based on your profile, I can provide personalized career recommendations, help you explore different career paths, or discuss strategies for career advancement. What specific aspect would you like to focus on?";
    }

    if (
      lowerInput.includes("interview") ||
      lowerInput.includes("question") ||
      lowerInput.includes("prepare")
    ) {
      return "Great! Interview preparation is key to success. I can help you with:\n• Common interview questions and answers\n• Behavioral interview techniques\n• Technical interview preparation\n• Mock interview sessions\n\nWhich type of interview are you preparing for?";
    }

    if (lowerInput.includes("skill") || lowerInput.includes("learn")) {
      return "Developing the right skills is crucial for career growth! I can help you identify:\n• Skills needed for your target career\n• Learning resources and courses\n• Practical projects to build your portfolio\n\nWhat skills are you interested in developing?";
    }

    if (lowerInput.includes("resume") || lowerInput.includes("cv")) {
      return "Your resume is your first impression! I can help you with:\n• Resume structure and formatting\n• Highlighting achievements and impact\n• Tailoring your resume for specific roles\n• ATS optimization tips\n\nWhat aspect of your resume would you like to improve?";
    }

    if (lowerInput.includes("salary") || lowerInput.includes("negotiat")) {
      return "Salary negotiation is an important skill! Here are some tips:\n• Research market rates for your role and location\n• Know your value and quantify your achievements\n• Practice your negotiation conversation\n• Consider the entire compensation package\n\nWould you like more specific advice on any of these points?";
    }

    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! 👋 It's great to see you! How can I assist you with your career journey today? Feel free to ask me about career advice, interview prep, skill development, or anything else related to your professional growth!";
    }

    if (lowerInput.includes("thank")) {
      return "You're welcome! 😊 I'm always here to help you succeed. Is there anything else you'd like to discuss about your career journey?";
    }

    // Default response
    return "That's a great question! As your AI Career Coach, I'm here to support you with various aspects of your professional journey including:\n\n• Career exploration and planning\n• Interview preparation and practice\n• Skill development recommendations\n• Resume and LinkedIn optimization\n• Networking strategies\n• Workplace challenges\n\nWhat would you like to focus on today?";
  };

  const getUsername = () => {
    const user = authService.getCurrentUser();
    return user ? user.name : "User";
  };

  return (
    <div className={cn(
      "bg-gradient-to-br from-background via-background to-primary/5 flex flex-col",
      isFloating ? "h-full" : "min-h-screen"
    )}>
      {/* Header - Hide if floating */}
      {!isFloating && (
        <header className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-btn flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-foreground">
                  AI Career Coach
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  Your intelligent career companion
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {getUsername()}
                </span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Chat Area */}
      <div className={cn(
        "flex-1 min-h-0 mx-auto w-full flex flex-col",
        isFloating ? "px-0 py-0" : "max-w-5xl px-4 py-6"
      )}>
        <Card className={cn(
          "flex-1 min-h-0 flex flex-col overflow-hidden shadow-xl",
          isFloating ? "border-none rounded-none" : "border-border/60"
        )}>
          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0 p-4" ref={scrollRef}>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user"
                          ? "bg-primary/20 text-primary"
                          : "gradient-btn text-white"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-card-foreground border border-border/60"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line leading-relaxed">
                        {message.content}
                      </p>
                      <p
                        className={`text-xs mt-2 ${
                          message.role === "user"
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center flex-shrink-0 text-white">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div className="bg-card border border-border/60 rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="shrink-0 border-t border-border p-4 bg-card/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your career..."
                disabled={isLoading}
                className="flex-1 bg-background/50 border-border/60 focus:border-primary/50"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="gradient-btn text-white px-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send • AI-powered career guidance
            </p>
          </div>
        </Card>
        
        {/* Quick Suggestions - Hide if floating to save space */}
        {!isFloating && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              "Career advice",
              "Interview tips",
              "Resume help",
              "Skill development",
              "Salary negotiation",
              "Networking strategies",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() => setInput(suggestion)}
                disabled={isLoading}
                className="justify-start text-sm border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5"
              >
                <MessageCircle className="w-4 h-4 mr-2 text-primary" />
                {suggestion}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
