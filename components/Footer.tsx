
import React from 'react';
import { Facebook, Youtube, Phone, Mail } from 'lucide-react';
import { useContent } from '../context/ContentContext';

// Zalo Icon Component - Exported for reuse
export const ZaloIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    aria-hidden="true"
  >
    <path d="M9 10C9 7.79086 10.7909 6 13 6H35C37.2091 6 39 7.79086 39 10V38C39 40.2091 37.2091 42 35 42H13C10.7909 42 9 40.2091 9 38V10Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 20H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 28H30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M30 20L18 28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const Footer: React.FC = () => {
  const { contactInfo } = useContent();

  return (
    <footer className="border-t border-white/5 bg-[#050507] py-16 mt-20">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex flex-col gap-6">
            <div>
                <div className="font-heading font-bold text-base tracking-wide text-white">© HEONA MEDIA</div>
                <div className="text-sm text-textMuted uppercase tracking-wider mt-2">Tổ chức sự kiện –  Media</div>
            </div>

            <div className="flex flex-col gap-3">
                 <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-sm text-textMuted hover:text-primary transition-colors w-fit group">
                    <Phone size={16} className="group-hover:text-primary transition-colors" />
                    <span>{contactInfo.phone}</span>
                 </a>
                 <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-sm text-textMuted hover:text-primary transition-colors w-fit group">
                    <Mail size={16} className="group-hover:text-primary transition-colors" />
                    <span>{contactInfo.email}</span>
                 </a>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4">
            <span className="text-sm text-textMuted">Theo dõi chúng tôi:</span>
            <div className="flex gap-4">
              <a 
                href={contactInfo.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-borderSubtle flex items-center justify-center text-textMuted hover:text-white hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300" 
                title="Facebook"
                aria-label="Ghé thăm Fanpage Facebook của Heona Media"
              >
                  <Facebook size={18} />
              </a>
              <a 
                href={contactInfo.zalo} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full border border-borderSubtle flex items-center justify-center text-textMuted hover:text-white hover:border-primary hover:bg-primary/10 hover:scale-110 transition-all duration-300" 
                title="Zalo"
                aria-label="Chat Zalo với Heona Media"
              >
                  <ZaloIcon size={18} />
              </a>
              {contactInfo.youtube && (
                <a 
                  href={contactInfo.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-10 h-10 rounded-full border border-borderSubtle flex items-center justify-center text-textMuted hover:text-white hover:border-red-600 hover:bg-red-600/10 hover:scale-110 transition-all duration-300" 
                  title="Youtube"
                  aria-label="Đăng ký kênh Youtube Heona Media"
                >
                    <Youtube size={18} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
