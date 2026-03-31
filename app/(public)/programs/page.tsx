import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

const programs = [
  {
    id: 1,
    slug: 'muscle-building',
    name: 'Muscle Building',
    nameAr: 'بناء العضلات',
    tagline: 'Build lean, lasting size',
    duration: '16 weeks',
    level: 'Intermediate – Advanced',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774869469/ChatGPT_Image_Mar_30_2026_04_47_36_PM_l244wh.png',
    description:
      'A structured hypertrophy program designed to add lean muscle through progressive overload, precision nutrition, and weekly coach adjustments. Every rep, every meal — engineered for growth.',
    includes: [
      'Custom hypertrophy workout plan (5 days/week)',
      'High-protein meal plan tailored to your macros',
      'Weekly 1-on-1 check-ins with your coach',
      'Progressive overload tracking built-in',
      'Supplement guidance included',
    ],
    ideal: 'Those who want to build size, improve definition, and increase strength over a sustained period.',
  },
  {
    id: 2,
    slug: 'fat-loss',
    name: 'Fat Loss',
    nameAr: 'فقدان الدهون',
    tagline: 'Burn fat, keep muscle',
    duration: '12 weeks',
    level: 'All Levels',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774870969/ChatGPT_Image_Mar_30_2026_05_12_21_PM_jufpsc.png',
    description:
      'A caloric-deficit program that preserves muscle while systematically reducing body fat. Combines structured cardio, strength training, and a precision nutrition plan that doesn\'t feel like a diet.',
    includes: [
      'Fat-loss focused workout plan',
      'Caloric deficit meal plan with macro targets',
      'Weekly weigh-in and body check reviews',
      'Cardio protocol adjusted weekly',
      'Mindset & accountability coaching',
    ],
    ideal: 'Anyone looking to reduce body fat, improve body composition, and build sustainable healthy habits.',
  },
  {
    id: 3,
    slug: 'summer-body',
    name: 'Summer Body',
    nameAr: 'جسم صيفي',
    tagline: '12 weeks to your best shape',
    duration: '12 weeks',
    level: 'All Levels',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774871156/ChatGPT_Image_Mar_30_2026_05_15_20_PM_dmlvkg.png',
    description:
      'A deadline-driven transformation program. Combines fat loss and muscle toning for a lean, athletic physique — ready for summer. Designed for real results in a realistic timeframe.',
    includes: [
      'Toning + fat-loss hybrid workout plan',
      'Clean-eating meal plan (no starvation)',
      'Body transformation progress tracking',
      'Weekly photo check-ins reviewed by coach',
      'Motivation & accountability system',
    ],
    ideal: 'People who have a specific timeframe and want a complete body transformation program.',
  },
  {
    id: 4,
    slug: 'workout-plan',
    name: 'Workout Plan Only',
    nameAr: 'خطة التمرين',
    tagline: 'Structured training, no meal plan',
    duration: 'Ongoing',
    level: 'All Levels',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774871223/ChatGPT_Image_Mar_30_2026_05_16_44_PM_qz2cet.png',
    description:
      'A fully personalized workout plan without the meal planning component. Perfect for those who already have their nutrition dialled in but want expert-designed training structure.',
    includes: [
      'Fully custom workout plan',
      'Day-by-day exercise schedule',
      'Sets, reps, rest & technique notes',
      'Exercise image/video references',
      'Monthly plan updates',
    ],
    ideal: 'Those who have an existing nutrition routine and want a professional training structure to follow.',
  },
  {
    id: 5,
    slug: 'meal-plan',
    name: 'Meal Plan Only',
    nameAr: 'خطة الطعام',
    tagline: 'Precision nutrition, no guesswork',
    duration: 'Ongoing',
    level: 'All Levels',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774871297/ChatGPT_Image_Mar_30_2026_05_17_57_PM_gnjys3.png',
    description:
      'A fully customized meal plan built around your goals, body metrics, and dietary preferences. No guesswork — just a clear, delicious eating structure that works.',
    includes: [
      'Custom meal plan (breakfast, lunch, snack, dinner)',
      'Macro & calorie targets per meal',
      'Dietary restrictions fully respected',
      'Grocery-friendly food choices',
      'Monthly meal plan refreshes',
    ],
    ideal: 'Those who train independently and want expert nutrition to complement their existing workout routine.',
  },
];

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default function ProgramsPage() {
  return (
    <>
      <style>{`
        .prog-hero {
          background: #0B0B0B;
          padding: 9rem 0 5rem;
          position: relative;
          overflow: hidden;
        }
        .prog-glow {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07) 0%, transparent 55%);
          pointer-events: none;
        }
        .prog-grain {
          position: absolute; inset: 0; opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px; pointer-events: none;
        }
        .prog-card {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px) saturate(150%);
          -webkit-backdrop-filter: blur(20px) saturate(150%);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 40px rgba(0,0,0,0.45);
          border-radius: 24px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, box-shadow 0.4s ease;
        }
        .prog-card:hover {
          transform: translateY(-8px);
          border-color: rgba(201,168,76,0.22);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.55);
        }
        .prog-btn {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.8rem 1.8rem;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #C9A84C;
          border: 1px solid rgba(201,168,76,0.4);
          background: transparent; border-radius: 10px;
          text-decoration: none;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }
        .prog-btn:hover {
          background: rgba(201,168,76,0.07);
          border-color: rgba(201,168,76,0.7);
          transform: translateY(-2px);
        }
      `}</style>

      <div className="flex flex-col min-h-screen" style={{ background: '#0B0B0B' }}>
        <Navbar />

        {/* Hero */}
        <div className="prog-hero">
          <div className="prog-glow" />
          <div className="prog-grain" />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-7 rounded-full"
              style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.18)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#C9A84C' }}>
                Our Programs
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
              Choose Your{' '}
              <span style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C76A, #C9A84C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Path
              </span>
            </h1>
            <p className="text-white/42 max-w-xl mx-auto text-base leading-relaxed">
              Every program is built around you — your body, your goals, your lifestyle.
              Start with a free consultation and we'll match you to the right plan.
            </p>
          </div>
        </div>

        {/* Programs */}
        <main className="flex-1 py-16" style={{ background: '#0B0B0B' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {programs.map((prog, idx) => (
              <div key={prog.id} className="prog-card">
                <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>

                  {/* Image */}
                  <div className="relative lg:w-2/5 h-64 lg:h-auto overflow-hidden flex-shrink-0">
                    <img
                      src={prog.image}
                      alt={prog.name}
                      className="w-full h-full object-cover"
                      style={{ minHeight: '320px' }}
                    />
                    <div className="absolute inset-0"
                      style={{ background: idx % 2 === 0 ? 'linear-gradient(to right, transparent 55%, rgba(0,0,0,0.7) 100%)' : 'linear-gradient(to left, transparent 55%, rgba(0,0,0,0.7) 100%)' }}
                    />
                    {/* Program number watermark */}
                    <div className="absolute bottom-4 left-5 text-[5rem] font-black leading-none select-none pointer-events-none"
                      style={{ color: 'transparent', WebkitTextStroke: '1px rgba(201,168,76,0.15)' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                    <div className="mb-5">
                      <p className="text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: 'rgba(201,168,76,0.5)' }}>
                        {prog.nameAr} &nbsp;·&nbsp; {prog.duration} &nbsp;·&nbsp; {prog.level}
                      </p>
                      <h2 className="text-3xl font-bold text-white tracking-tight mb-1">{prog.name}</h2>
                      <p className="text-base" style={{ color: 'rgba(201,168,76,0.7)' }}>{prog.tagline}</p>
                    </div>

                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {prog.description}
                    </p>

                    {/* Includes */}
                    <div className="mb-6">
                      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        What's included
                      </p>
                      <ul className="space-y-2.5">
                        {prog.includes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span style={{ color: '#C9A84C' }}><CheckIcon /></span>
                            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Ideal for */}
                    <div className="mb-7 p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.1)' }}>
                      <p className="text-[10px] font-semibold tracking-[0.16em] uppercase mb-1.5" style={{ color: 'rgba(201,168,76,0.45)' }}>
                        Ideal for
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>{prog.ideal}</p>
                    </div>

                    <a
                      href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
                      target="_blank" rel="noopener noreferrer"
                      className="prog-btn w-fit"
                    >
                      Start This Program
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-20 px-4">
            <p className="text-xs tracking-[0.2em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Not sure which program is right for you?
            </p>
            <a
              href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
              target="_blank" rel="noopener noreferrer"
              className="prog-btn"
            >
              Book a Free Consultation
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
