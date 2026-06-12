import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingMenu } from './FloatingMenu';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Tech Elements */}
      <div className="bg-tech-grid" />
      
      {/* Ambient Light Orbs */}
      <div className="ambient-glow w-[500px] h-[500px] bg-primary/10 top-[-10%] left-[-10%] animate-pulse-slow" />
      <div className="ambient-glow w-[600px] h-[600px] bg-secondary/5 bottom-[-20%] right-[-10%] animate-float" />
      <div className="ambient-glow w-[300px] h-[300px] bg-[#4221c4]/10 top-[40%] left-[30%] opacity-50 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      <Header />
      <main className="flex-grow pt-20 md:pt-24 animate-fade-in relative z-10 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <FloatingMenu />
    </div>
  );
};