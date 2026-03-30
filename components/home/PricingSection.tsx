'use client';

import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const plans = [
  {
    id: 1,
    name: 'Plan Only',
    tagline: 'Self-paced structure',
    price: '149',
    currency: 'SAR',
    period: 'mo',
    description: 'Get a fully customized meal or workout plan built around your body, goals, and lifestyle.',
    featured: false,
    cta: 'Get Started',
    features: [
      'Custom meal plan or workout plan',
      'Personalized to your goals',
      'Dietary restrictions included',
      'Weekly plan updates',
      'PDF download access',
    ],
  },
  {
    id: 2,
    name: 'Full Coaching',
    tagline: 'Most chosen program',
    price: '349',
    currency: 'SAR',
    period: 'mo',
    description: 'Complete coaching experience — custom plans, weekly check-ins, and direct access to your trainer.',
    featured: true,
    cta: 'Start Coaching',
    features: [
      'Custom meal plan + workout plan',
      'Dedicated personal trainer',
      'Weekly 1-on-1 check-ins',
      'Real-time messaging with coach',
      'Progress tracking & adjustments',
      'InBody analysis support',
      'Priority plan updates',
    ],
  },
  {
    id: 3,
    name: 'Elite',
    tagline: 'Maximum results',
    price: '549',
    currency: 'SAR',
    period: 'mo',
    description: 'The full OMR+ experience — elite coaching with premium add-ons for those who want the best.',
    featured: false,
    cta: 'Go Elite',
    features: [
      'Everything in Full Coaching',
      'Unlimited coach messages',
      'Bi-weekly video consultations',
      'Supplement guidance',
      'Competition prep support',
      'Priority onboarding',
    ],
  },
];

