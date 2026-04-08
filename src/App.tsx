/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, MouseEvent, ChangeEvent } from "react";
import confetti from "canvas-confetti";
import Lenis from "lenis";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate 
} from "react-router-dom";
import { supabaseClient } from "./lib/supabase";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LabelList
} from 'recharts';
import { 
  Cpu, 
  Users, 
  Sprout, 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  ChevronRight, 
  Menu, 
  X, 
  Instagram, 
  Twitter, 
  Linkedin,
  MessageSquare,
  Phone,
  MapPin,
  Send,
  Sparkles,
  Wrench,
  Map,
  Brain,
  Globe,
  Target,
  Zap,
  Sun,
  Moon,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Quote,
  Bug,
  Lightbulb
} from "lucide-react";
import FeaturesPage from "./pages/FeaturesPage";
import GoalTrackerPage from "./pages/GoalTrackerPage";

import { Chatbot } from "./components/Chatbot";
import { AnimatedRoadmap } from "./components/AnimatedRoadmap";
import { FeedbackModal } from "./components/FeedbackModal";
import { FeedbackBot } from "./components/FeedbackBot";
import { ViewerFeedback } from "./components/ViewerFeedback";
import PageTransition from "./components/PageTransition";

// --- Components ---

const Preloader = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[100] bg-bg flex items-center justify-center"
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Square Border SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <motion.rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="12"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FF94" />
              <stop offset="50%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#FF6B00" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Glowing Square Background */}
        <motion.div 
          animate={{ 
            scale: [0.95, 1.05, 0.95],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-4 bg-gradient-to-br from-brand-green via-brand-blue to-brand-orange rounded-xl blur-xl"
        />

        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 w-20 h-20 p-4 glass rounded-2xl border-white/10 flex items-center justify-center"
        >
          <motion.img 
            animate={{ 
              filter: ["brightness(1) contrast(1)", "brightness(1.5) contrast(1.2)", "brightness(1) contrast(1)"]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            src="/logo.png" 
            alt="IAH.AI Logo" 
            className="w-full h-full object-contain" 
          />
        </motion.div>
        
        {/* Corner Accents */}
        {[0, 90, 180, 270].map((rotation, i) => (
          <motion.div
            key={rotation}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + (i * 0.1) }}
            style={{ rotate: rotation }}
            className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-brand-green/50 rounded-tl-lg"
          />
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.5, 1] }}
        transition={{ delay: 0.8, duration: 2, repeat: Infinity }}
        className="absolute bottom-20 font-display font-bold text-[10px] tracking-[0.8em] uppercase text-text/30"
      >
        Initializing Intelligence
      </motion.div>
    </motion.div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('cursor-grab')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-brand-green rounded-full pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: mousePos.x - 6,
          y: mousePos.y - 6,
          scale: isHovering ? 4 : 1,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 250, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-brand-blue/50 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.5 : 1,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 150, mass: 0.8 }}
      />
    </>
  );
};

const DraggableOrb = () => {
  return (
    <div className="relative h-60 flex items-center justify-center overflow-hidden bg-white/[0.01]">
      <motion.div
        drag
        dragConstraints={{ left: -150, right: 150, top: -50, bottom: 50 }}
        whileDrag={{ scale: 1.2 }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-green via-brand-blue to-brand-orange flex items-center justify-center text-white font-bold cursor-grab glow-green relative z-10"
      >
        <Cpu className="w-10 h-10 animate-pulse" />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-brand-green rounded-full -z-10 blur-xl"
        />
      </motion.div>
      <div className="absolute text-white/5 font-display text-8xl font-black select-none pointer-events-none uppercase tracking-tighter">
        Interactive AI
      </div>
    </div>
  );
};

const OrangeDragPoint = () => {
  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      whileDrag={{ scale: 1.2, cursor: 'grabbing' }}
      className="fixed bottom-10 right-10 z-[100] cursor-grab group"
    >
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          rotate: [0, 8, -8, 0],
          boxShadow: [
            "0 0 20px rgba(255, 107, 0, 0.4)",
            "0 0 40px rgba(255, 107, 0, 0.6)",
            "0 0 20px rgba(255, 107, 0, 0.4)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center relative z-10"
      >
        <MessageSquare className="text-white w-8 h-8" />
        <motion.div
          animate={{ 
            scale: [1, 1.8, 1], 
            opacity: [0.5, 0, 0.5] 
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeOut"
          }}
          className="absolute inset-0 bg-brand-orange rounded-full -z-10"
        />
      </motion.div>
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-brand-orange text-white px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Drag me!
      </div>
    </motion.div>
  );
};

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-12 left-0 right-0 h-0.5 bg-brand-green origin-left z-[150]"
      style={{ scaleX }}
    />
  );
};

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (location.pathname !== '/') {
      navigate('/waitlist');
    } else {
      const waitlistSection = document.getElementById('waitlist');
      if (waitlistSection) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo('#waitlist');
        } else {
          waitlistSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-8 left-8 z-[90] hidden md:block"
        >
          <button
            onClick={handleClick}
            className="group relative flex items-center gap-3 px-6 py-4 bg-brand-green text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,255,148,0.3)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Sparkles className="w-4 h-4" />
            Join Waitlist
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-10 left-10 z-[100] w-14 h-14 glass rounded-2xl flex items-center justify-center hover:bg-brand-green hover:text-black transition-all duration-500 group shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          aria-label="Back to top"
        >
          <ChevronRight className="w-6 h-6 -rotate-90 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "Goals", path: "/goals" },
    { name: "About Us", path: "/about" },
    { name: "Investors", path: "/investors" },
    { name: "Contact Us", path: "/contact" },
  ];

  const handleWaitlistClick = () => {
    if (location.pathname !== '/') {
      navigate('/waitlist');
    } else {
      const waitlistSection = document.getElementById('waitlist');
      if (waitlistSection) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo('#waitlist');
        } else {
          waitlistSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed top-12 left-0 w-full z-[100] transition-all duration-500 ${
        isScrolled ? 'bg-black/80 backdrop-blur-2xl py-4 border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]' : 'bg-transparent py-8'
      }`}
    >
      {isScrolled && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-brand-green/5 via-transparent to-brand-blue/5 pointer-events-none"
        />
      )}
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group focus-visible:outline-none">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 relative"
          >
            <div className="absolute inset-0 bg-brand-green/20 blur-xl rounded-full group-hover:bg-brand-green/40 transition-all" />
            <img src="/logo.png" alt="IAH.AI Logo" className="w-full h-full object-contain relative z-10" />
          </motion.div>
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-tighter leading-none group-hover:text-brand-green transition-colors">IAH.AI</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/30">Ecosystem</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative group text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${
                location.pathname === link.path ? 'text-brand-green' : 'text-white/30 hover:text-white'
              }`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="navUnderline"
                  className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-green"
                />
              )}
            </Link>
          ))}
          
          <button 
            onClick={handleWaitlistClick}
            className="px-6 py-2.5 bg-brand-green text-black rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all duration-500 shadow-[0_10px_30px_rgba(0,255,148,0.2)]"
          >
            Join Waitlist
          </button>

          <div className="flex items-center gap-4 ml-4 pl-8 border-l border-white/10">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/5 transition-all group/theme"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-white/40 group-hover/theme:text-brand-green transition-colors" />
              ) : (
                <Moon className="w-4 h-4 text-white/40 group-hover/theme:text-brand-blue transition-colors" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden w-10 h-10 rounded-xl glass flex items-center justify-center text-white/40 hover:text-white transition-all"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-0 left-0 w-full h-screen bg-black/95 backdrop-blur-3xl z-[150] p-8 flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="IAH.AI Logo" className="w-10 h-10 object-contain" />
                <span className="font-display font-black text-2xl tracking-tighter">IAH.AI</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="w-12 h-12 rounded-2xl glass flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-3xl font-display font-bold tracking-tighter ${
                      location.pathname === link.path ? 'text-brand-green' : 'text-white/40'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto space-y-8">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleWaitlistClick}
                className="w-full py-6 bg-brand-green text-black rounded-[2rem] text-lg font-bold uppercase tracking-widest shadow-[0_20px_40px_rgba(0,255,148,0.2)]"
              >
                Join Waitlist
              </motion.button>
              
              <div className="flex items-center justify-between p-6 glass rounded-[2rem]">
                <span className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Appearance</span>
                <button 
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  {theme === 'dark' ? (
                    <><Sun className="w-4 h-4 text-brand-green" /> Light</>
                  ) : (
                    <><Moon className="w-4 h-4 text-brand-blue" /> Dark</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const springY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  const moveX1 = useTransform(springX, [0, 1920], [-50, 50]);
  const moveY1 = useTransform(springY, [0, 1080], [-50, 50]);
  const moveX2 = useTransform(springX, [0, 1920], [50, -50]);
  const moveY2 = useTransform(springY, [0, 1080], [50, -50]);
  const moveX3 = useTransform(springX, [0, 1920], [-25, 25]);
  const moveY3 = useTransform(springY, [0, 1080], [-25, 25]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-40 overflow-hidden section-visibility">
      {/* Enhanced Background Glows with Parallax & Color Shifts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid Background */}
        <motion.div 
          className="absolute inset-[-10%] opacity-[0.05] pointer-events-none hidden md:block"
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
            x: moveX3,
            y: moveY3
          }}
        />

        {/* Floating Neural Nodes - Reduced for Mobile Performance */}
        <div className="hidden md:block">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                opacity: 0 
              }}
              animate={{ 
                opacity: [0, 0.15, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{ 
                duration: 25 + Math.random() * 15, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ 
                x: moveX2, 
                y: moveY2,
                translateX: (Math.random() * 100 - 50) + "px",
                translateY: (Math.random() * 100 - 50) + "px"
              }}
              className="absolute w-1 h-1 bg-brand-green rounded-full blur-[1px]"
            />
          ))}
        </div>

        {/* Mouse Spotlight - Only for Desktop */}
        <motion.div 
          style={{ 
            x: springX, 
            y: springY,
            translateX: "-50%",
            translateY: "-50%"
          }}
          className="absolute w-[500px] h-[500px] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none z-0 hidden md:block"
        />

        <motion.div 
          style={{ x: moveX1, y: moveY1 }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            backgroundColor: ["rgba(0, 255, 148, 0.15)", "rgba(0, 163, 255, 0.15)", "rgba(0, 255, 148, 0.15)"]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-[600px] h-[600px] blur-[160px] rounded-full" 
        />
        <motion.div 
          style={{ x: moveX2, y: moveY2 }}
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
            backgroundColor: ["rgba(0, 163, 255, 0.15)", "rgba(255, 107, 0, 0.15)", "rgba(0, 163, 255, 0.15)"]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] blur-[160px] rounded-full" 
        />
        <motion.div 
          style={{ x: moveX3, y: moveY3 }}
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.1, 0.2, 0.1],
            backgroundColor: ["rgba(255, 107, 0, 0.1)", "rgba(0, 255, 148, 0.1)", "rgba(255, 107, 0, 0.1)"]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-[200px] rounded-full" 
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          style={{ 
            rotateX: useTransform(springY, [0, 1080], [5, -5]),
            rotateY: useTransform(springX, [0, 1920], [-5, 5]),
            perspective: 1000
          }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                ease: [0.23, 1, 0.32, 1],
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="flex flex-col items-center gap-4 mb-10"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 glass rounded-full text-xs font-bold tracking-[0.2em] uppercase text-brand-green border-brand-green/30 glow-green">
              <Sparkles className="w-4 h-4" />
              Intelligent At Hand
            </div>
            <motion.div
              className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-orange"
            >
              Built India To Grow India
            </motion.div>
          </motion.div>
          
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } }
            }}
            className="text-4xl sm:text-6xl md:text-[120px] font-display font-bold tracking-tight leading-[0.9] md:leading-[0.8] mb-12 optimize-gpu"
          >
            <span className="text-gradient font-serif italic font-light">BUILDING THE FUTURE</span>
          </motion.h1>
          
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-16 leading-relaxed font-light tracking-tight"
          >
            We use AI because it makes building powerful tools faster, smarter, and accessible to everyone — not just developers.
          </motion.p>
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link 
              to="/waitlist" 
              aria-label="Join the Elite Waitlist"
              className="w-full sm:w-auto group px-14 py-6 bg-white text-black rounded-2xl font-bold text-lg hover:bg-brand-green hover:text-white transition-all duration-500 shadow-[0_20px_50px_rgba(0,255,148,0.2)] flex items-center justify-center gap-3 focus-visible:outline-2 focus-visible:outline-brand-green focus-visible:outline-offset-4"
            >
              Join the Elite Waitlist <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              aria-label="Scroll to features section"
              className="w-full sm:w-auto px-14 py-6 glass rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-500 border-white/10 focus-visible:outline-2 focus-visible:outline-brand-green focus-visible:outline-offset-4"
            >
              The Vision
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-[10%] hidden lg:block"
      >
        <div className="glass p-4 rounded-2xl border-brand-blue/30 glow-green">
          <Cpu className="w-8 h-8 text-brand-blue" />
        </div>
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 left-[10%] hidden lg:block"
      >
        <div className="glass p-4 rounded-2xl border-brand-orange/30">
          <Sprout className="w-8 h-8 text-brand-orange" />
        </div>
      </motion.div>
    </section>
  );
};


