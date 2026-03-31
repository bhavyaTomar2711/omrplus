import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const categories = [
  { name: 'Supplements', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  )},
  { name: 'Healthy Snacks', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5M12 8.25v-1.5m0 0c-1.354 0-2.7.055-4.024.166C6.845 6.885 6 7.647 6 8.55V6.75m6 1.5V6.75M12 8.25V6.75" />
    </svg>
  )},
  { name: 'Nutrition Items', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
    </svg>
  )},
  { name: 'Ebooks & Guides', icon: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  )},
];

export default function MarketplacePage() {
  return (
    <>
      <style>{`
        .mkt-page { background: #0B0B0B; }
        .mkt-hero {
          padding: 9rem 0 6rem;
          position: relative; overflow: hidden;
        }
        .mkt-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 35%, rgba(201,168,76,0.07) 0%, transparent 58%);
          pointer-events: none;
        }
        .mkt-grain {
          position: absolute; inset: 0; opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px; pointer-events: none;
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.5; }
          50%  { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .mkt-pulse {
          position: absolute; inset: -20px; border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.2);
          animation: pulse-ring 3s ease-in-out infinite;
        }
        .mkt-pulse-2 {
          position: absolute; inset: -40px; border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.1);
          animation: pulse-ring 3s ease-in-out infinite 0.5s;
        }
        .mkt-cat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          transition: border-color 0.3s ease, background 0.3s ease;
        }
        .mkt-cat-card:hover {
          border-color: rgba(201,168,76,0.18);
          background: rgba(255,255,255,0.045);
        }
        .mkt-notify-btn {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.9rem 2.2rem;
          font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid rgba(201,168,76,0.4);
          background: transparent; border-radius: 10px;
          cursor: pointer;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .mkt-notify-btn:hover {
          background: rgba(201,168,76,0.07);
          border-color: rgba(201,168,76,0.7);
        }
      `}</style>

      <div className="mkt-page flex flex-col min-h-screen">
        <Navbar />

        <section className="mkt-hero flex-1">
          <div className="mkt-glow" />
          <div className="mkt-grain" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            {/* Coming soon badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-10 rounded-full"
              style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#C9A84C' }}>
                Coming Soon
              </span>
            </div>

            {/* Animated icon */}
            <div className="relative w-24 h-24 mx-auto mb-10">
              <div className="mkt-pulse" />
              <div className="mkt-pulse-2" />
              <div className="relative w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.22)' }}>
                <svg className="w-10 h-10" style={{ color: '#C9A84C' }} fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
              The OMR+{' '}
              <span style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C76A, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Marketplace
              </span>
            </h1>

            <p className="text-white/40 text-base leading-[1.9] max-w-xl mx-auto mb-10">
              Premium supplements, healthy snacks, nutrition essentials, and digital guides —
              all curated for performance. Launching soon exclusively for OMR+ members.
            </p>

            {/* Notify CTA */}
            <a
              href="https://wa.me/?text=I%20want%20to%20be%20notified%20when%20the%20OMR%2B%20marketplace%20launches"
              target="_blank" rel="noopener noreferrer"
              className="mkt-notify-btn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
              Notify Me at Launch
            </a>

            {/* Divider */}
            <div className="h-px max-w-sm mx-auto my-14"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />

            {/* What's coming */}
            <div className="mb-8">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.25)' }}>
                What&apos;s Coming
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {categories.map((cat, i) => (
                  <div key={i} className="mkt-cat-card flex-col text-center" style={{ flexDirection: 'column' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.14)', color: '#C9A84C' }}>
                      {cat.icon}
                    </div>
                    <p className="text-xs font-medium text-white/60">{cat.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Members only note */}
            <p className="text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.2)' }}>
              <span style={{ color: 'rgba(201,168,76,0.4)' }}>✓</span>{' '}
              Exclusive member pricing &nbsp;·&nbsp;
              <span style={{ color: 'rgba(201,168,76,0.4)' }}>✓</span>{' '}
              Curated for performance &nbsp;·&nbsp;
              <span style={{ color: 'rgba(201,168,76,0.4)' }}>✓</span>{' '}
              Digital downloads included
            </p>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
