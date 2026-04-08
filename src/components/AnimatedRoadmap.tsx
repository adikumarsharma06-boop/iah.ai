import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Globe, 
  Zap, 
  Target, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Rocket,
  ShieldCheck,
  Cpu,
  Network
} from 'lucide-react';

const roadmapSteps = [
  {
    id: 1,
    phase: "Phase 01",
    title: "Neural Foundation",
    description: "Building the core AI engine and foundational architecture that powers our ecosystem. We focus on creating a strong base for learning, automation, and scalability.",
    icon: Brain,
    color: "from-brand-blue to-cyan-400",
    glow: "shadow-[0_0_50px_rgba(0,163,255,0.3)]",
    status: "completed"
  },
  {
    id: 2,
    phase: "Phase 02",
    title: "Global Intelligent Expansion",
    description: "Expanding AI capabilities into automation systems and smart decision-making tools that adapt across different industries and users worldwide.",
    icon: Globe,
    color: "from-brand-green to-emerald-400",
    glow: "shadow-[0_0_50px_rgba(0,255,148,0.3)]",
    status: "current"
  },
  {
    id: 3,
    phase: "Phase 03",
    title: "Synergy Ecosystem",
    description: "Integrating multiple platforms and services into one unified AI ecosystem, allowing seamless interaction between systems and intelligent workflows.",
    icon: Zap,
    color: "from-brand-orange to-amber-400",
    glow: "shadow-[0_0_50px_rgba(242,125,38,0.3)]",
    status: "upcoming"
  },
  {
    id: 4,
    phase: "Phase 04",
    title: "Decentralized Evolution",
    description: "Creating a self-evolving, autonomous AI system that continuously improves and operates independently, representing the future of intelligent technology.",
    icon: Target,
    color: "from-purple-500 to-pink-500",
    glow: "shadow-[0_0_50px_rgba(168,85,247,0.3)]",
    status: "upcoming"
  }
];

export const AnimatedRoadmap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
  };

  return (
    <section ref={containerRef} className="py-40 relative overflow-hidden bg-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-white/5 via-white/10 to-white/5" />
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-brand-blue/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-brand-green/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
          >
            <Rocket className="w-3 h-3" /> The Strategic Path
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-display font-bold mb-8 tracking-tighter"
          >
            Our Roadmap <span className="text-gradient italic">Evolution.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-white/40 max-w-2xl mx-auto text-xl font-light leading-relaxed"
          >
            Experience the dynamic evolution of our strategic journey as we build the future of intelligent systems.
          </motion.p>
        </div>

        <div className="relative">
          {/* Animated Progress Line */}
          <motion.div 
            style={{ scaleY, originY: 0 }}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-1 h-full bg-gradient-to-b from-brand-blue via-brand-green to-brand-orange rounded-full z-0"
          />

          <div className="space-y-40">
            {roadmapSteps.map((step, idx) => (
              <div key={step.id} className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                {/* Content Side */}
                <motion.div 
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 w-full"
                >
                  <div className={`glass-dark p-10 rounded-[3rem] border border-white/10 relative group hover:border-white/20 transition-all duration-700 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />
                    
                    <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] mb-6 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <span className="text-white/60">{step.phase}</span>
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      <span className={step.status === 'completed' ? 'text-brand-green' : step.status === 'current' ? 'text-brand-blue' : 'text-white/20'}>
                        {step.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-3xl md:text-4xl font-display font-bold mb-6 tracking-tight group-hover:text-white transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-white/40 text-lg font-light leading-relaxed mb-8 group-hover:text-white/60 transition-colors">
                      {step.description}
                    </p>

                    <div className={`flex items-center gap-4 ${idx % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Cpu className="w-4 h-4 text-white/20" />
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                          <Network className="w-4 h-4 text-white/20" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Center Node */}
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`w-20 h-20 rounded-3xl bg-bg border-2 border-white/10 flex items-center justify-center relative group ${step.glow}`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-20 rounded-3xl blur-xl group-hover:opacity-40 transition-opacity`} />
                    <step.icon className={`w-10 h-10 relative z-10 ${step.status === 'completed' ? 'text-brand-green' : step.status === 'current' ? 'text-brand-blue' : 'text-white/20'}`} />
                    
                    {step.status === 'completed' && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-green rounded-full flex items-center justify-center border-2 border-bg">
                        <CheckCircle2 className="w-3 h-3 text-black" />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Spacer Side */}
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-40 text-center"
        >
          <div className="glass-dark p-12 rounded-[4rem] border border-white/10 inline-block relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Sparkles className="w-12 h-12 text-brand-green mx-auto mb-8 animate-pulse" />
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight">Ready to join the evolution?</h3>
            <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto font-light">Be part of the next phase of intelligent systems and help us shape the future.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={handleWaitlistClick}
                className="px-10 py-5 bg-brand-green text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_15px_40px_rgba(0,255,148,0.2)]"
              >
                Join the Waitlist
              </button>
              <button 
                onClick={() => navigate('/features')}
                className="px-10 py-5 glass rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Explore Features
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
