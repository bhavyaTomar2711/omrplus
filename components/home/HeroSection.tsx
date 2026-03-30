'use client';

export default function HeroSection() {
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

        {/* Professional Overlay - Left side darker */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent"></div>
      </div>

      {/* Content - Less Desktop Width, More Focused */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-80px)]">
          {/* Left Content - Professional & Clean */}
          <div className="flex flex-col justify-center space-y-6">
            {/* Main Headline - Professional */}
            <div className="space-y-0">
              {/* Headline - Professional */}
              <div className="space-y-1">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-medium text-white leading-tight">
                  UNLEASH YOUR
                </h1>
                <h2 className="text-7xl md:text-7xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold leading-tight">
                  POTENTIAL
                </h2>
              </div>
            </div>

            {/* Subtext - Professional tone */}
            <p className="text-sm text-white/60 max-w-lg font-light leading-relaxed">
              Join a community where goals are crushed, strength is built, and potential becomes power.
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <a
                href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-outline inline-block px-8 py-3 text-base"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Right Side - Video fills space */}
          <div className="hidden lg:block relative h-full min-h-[500px]"></div>
        </div>
      </div>

      {/* Fade at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-black to-transparent z-20"></div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <svg className="w-5 h-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
