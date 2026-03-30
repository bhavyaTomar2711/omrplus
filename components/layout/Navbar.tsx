'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
        ? 'bg-brand-black/95 backdrop-blur-md shadow-lg shadow-brand-gold/5 border-b border-brand-gold/10'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Bigger */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-30 h-20 flex items-center justify-center">
              <img
                src="https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774866904/B9EBAC3E-ECDA-4CA9-81C7-F14DCC3E7A9D_1_-Photoroom_s5ro4z.png"
                alt="OMR+ Logo"
                className="h-15 w-auto object-contain group-hover:opacity-80 transition-opacity"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#programs" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              Programs
            </a>
            <a href="#how-it-works" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              How It Works
            </a>
            <a href="#transformations" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              Transformations
            </a>
            <a href="#" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              About
            </a>
            <a href="#" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              Contact
            </a>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <button className="px-3 py-1 text-sm font-medium text-brand-gold">EN</button>
              <span className="text-white/30">|</span>
              <button className="px-3 py-1 text-sm font-medium text-white/50 hover:text-brand-gold transition-colors">AR</button>
            </div>

            {/* CTA Button */}
            <a
              href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block btn-gold text-sm"
            >
              Book Consultation
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white/70 hover:text-brand-gold transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <a href="#programs" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              Programs
            </a>
            <a href="#how-it-works" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              How It Works
            </a>
            <a href="#transformations" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              Transformations
            </a>
            <a href="#" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              About
            </a>
            <a href="#" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              Contact
            </a>
            <div className="px-4 py-2">
              <a
                href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full text-center text-sm"
              >
                Book Consultation
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
