'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

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
            <Link href="/programs" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              Programs
            </Link>
            <a href="/#how-it-works" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              How It Works
            </a>
            <a href="/#transformations" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              Transformations
            </a>
            <Link href="/marketplace" className="relative text-white/70 hover:text-brand-gold transition-colors underline-gold flex items-center gap-1.5">
              Marketplace
              <span className="text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
                Soon
              </span>
            </Link>
            <Link href="/about" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              About
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-brand-gold transition-colors underline-gold">
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
              <button className="px-3 py-1 text-sm font-medium text-brand-gold">EN</button>
              <span className="text-white/30">|</span>
              <button className="px-3 py-1 text-sm font-medium text-white/50 hover:text-brand-gold transition-colors">AR</button>
            </div>

            {/* Account / Dashboard Button */}
            {!loading && (
              user ? (
                <Link
                  href={`/dashboard/${user.profile?.role ?? 'client'}`}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                  style={{
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.38)',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201,168,76,0.08)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.65)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.38)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300"
                  style={{
                    color: '#C9A84C',
                    border: '1px solid rgba(201,168,76,0.38)',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201,168,76,0.08)';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.65)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,168,76,0.38)';
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Account
                </Link>
              )
            )}

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
            <Link href="/programs" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              Programs
            </Link>
            <a href="/#how-it-works" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              How It Works
            </a>
            <a href="/#transformations" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              Transformations
            </a>
            <Link href="/marketplace" className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              Marketplace
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
                Soon
              </span>
            </Link>
            <Link href="/about" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-white/70 hover:text-brand-gold transition-colors">
              Contact
            </Link>
            <div className="px-4 py-2">
              {!loading && (
                user ? (
                  <Link href={`/dashboard/${user.profile?.role ?? 'client'}`} className="btn-gold-outline w-full text-center text-sm block">
                    Dashboard
                  </Link>
                ) : (
                  <Link href="/login" className="btn-gold-outline w-full text-center text-sm block">
                    Account
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
