
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { ProgressiveImage } from './ProgressiveImage';

const NAV_LINKS = [
  { path: '/', label: 'Trang chủ' },
  { path: '/about', label: 'Giới thiệu' },
  { path: '/services', label: 'Dịch vụ' },
  { path: '/projects', label: 'Dự án' },
  { path: '/pricing', label: 'Bảng giá' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Liên hệ' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    // Nếu đang ở trang chủ và bấm vào link trang chủ (hoặc logo), cuộn lên đầu
    if (path === '/' && location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Luôn đóng menu mobile khi click
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileMenuOpen
          ? 'bg-[rgba(5,5,9,0.94)] backdrop-blur-md border-b border-white/5 py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={(e) => handleLinkClick(e, '/')}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform border border-white/10">
              <ProgressiveImage
                src="/images/logo.webp"
                alt="HEONA MEDIA"
                className="w-full h-full object-cover"
                width="40"
                height="40"
                delay={0}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-sm uppercase tracking-[0.08em] text-white font-bold leading-none mb-1">
                HEONA MEDIA
              </span>
              <span className="text-[10px] text-textMuted uppercase tracking-[0.12em] leading-none">
                Event • Personal Signature Brand
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`px-3 py-2 rounded-full transition-all duration-300 hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary ${location.pathname === link.path ? 'text-white' : 'text-textMuted'
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-5">
            {/* Hotline Desktop */}
            <a href="tel:0931899427" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Phone size={16} className="animate-pulse-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-textMuted group-hover:text-secondary transition-colors">Hotline</span>
                <span className="text-sm font-bold text-white leading-none">0931 899 427</span>
              </div>
            </a>

            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#5a2dff] via-primary to-secondary text-white text-sm font-bold hover:from-secondary hover:to-secondary hover:shadow-lg hover:shadow-secondary/25 hover:-translate-y-0.5 transition-all duration-300"
            >
              Nhận báo giá
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden w-9 h-9 rounded-full border border-borderSubtle flex items-center justify-center text-white hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mở menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
            }`}
        >
          <nav className="flex flex-col gap-1 pt-3 border-t border-white/5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                className={`block py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                    ? 'bg-white/5 text-white'
                    : 'text-textMuted hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-secondary'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-3 px-2 pb-2">
              <a
                href="tel:0931899427"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/5 text-white text-sm font-bold border border-white/10 hover:bg-primary/20 hover:border-primary/50 transition-all"
              >
                <Phone size={16} /> 0931 899 427
              </a>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold hover:from-secondary hover:to-secondary transition-all"
              >
                Nhận báo giá
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
