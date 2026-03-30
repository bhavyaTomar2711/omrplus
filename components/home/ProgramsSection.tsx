'use client';

import AnimateOnScroll from '@/components/ui/AnimateOnScroll';

const programs = [
  {
    id: 1,
    name: 'Muscle Building',
    nameAr: 'بناء العضلات',
    description: 'Build lean muscle mass with progressive strength training and high-protein meal plans.',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774869469/ChatGPT_Image_Mar_30_2026_04_47_36_PM_l244wh.png',
  },
  {
    id: 2,
    name: 'Fat Loss',
    nameAr: 'فقدان الدهون',
    description: 'Sustainable fat loss through structured nutrition and cardio-strength combination workouts.',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774870969/ChatGPT_Image_Mar_30_2026_05_12_21_PM_jufpsc.png',
  },
  {
    id: 3,
    name: 'Summer Body',
    nameAr: 'جسم صيفي',
    description: 'Transform in 12 weeks with our scientifically-backed summer body program.',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774871156/ChatGPT_Image_Mar_30_2026_05_15_20_PM_dmlvkg.png',
  },
  {
    id: 4,
    name: 'Workout Plan',
    nameAr: 'خطة التمرين',
    description: 'Structured workout plans without meal planning. Perfect for those with their own diet.',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774871223/ChatGPT_Image_Mar_30_2026_05_16_44_PM_qz2cet.png',
  },
  {
    id: 5,
    name: 'Meal Plan',
    nameAr: 'خطة الطعام',
    description: 'Get personalized meal plans tailored to your goals and dietary preferences.',
    image: 'https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774871297/ChatGPT_Image_Mar_30_2026_05_17_57_PM_gnjys3.png',
  },
];

export default function ProgramsSection() {
  return (
    <section id="programs" className="py-24 bg-brand-black relative overflow-hidden">
      {/* Subtle background orb — gold, very faint */}
      <div className="absolute top-1/3 right-0 w-[600px] h-[600px] rounded-full -z-10"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Section Header */}
        <AnimateOnScroll className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Choose Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold font-black">
              Path
            </span>
          </h2>
          <p className="text-base text-white/40 max-w-xl mx-auto font-light tracking-wide">
            Pick the program that matches your goals. All plans include personalized support.
          </p>
        </AnimateOnScroll>

        {/* Row 1 — 3 Vertical Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
          {programs.slice(0, 3).map((program, idx) => (
            <AnimateOnScroll key={program.id} delay={idx * 80}>
              <a
                href="#"
                className="group block rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={program.image}
                    alt={program.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
                  />
                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />
                </div>

                {/* Details */}
                <div className="p-6 pt-5">
                  <div className="mb-4">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-2">{program.nameAr}</p>
                    <h3 className="text-xl font-semibold text-white tracking-wide group-hover:text-brand-gold transition-colors duration-300">
                      {program.name}
                    </h3>
                  </div>
                  <p className="text-sm text-white/45 leading-relaxed mb-6 font-light">
                    {program.description}
                  </p>
                  <button
                    className="text-sm font-medium tracking-wide transition-all duration-300 px-5 py-2 rounded-lg"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(201,168,76,0.6)',
                      color: '#C9A84C',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.9)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.6)';
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </a>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Row 2 — 2 Horizontal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-14">
          {programs.slice(3).map((program, idx) => (
            <AnimateOnScroll key={program.id} delay={(idx + 3) * 80}>
              <a
                href="#"
                className="group flex rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  transition: 'transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.3)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 60px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                {/* Image - Left */}
                <div className="relative w-2/5 overflow-hidden flex-shrink-0">
                  <img
                    src={program.image}
                    alt={program.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />
                </div>

                {/* Content - Right */}
                <div className="flex-1 p-7 flex flex-col justify-center">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-white/35 mb-2">{program.nameAr}</p>
                  <h3 className="text-xl font-semibold text-white tracking-wide mb-3 group-hover:text-brand-gold transition-colors duration-300">
                    {program.name}
                  </h3>
                  <p className="text-sm text-white/45 leading-relaxed mb-6 font-light">
                    {program.description}
                  </p>
                  <button
                    className="text-sm font-medium tracking-wide transition-all duration-300 px-5 py-2 rounded-lg w-fit"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(201,168,76,0.6)',
                      color: '#C9A84C',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.08)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.9)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.6)';
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </a>
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA */}
        <AnimateOnScroll className="text-center">
          <p className="text-white/30 text-sm mb-5 font-light tracking-wide">Not sure which program is right for you?</p>
          <a
            href="https://wa.me/?text=I%20want%20to%20book%20a%20free%20consultation%20for%20OMR%2B"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium tracking-wide px-7 py-3 rounded-lg transition-all duration-300"
            style={{
              background: 'transparent',
              border: '1px solid rgba(201,168,76,0.5)',
              color: '#C9A84C',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.07)';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.8)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.5)';
            }}
          >
            Book a Free Consultation
          </a>
        </AnimateOnScroll>

      </div>
    </section>
  );
}
