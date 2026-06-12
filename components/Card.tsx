import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noHover = false }) => {
  return (
    <div
      className={`relative glass-panel rounded-xl p-6 transition-all duration-500 group ${
        !noHover 
          ? 'bento-hover' 
          : ''
      } ${className}`}
    >
      {/* Tech Corner Accents - visible on hover */}
      {!noHover && (
        <>
          {/* Top Left */}
          <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-tl-lg" />
          {/* Bottom Right */}
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-br-lg" />
          
          {/* Scanner line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.03] to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000 pointer-events-none" />
        </>
      )}
      
      {children}
    </div>
  );
};

export const Pill: React.FC<{ text: string }> = ({ text }) => (
  <span className="px-3 py-1.5 rounded border border-white/10 bg-white/5 backdrop-blur text-[10px] font-bold text-textMuted uppercase tracking-widest shadow-sm">
    {text}
  </span>
);