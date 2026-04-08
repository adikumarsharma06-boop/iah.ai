import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Send, Sparkles, Bug, Lightbulb, AlertCircle } from "lucide-react";
import { supabaseClient } from "../lib/supabase";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "bug" | "suggestion";
}

export const FeedbackModal = ({ isOpen, onClose, initialType = "suggestion" }: FeedbackModalProps) => {
  const [type, setType] = useState<"bug" | "suggestion">(initialType);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update type when initialType changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
    }
  }, [isOpen, initialType]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: supabaseError } = await supabaseClient
        .from("feedback")
        .insert([
          {
            type,
            email: email || null,
            user_name: userName || null,
            message,
            is_public: isPublic,
            user_agent: window.navigator.userAgent,
            created_at: new Date().toISOString(),
          },
        ]);

      if (supabaseError) throw supabaseError;

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        setEmail("");
        setUserName("");
        setIsPublic(false);
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      setError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/10 overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-green/10 rounded-full blur-[80px] pointer-events-none" />
            
            <button 
              onClick={onClose}
              className="absolute top-8 right-8 w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Close feedback modal"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-display font-bold mb-2 tracking-tight">Share your <span className="text-gradient">Thoughts</span></h2>
                    <p className="text-white/40 text-sm font-light">Help us improve the IAH.AI ecosystem.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setType("suggestion")}
                        className={`flex-1 py-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest ${
                          type === "suggestion" 
                            ? "bg-brand-green/10 border-brand-green text-brand-green" 
                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        <Lightbulb className="w-4 h-4" /> Suggestion
                      </button>
                      <button
                        type="button"
                        onClick={() => setType("bug")}
                        className={`flex-1 py-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest ${
                          type === "bug" 
                            ? "bg-brand-orange/10 border-brand-orange text-brand-orange" 
                            : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                        }`}
                      >
                        <Bug className="w-4 h-4" /> Bug Report
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Name (Optional)</label>
                        <input 
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-blue transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Email (Optional)</label>
                        <input 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-blue transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Message</label>
                      <textarea 
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={type === "bug" ? "Describe the issue..." : "What's your idea?"}
                        rows={4}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-4 focus:outline-none focus:border-brand-blue transition-all text-sm resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3 ml-1">
                      <button
                        type="button"
                        onClick={() => setIsPublic(!isPublic)}
                        className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                          isPublic ? "bg-brand-green border-brand-green" : "border-white/20 hover:border-white/40"
                        }`}
                      >
                        {isPublic && <div className="w-2 h-2 bg-black rounded-full" />}
                      </button>
                      <span className="text-xs text-white/40 font-medium">Make this feedback public (Testimonial)</span>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 text-brand-orange text-xs font-medium bg-brand-orange/10 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting || !message}
                      className="w-full py-4 bg-brand-green text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Sending..." : (
                        <>
                          Submit Feedback <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-brand-green" />
                  </div>
                  <h3 className="text-3xl font-display font-bold mb-3 tracking-tight">Feedback Received</h3>
                  <p className="text-white/40 text-sm font-light">Thank you for helping us grow!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
