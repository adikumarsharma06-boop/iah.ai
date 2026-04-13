import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  glow?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 'md', 
  showText = true,
  glow = true,
}) => {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex flex-col">
        <div className="relative">
          {glow && (
            <div className="absolute -inset-2 bg-brand-green/10 blur-lg rounded-full animate-pulse pointer-events-none" />
          )}
          <span className={`${textSizes[size]} font-display font-black tracking-tighter leading-none relative z-10`}>
            IAH.AI
          </span>
        </div>
        <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/30 relative z-10">
          Ecosystem
        </span>
      </div>
    </div>
  );
};
