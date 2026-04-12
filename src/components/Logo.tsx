import React from 'react';
import { motion } from 'motion/react';
import logo from "../assets/logo.png";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 'md', 
  showText = false,
  glow = true,
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`${sizes[size]} relative flex items-center justify-center`}
      >
        {glow && (
          <div className="absolute inset-0 bg-brand-green/20 blur-xl rounded-full animate-pulse" />
        )}
        <img 
          src={logo} 
          alt="IAH.AI Logo" 
          className="w-full h-full object-contain relative z-10" 
        />
      </motion.div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-display font-black tracking-tighter leading-none`}>
            IAH.AI
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/30">
            Ecosystem
          </span>
        </div>
      )}
    </div>
  );
};
