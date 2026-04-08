import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, Loader2, User, Bot, ChevronDown } from "lucide-react";

const SYSTEM_INSTRUCTION = `You are the IAH.AI Elite Guide, a highly sophisticated AI mentor. 
Your goal is to provide intelligent, strategic, and empowering guidance to individuals seeking growth, career pivots, or mentorship. 
You are professional, visionary, and deeply insightful. 
You bridge the gap between human potential and reality. 
Your tone is encouraging, elite, and futuristic. 
Keep your responses concise yet profound. 
Always aim to provide actionable wisdom.`;

interface Message {
  role: 'user' | 'bot';
  text: string;
  timestamp: string | Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load messages from local storage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('iah_ai_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(parsed);
      } catch (e) {
        console.error("Failed to parse chat history", e);
        initializeWelcomeMessage();
      }
    } else {
      initializeWelcomeMessage();
    }
  }, []);

  const initializeWelcomeMessage = () => {
    setMessages([
      {
        role: 'bot',
        text: "Welcome to the Elite Circle. I am your IAH.AI Guide. How can I help you bridge the gap between your potential and reality today?",
        timestamp: new Date()
      }
    ]);
  };

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('iah_ai_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
        }
      });

      const botMessage: Message = {
        role: 'bot',
        text: response.text || "I apologize, but I am unable to process that request at the moment. Let's try another approach to your growth.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "The intelligence link is temporarily unstable. Please try again in a moment.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-10 right-6 md:bottom-32 md:right-10 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: "blur(10px)" }}
            className="mb-6 w-[380px] h-[600px] glass-dark rounded-[32px] border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-orange/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                <h3 className="font-display font-bold text-base tracking-tight">IAH.AI Guide</h3>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Active Intelligence</span>
                </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user' ? 'bg-brand-orange/10' : 'bg-brand-orange/20'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4 text-brand-orange" /> : <Bot className="w-4 h-4 text-brand-orange" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-brand-orange/5 text-text border border-brand-orange/20' 
                        : 'bg-white/[0.03] text-text/80 border border-white/5'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-brand-orange" />
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                      <Loader2 className="w-4 h-4 text-brand-orange animate-spin" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for elite guidance..."
                  aria-label="Chat input"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 pr-14 focus:outline-none focus:border-brand-orange transition-all duration-300 text-sm placeholder:text-text/50 text-text"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-orange text-bg rounded-xl flex items-center justify-center hover:bg-white transition-all duration-300 disabled:opacity-50 disabled:hover:bg-brand-orange focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-4 text-[9px] text-center font-black uppercase tracking-[0.2em] text-text/20">
                Powered by IAH.AI Core Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat guide" : "Open chat guide"}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className={`w-16 h-16 rounded-2xl shadow-[0_20px_50px_rgba(255,107,0,0.3)] flex items-center justify-center transition-all duration-500 focus-visible:outline-2 focus-visible:outline-brand-orange focus-visible:outline-offset-4 ${
          isOpen ? 'bg-text text-bg' : 'bg-brand-orange text-bg'
        }`}
      >
        {isOpen ? <ChevronDown className="w-8 h-8" /> : <MessageSquare className="w-8 h-8" />}
      </motion.button>
    </div>
  );
};
