import React from 'react';
import { motion } from "motion/react";
import { MessageSquarePlus, Sparkles } from "lucide-react";

interface FeedbackBotProps {
  onOpenFeedback: (type: "bug" | "suggestion") => void;
}

export const FeedbackBot: React.FC<FeedbackBotProps> = ({ onOpenFeedback }) => {
  return (
    <div className="fixed bottom-10 left-6 md:bottom-10 md:left-10 z-[100]">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, x: -20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="relative group"
      >
        {/* Tooltip */}
        <div className="absolute bottom-full left-0 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-2 group-hover:translate-y-0">
          <div className="glass-dark px-4 py-2 rounded-xl border border-white/10 whitespace-nowrap">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-green">Share your feedback</p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onOpenFeedback("suggestion")}
          className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-brand-green/10 hover:border-brand-green/30 transition-all duration-500 group shadow-2xl"
        >
          <div className="relative">
            <MessageSquarePlus className="w-6 h-6 text-white/60 group-hover:text-brand-green transition-colors" />
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-3 h-3 text-brand-green" />
            </motion.div>
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
};
