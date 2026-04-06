'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative w-full min-h-screen bg-brand-black overflow-hidden flex items-center pt-20">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Crect fill='%230A0A0A' width='1920' height='1080'/%3E%3C/svg%3E"
        >
          <source
            src="https://res.cloudinary.com/dqiuwzvfb/video/upload/v1774881891/Untitled_1_tpbahv.mp4"
            type="video/mp4"
          />
        </video>

        {/* Desktop overlay - left side darker */}
        <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25"></div>
        {/* Mobile overlay - heavier dark for readability */}
        <div className="sm:hidden absolute inset-0 bg-black/70"></div>
      </div>

      {/* Content - Less Desktop Width, More Focused */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left Content */}
          <div className="flex flex-col justify-center sm:items-start sm:text-left sm:space-y-6">

            {/* ── MOBILE HERO ── */}
            <div className="sm:hidden flex flex-col items-center text-center px-2" style={{ gap: '1.25rem' }}>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.22)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase" style={{ color: '#C9A84C' }}>
                  {t('hero.badge')}
                </span>
              </div>

              {/* Headline */}
              <div style={{ lineHeight: 1.0 }}>
                <div className="text-[4.5rem] font-black tracking-tight text-white uppercase" style={{ letterSpacing: '-0.02em' }}>
                  {t('hero.mobileHeadline1')}
                </div>
                {t('hero.mobileHeadline2') && (
                  <div className="text-[4.5rem] font-black tracking-tight text-white uppercase" style={{ letterSpacing: '-0.02em' }}>
                    {t('hero.mobileHeadline2')}
                  </div>
                )}
                <div className="text-[4.8rem] font-black uppercase" style={{
                  letterSpacing: '-0.02em',
                  background: 'linear-gradient(135deg, #C9A84C 0%, #F0D878 50%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {t('hero.headline2')}
                </div>
              </div>

              {/* Thin gold divider */}
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4))' }} />
                <span className="text-[10px] tracking-[0.25em] uppercase" style={{ color: 'rgba(201,168,76,0.5)' }}>OMR+</span>
                <div className="h-px flex-1 max-w-[60px]" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.4), transparent)' }} />
              </div>

              {/* Subtext */}
              <p dir="auto" className="text-[15px] leading-relaxed max-w-[300px]" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 300 }}>
                {t('hero.subtext')}
              </p>

              {/* CTA */}
              <a href="/pricing"
                className="inline-flex items-center gap-3 px-10 py-4 rounded-xl text-base font-bold tracking-widest uppercase transition-all"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C, #E5C76B)',
                  color: '#0A0A0A',
                  boxShadow: '0 8px 28px rgba(201,168,76,0.25)',
                }}>
                {t('hero.cta')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </a>

              {/* Trust line */}
              <p dir="auto" className="text-[11px] tracking-[0.18em] uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {t('hero.trust')}
              </p>
            </div>

            {/* ── DESKTOP HERO (unchanged) ── */}
            <div className="hidden sm:flex flex-col space-y-6">
              <div className="space-y-1">
                <h1 dir="auto" className="text-6xl md:text-7xl lg:text-8xl font-medium text-white leading-tight">
                  {t('hero.headline1')}
                </h1>
                <h2 dir="auto" className="text-7xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold leading-tight">
                  {t('hero.headline2')}
                </h2>
              </div>
              <p dir="auto" className="text-sm text-white/60 max-w-lg font-light leading-relaxed">
                {t('hero.subtext')}
              </p>
              <div className="pt-2">
                <a href="/pricing" className="btn-gold-outline inline-block px-8 py-3 text-base">
                  {t('hero.cta')}
                </a>
              </div>
            </div>

          </div>

          {/* Right Side - Video fills space */}
          <div className="hidden lg:block relative h-full min-h-[500px]"></div>
        </div>
      </div>

      {/* Fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-black to-transparent z-20"></div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
