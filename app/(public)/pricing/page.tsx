'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/context/LanguageContext';

interface PublicPlan {
  id: string;
  name: string;
  description: string | null;
  tagline: string | null;
  cta_text: string | null;
  price_sar: number;
  features: string[];
  is_featured: boolean;
  sort_order: number;
}

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const faq = [
  {
    q: 'Can I cancel anytime?',
    qAr: 'هل يمكنني الإلغاء في أي وقت؟',
    a: 'Yes. Cancel anytime from your dashboard — your access continues until the end of the billing period.',
    aAr: 'نعم. ألغِ في أي وقت من لوحة التحكم — يستمر وصولك حتى نهاية فترة الفاتورة.',
  },
  {
    q: 'Can I switch plans?',
    qAr: 'هل يمكنني تغيير الخطة؟',
    a: 'Yes. Upgrade or downgrade at any time from your Subscription tab in the dashboard.',
    aAr: 'نعم. قم بالترقية أو التخفيض في أي وقت من تبويب الاشتراك في لوحة التحكم.',
  },
  {
    q: 'What payment methods are accepted?',
    qAr: 'ما طرق الدفع المقبولة؟',
    a: 'Visa, Mastercard, and Apple Pay — all processed securely through Stripe.',
    aAr: 'فيزا وماستركارد وApple Pay — كلها تُعالج بأمان عبر Stripe.',
  },
  {
    q: 'How quickly will I get my plan?',
    qAr: 'متى سأحصل على خطتي؟',
    a: 'After completing your onboarding questionnaire, your coach will deliver your first plan within 48 hours.',
    aAr: 'بعد إكمال استبيان التأهيل، سيسلّمك مدربك خطتك الأولى خلال ٤٨ ساعة.',
  },
  {
    q: 'Is there a free trial?',
    qAr: 'هل هناك تجربة مجانية؟',
    a: 'No free trials — but we offer a free consultation so you can ask all your questions before committing.',
    aAr: 'لا توجد تجارب مجانية، لكننا نقدم استشارة مجانية حتى تطرح كل أسئلتك قبل الالتزام.',
  },
];