export default function PricingSection() {
  return (
    <>
      <style>{`
        .pricing-section {
          background: #0B0B0B;
          position: relative;
          overflow: hidden;
          padding: 7rem 0;
        }

        /* Grain texture */
        .pricing-grain {
          position: absolute;
          inset: 0;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }

        /* Default card */
        .pricing-card {
          background: rgba(255, 255, 255, 0.025);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.05),
            0 8px 32px rgba(0, 0, 0, 0.45);
          border-radius: 20px;
          transition:
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease,
            box-shadow 0.4s ease;
        }
        .pricing-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201, 168, 76, 0.18);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.06),
            0 16px 48px rgba(0, 0, 0, 0.55);
        }

        /* Featured card */
        .pricing-card-featured {
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          border: 1px solid rgba(201, 168, 76, 0.22);
          box-shadow:
            inset 0 1px 0 rgba(201, 168, 76, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.2),
            0 12px 50px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(201, 168, 76, 0.05);
          border-radius: 24px;
          transform: scale(1.04);
          transition:
            transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.4s ease,
            box-shadow 0.4s ease;
        }
        .pricing-card-featured:hover {
          transform: scale(1.04) translateY(-7px);
          border-color: rgba(201, 168, 76, 0.35);
          box-shadow:
            inset 0 1px 0 rgba(201, 168, 76, 0.12),
            0 24px 64px rgba(0, 0, 0, 0.65),
            0 0 0 1px rgba(201, 168, 76, 0.08);
        }

        /* Inner card gradient */
        .pricing-card-inner-glow {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(145deg, rgba(201,168,76,0.04) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Default button */
        .pricing-btn-default {
          display: block;
          width: 100%;
          padding: 0.875rem 1.5rem;
          text-align: center;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid rgba(201, 168, 76, 0.35);
          background: transparent;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.3s ease, border-color 0.3s ease;
        }
        .pricing-btn-default:hover {
          background: rgba(201, 168, 76, 0.07);
          border-color: rgba(201, 168, 76, 0.6);
        }

        /* Featured button */
        .pricing-btn-featured {
          display: block;
          width: 100%;
          padding: 0.9rem 1.5rem;
          text-align: center;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #0B0B0B;
          background: linear-gradient(135deg, #C9A84C 0%, #E5C76B 55%, #C9A84C 100%);
          border: none;
          border-radius: 10px;
          text-decoration: none;
          transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pricing-btn-featured:hover {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(201, 168, 76, 0.22);
        }

        /* Feature item dot */
        .feat-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(201, 168, 76, 0.55);
          flex-shrink: 0;
          margin-top: 6px;
        }
      `}</style>

      <section className="pricing-section">
        {/* Radial gold atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.06) 0%, transparent 55%)',
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <div className="pricing-grain" />

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
                Membership
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white mb-5 tracking-tight leading-[1.1]">
              Invest in{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #C9A84C 0%, #E8C76A 50%, #C9A84C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Your Results
              </span>
            </h2>

            <p className="text-white/40 max-w-md mx-auto text-base leading-relaxed tracking-wide">
              Choose a coaching tier built around your commitment level.
              Every plan includes a free consultation before you start.
            </p>

            {/* Divider */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div
                className="h-px w-16"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))',
                }}
              />
              <span
                className="text-[10px] tracking-[0.22em] uppercase"
                style={{ color: 'rgba(201,168,76,0.45)' }}
              >
                All plans include a free consultation
              </span>
              <div
                className="h-px w-16"
                style={{
                  background:
                    'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)',
                }}
              />
            </div>
          </AnimateOnScroll>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-20">
            {plans.map((plan, idx) => (
              <AnimateOnScroll key={plan.id} delay={idx * 110}>
                <div
                  className={`relative p-8 flex flex-col h-full ${
                    plan.featured ? 'pricing-card-featured' : 'pricing-card'
                  }`}
                >
                  <div className="pricing-card-inner-glow" />

                  {/* Featured badge */}
                  {plan.featured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[10px] font-semibold tracking-[0.15em] uppercase rounded-full"
                        style={{
                          background: 'rgba(201,168,76,0.1)',
                          border: '1px solid rgba(201,168,76,0.3)',
                          color: '#C9A84C',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        <span className="w-1 h-1 rounded-full bg-current" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan name & tagline */}
                  <div className="relative z-10 mb-6">
                    <p
                      className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2"
                      style={{ color: 'rgba(201,168,76,0.5)' }}
                    >
                      {plan.tagline}
                    </p>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {plan.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="relative z-10 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-start gap-1.5">
                      <span
                        className="text-sm font-medium mt-3"
                        style={{ color: 'rgba(201,168,76,0.6)' }}
                      >
                        {plan.currency}
                      </span>
                      <span
                        className="text-6xl font-black leading-none tracking-tight"
                        style={{
                          background: plan.featured
                            ? 'linear-gradient(135deg, #C9A84C, #E8C76A)'
                            : 'rgba(255,255,255,0.85)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                        }}
                      >
                        {plan.price}
                      </span>
                      <span
                        className="text-sm font-medium mt-auto mb-2"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        /{plan.period}
                      </span>
                    </div>
                    <p
                      className="text-[13px] leading-relaxed mt-3"
                      style={{ color: 'rgba(255,255,255,0.38)' }}
                    >
                      {plan.description}
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="relative z-10 space-y-3.5 flex-grow mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <span style={{ color: '#C9A84C', marginTop: '1px' }}>
                          <CheckIcon />
                        </span>
                        <span
                          className="text-[13px] leading-snug"
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="relative z-10">
                    <a
                      href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={
                        plan.featured
                          ? 'pricing-btn-featured'
                          : 'pricing-btn-default'
                      }
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Bottom note */}
          <AnimateOnScroll className="text-center">
            <p
              className="text-xs tracking-wide"
              style={{ color: 'rgba(255,255,255,0.22)' }}
            >
              All prices listed in Saudi Riyal (SAR). Pricing is managed by the admin and subject to change.
              <br className="hidden sm:block" />
              <span
                className="mt-1 inline-block"
                style={{ color: 'rgba(201,168,76,0.4)' }}
              >
                Not sure which plan? Book your free consultation — no commitment required.
              </span>
            </p>
          </AnimateOnScroll>

        </div>
      </section>
    </>
  );
}
