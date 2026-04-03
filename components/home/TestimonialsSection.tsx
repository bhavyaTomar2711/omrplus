'use client';

import { useEffect, useRef } from 'react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const VIDEO_URL =
  'https://res.cloudinary.com/dqiuwzvfb/video/upload/v1774890621/Video_Project_d73r7c.mp4';
const VIDEO_URL_MOBILE =
  'https://res.cloudinary.com/dqiuwzvfb/video/upload/v1775201565/5752503-uhd_2160_3840_25fps_1_tgqdr9.mp4';

const testimonials = [
  {
    id: 1,
    number: '01',
    quote:
      'OMR+ completely transformed my journey. The personalized meal plans and trainer support made every week feel structured and achievable. Lost 20kg and gained a completely different relationship with my body.',
    name: 'Member 01',
    role: 'Fat Loss Program',
    duration: '12 weeks',
    rating: 5,
  },
  {
    id: 2,
    number: '02',
    quote:
      'The professionalism here is unmatched. My trainer adjusted my program every single week based on real data. It never felt like a generic plan — it felt built just for me.',
    name: 'Member 02',
    role: 'Muscle Building Program',
    duration: '16 weeks',
    rating: 5,
  },
  {
    id: 3,
    number: '03',
    quote:
      'Skeptical at first, but within six weeks the results were undeniable. The coaching, the accountability, and the precision of the nutrition plan — nothing else compares.',
    name: 'Member 03',
    role: 'Summer Body Program',
    duration: '12 weeks',
    rating: 5,
  },
  {
    id: 4,
    number: '04',
    quote:
      "Worth every riyal. When I wanted to quit at week four, my coach was there with the right adjustment and the right words. Best investment I've made in myself.",
    name: 'Member 04',
    role: 'Elite Coaching',
    duration: '20 weeks',
    rating: 5,
  },
];

const StarIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
  </svg>
);

export default function TestimonialsSection() {
  const bgRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const section = bgRef.current.closest('section') as HTMLElement;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = -rect.top / (section.offsetHeight + window.innerHeight);
      bgRef.current.style.transform = `translateY(${progress * 70}px) scale(1.1)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        /* ── Section ── */
        .tm-section {
          position: relative;
          overflow: hidden;
          padding: 7rem 0 8rem;
          background: #080808;
        }

        /* ── Video layer ── */
        .tm-video-wrap {
          position: absolute;
          inset: -10%;
          will-change: transform;
          transform: scale(1.1);
        }
        .tm-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.45) saturate(0.6);
        }

        /* ── Cinematic overlays ── */
        .tm-ov-top {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.72) 0%,
            rgba(0,0,0,0.18) 30%,
            rgba(0,0,0,0.18) 70%,
            rgba(0,0,0,0.78) 100%
          );
          pointer-events: none;
          z-index: 1;
        }
        .tm-ov-sides {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%);
          pointer-events: none;
          z-index: 1;
        }
        .tm-ov-gold {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 55% 50%, rgba(201,168,76,0.05) 0%, transparent 55%);
          pointer-events: none;
          z-index: 1;
        }

        /* ── Grain ── */
        .tm-grain {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }

        /* ── Testimonial card ── */
        .tm-card {
          position: relative;
          background: rgba(0, 0, 0, 0.52);
          backdrop-filter: blur(20px) saturate(140%);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 8px 36px rgba(0, 0, 0, 0.5);
          border-radius: 20px;
          padding: 2.25rem 2rem 2rem;
          transition:
            transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease,
            box-shadow 0.4s ease;
          overflow: visible;
        }
        .tm-card:hover {
          transform: translateY(-8px);
          border-color: rgba(201, 168, 76, 0.2);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.07),
            0 20px 56px rgba(0, 0, 0, 0.65);
        }

        /* ── Number badge ── */
        @keyframes badgeIn {
          from { opacity: 0; transform: scale(0.6); }
          to   { opacity: 1; transform: scale(1); }
        }
        .tm-badge {
          position: absolute;
          top: -14px;
          left: 22px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(10, 10, 10, 0.85);
          border: 1px solid rgba(201, 168, 76, 0.35);
          box-shadow:
            0 0 12px rgba(201, 168, 76, 0.1),
            inset 0 1px 0 rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: #C9A84C;
          animation: badgeIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        /* ── CTA button ── */
        .tm-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2.5rem;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid rgba(201, 168, 76, 0.38);
          background: transparent;
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.35s ease, border-color 0.35s ease, transform 0.35s ease, box-shadow 0.35s ease;
        }
        .tm-btn:hover {
          background: rgba(201, 168, 76, 0.07);
          border-color: rgba(201, 168, 76, 0.65);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201, 168, 76, 0.1);
        }
      `}</style>

      <section className="tm-section">
        {/* Video background — desktop */}
        <div ref={bgRef} className="tm-video-wrap hidden sm:block">
          <video
            ref={videoRef}
            className="tm-video"
            src={VIDEO_URL}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        {/* Video background — mobile portrait */}
        <div className="tm-video-wrap sm:hidden" style={{ inset: 0, transform: 'none' }}>
          <video
            className="tm-video"
            src={VIDEO_URL_MOBILE}
            autoPlay
            muted
            loop
            playsInline
            style={{ filter: 'brightness(0.32) saturate(0.65)' }}
          />
        </div>

        {/* Overlays */}
        <div className="tm-ov-top" />
        <div className="tm-ov-sides" />
        <div className="tm-ov-gold" />
        <div className="tm-grain" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <AnimateOnScroll className="text-center mb-20">
            <div
              className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-7 rounded-full"
              style={{
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.18)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
              <span
                className="text-xs font-semibold tracking-[0.2em] uppercase"
                style={{ color: '#C9A84C' }}
              >
                Member Stories
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 tracking-tight leading-[1.1]">
              What Our{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #C9A84C 0%, #E8C76A 50%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Members Say
              </span>
            </h2>

            <p className="text-white/38 max-w-md mx-auto text-base leading-relaxed tracking-wide">
              Real feedback from members who committed to the process
              and came out the other side transformed.
            </p>
          </AnimateOnScroll>

          {/* Testimonials grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-20">
            {testimonials.map((t, idx) => (
              <AnimateOnScroll key={t.id} delay={idx * 120}>
                <div className="tm-card">
                  {/* Number badge */}
                  <div className="tm-badge">{t.number}</div>

                  {/* Stars */}
                  <div
                    className="flex gap-1 mb-5"
                    style={{ color: 'rgba(201,168,76,0.65)' }}
                  >
                    {[...Array(t.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p
                    className="text-sm leading-[1.85] mb-6 tracking-wide"
                    style={{ color: 'rgba(255,255,255,0.62)', fontStyle: 'italic' }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>

                  {/* Divider */}
                  <div
                    className="h-px w-full mb-5"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(201,168,76,0.18), rgba(255,255,255,0.05), transparent)',
                    }}
                  />

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white/80 tracking-tight">
                        {t.name}
                      </p>
                      <p
                        className="text-[11px] mt-0.5 tracking-wide"
                        style={{ color: 'rgba(201,168,76,0.55)' }}
                      >
                        {t.role}
                      </p>
                    </div>
                    <div
                      className="text-[10px] font-medium tracking-[0.14em] uppercase px-3 py-1 rounded-full"
                      style={{
                        color: 'rgba(255,255,255,0.3)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        background: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      {t.duration}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>


        </div>
      </section>
    </>
  );
}