export default function PricingPage() {
  const { t, isRTL } = useLanguage();
  const [plans, setPlans] = useState<PublicPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pricing-plans')
      .then(r => r.json())
      .then(d => setPlans(d.plans ?? []))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <style>{`
        .price-page { background: #0B0B0B; min-height: 100vh; }
        .price-hero {
          background: #0B0B0B; padding: 9rem 0 5rem; position: relative; overflow: hidden;
        }
        .price-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 55%);
          pointer-events: none;
        }
        .price-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px; overflow: hidden;
          transition: border-color 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .price-card:hover { transform: translateY(-6px); border-color: rgba(201,168,76,0.2); }
        .price-card-featured {
          background: rgba(255,255,255,0.035);
          border-color: rgba(201,168,76,0.3);
          box-shadow: 0 0 60px rgba(201,168,76,0.06);
        }
        .price-card-featured:hover { border-color: rgba(201,168,76,0.55); }
        .price-btn {
          display: block; width: 100%; padding: 1rem;
          font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;
          text-align: center; text-decoration: none; border-radius: 14px;
          border: 1px solid rgba(201,168,76,0.4); color: #C9A84C; background: transparent;
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }
        .price-btn:hover { background: rgba(201,168,76,0.07); border-color: rgba(201,168,76,0.7); transform: translateY(-1px); }
        .price-btn-featured {
          display: block; width: 100%; padding: 1rem;
          font-size: 0.75rem; font-weight: 800; letter-spacing: 0.15em; text-transform: uppercase;
          text-align: center; text-decoration: none; border-radius: 14px;
          background: linear-gradient(135deg,#C9A84C,#E8C76A); color: #0B0B0B; border: none;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .price-btn-featured:hover { opacity: 0.88; transform: translateY(-1px); }
        .faq-item {
          border-bottom: 1px solid rgba(255,255,255,0.06); padding: 1.5rem 0;
        }
        .faq-item:last-child { border-bottom: none; }
      `}</style>

      <div className="price-page">
        <Navbar />

        {/* Hero */}
        <div className="price-hero">
          <div className="price-glow" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-7 rounded-full"
              style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#C9A84C' }}>
                {t('pricing.badge')}
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 tracking-tight">
              {t('pricing.title')}{' '}
              <span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C76A,#C9A84C)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {t('pricing.titleHighlight')}
              </span>
            </h1>
            <p className="text-white/42 max-w-xl mx-auto text-base leading-relaxed">
              {t('pricing.subtitle')}
            </p>
          </div>
        </div>

        {/* Plan Cards */}
        <section className="py-16" style={{ background: '#0B0B0B' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {loading && (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-amber-400/30 border-t-amber-400 animate-spin" />
              </div>
            )}

            {!loading && plans.length === 0 && (
              <div className="text-center py-20">
                <p className="text-white/30 text-sm">No plans available yet. Check back soon.</p>
              </div>
            )}

            {!loading && plans.length > 0 && (
              <div className={`grid gap-6 items-start ${plans.length === 1 ? 'max-w-md mx-auto' : plans.length === 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
                {plans.map(plan => (
                  <div key={plan.id} className={`price-card ${plan.is_featured ? 'price-card-featured' : ''}`}>

                    {plan.is_featured && (
                      <div className="px-6 pt-5 pb-0 flex justify-start">
                        <span className="text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full"
                          style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.3)' }}>
                          ● {isRTL ? 'الأكثر شعبية' : 'Most Popular'}
                        </span>
                      </div>
                    )}

                    <div className="p-6 sm:p-8">
                      {/* Header */}
                      {plan.tagline && (
                        <p className="text-[10px] tracking-[0.22em] uppercase mb-2 font-semibold" style={{ color: 'rgba(201,168,76,0.5)' }}>
                          {plan.tagline}
                        </p>
                      )}
                      <h2 className="text-2xl font-bold text-white mb-4">{plan.name}</h2>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 mb-4" dir="ltr">
                        <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.4)' }}>SAR</span>
                        <span className="text-5xl font-black" style={{ color: plan.is_featured ? '#C9A84C' : 'white' }}>{plan.price_sar}</span>
                        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{isRTL ? '/شهر' : '/month'}</span>
                      </div>

                      {/* Description */}
                      {plan.description && (
                        <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.42)' }}>
                          {plan.description}
                        </p>
                      )}

                      {/* CTA */}
                      <a
                        href={`/checkout?plan=${plan.id}`}
                        className={plan.is_featured ? 'price-btn-featured' : 'price-btn'}
                      >
                        {plan.cta_text ?? (isRTL ? 'ابدأ الآن' : 'Get Started')}
                      </a>

                      <div className="h-px my-6" style={{ background: 'rgba(255,255,255,0.06)' }} />

                      {/* What's included */}
                      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.22)' }}>
                        {isRTL ? 'ما يشمله البرنامج' : "What's included"}
                      </p>
                      <ul className="space-y-2.5">
                        {plan.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                            <span style={{ color: '#C9A84C', marginTop: '1px' }}><CheckIcon /></span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer note */}
            {!loading && (
              <p className="text-center text-xs mt-10" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {t('pricing.footer1')}
                <br />
                <span style={{ color: 'rgba(201,168,76,0.4)' }}>{t('pricing.footer2')}</span>
              </p>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16" style={{ background: '#0D0D0D' }}>
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-white mb-3">
                {isRTL ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-white/35 text-sm">
                {isRTL ? 'لا تجد إجابتك؟ تواصل معنا مباشرة.' : "Can't find your answer? Contact us directly."}
              </p>
            </div>
            <div>
              {faq.map((item, i) => (
                <div key={i} className="faq-item">
                  <p className="text-base font-semibold text-white mb-2">{isRTL ? item.qAr : item.q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{isRTL ? item.aAr : item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 text-center" style={{ background: '#0B0B0B' }}>
          <div className="max-w-lg mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-3">
              {isRTL ? 'لست متأكداً من أين تبدأ؟' : 'Not sure where to start?'}
            </h2>
            <p className="text-white/38 text-sm mb-7 leading-relaxed">
              {isRTL
                ? 'احجز استشارة مجانية وسنرشدك إلى الخطة المناسبة لأهدافك وميزانيتك.'
                : "Book a free consultation and we'll guide you to the right plan for your goals and budget."}
            </p>
            <a
              href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'0.9rem 2rem', border:'1px solid rgba(201,168,76,0.4)', color:'#C9A84C', fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.14em', textTransform:'uppercase', borderRadius:14, textDecoration:'none', transition:'background 0.25s ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(201,168,76,0.07)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {isRTL ? 'احجز استشارة مجانية' : 'Book Free Consultation'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