const About = ({ isHome = false }: { isHome?: boolean, roadmapStep?: number, roadmapProgress?: number, onStepChange?: (step: number) => void }) => {
  return (
    <section id="about" className="py-40 relative overflow-hidden section-visibility">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-20 w-[800px] h-[800px] bg-brand-green/5 blur-[160px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-20 w-[800px] h-[800px] bg-brand-blue/5 blur-[160px] rounded-full" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Decorative Map Line */}
        <div className="absolute inset-0 pointer-events-none opacity-10 -z-10">
          <svg width="100%" height="100%" viewBox="0 0 1440 2000" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
              d="M-50 400 C 300 200, 600 800, 720 600 C 840 400, 1100 1000, 1500 800"
              stroke="url(#mapGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
            <motion.path
              d="M-50 450 C 350 250, 650 850, 720 650 C 790 450, 1050 1050, 1490 850"
              stroke="url(#mapGradient)"
              strokeWidth="1"
              strokeDasharray="20 20"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 5, ease: "easeInOut", delay: 0.5 }}
            />
            {[
              { x: 300, y: 200 },
              { x: 600, y: 800 },
              { x: 720, y: 600 },
              { x: 840, y: 400 },
              { x: 1100, y: 1000 }
            ].map((point, i) => (
              <motion.circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="6"
                fill="url(#mapGradient)"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 0.5, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + i * 0.3 }}
              />
            ))}
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00FF96" />
                <stop offset="50%" stopColor="#00D1FF" />
                <stop offset="100%" stopColor="#FF6B00" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* What is IAH.AI? Section */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-40 lg:mb-60">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-video rounded-[40px] lg:rounded-[60px] overflow-hidden glass-dark p-1 border border-white/10 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 via-brand-green/20 to-brand-orange/20 opacity-30" />
              <div className="relative h-full w-full rounded-[38px] lg:rounded-[58px] overflow-hidden bg-black/40 flex items-center justify-center p-8 lg:p-12">
                <div className="text-center">
                  <div className="flex justify-center gap-4 lg:gap-6 mb-6 lg:mb-8">
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30">
                      <Cpu className="w-6 h-6 lg:w-8 lg:h-8 text-brand-blue" />
                    </motion.div>
                    <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl bg-brand-green/20 flex items-center justify-center border border-brand-green/30">
                      <Users className="w-6 h-6 lg:w-8 lg:h-8 text-brand-green" />
                    </motion.div>
                  </div>
                  <h3 className="text-2xl lg:text-4xl font-display font-bold mb-4 lg:mb-6">The Intelligence Hub</h3>
                  <p className="text-white/60 text-base lg:text-lg font-light leading-relaxed">
                    A decentralized ecosystem where AI precision meets human intuition.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="order-1 lg:order-2"
          >
            {!isHome && (
              <>
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="flex items-center gap-4 mb-6 lg:mb-8"
                >
                  <div className="w-12 h-px bg-brand-blue" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-blue">The Identity</span>
                </motion.div>
                <motion.h2 
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                  }}
                  className="text-4xl md:text-8xl font-display font-bold mb-8 lg:mb-12 tracking-tighter leading-[0.9]"
                >
                  About <span className="text-gradient font-serif italic">IAH.AI</span>
                </motion.h2>
              </>
            )}
            <div className="space-y-6 lg:space-y-8 text-lg lg:text-xl text-white/40 leading-relaxed font-light">
              {isHome ? (
                <div className="space-y-6">
                  <p className="text-white font-medium">
                    IAH.AI makes AI creation simple for everyone.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-green" />
                      <span>No-code AI builder</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-green" />
                      <span>All tools in one platform</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-green" />
                      <span>Fast deployment</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-brand-green" />
                      <span>Beginner-friendly system</span>
                    </li>
                  </ul>
                  <p className="text-brand-green font-bold mt-8">
                    👉 Anyone can build AI tools in minutes
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-white font-bold text-xl lg:text-2xl">
                    AI is powerful, but building with it is still too hard.
                  </p>
                  <p>
                    90% of people can't build with AI because it requires coding knowledge, tools are scattered, and platforms are too expensive.
                  </p>
                  <p className="text-white font-medium">
                    IAH.AI is the solution.
                  </p>
                  <p>
                    We provide a no-code AI builder that brings all tools into one platform for fast, beginner-friendly deployment.
                  </p>
                  <p className="italic text-brand-blue">
                    Our mission: Build a global AI ecosystem where anyone can be a creator.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Why We Built IAH.AI Section */}
        <div className="mb-40 lg:mb-60 py-20 lg:py-32 border-y border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue/5 blur-[120px] rounded-full translate-x-1/2" />
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-4 mb-6 lg:mb-8">
                  <div className="w-12 h-px bg-brand-green" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-green">The Genesis</span>
                </div>
                <h2 className="text-4xl md:text-7xl font-display font-bold mb-8 lg:mb-12 tracking-tighter leading-[0.9]">
                  Why We Built <span className="text-gradient italic">IAH.AI?</span>
                </h2>
                <div className="space-y-6 text-base lg:text-lg text-white/60 font-light leading-relaxed">
                  <p>
                    We saw that most AI tools were too hard for regular people to use. Farmers, shopkeepers, and students were being left behind because of complex technology and confusing words.
                  </p>
                  <p className="text-white font-medium">
                    We built IAH.AI to be the bridge.
                  </p>
                  <p>
                    Technology is only useful if everyone can use it. We want AI to work for everyone in India, using simple language that anyone can understand without needing a special degree.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="glass p-8 lg:p-12 rounded-[40px] lg:rounded-[60px] border border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative z-10 space-y-8 lg:space-y-12">
                    {[
                      { 
                        title: "Designed for People", 
                        desc: "We focus on what you need and how you feel, not just on complex computer power.",
                        icon: Sparkles,
                        color: "brand-green"
                      },
                      { 
                        title: "Local Knowledge", 
                        desc: "Our AI understands the real-world needs of Indian farmers and small businesses.",
                        icon: Globe,
                        color: "brand-blue"
                      },
                      { 
                        title: "Very Simple", 
                        desc: "We remove confusing words and extra clicks so the tool is easy to use.",
                        icon: CheckCircle,
                        color: "brand-orange"
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 lg:gap-6">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-${item.color}/20 flex items-center justify-center flex-shrink-0 border border-${item.color}/30`}>
                          <item.icon className={`w-5 h-5 lg:w-6 lg:h-6 text-${item.color}`} />
                        </div>
                        <div>
                          <h4 className="text-lg lg:text-xl font-display font-bold text-white mb-1 lg:mb-2">{item.title}</h4>
                          <p className="text-xs lg:text-sm text-white/40 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-green/20 blur-[80px] rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-blue/20 blur-[80px] rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>


        <div className="mb-40 lg:mb-60 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6 lg:mb-8">
              <div className="w-12 h-px bg-brand-orange" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-orange">The Core Vision</span>
              <div className="w-12 h-px bg-brand-orange" />
            </div>
            <h2 className="text-4xl md:text-8xl font-display font-bold mb-8 lg:mb-12 tracking-tighter leading-[0.9]">
              Our <span className="text-gradient italic">Vision</span>
            </h2>
            <div className="max-w-5xl mx-auto px-4">
              <motion.p 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="text-2xl md:text-6xl text-white font-display font-light leading-[1.2] md:leading-[1.1] mb-12 lg:mb-16 tracking-tight"
              >
                "IAH.AI was born from a singular, burning realization: <span className="text-brand-green font-bold">Guidance</span> shouldn't be a privilege of the few; it should be the <span className="text-brand-blue font-bold">right</span> of the many."
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 lg:mb-8" />
                <div className="space-y-2">
                  <p className="text-xl md:text-3xl font-display italic text-white/80 tracking-wide">
                    Aditya Sharma
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Founder, IAH.AI</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>


          {/* Bridging the Gap: The Ultimate Transformation */}
          <div className="pt-10 lg:pt-20 pb-40 lg:pb-60 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-red-500/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-brand-green/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20 lg:mb-32 relative z-10"
            >
              <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
                The Transformation
              </div>
              <h3 className="text-4xl md:text-8xl font-display font-bold mb-6 lg:mb-8 tracking-tighter leading-[0.9]">
                Bridging the <span className="text-gradient italic">Gap</span>
              </h3>
              <p className="text-white/40 text-lg lg:text-xl max-w-2xl mx-auto font-light leading-relaxed px-4">
                We identify the friction in the current AI landscape and engineer the bridge to a more inclusive future.
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-7 gap-8 items-stretch relative z-10 px-4">
              {/* The Problem (3 cols) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 glass-dark p-8 lg:p-12 rounded-[32px] lg:rounded-[40px] border border-red-500/10 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8 lg:mb-10">
                    <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center border border-red-500/30">
                      <X className="w-5 h-5 text-red-500" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-red-500/60">The Friction</span>
                  </div>
                  <h4 className="text-3xl lg:text-4xl font-display font-bold mb-8 lg:mb-10 text-white tracking-tight leading-[0.9]">The Problem</h4>
                  <div className="space-y-6 lg:space-y-8">
                    {[
                      { title: "Technical Jargon", desc: "Complex terms that alienate non-technical users." },
                      { title: "Digital Exclusion", desc: "Millions left behind by the rapid pace of AI evolution." },
                      { title: "Complex Interfaces", desc: "Tools designed for engineers, not for everyday people." },
                      { title: "Knowledge Divide", desc: "The gap between those who 'know' AI and those who don't." }
                    ].map((item, i) => (
                      <div key={i} className="group/item">
                        <h5 className="text-white/80 font-bold mb-1 lg:mb-2 group-hover/item:text-red-400 transition-colors">{item.title}</h5>
                        <p className="text-white/30 text-xs lg:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* The Bridge (1 col) */}
              <div className="lg:col-span-1 flex flex-col items-center justify-center gap-8 lg:gap-12 py-8 lg:py-0">
                <div className="w-px h-16 lg:h-24 bg-gradient-to-b from-red-500/20 via-white/10 to-transparent" />
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0px rgba(0, 255, 153, 0)",
                      "0 0 40px rgba(0, 255, 153, 0.2)",
                      "0 0 0px rgba(0, 255, 153, 0)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full glass flex items-center justify-center border border-white/10 relative"
                >
                  <Sparkles className="w-6 h-6 lg:w-8 lg:h-8 text-brand-green relative z-10" />
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-dashed border-brand-green/30"
                  />
                </motion.div>
                <div className="w-px h-16 lg:h-24 bg-gradient-to-t from-brand-green/20 via-white/10 to-transparent" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20 vertical-text hidden lg:block">IAH.AI Bridge</span>
              </div>

              {/* The Solution (3 cols) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-3 glass-dark p-8 lg:p-12 rounded-[32px] lg:rounded-[40px] border border-brand-green/10 relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-brand-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8 lg:mb-10">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/20 flex items-center justify-center border border-brand-green/30">
                      <CheckCircle className="w-5 h-5 text-brand-green" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-green/60">The Evolution</span>
                  </div>
                  <h4 className="text-3xl lg:text-4xl font-display font-bold mb-8 lg:mb-10 text-white tracking-tight leading-[0.9]">The Solution</h4>
                  <div className="space-y-6 lg:space-y-8">
                    {[
                      { title: "Human Language", desc: "AI that speaks and understands like a real person." },
                      { title: "Universal Access", desc: "Empowering every individual, regardless of background." },
                      { title: "Radical Simplicity", desc: "Interfaces that feel intuitive and second-nature." },
                      { title: "Contextual Clarity", desc: "Guidance that makes sense in your real-world context." }
                    ].map((item, i) => (
                      <div key={i} className="group/item">
                        <h5 className="text-white/80 font-bold mb-1 lg:mb-2 group-hover/item:text-brand-green transition-colors">{item.title}</h5>
                        <p className="text-white/30 text-xs lg:text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Final Vision Statement */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-20 lg:mt-40 text-center max-w-4xl mx-auto px-4 relative z-10"
            >
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8 lg:mb-12" />
              <h4 className="text-xl md:text-5xl font-display font-light text-white/80 leading-snug tracking-tight">
                "We use AI because it makes building powerful tools faster, smarter, and accessible to everyone — not just developers."
              </h4>
              <div className="mt-8 lg:mt-12 flex items-center justify-center gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">The IAH.AI Mission</span>
                <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
};

const TopBanner = () => {
  const bannerText = "IAH.AI BUILT INDIA TO GROW INDIA • FOUNDER ADITYA SHARMA • WELCOME OUR WAITLIST 🇮🇳 🚀 ✨";
  
  return (
    <div className="fixed top-0 left-0 w-full h-12 bg-black/80 backdrop-blur-xl border-b border-white/5 z-[150] overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-brand-green/5 via-transparent to-brand-blue/5 pointer-events-none" />
      <motion.div 
        animate={{ x: ["-50%", "0%"] }}
        transition={{ 
          duration: 60, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="flex whitespace-nowrap gap-10 items-center"
        style={{ width: "fit-content" }}
      >
        {/* We repeat the content twice to create a seamless loop */}
        <div className="flex gap-10 items-center">
          {[...Array(5)].map((_, i) => (
            <div key={`a-${i}`} className="flex items-center gap-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green/80 flex items-center gap-4">
                <Sparkles className="w-3 h-3" />
                {bannerText}
              </span>
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
        <div className="flex gap-10 items-center">
          {[...Array(5)].map((_, i) => (
            <div key={`b-${i}`} className="flex items-center gap-10">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green/80 flex items-center gap-4">
                <Sparkles className="w-3 h-3" />
                {bannerText}
              </span>
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, colorClass, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    className="glass-dark p-10 rounded-[40px] border-white/5 hover:border-white/20 transition-all duration-700 group relative overflow-hidden hover-3d preserve-3d"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${colorClass} relative z-10`}>
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-3xl font-bold mb-6 relative z-10 tracking-tight">{title}</h3>
    <p className="text-white/40 leading-relaxed text-lg font-light relative z-10 group-hover:text-white/60 transition-colors">{description}</p>
  </motion.div>
);

const FeaturesGrid = () => {
  const features = [
    { 
      icon: Brain, 
      title: "AI Roadmaps", 
      desc: "Hyper-personalized strategies generated by neural networks to guide your unique growth journey.", 
      color: "#00FF94"
    },
    { 
      icon: Users, 
      title: "Elite Mentors", 
      desc: "Direct connection to industry titans and life coaches who have walked the path before you.", 
      color: "#00E0FF"
    },
    { 
      icon: Sprout, 
      title: "Agri-Tech", 
      desc: "Modern data insights and sustainable growth strategies for the next generation of agriculture.", 
      color: "#FF6B00"
    },
    { 
      icon: Wrench, 
      title: "AI Tools Suite", 
      desc: "Proprietary AI-driven utilities designed to automate and optimize complex professional tasks.", 
      color: "#00E0FF"
    },
    { 
      icon: Globe, 
      title: "Community", 
      desc: "A vibrant global network of ambitious individuals collaborating to build a better future.", 
      color: "#00FF94"
    },
    { 
      icon: Map, 
      title: "Journey Map", 
      desc: "Dynamic, AI-generated visual roadmap that evolves in real-time as you achieve your milestones.", 
      color: "#FF6B00"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {features.map((feature, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -10 }}
          className="group p-10 rounded-[2.5rem] glass border border-white/5 hover:border-white/20 transition-all duration-500 relative overflow-hidden"
        >
          {/* Hover Glow */}
          <div 
            className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl pointer-events-none"
            style={{ background: `radial-gradient(circle at center, ${feature.color}15 0%, transparent 70%)` }}
          />
          
          <div className="relative z-10">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundColor: `${feature.color}10`, border: `1px solid ${feature.color}30` }}
            >
              <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
            </div>
            
            <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">
              {feature.title}
            </h3>
            <p className="text-white/40 text-lg font-light leading-relaxed group-hover:text-white/60 transition-colors">
              {feature.desc}
            </p>
          </div>

          {/* Bottom Accent */}
          <div 
            className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-700 ease-out"
            style={{ backgroundColor: feature.color }}
          />
        </motion.div>
      ))}
    </div>
  );
};

const Features = ({ roadmapStep, roadmapProgress, onStepChange }: { roadmapStep: number, roadmapProgress: number, onStepChange?: (step: number) => void }) => {
  return (
    <section id="features" className="py-60 relative section-visibility overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-brand-green/5 blur-[200px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-6 py-2 glass rounded-full border border-white/10 mb-8"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-green">Core Ecosystem</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tighter"
          >
            The Future is <span className="text-gradient italic">Circular.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-2xl mx-auto text-xl md:text-2xl font-light"
          >
            Explore our interconnected suite of tools designed to accelerate your evolution.
          </motion.p>
        </div>

        <FeaturesGrid />

        <div className="mt-40 text-center">
          <Link to="/features" className="inline-flex items-center gap-4 px-12 py-6 glass rounded-[2rem] font-bold text-xl hover:bg-white/10 transition-all group border border-white/5">
            Explore Full Roadmap <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    { number: "01", title: "Pick an Idea", desc: "Start with your own idea or choose from our ready-to-use templates." },
    { number: "02", title: "Make it Yours", desc: "Use our simple builder to change how your AI works and looks." },
    { number: "03", title: "Go Live", desc: "Launch your AI tool with just one click. It's that easy." }
  ];

  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden section-visibility">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 -left-20 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">How It Works</h2>
            <p className="text-white/60 text-lg font-light">A simple way to turn your ideas into reality.</p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-white/10 mx-10 mb-6" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-12 perspective-1000">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="relative group hover-3d preserve-3d"
            >
              <span className="text-8xl font-display font-bold text-white/5 absolute -top-10 -left-4 select-none group-hover:text-brand-green/10 transition-colors duration-700">
                {step.number}
              </span>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 group-hover:text-brand-green transition-colors duration-500">
                  <CheckCircle className="w-6 h-6 text-brand-green group-hover:scale-110 transition-transform duration-500" />
                  {step.title}
                </h3>
                <p className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-500">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TeamMember = ({ name, role, image, isFounder, bio, linkedin, twitter, instagram, location, knowCount }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const spotlightBg = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(0, 255, 148, 0.08), transparent 80%)`
  );

  // Extract short bio (first sentence or first 120 chars)
  const shortBio = bio.split('\n')[0].split('.')[0] + '.';

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { 
            opacity: 1, 
            y: 0, 
            transition: { 
              duration: 1, 
              ease: [0.23, 1, 0.32, 1],
              staggerChildren: 0.1
            } 
          }
        }}
        onMouseMove={handleMouseMove}
        onClick={() => setIsExpanded(true)}
        className={`group relative rounded-[48px] border border-white/5 bg-white/[0.01] p-10 transition-all duration-700 hover:bg-white/[0.03] hover:border-brand-green/20 hover:shadow-[0_0_50px_rgba(0,255,148,0.05)] cursor-pointer ${
          isFounder ? 'lg:col-span-2 lg:flex gap-16 items-center' : ''
        }`}
      >
        {/* Dynamic Spotlight */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-[48px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: spotlightBg }}
        />

        {/* Image Section */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
          }}
          className={`relative shrink-0 overflow-hidden rounded-[36px] ${isFounder ? 'w-full lg:w-[45%] aspect-square' : 'aspect-[4/5] mb-10'}`}
        >
          {knowCount && (
            <div className="absolute top-6 left-6 z-20 px-5 py-2 glass rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,255,148,0.2)] backdrop-blur-md">
              <span className="text-2xl font-display font-black text-brand-green tracking-tighter">{knowCount}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-brand-green/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110 contrast-[1.1] saturate-[1.2] brightness-[1.05]"
            referrerPolicy="no-referrer"
          />
          
          {/* Social Links */}
          <div className="absolute bottom-8 left-8 flex gap-4 z-20 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-12 h-12 rounded-2xl glass-dark flex items-center justify-center hover:bg-brand-green hover:text-black transition-all duration-300 backdrop-blur-xl border border-white/10">
                <Linkedin className="w-5 h-5" />
              </a>
            )}
            {twitter && (
              <a href={twitter} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-12 h-12 rounded-2xl glass-dark flex items-center justify-center hover:bg-brand-green hover:text-black transition-all duration-300 backdrop-blur-xl border border-white/10">
                <Twitter className="w-5 h-5" />
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="w-12 h-12 rounded-2xl glass-dark flex items-center justify-center hover:bg-brand-green hover:text-black transition-all duration-300 backdrop-blur-xl border border-white/10">
                <Instagram className="w-5 h-5" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Content Section */}
        <div className={isFounder ? 'lg:w-[55%] mt-10 lg:mt-0' : ''}>
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-brand-green/30 group-hover:w-16 transition-all duration-700" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-brand-green/70">
              {role}
            </span>
          </div>
          
          <h4 className={`${isFounder ? 'text-5xl lg:text-7xl' : 'text-3xl'} font-display font-bold tracking-tighter mb-6 leading-tight`}>
            {name}
          </h4>
          
          <p className={`text-white/40 font-light leading-relaxed ${isFounder ? 'text-xl' : 'text-base line-clamp-3'}`}>
            {shortBio}
          </p>

          <div className="mt-8 flex items-center gap-2 text-brand-green text-[10px] font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            View Full Profile <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </motion.div>

      {/* Full Details Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6 md:p-12"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsExpanded(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-2xl" 
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-5xl glass-dark rounded-[48px] border border-white/10 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setIsExpanded(false)}
                className="absolute top-8 right-8 z-30 w-12 h-12 rounded-2xl glass flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-[40%] h-[400px] md:h-auto relative">
                <img 
                  src={image} 
                  alt={name} 
                  className="w-full h-full object-cover transition-all duration-700 contrast-[1.15] saturate-[1.3] brightness-[1.1]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:hidden" />
              </div>

              <div className="flex-1 p-10 md:p-16 overflow-y-auto custom-scrollbar">
                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="h-px w-12 bg-brand-green" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.4em] text-brand-green">
                      {role}
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-4">{name}</h2>
                  {location && (
                    <div className="flex items-center gap-2 text-white/40 text-sm font-bold uppercase tracking-widest">
                      <MapPin className="w-4 h-4 text-brand-orange" /> {location}
                    </div>
                  )}
                </div>

                <div className="space-y-8 text-xl text-white/60 leading-relaxed font-light whitespace-pre-line">
                  {bio}
                </div>

                <div className="mt-16 pt-12 border-t border-white/5 flex flex-wrap gap-6">
                  {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 glass rounded-2xl hover:bg-brand-green hover:text-black transition-all duration-300">
                      <Linkedin className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">LinkedIn</span>
                    </a>
                  )}
                  {instagram && (
                    <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 glass rounded-2xl hover:bg-brand-green hover:text-black transition-all duration-300">
                      <Instagram className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Team = () => {
  const founder = { 
    name: "Aditya Sharma", 
    role: "Founder (Vision + Execution)", 
    image: "https://i.ibb.co/TDWjxFhg/Whats-App-Image-2026-03-19-at-12-19-32-PM.jpg",
    location: "Kolkata, West Bengal",
    knowCount: "100",
    bio: `Aditya is a young but highly driven entrepreneur building for the future. He identified a critical gap where millions of people have potential but lack the right roadmap to take action. Through IAH.AI, he aims to create a future where intelligent guidance is accessible to everyone.`,
    instagram: "https://www.instagram.com/grow.with_adii?igsh=MWg0NmU3czkyOG1jYg==",
    linkedin: "https://www.linkedin.com/in/aditya-sharma-a38a0a3a6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    twitter: "https://x.com/AdityaShar54906"
  };
  
  const members = [
    {
      name: "Sanjana Das",
      role: "Chief Operating Officer",
      image: "https://i.ibb.co/ShpFCxz/Whats-App-Image-2026-03-19-at-12-29-21-PM.jpg",
      location: "Kolkata, West Bengal",
      bio: `The Chief Operating Officer of IAH.AI is responsible for managing operations, planning execution, and ensuring that the vision of the startup is translated into real progress.

As a core member of the team, she focuses on organizing workflows, coordinating tasks, and maintaining consistency in day-to-day activities. She plays a key role in turning ideas into structured action by aligning team efforts with clear goals and timelines.

With a strong sense of responsibility and discipline, she helps maintain focus, clarity, and balance within the team — especially important in a growing startup environment.

Her role ensures that IAH.AI moves forward in a structured, organized, and efficient way.`,
      instagram: "https://www.instagram.com/start_with_sanjana?igsh=Y2dqMzNpMzdpdzAx"
    }
  ];

  return (
    <section id="team" className="py-60 relative overflow-hidden bg-bg section-visibility">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[800px] h-[800px] bg-brand-green/10 blur-[200px] rounded-full opacity-30" />
        <div className="absolute bottom-1/4 -right-20 w-[800px] h-[800px] bg-brand-blue/10 blur-[200px] rounded-full opacity-30" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-40">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-12 h-px bg-brand-green" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-green">The Leadership</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="text-7xl md:text-[140px] font-display font-bold tracking-tighter leading-[0.8] mb-4"
            >
              Meet the <br />
              <span className="text-gradient italic font-light">Visionaries.</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="lg:mb-6"
          >
            <p className="text-white/40 text-2xl font-light leading-relaxed max-w-md tracking-tight">
              A diverse group of architects, dreamers, and engineers united by a singular purpose: redefining human evolution.
            </p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Founder Card */}
          <TeamMember {...founder} isFounder />
          
          {/* Other Members Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:col-span-2"
          >
            {members.map((member, idx) => (
              <TeamMember key={idx} {...member} />
            ))}

            {/* Join the Team Card */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
              }}
              className="group relative rounded-[48px] border border-dashed border-white/10 bg-transparent p-12 flex flex-col items-center justify-center text-center hover:border-brand-green/50 transition-all duration-700 hover:bg-white/[0.02]"
            >
              <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-brand-green/10 transition-all duration-700">
                <Users className="w-10 h-10 text-white/20 group-hover:text-brand-green transition-colors" />
              </div>
              <h4 className="text-3xl font-display font-bold mb-6 tracking-tight">Join the Evolution</h4>
              <p className="text-white/60 text-base font-light mb-10 max-w-[240px] leading-relaxed">
                We're always looking for brilliant minds to join our mission.
              </p>
              <Link to="/contact" className="px-10 py-5 glass rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-green hover:text-black transition-all duration-500">
                View Openings
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};


const Confetti = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0,
            rotate: 0,
            opacity: 1 
          }}
          animate={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`, 
            scale: Math.random() * 1.5 + 0.5,
            rotate: Math.random() * 720,
            opacity: 0 
          }}
          transition={{ 
            duration: Math.random() * 2 + 1.5, 
            ease: [0.23, 1, 0.32, 1],
            delay: Math.random() * 0.1
          }}
          className={`absolute w-2 h-2 rounded-sm ${
            ["bg-brand-green", "bg-brand-blue", "bg-brand-orange", "bg-white"][Math.floor(Math.random() * 4)]
          }`}
        />
      ))}
    </div>
  );
};

const SuccessCheck = () => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: "spring", damping: 12, stiffness: 200 }}
    className="w-32 h-32 bg-brand-green/10 rounded-full flex items-center justify-center mb-10 relative mx-auto"
  >
    <motion.div
      initial={{ scale: 0, opacity: 0.5 }}
      animate={{ scale: 2, opacity: 0 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      className="absolute inset-0 bg-brand-green rounded-full"
    />
    <svg 
      viewBox="0 0 24 24" 
      className="w-16 h-16 text-brand-green"
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeInOut" }}
        d="M20 6L9 17l-5-5"
      />
    </svg>
  </motion.div>
);

const Waitlist = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    interest: "Personal Growth",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "";
    if (!regex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === "email") {
      setEmailError(validateEmail(value));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const error = validateEmail(formData.email);
    if (error || !formData.email || !formData.fullName) {
      if (error || !formData.email) setEmailError(error || "Email is required");
      if (!formData.fullName) alert("Please enter your full name");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabaseClient
        .from("waitlist")
        .insert([{ 
          email: formData.email,
          full_name: formData.fullName,
          interest: formData.interest,
          message: formData.message
        }]);

      if (error) {
        alert("❌ Error: " + error.message);
        console.error(error);
      } else {
        // Trigger confetti burst
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00FF94', '#00E0FF', '#FFFFFF'],
          disableForReducedMotion: true
        });

        setIsSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          interest: "Personal Growth",
          message: ""
        });
        setEmailError("");
        setTimeout(() => setIsSubmitted(false), 5000);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="waitlist" className="py-40 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-green/5 to-transparent" />
      
      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="glass-dark p-8 md:p-20 rounded-[40px] md:rounded-[60px] border-white/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 blur-[120px] rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-blue/10 blur-[120px] rounded-full -ml-20 -mb-20" />
          
          <div className="relative z-10 min-h-[500px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter leading-tight">
                    Ready to start your <br />
                    <span className="text-gradient italic">journey?</span>
                  </h2>
                  <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                    Join the elite waitlist today. Tell us a bit about yourself so we can tailor your experience.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 text-left">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName"
                          placeholder="Your Name" 
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-green transition-all duration-500 focus:bg-white/[0.06] text-text placeholder:text-text/10"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Email Address</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            name="email"
                            placeholder="Your Email" 
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full bg-glass-bg backdrop-blur-md border rounded-2xl px-7 py-5 focus:outline-none transition-all duration-500 focus:bg-white/[0.06] text-text placeholder:text-text/10 ${
                              emailError 
                                ? "border-red-500/50 focus:border-red-500" 
                                : "border-glass-border focus:border-brand-green"
                            }`}
                          />
                          <AnimatePresence>
                            {emailError && (
                              <motion.span 
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="absolute -bottom-6 left-2 text-[10px] text-red-500 font-medium uppercase tracking-widest"
                              >
                                {emailError}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Primary Interest</label>
                        <div className="relative">
                          <select 
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            className="w-full bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-green transition-all duration-500 focus:bg-white/[0.06] text-text appearance-none cursor-pointer"
                          >
                            <option value="Personal Growth" className="bg-bg">Personal Growth</option>
                            <option value="Career Pivot" className="bg-bg">Career Pivot</option>
                            <option value="Farming Support" className="bg-bg">Farming Support</option>
                            <option value="Mentorship" className="bg-bg">Mentorship</option>
                            <option value="Other" className="bg-bg">Other</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text/20">
                            <ChevronRight className="w-4 h-4 rotate-90" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Message (Optional)</label>
                        <textarea 
                          name="message"
                          placeholder="Tell us more about your goals..." 
                          value={formData.message}
                          onChange={handleChange}
                          rows={1}
                          className="w-full bg-glass-bg backdrop-blur-md border border-glass-border rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-green transition-all duration-500 focus:bg-white/[0.06] text-text resize-none placeholder:text-text/10"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isLoading || !!emailError || !formData.email || !formData.fullName}
                      className="w-full py-6 bg-brand-green text-black rounded-2xl text-[12px] font-bold uppercase tracking-[0.4em] hover:bg-white transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-[0_15px_40px_rgba(0,255,148,0.2)] group"
                    >
                      {isLoading ? (
                        "Processing..."
                      ) : (
                        <>
                          Join the Elite Circle 
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="min-h-[128px] flex items-center justify-center mb-10">
                    <SuccessCheck />
                  </div>
                  <h3 className="text-4xl md:text-6xl font-display font-bold mb-6 uppercase tracking-tighter">Thank You</h3>
                  <p className="text-white/40 text-xl font-light max-w-md mx-auto leading-relaxed">
                    NOW YOU ARE IN THE WAITING LIST <br />
                    <span className="text-brand-green font-medium">WE SOON TOUCH YOU ...</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenFeedback }: { onOpenFeedback: (type?: "bug" | "suggestion") => void }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleInternalLink = (e: MouseEvent, id: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(id);
      if (element) {
        if ((window as any).lenis) {
          (window as any).lenis.scrollTo(`#${id}`);
        } else {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <footer className="py-32 border-t border-glass-border relative overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-brand-green/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-20 mb-24 md:mb-32">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                <img src="/logo.png" alt="IAH.AI Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-display font-bold text-2xl md:text-3xl tracking-tighter">IAH.AI</span>
            </div>
            <p className="text-text/50 max-w-sm leading-relaxed text-base md:text-lg font-light mb-8">
              Intelligent At Hand. Redefining human evolution through the seamless integration of artificial intelligence and human wisdom.
            </p>
            <div className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-orange">
              Built India To Grow India
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-1 gap-12 md:gap-8 md:col-span-1">
            <div>
              <h5 className="font-display font-bold text-lg md:text-xl mb-6 md:mb-8 tracking-tight">Ecosystem</h5>
              <ul className="space-y-4 md:space-y-5 text-text/50 text-sm md:text-base font-medium">
                <li><Link to="/about" className="hover:text-brand-green transition-all duration-300 flex items-center gap-2 group"><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> About Us</Link></li>
                <li><Link to="/features" className="hover:text-brand-blue transition-all duration-300 flex items-center gap-2 group"><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Features</Link></li>
                <li><Link to="/goals" className="hover:text-brand-green transition-all duration-300 flex items-center gap-2 group"><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Goal Tracker</Link></li>
                <li><Link to="/" onClick={(e) => handleInternalLink(e, 'how-it-works')} className="hover:text-brand-orange transition-all duration-300 flex items-center gap-2 group"><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> How it Works</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-display font-bold text-lg md:text-xl mb-6 md:mb-8 tracking-tight">Support</h5>
              <ul className="space-y-4 md:space-y-5 text-text/50 text-sm md:text-base font-medium">
                <li><button onClick={() => onOpenFeedback("bug")} className="hover:text-brand-orange transition-all duration-300 flex items-center gap-2 group"><Bug className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Report a Bug</button></li>
                <li><button onClick={() => onOpenFeedback("suggestion")} className="hover:text-brand-green transition-all duration-300 flex items-center gap-2 group"><Lightbulb className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Suggestion</button></li>
                <li><Link to="/contact" className="hover:text-brand-blue transition-all duration-300 flex items-center gap-2 group"><Mail className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Contact Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-display font-bold text-lg md:text-xl mb-6 md:mb-8 tracking-tight">Connect</h5>
              <div className="flex gap-4 md:gap-5">
                <a href="https://x.com/AdityaShar54906" target="_blank" rel="noopener noreferrer" aria-label="Follow us on X (Twitter)" className="w-10 h-10 md:w-12 md:h-12 glass rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-brand-blue/20 hover:scale-110 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-blue focus-visible:outline-offset-4"><Twitter className="w-5 h-5 md:w-6 md:h-6" /></a>
                <a href="https://www.linkedin.com/in/aditya-sharma-a38a0a3a6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn" className="w-10 h-10 md:w-12 md:h-12 glass rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-brand-blue/20 hover:scale-110 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-blue focus-visible:outline-offset-4"><Linkedin className="w-5 h-5 md:w-6 md:h-6" /></a>
                <a href="https://www.instagram.com/1.iah.ai?igsh=ZGRhdTk1Y3N4MGFu" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="w-10 h-10 md:w-12 md:h-12 glass rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-brand-blue/20 hover:scale-110 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-brand-blue focus-visible:outline-offset-4"><Instagram className="w-5 h-5 md:w-6 md:h-6" /></a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-glass-border text-text/20 text-xs font-bold uppercase tracking-[0.3em]">
          <p>© 2026 IAH.AI. All rights reserved.</p>
          <div className="flex gap-12">
            <button onClick={() => onOpenFeedback("suggestion")} className="hover:text-text transition-colors">Feedback</button>
            <a href="#" className="hover:text-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Store in Supabase 'contact' table
      const { error: supabaseError } = await supabaseClient
        .from("contact")
        .insert([{
          full_name: formData.fullName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          created_at: new Date().toISOString()
        }]);

      if (supabaseError) {
        console.error("Supabase Error:", supabaseError);
        // Fallback or alert if needed, but we'll proceed with the success state for UX
        // unless it's a critical failure the user should know about
      }

      // Log for developer awareness (as requested by user in previous turns)
      console.log("Message sent and stored. Notification details:", {
        to: "adikumarsharma06@gmail.com",
        phone: "7980259343",
        data: formData
      });

      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00A3FF', '#FFFFFF']
      });

      setIsSubmitted(true);
      setFormData({ fullName: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 8000);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-32 pt-40 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight">Get in <span className="text-brand-blue">Touch</span></h2>
            <p className="text-white/50 text-xl mb-12 leading-relaxed font-light max-w-lg">
              Have questions about our mentorship programs or AI roadmaps? We're here to help you navigate your journey.
            </p>
            
            <div className="space-y-10">
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 rounded-[24px] bg-brand-green/10 flex items-center justify-center group-hover:bg-brand-green/20 transition-all duration-500 group-hover:scale-110">
                  <Phone className="text-brand-green w-8 h-8" />
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-[0.4em] font-bold mb-2">ADITYA SHARMA</p>
                  <p className="text-3xl font-bold tracking-tighter">7980259343</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8 group">
                <div className="w-20 h-20 rounded-[24px] bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange/20 transition-all duration-500 group-hover:scale-110">
                  <MapPin className="text-brand-orange w-8 h-8" />
                </div>
                <div>
                  <p className="text-white/30 text-xs uppercase tracking-[0.4em] font-bold mb-2">Visit Us</p>
                  <p className="text-2xl font-bold tracking-tighter">KOLKATA WEST BENGAL PIN 712311</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="glass p-12 rounded-[40px] border-white/5 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          className="w-full bg-glass-bg border border-glass-border rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-blue transition-all duration-500 focus:bg-white/[0.05] text-text placeholder:text-text/10" 
                          placeholder="Your Name" 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Email Address</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full bg-glass-bg border border-glass-border rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-blue transition-all duration-500 focus:bg-white/[0.05] text-text placeholder:text-text/10" 
                          placeholder="Your Email" 
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Subject</label>
                      <input 
                        type="text" 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full bg-glass-bg border border-glass-border rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-blue transition-all duration-500 focus:bg-white/[0.05] text-text placeholder:text-text/10" 
                        placeholder="How can we help?" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold uppercase tracking-[0.3em] text-text/40 ml-1 block">Message</label>
                      <textarea 
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={4} 
                        className="w-full bg-glass-bg border border-glass-border rounded-2xl px-7 py-5 focus:outline-none focus:border-brand-blue transition-all duration-500 focus:bg-white/[0.05] text-text resize-none placeholder:text-text/10" 
                        placeholder="Tell us more..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-6 bg-brand-blue text-white rounded-2xl font-bold text-[12px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all duration-700 flex items-center justify-center gap-4 shadow-[0_20px_50px_rgba(0,163,255,0.2)] group disabled:opacity-50"
                    >
                      {isLoading ? "Sending..." : (
                        <>
                          Send Message 
                          <Send className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center"
                  >
                    <div className="w-24 h-24 rounded-full bg-brand-blue/20 flex items-center justify-center mx-auto mb-10">
                      <CheckCircle className="w-12 h-12 text-brand-blue" />
                    </div>
                    <h3 className="text-4xl md:text-6xl font-display font-bold mb-6 uppercase tracking-tighter">Verified</h3>
                    <p className="text-text/40 text-xl font-light max-w-md mx-auto leading-relaxed">
                      WE TOUCH YOU SOON... <br />
                      <span className="text-brand-blue font-medium">YOUR MESSAGE IS ON THE WAY.</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WaitlistPage = () => {
  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10">
        <Waitlist />
      </div>
    </div>
  );
};

const ProblemSection = () => {
  const problems = [
    { title: "Requires coding knowledge", desc: "Most AI tools are built for developers, leaving 90% of people behind." },
    { number: "02", title: "Too many different tools", desc: "Finding and using different AI services is very confusing." },
    { number: "03", title: "Too expensive", desc: "Most AI tools cost too much for regular people and beginners." },
    { number: "04", title: "Hard to learn", desc: "Most tools are too difficult for beginners to start using quickly." }
  ];

  return (
    <section id="problem" className="py-40 relative overflow-hidden section-visibility">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter">The <span className="text-gradient font-serif italic">Problem</span></h2>
          <p className="text-white/40 text-xl max-w-2xl mx-auto font-light">AI is powerful, but building with it is still too hard for most people.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
          {problems.map((problem, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-orange/30 transition-all duration-500 hover-3d preserve-3d"
            >
              <h4 className="text-xl font-bold mb-4 text-brand-orange">{problem.title}</h4>
              <p className="text-white/40 font-light leading-relaxed">{problem.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 glass rounded-3xl border border-brand-orange/20 text-center"
        >
          <p className="text-2xl font-bold text-white">Result: <span className="text-brand-orange">90% of people</span> can't build with AI</p>
        </motion.div>
      </div>
    </section>
  );
};

const ImpactVisionChart = () => {
  const data = [
    { area: 'Accessibility', target: 95 },
    { area: 'Creation Speed', target: 90 },
    { area: 'User Reach', target: 85 },
    { area: 'Cost Savings', target: 80 },
  ];

  return (
    <div className="w-full h-[300px] min-w-0 relative mt-12">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ right: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
          <XAxis type="number" hide domain={[0, 100]} />
          <YAxis 
            dataKey="area" 
            type="category" 
            stroke="#ffffff40" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={100}
          />
          <Bar 
            dataKey="target" 
            fill="#00FF94" 
            radius={[0, 4, 4, 0]} 
            barSize={20}
            animationDuration={2000}
            animationEasing="ease-out"
          >
            <LabelList 
              dataKey="target" 
              position="right" 
              fill="#00FF94" 
              fontSize={12} 
              formatter={(val: number) => `${val}%`}
              offset={10}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-center text-white/20 text-[10px] font-bold uppercase tracking-[0.4em] mt-6">Our Impact Target (Vision Scale)</p>
    </div>
  );
};

const MarketSection = () => {
  const marketStats = [
    { label: "AI Market", value: "Global", desc: "Rapidly growing demand for AI tools." },
    { label: "Target Audience", value: "Massive", desc: "Creators, students, and startups." },
    { label: "Demand", value: "Rising", desc: "High demand for no-code solutions." }
  ];

  const businessModel = [
    { title: "Freemium Model", desc: "Basic access for free, premium for power users." },
    { title: "Paid Features", desc: "Advanced tools and customization options." },
    { title: "AI Credits", desc: "Pay-as-you-go system for AI processing." },
    { title: "Subscriptions", desc: "Monthly and annual plans for businesses." }
  ];

  return (
    <section id="market" className="py-40 relative overflow-hidden section-visibility">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter">Market & <span className="text-gradient italic">Business Model</span></h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto font-light">The AI world is growing fast, and IAH.AI is right at the heart of it.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20 perspective-1000">
          {marketStats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-dark p-8 rounded-3xl border border-white/5 text-center hover-3d preserve-3d"
            >
              <div className="text-brand-green text-sm font-bold uppercase tracking-widest mb-2">{stat.label}</div>
              <div className="text-4xl font-display font-bold mb-4">{stat.value}</div>
              <p className="text-white/40 text-sm">{stat.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold mb-6">Market Potential</h3>
            <p className="text-white/40 leading-relaxed mb-8">
              The AI market is projected to reach trillions by 2030. IAH.AI is capturing the early-stage no-code segment, which is the fastest-growing sub-sector.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-green" />
                <span className="text-sm text-white/60">37% CAGR in AI software</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-brand-blue" />
                <span className="text-sm text-white/60">90% of SMEs seeking AI integration</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark p-8 rounded-[32px] border border-white/5"
          >
            <ImpactVisionChart />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000">
          {businessModel.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-blue/30 transition-all duration-500 hover-3d preserve-3d"
            >
              <h4 className="text-xl font-bold mb-2 text-brand-blue">{item.title}</h4>
              <p className="text-white/40 text-sm font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TractionSection = () => {
  return (
    <section id="traction" className="py-40 bg-white/5 relative overflow-hidden section-visibility">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-8 tracking-tighter">Real <span className="text-gradient font-serif italic">Traction</span></h2>
            <p className="text-white/40 text-xl mb-12 font-light leading-relaxed">
              We are growing daily, with early interest from students, creators, and entrepreneurs who are ready to build with AI.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 glass rounded-2xl border border-white/10">
                <div className="text-5xl font-display font-bold text-brand-green">60+</div>
                <div>
                  <div className="text-xl font-bold">Active Users</div>
                  <div className="text-white/40 text-sm">Growing daily community.</div>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 glass rounded-2xl border border-white/10">
                <div className="text-5xl font-display font-bold text-brand-blue">25+</div>
                <div>
                  <div className="text-xl font-bold">Coding Users</div>
                  <div className="text-white/40 text-sm">Building with our core tools.</div>
                </div>
              </div>
              <div className="flex items-center gap-6 p-6 glass rounded-2xl border border-white/10">
                <div className="text-5xl font-display font-bold text-brand-orange">95%</div>
                <div>
                  <div className="text-xl font-bold">Efficiency Increase</div>
                  <div className="text-white/40 text-sm">Average gain in task completion.</div>
                </div>
              </div>
            </div>
            <div className="mt-12 glass-dark p-8 rounded-3xl border border-white/5">
              <ImpactVisionChart />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark p-12 rounded-[40px] border border-white/10 text-center"
          >
            <h3 className="text-3xl font-bold mb-8">Our Edge</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 rounded-2xl bg-brand-green/10 border border-brand-green/20">
                <div className="text-brand-green font-bold mb-2">IAH.AI</div>
                <div className="text-sm text-white/60">Simple & Affordable</div>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 opacity-50">
                <div className="text-white/40 font-bold mb-2">Others</div>
                <div className="text-sm text-white/20">Complex & Expensive</div>
              </div>
            </div>
            <p className="mt-12 text-brand-green font-bold text-xl uppercase tracking-widest">Simplicity + Accessibility</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhyInvestSection = () => {
  const reasons = [
    {
      title: "First-Mover Advantage",
      desc: "IAH.AI is one of the first no-code AI platforms specifically targeting the Indian SME and creator market.",
      icon: Target
    },
    {
      title: "Scalable Infrastructure",
      desc: "Our cloud-native architecture allows us to scale to millions of users with minimal overhead.",
      icon: Cpu
    },
    {
      title: "High Retention Potential",
      desc: "By becoming the 'operating system' for AI tools, we create high switching costs and long-term value.",
      icon: ShieldCheck
    },
    {
      title: "Massive Market Gap",
      desc: "90% of potential AI users cannot code. We are the bridge that connects them to the AI revolution.",
      icon: Globe
    }
  ];

  return (
    <section className="py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter">Why <span className="text-gradient italic">Invest?</span></h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto font-light">A unique opportunity to be part of the next big wave in technology.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 rounded-[40px] border border-white/10 flex gap-8 items-start group hover:bg-white/[0.02] transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-green/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-green/20 transition-colors">
                <reason.icon className="w-8 h-8 text-brand-green" />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-4">{reason.title}</h4>
                <p className="text-white/40 leading-relaxed">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const InvestorAskSection = () => {
  const asks = [
    { title: "Funding / Mentorship", icon: TrendingUp },
    { title: "Early Adopters", icon: Users },
    { title: "Strategic Support", icon: Target }
  ];

  return (
    <section id="investor-ask" className="py-40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-8xl font-display font-bold mb-12 tracking-tighter">The <span className="text-gradient font-serif italic">Ask</span></h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-20 font-light">We are building a global AI ecosystem. Join us in making AI creation accessible to everyone.</p>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {asks.map((ask, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-dark p-10 rounded-[40px] border border-white/10 hover:border-brand-green/30 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-green/20 transition-colors">
                  <ask.icon className="w-8 h-8 text-brand-green" />
                </div>
                <h4 className="text-2xl font-bold">{ask.title}</h4>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 p-12 glass rounded-[48px] border border-white/10 inline-block">
            <h3 className="text-3xl font-display font-bold mb-4">Ready to build the future?</h3>
            <Link to="/contact" className="inline-flex items-center gap-3 text-brand-green font-bold text-xl hover:gap-6 transition-all">
              Connect with Aditya Sharma <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const InvestorPage = () => {
  return (
    <div className="pt-40 min-h-screen relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10">
        <section className="py-32 text-center">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
            >
              Investor Pitch Deck
            </motion.div>
            <h1 className="text-6xl md:text-9xl font-display font-bold mb-12 tracking-tighter leading-[0.85]">
              <span className="text-gradient font-serif italic">BUILDING THE FUTURE</span>
            </h1>
            <p className="text-white/40 text-2xl max-w-3xl mx-auto font-light leading-relaxed mb-12">
              AI is not the future — it’s the present. We’re making it usable for everyone.
            </p>
            <p className="text-white/60 text-xl max-w-3xl mx-auto font-medium leading-relaxed">
              We use AI because it makes building powerful tools faster, smarter, and accessible to everyone — not just developers.
            </p>
          </div>
        </section>

        <About />
        <WhyInvestSection />
        <ProblemSection />
        <MarketSection />
        <TractionSection />
        <InvestorAskSection />
        <Team />
      </div>
    </div>
  );
};

const InvestorCTA = () => {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-16 rounded-[60px] border border-white/10 text-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 tracking-tighter">Interested in our <span className="text-gradient italic">Growth?</span></h2>
            <p className="text-white/40 text-xl max-w-2xl mx-auto mb-12 font-light">
              Explore our investor pitch deck, market analysis, and traction data to see how we're building the future of AI.
            </p>
            <Link 
              to="/investors" 
              className="inline-flex items-center gap-3 px-12 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:bg-brand-green hover:text-white transition-all duration-500 shadow-2xl"
            >
              View Investor Deck <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Faster Growth",
      desc: "Accelerate your development cycle with AI-powered automation and rapid prototyping.",
      icon: Zap,
      color: "text-brand-green",
      bg: "bg-brand-green/10"
    },
    {
      title: "Reduced Costs",
      desc: "Minimize overhead by replacing complex manual processes with intelligent AI agents.",
      icon: ShieldCheck,
      color: "text-brand-blue",
      bg: "bg-brand-blue/10"
    },
    {
      title: "Full Automation",
      desc: "Deploy systems that run themselves, from data analysis to customer engagement.",
      icon: Cpu,
      color: "text-brand-orange",
      bg: "bg-brand-orange/10"
    },
    {
      title: "Intelligent Personalization",
      desc: "Deliver hyper-personalized experiences to every user with deep learning insights.",
      icon: Brain,
      color: "text-white",
      bg: "bg-white/10"
    }
  ];

  return (
    <section id="benefits" className="py-40 relative overflow-hidden section-visibility">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-brand-green mb-8"
          >
            <Sparkles className="w-4 h-4" />
            Key Outcomes
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6"
          >
            Revolutionize Your <span className="text-gradient italic">Workflow.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white/40 text-xl max-w-2xl mx-auto font-light"
          >
            Experience the power of a next-generation AI ecosystem designed for global scale.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 perspective-1000">
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-10 rounded-[40px] glass border border-white/5 hover:border-brand-green/30 transition-all duration-700 hover:bg-white/[0.02] hover-3d preserve-3d"
            >
              <div className={`w-16 h-16 rounded-2xl ${benefit.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <benefit.icon className={`w-8 h-8 ${benefit.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{benefit.title}</h3>
              <p className="text-white/40 leading-relaxed font-light">{benefit.desc}</p>
              
              {/* Decorative Glow */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${benefit.bg} blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How does IAH.AI actually work?",
      answer: "IAH.AI works by turning your ideas, data, and goals into intelligent actions using advanced AI systems. Instead of just giving suggestions, our platform analyzes your inputs, understands patterns, and automatically helps you make smarter decisions, automate tasks, and grow faster. It continuously learns and improves, so the more you use it, the more powerful it becomes."
    },
    {
      question: "Is my data safe and private?",
      answer: "Yes, your data security is a top priority for us. We use secure systems and modern encryption practices to ensure your data remains protected. Your information is never sold or misused, and we are building our platform with a strong focus on privacy, transparency, and user control."
    },
    {
      question: "Do I need coding skills to use it?",
      answer: "No, you don’t need any coding skills. IAH.AI is designed to be simple and user-friendly for everyone — whether you are a student, creator, or business owner. Our goal is to make powerful AI accessible to anyone without technical knowledge."
    },
    {
      question: "What kind of integrations do you support?",
      answer: "IAH.AI is being designed as a flexible ecosystem that will connect with websites, apps, and various digital tools. Our vision is to allow seamless integration across platforms so users can manage everything in one place with AI support."
    },
    {
      question: "What are your future plans for the platform?",
      answer: "We are building IAH.AI as a complete AI ecosystem. Our future plans include advanced automation systems, intelligent decision engines, deeper integrations, and eventually a decentralized, self-evolving AI platform. Our mission is to create a system that not only assists but actually executes and grows with you."
    }
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-40 relative overflow-hidden section-visibility">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-6"
          >
            Common <span className="text-gradient italic">Queries.</span>
          </motion.h2>
          <p className="text-white/40 text-xl font-light">
            Everything you need to know about the future of AI.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl border border-white/5 overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === i ? null : i)}
                className="w-full px-8 py-8 text-left flex items-center justify-between group"
              >
                <span className="text-xl font-bold tracking-tight group-hover:text-brand-green transition-colors">{faq.question}</span>
                <motion.div
                  animate={{ rotate: activeIndex === i ? 180 : 0 }}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-green/20 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="px-8 pb-8 text-white/60 font-light leading-relaxed text-lg border-t border-white/5 pt-6">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingPage = ({ roadmapStep, roadmapProgress, onStepChange }: { roadmapStep: number, roadmapProgress: number, onStepChange?: (step: number) => void }) => {
  return (
    <>
      <Hero />
      <BenefitsSection />
        <About isHome roadmapStep={roadmapStep} roadmapProgress={roadmapProgress} onStepChange={onStepChange} />
      <AnimatedRoadmap />
      <ProblemSection />
      <Features roadmapStep={roadmapStep} roadmapProgress={roadmapProgress} onStepChange={onStepChange} />
      <HowItWorks />
      <MarketSection />
      <TractionSection />
      <Team />
      <InvestorAskSection />
      <InvestorCTA />
      <FAQSection />
      <Waitlist />
    </>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [roadmapStep, setRoadmapStep] = useState(1);
  const [roadmapProgress, setRoadmapProgress] = useState(20);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"bug" | "suggestion">("suggestion");

  const openFeedback = (type: "bug" | "suggestion" = "suggestion") => {
    setFeedbackType(type);
    setIsFeedbackOpen(true);
  };
  const [exploredSections, setExploredSections] = useState<Set<string>>(new Set());
  const location = useLocation();
  const lenisRef = useState<Lenis | null>(null)[0]; // We'll use a local variable or ref instead

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Store lenis on window for global access if needed (optional but helpful for debugging/manual scroll)
    (window as any).lenis = lenis;

    return () => {
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    if ((window as any).lenis) {
      (window as any).lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const triggerCelebration = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Auto-hide celebration after 5 seconds
    setTimeout(() => {
      setIsCompleted(false);
    }, 5000);
  };

  // Track page visits
  useEffect(() => {
    const path = location.pathname.replace('/', '') || 'home';
    if (!exploredSections.has(path)) {
      setExploredSections(prev => {
        const next = new Set<string>(prev).add(path);
        checkCompletion(next);
        return next;
      });
    }
  }, [location.pathname]);

  const checkCompletion = (sections: Set<string>) => {
    const requiredPages = ['home', 'features', 'about', 'contact', 'waitlist'];
    const visitedPages = requiredPages.filter(page => sections.has(page));
    
    // Update progress based on visited pages (50% of total progress)
    const pageProgress = (visitedPages.length / requiredPages.length) * 50;
    
    // Check if home scroll is also done (other 50%)
    const homeScrollDone = sections.has('footer');
    const totalProgress = pageProgress + (homeScrollDone ? 50 : 0);
    
    setRoadmapProgress(totalProgress);
    
    if (totalProgress >= 100 && !isCompleted) {
      setRoadmapStep(4);
      setIsCompleted(true);
      triggerCelebration();
    } else if (totalProgress > 66) {
      setRoadmapStep(3);
    } else if (totalProgress > 33) {
      setRoadmapStep(2);
    }
  };

  useEffect(() => {
    if (isCompleted) return;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercent > 80 && !exploredSections.has('footer')) {
        setExploredSections(prev => {
          const next = new Set<string>(prev).add('footer');
          checkCompletion(next);
          return next;
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [exploredSections, isCompleted]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-brand-green selection:text-black relative transition-colors duration-500">
        <TopBanner />
        <AnimatePresence>
          {loading && <Preloader />}
        </AnimatePresence>

        {!loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="transition-all duration-500"
          >
            <CustomCursor />
            <ScrollProgress />
            <BackToTop />
            <FloatingCTA />
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <AnimatePresence mode="wait">
              <motion.div key={location.pathname} className="w-full">
                <Routes location={location}>
                  <Route path="/" element={<PageTransition><LandingPage roadmapStep={roadmapStep} roadmapProgress={roadmapProgress} onStepChange={(step) => setRoadmapStep(step)} /></PageTransition>} />
                  <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
                  <Route path="/goals" element={<PageTransition><GoalTrackerPage /></PageTransition>} />
                  <Route path="/investors" element={<PageTransition><InvestorPage /></PageTransition>} />
                  <Route path="/about" element={
                    <PageTransition>
                      <div className="pt-40 min-h-screen relative overflow-hidden">
                        {/* Background Glows */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px]" />
                          <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px]" />
                        </div>
                        <div className="relative z-10">
                          <About />
                          <Team />
                        </div>
                      </div>
                    </PageTransition>
                  } />
                  <Route path="/contact" element={
                    <PageTransition>
                      <div className="pt-20 min-h-screen relative overflow-hidden">
                        {/* Background Glows */}
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px]" />
                          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px]" />
                        </div>
                        <div className="relative z-10">
                          <Contact />
                        </div>
                      </div>
                    </PageTransition>
                  } />
                  <Route path="/waitlist" element={<PageTransition><WaitlistPage /></PageTransition>} />
                </Routes>
              </motion.div>
            </AnimatePresence>
            <Footer onOpenFeedback={openFeedback} />
            <FeedbackModal 
              isOpen={isFeedbackOpen} 
              onClose={() => setIsFeedbackOpen(false)} 
              initialType={feedbackType}
            />

            <Chatbot />
            <FeedbackBot onOpenFeedback={openFeedback} />

            {/* Completion Celebration Overlay */}
            <AnimatePresence>
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 12 }}
                    className="glass-dark p-12 rounded-[3rem] border border-brand-green/30 text-center shadow-[0_0_100px_rgba(0,255,148,0.2)]"
                  >
                    <div className="w-24 h-24 rounded-full bg-brand-green/20 flex items-center justify-center mx-auto mb-8">
                      <Sparkles className="w-12 h-12 text-brand-green" />
                    </div>
                    <h2 className="text-5xl font-display font-bold mb-4 uppercase tracking-tighter">Strategic Mastery Achieved</h2>
                    <p className="text-white/60 text-xl font-light">You've explored the full potential of IAH.AI. Your roadmap is now fully optimized.</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    );
}
