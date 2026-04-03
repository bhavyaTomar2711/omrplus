'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

// ── Translation dictionaries ────────────────────────────────────────────────

const en: Record<string, string> = {
  // Nav
  'nav.programs': 'Programs',
  'nav.howItWorks': 'How It Works',
  'nav.transformations': 'Transformations',
  'nav.marketplace': 'Marketplace',
  'nav.pricing': 'Pricing',
  'nav.about': 'About',
  'nav.contact': 'Contact',
  'nav.dashboard': 'Dashboard',
  'nav.account': 'Account',
  'nav.soon': 'Soon',

  // Footer
  'footer.tagline': 'Premium fitness coaching with personalized meal plans. Transform your body, elevate your life.',
  'footer.quickLinks': 'Quick Links',
  'footer.aboutUs': 'About Us',
  'footer.ourPrograms': 'Our Programs',
  'footer.muscleBuilding': 'Muscle Building',
  'footer.fatLoss': 'Fat Loss',
  'footer.summerBody': 'Summer Body',
  'footer.workoutPlan': 'Workout Plan',
  'footer.mealPlan': 'Meal Plan',
  'footer.getInTouch': 'Get in Touch',
  'footer.email': 'Email',
  'footer.whatsapp': 'WhatsApp',
  'footer.messageUs': 'Message Us',
  'footer.freeConsultation': 'Free Consultation',
  'footer.allRightsReserved': 'All rights reserved.',
  'footer.privacyPolicy': 'Privacy Policy',
  'footer.termsOfService': 'Terms of Service',
  'footer.language': 'Language',
  'footer.premiumCoaching': 'Premium coaching',
  'footer.noFreeTrials': 'No free trials',
  'footer.transparentPricing': 'Transparent pricing',
  'footer.realResults': 'Real results',

  // Hero
  'hero.headline1': 'UNLEASH YOUR',
  'hero.headline2': 'POTENTIAL',
  'hero.subtext': 'Join a community where goals are crushed, strength is built, and potential becomes power.',
  'hero.cta': 'Get Started',

  // Programs page
  'programs.badge': 'Our Programs',
  'programs.title': 'Choose Your',
  'programs.titleHighlight': 'Path',
  'programs.subtitle': 'Every program is built around you — your body, your goals, your lifestyle. Start with a free consultation and we\'ll match you to the right plan.',
  'programs.whatsIncluded': "What's included",
  'programs.idealFor': 'Ideal for',
  'programs.startProgram': 'Start This Program',
  'programs.notSure': 'Not sure which program is right for you?',
  'programs.bookConsultation': 'Book a Free Consultation',

  // Program names
  'program.muscleBuilding.name': 'Muscle Building',
  'program.muscleBuilding.tagline': 'Build lean, lasting size',
  'program.muscleBuilding.description': 'A structured hypertrophy program designed to add lean muscle through progressive overload, precision nutrition, and weekly coach adjustments. Every rep, every meal — engineered for growth.',
  'program.muscleBuilding.ideal': 'Those who want to build size, improve definition, and increase strength over a sustained period.',
  'program.muscleBuilding.i1': 'Custom hypertrophy workout plan (5 days/week)',
  'program.muscleBuilding.i2': 'High-protein meal plan tailored to your macros',
  'program.muscleBuilding.i3': 'Weekly 1-on-1 check-ins with your coach',
  'program.muscleBuilding.i4': 'Progressive overload tracking built-in',
  'program.muscleBuilding.i5': 'Supplement guidance included',

  'program.fatLoss.name': 'Fat Loss',
  'program.fatLoss.tagline': 'Burn fat, keep muscle',
  'program.fatLoss.description': "A caloric-deficit program that preserves muscle while systematically reducing body fat. Combines structured cardio, strength training, and a precision nutrition plan that doesn't feel like a diet.",
  'program.fatLoss.ideal': 'Anyone looking to reduce body fat, improve body composition, and build sustainable healthy habits.',
  'program.fatLoss.i1': 'Fat-loss focused workout plan',
  'program.fatLoss.i2': 'Caloric deficit meal plan with macro targets',
  'program.fatLoss.i3': 'Weekly weigh-in and body check reviews',
  'program.fatLoss.i4': 'Cardio protocol adjusted weekly',
  'program.fatLoss.i5': 'Mindset & accountability coaching',

  'program.summerBody.name': 'Summer Body',
  'program.summerBody.tagline': '12 weeks to your best shape',
  'program.summerBody.description': 'A deadline-driven transformation program. Combines fat loss and muscle toning for a lean, athletic physique — ready for summer. Designed for real results in a realistic timeframe.',
  'program.summerBody.ideal': 'People who have a specific timeframe and want a complete body transformation program.',
  'program.summerBody.i1': 'Toning + fat-loss hybrid workout plan',
  'program.summerBody.i2': 'Clean-eating meal plan (no starvation)',
  'program.summerBody.i3': 'Body transformation progress tracking',
  'program.summerBody.i4': 'Weekly photo check-ins reviewed by coach',
  'program.summerBody.i5': 'Motivation & accountability system',

  'program.workoutOnly.name': 'Workout Plan Only',
  'program.workoutOnly.tagline': 'Structured training, no meal plan',
  'program.workoutOnly.description': 'A fully personalized workout plan without the meal planning component. Perfect for those who already have their nutrition dialled in but want expert-designed training structure.',
  'program.workoutOnly.ideal': 'Those who have an existing nutrition routine and want a professional training structure to follow.',
  'program.workoutOnly.i1': 'Fully custom workout plan',
  'program.workoutOnly.i2': 'Day-by-day exercise schedule',
  'program.workoutOnly.i3': 'Sets, reps, rest & technique notes',
  'program.workoutOnly.i4': 'Exercise image/video references',
  'program.workoutOnly.i5': 'Monthly plan updates',

  'program.mealOnly.name': 'Meal Plan Only',
  'program.mealOnly.tagline': 'Precision nutrition, no guesswork',
  'program.mealOnly.description': 'A fully customized meal plan built around your goals, body metrics, and dietary preferences. No guesswork — just a clear, delicious eating structure that works.',
  'program.mealOnly.ideal': 'Those who train independently and want expert nutrition to complement their existing workout routine.',
  'program.mealOnly.i1': 'Custom meal plan (breakfast, lunch, snack, dinner)',
  'program.mealOnly.i2': 'Macro & calorie targets per meal',
  'program.mealOnly.i3': 'Dietary restrictions fully respected',
  'program.mealOnly.i4': 'Grocery-friendly food choices',
  'program.mealOnly.i5': 'Monthly meal plan refreshes',

  // About page
  'about.badge': 'About OMR+',
  'about.title': 'Premium Coaching,',
  'about.titleHighlight': 'Real Results',
  'about.subtitle': 'OMR+ is a premium fitness coaching platform built for people who are serious about transforming their bodies — with expert guidance, not guesswork.',
  'about.mission.title': 'Our Mission',
  'about.mission.body': 'To deliver world-class fitness coaching that\'s accessible, personalized, and built around real results — not empty promises.',
  'about.approach.title': 'Our Approach',
  'about.approach.body': 'Every client receives a completely personalized plan — tailored workouts, custom meal plans, and weekly check-ins with a dedicated coach.',
  'about.values.title': 'Our Values',
  'about.values.b1': 'Personalization over generic plans',
  'about.values.b2': 'Transparency & honest communication',
  'about.values.b3': 'Results-driven accountability',
  'about.values.b4': 'Premium quality in everything we do',
  'about.cta': 'Start Your Transformation',

  // Contact page
  'contact.badge': 'Contact Us',
  'contact.title': "Let's",
  'contact.titleHighlight': 'Talk',
  'contact.subtitle': 'Have a question or ready to start? Reach out and we\'ll get back to you.',
  'contact.whatsapp.title': 'WhatsApp',
  'contact.whatsapp.desc': 'Message us directly for the fastest response.',
  'contact.whatsapp.btn': 'Message on WhatsApp',
  'contact.email.title': 'Email',
  'contact.email.desc': 'Send us a message and we\'ll reply within 24 hours.',
  'contact.form.title': 'Send a Message',
  'contact.form.name': 'Full Name',
  'contact.form.namePlaceholder': 'Your name',
  'contact.form.email': 'Email Address',
  'contact.form.emailPlaceholder': 'your@email.com',
  'contact.form.message': 'Message',
  'contact.form.messagePlaceholder': 'How can we help you?',
  'contact.form.submit': 'Send Message',
  'contact.form.sending': 'Sending…',
  'contact.form.success': 'Message sent! We\'ll be in touch soon.',

  // Marketplace page
  'marketplace.badge': 'Marketplace',
  'marketplace.title': 'Premium Supplements',
  'marketplace.titleHighlight': '& More',
  'marketplace.subtitle': 'Hand-picked supplements, nutrition products, and expert resources to support your fitness journey.',
  'marketplace.comingSoon': 'Coming Soon',
  'marketplace.comingSoonTitle': 'Store Opening Soon',
  'marketplace.comingSoonDesc': 'We\'re curating the best supplements and nutrition products for you. Check back soon.',
  'marketplace.notifyBtn': 'Notify Me',

  // How It Works section
  'hiw.badge': 'How It Works',
  'hiw.title': 'Your Journey to',
  'hiw.titleHighlight': 'Transformation',
  'hiw.step1.title': 'Free Consultation',
  'hiw.step1.desc': 'Book a free consultation with our team. We\'ll assess your goals, lifestyle, and fitness level to match you with the right program.',
  'hiw.step2.title': 'Get Your Plan',
  'hiw.step2.desc': 'Receive a fully customized workout and meal plan, tailored specifically to your body, goals, and schedule.',
  'hiw.step3.title': 'Coach Support',
  'hiw.step3.desc': 'Stay connected with your dedicated coach. Weekly check-ins, plan adjustments, and real-time messaging keep you on track.',
  'hiw.step4.title': 'Track Progress',
  'hiw.step4.desc': 'Log your progress, upload body checks, and watch your transformation unfold with data-driven insights.',

  // Transformations section
  'trans.badge': 'Transformations',
  'trans.title': 'Real People,',
  'trans.titleHighlight': 'Real Results',
  'trans.subtitle': 'Privacy-protected client transformations. Results vary by individual commitment and program.',
  'trans.disclaimer': 'Client identities protected. Results shown with permission.',
  'trans.verified': 'Verified Result',
  'trans.more': 'Hundreds more stories waiting to be told',
  'trans.viewAll': 'View All Transformations',
  'trans.t1.label': 'lost',
  'trans.t1.program': 'Fat Loss',
  'trans.t1.duration': '12 weeks',
  'trans.t1.change': 'Body composition improved significantly. Consistent training and tailored nutrition made the difference.',
  'trans.t2.label': 'gained',
  'trans.t2.program': 'Muscle Building',
  'trans.t2.duration': '16 weeks',
  'trans.t2.change': 'Strength increased by 40%. Progressive overload and precision meal planning built a foundation that lasts.',
  'trans.t3.label': 'confidence',
  'trans.t3.program': 'Summer Body',
  'trans.t3.duration': '12 weeks',
  'trans.t3.change': 'More energy, better posture, and a physique to be proud of — achieved through consistency and guidance.',
  'trans.stat1': 'Active Members',
  'trans.stat2': 'Success Rate',
  'trans.stat3': 'Avg. Months',
  'trans.stat4': 'Check-ins',

  // Pricing section
  'pricing.badge': 'Pricing',
  'pricing.title': 'Simple,',
  'pricing.titleHighlight': 'Transparent Pricing',
  'pricing.subtitle': 'No hidden fees. No free trials. Choose the plan that fits your goals.',
  'pricing.perMonth': '/month',
  'pricing.getStarted': 'Get Started',
  'pricing.popular': 'Most Popular',
  'pricing.consultation': 'Book Free Consultation',
  'pricing.footer1': 'All prices listed in Saudi Riyal (SAR). Pricing is managed by the admin and subject to change.',
  'pricing.footer2': 'Not sure which plan? Book your free consultation — no commitment required.',
  'pricing.plan1.name': 'Plan Only',
  'pricing.plan1.tagline': 'Self-paced structure',
  'pricing.plan1.desc': 'Get a fully customized meal or workout plan built around your body, goals, and lifestyle.',
  'pricing.plan1.cta': 'Get Started',
  'pricing.plan1.f1': 'Custom meal plan or workout plan',
  'pricing.plan1.f2': 'Personalized to your goals',
  'pricing.plan1.f3': 'Dietary restrictions included',
  'pricing.plan1.f4': 'Weekly plan updates',
  'pricing.plan1.f5': 'PDF download access',
  'pricing.plan2.name': 'Full Coaching',
  'pricing.plan2.tagline': 'Most chosen program',
  'pricing.plan2.desc': 'Complete coaching experience — custom plans, weekly check-ins, and direct access to your trainer.',
  'pricing.plan2.cta': 'Start Coaching',
  'pricing.plan2.f1': 'Custom meal plan + workout plan',
  'pricing.plan2.f2': 'Dedicated personal trainer',
  'pricing.plan2.f3': 'Weekly 1-on-1 check-ins',
  'pricing.plan2.f4': 'Real-time messaging with coach',
  'pricing.plan2.f5': 'Progress tracking & adjustments',
  'pricing.plan2.f6': 'InBody analysis support',
  'pricing.plan2.f7': 'Priority plan updates',
  'pricing.plan3.name': 'Elite',
  'pricing.plan3.tagline': 'Maximum results',
  'pricing.plan3.desc': 'The full OMR+ experience — elite coaching with premium add-ons for those who want the best.',
  'pricing.plan3.cta': 'Go Elite',
  'pricing.plan3.f1': 'Everything in Full Coaching',
  'pricing.plan3.f2': 'Unlimited coach messages',
  'pricing.plan3.f3': 'Bi-weekly video consultations',
  'pricing.plan3.f4': 'Supplement guidance',
  'pricing.plan3.f5': 'Competition prep support',
  'pricing.plan3.f6': 'Priority onboarding',

  // Consultation CTA
  'cta.title': 'Ready to Transform?',
  'cta.subtitle': 'Book your free consultation today and take the first step toward the body you deserve.',
  'cta.btn': 'Book Free Consultation',

  // Testimonials
  'testimonials.badge': 'Testimonials',
  'testimonials.title': 'What Our',
  'testimonials.titleHighlight': 'Members Say',

  // Login page
  'login.memberPortal': 'Member Portal',
  'login.title': 'Welcome Back',
  'login.subtitle': 'Sign in to access your coaching dashboard',
  'login.email': 'Email Address',
  'login.emailPlaceholder': 'you@example.com',
  'login.password': 'Password',
  'login.forgotPassword': 'Forgot password?',
  'login.signIn': 'Sign In',
  'login.signingIn': 'Signing in…',
  'login.noAccount': "Don't have an account?",
  'login.createOne': 'Create one',
  'login.secureLogin': 'Secure login',
  'login.dataPrivate': 'Your data is private',

  // Signup page
  'signup.memberPortal': 'New Member',
  'signup.title': 'Create Your Account',
  'signup.subtitle': 'Join OMR+ and start your transformation',
  'signup.fullName': 'Full Name',
  'signup.fullNamePlaceholder': 'Your full name',
  'signup.email': 'Email Address',
  'signup.emailPlaceholder': 'you@example.com',
  'signup.password': 'Password',
  'signup.passwordPlaceholder': '••••••••',
  'signup.confirmPassword': 'Confirm Password',
  'signup.confirmPlaceholder': '••••••••',
  'signup.createAccount': 'Create Account',
  'signup.creating': 'Creating account…',
  'signup.haveAccount': 'Already have an account?',
  'signup.signIn': 'Sign in',
  'signup.secureSignup': 'Secure signup',
  'signup.dataPrivate': 'Your data is private',

  // Dashboard Shell
  'dash.memberPortal': 'Member Portal',
  'dash.coachPortal': 'Coach Portal',
  'dash.adminPanel': 'Admin Panel',
  'dash.signOut': 'Sign Out',
  'dash.backToSite': 'Back to site',

  // Client Dashboard
  'client.overview': 'Overview',
  'client.mealPlan': 'Meal Plan',
  'client.workoutPlan': 'Workout Plan',
  'client.progress': 'Progress',
  'client.messages': 'Messages',
  'client.subscription': 'Subscription',
  'client.welcome': 'Welcome back',
  'client.yourCoach': 'Your Coach',
  'client.noCoach': 'No coach assigned yet',
  'client.activePlan': 'Active Plan',
  'client.loading': 'Loading…',
  'client.noMealPlan': 'No meal plan assigned yet',
  'client.noWorkoutPlan': 'No workout plan assigned yet',
  'client.watchVideo': 'Watch',

  // Coach Dashboard
  'coach.clients': 'Clients',
  'coach.mealBuilder': 'Meal Builder',
  'coach.workoutBuilder': 'Workout Builder',
  'coach.progress': 'Progress',
  'coach.messages': 'Messages',
  'coach.welcome': 'Welcome back, Coach',
  'coach.myClients': 'My Clients',
  'coach.assignedClients': 'Assigned Clients',

  // Admin Dashboard
  'admin.overview': 'Overview',
  'admin.users': 'Users',
  'admin.coaches': 'Coaches',
  'admin.subscriptions': 'Subscriptions',
  'admin.marketplace': 'Marketplace',
  'admin.pricing': 'Pricing',
  'admin.videos': 'Videos',
  'admin.analytics': 'Analytics',
  'admin.chat': 'Chat',
  'admin.welcome': 'Welcome, Admin',
};

// ── Arabic translations ───────────────────────────────────────────────────

const ar: Record<string, string> = {
  // Nav
  'nav.programs': 'البرامج',
  'nav.howItWorks': 'كيف يعمل',
  'nav.transformations': 'قبل وبعد',
  'nav.marketplace': 'المتجر',
  'nav.pricing': 'الأسعار',
  'nav.about': 'عن الشركة',
  'nav.contact': 'تواصل معنا',
  'nav.dashboard': 'لوحة التحكم',
  'nav.account': 'حسابي',
  'nav.soon': 'قريباً',

  // Footer
  'footer.tagline': 'تدريب رياضي متميز مع خطط غذائية مخصصة. حوّل جسمك وارتقِ بحياتك.',
  'footer.quickLinks': 'روابط سريعة',
  'footer.aboutUs': 'عن الشركة',
  'footer.ourPrograms': 'برامجنا',
  'footer.muscleBuilding': 'بناء العضلات',
  'footer.fatLoss': 'حرق الدهون',
  'footer.summerBody': 'جسم صيفي',
  'footer.workoutPlan': 'خطة التمرين',
  'footer.mealPlan': 'خطة الطعام',
  'footer.getInTouch': 'تواصل معنا',
  'footer.email': 'البريد الإلكتروني',
  'footer.whatsapp': 'واتساب',
  'footer.messageUs': 'راسلنا',
  'footer.freeConsultation': 'استشارة مجانية',
  'footer.allRightsReserved': 'جميع الحقوق محفوظة.',
  'footer.privacyPolicy': 'سياسة الخصوصية',
  'footer.termsOfService': 'شروط الخدمة',
  'footer.language': 'اللغة',
  'footer.premiumCoaching': 'تدريب متميز',
  'footer.noFreeTrials': 'لا تجارب مجانية',
  'footer.transparentPricing': 'أسعار شفافة',
  'footer.realResults': 'نتائج حقيقية',

  // Hero
  'hero.headline1': 'اكشف',
  'hero.headline2': 'إمكاناتك',
  'hero.subtext': 'انضم إلى مجتمع يُحقق الأهداف ويبني القوة ويحوّل الإمكانات إلى قوة حقيقية.',
  'hero.cta': 'ابدأ الآن',

  // Programs page
  'programs.badge': 'برامجنا',
  'programs.title': 'اختر',
  'programs.titleHighlight': 'مسارك',
  'programs.subtitle': 'كل برنامج مصمم خصيصاً لك — لجسمك وأهدافك وأسلوب حياتك. ابدأ باستشارة مجانية وسنرشدك للخطة المناسبة.',
  'programs.whatsIncluded': 'ما يشمله البرنامج',
  'programs.idealFor': 'مناسب لـ',
  'programs.startProgram': 'ابدأ هذا البرنامج',
  'programs.notSure': 'لست متأكداً من البرنامج المناسب لك؟',
  'programs.bookConsultation': 'احجز استشارة مجانية',

  // Program names
  'program.muscleBuilding.name': 'بناء العضلات',
  'program.muscleBuilding.tagline': 'بنِ عضلات متينة ودائمة',
  'program.muscleBuilding.description': 'برنامج تضخيم عضلي منظم يهدف إلى بناء العضلات عبر التحميل التدريجي والتغذية الدقيقة وتعديلات أسبوعية من المدرب. كل تكرار، كل وجبة — مصمم للنمو.',
  'program.muscleBuilding.ideal': 'مَن يرغب في زيادة الحجم، تحسين التعريف العضلي، وزيادة القوة على المدى البعيد.',
  'program.muscleBuilding.i1': 'خطة تمرين تضخيمي مخصصة (5 أيام/أسبوع)',
  'program.muscleBuilding.i2': 'نظام غذائي عالي البروتين مُكيَّف مع الماكرو',
  'program.muscleBuilding.i3': 'جلسات متابعة فردية أسبوعية مع مدربك',
  'program.muscleBuilding.i4': 'تتبع تحميل تدريجي مدمج',
  'program.muscleBuilding.i5': 'توجيهات المكملات الغذائية',

  'program.fatLoss.name': 'حرق الدهون',
  'program.fatLoss.tagline': 'احرق الدهون واحتفظ بالعضلات',
  'program.fatLoss.description': 'برنامج بعجز السعرات يحافظ على العضلات مع تقليل الدهون تدريجياً. يجمع بين الكارديو المنظم وتدريب القوة وخطة تغذية دقيقة لا تشعر معها بالحرمان.',
  'program.fatLoss.ideal': 'كل من يرغب في تقليل دهون الجسم وتحسين تركيبته الجسدية وبناء عادات صحية مستدامة.',
  'program.fatLoss.i1': 'خطة تمرين مُركَّزة على حرق الدهون',
  'program.fatLoss.i2': 'خطة غذائية بعجز سعرات مع أهداف ماكرو',
  'program.fatLoss.i3': 'متابعة أسبوعية للوزن وفحص الجسم',
  'program.fatLoss.i4': 'بروتوكول كارديو يُعدَّل أسبوعياً',
  'program.fatLoss.i5': 'تدريب على التركيز والمساءلة',

  'program.summerBody.name': 'جسم صيفي',
  'program.summerBody.tagline': '12 أسبوعاً نحو أفضل شكل',
  'program.summerBody.description': 'برنامج تحول موجَّه بموعد محدد. يجمع بين حرق الدهون ونحت العضلات للحصول على جسم رياضي ومفتول — جاهز للصيف. مصمم لنتائج حقيقية في إطار زمني واقعي.',
  'program.summerBody.ideal': 'مَن لديه إطار زمني محدد ويريد برنامج تحول كامل للجسم.',
  'program.summerBody.i1': 'خطة تمرين هجينة بين النحت وحرق الدهون',
  'program.summerBody.i2': 'نظام غذائي نظيف (بدون تجويع)',
  'program.summerBody.i3': 'تتبع تقدم تحول الجسم',
  'program.summerBody.i4': 'متابعة صور أسبوعية يراجعها المدرب',
  'program.summerBody.i5': 'نظام تحفيز ومساءلة',

  'program.workoutOnly.name': 'خطة التمرين فقط',
  'program.workoutOnly.tagline': 'تدريب منظم بدون خطة غذائية',
  'program.workoutOnly.description': 'خطة تمرين مخصصة بالكامل دون مكوّن التخطيط الغذائي. مثالية لمَن لديهم نظامهم الغذائي محدداً ويريدون هيكل تدريب احترافي.',
  'program.workoutOnly.ideal': 'مَن لديه روتين تغذية قائم ويريد هيكل تدريب احترافي.',
  'program.workoutOnly.i1': 'خطة تمرين مخصصة بالكامل',
  'program.workoutOnly.i2': 'جدول تمرين يومي',
  'program.workoutOnly.i3': 'ملاحظات المجموعات والتكرار والراحة والتقنية',
  'program.workoutOnly.i4': 'مراجع صور/فيديو للتمارين',
  'program.workoutOnly.i5': 'تحديثات شهرية للخطة',

  'program.mealOnly.name': 'خطة الطعام فقط',
  'program.mealOnly.tagline': 'تغذية دقيقة بدون تخمين',
  'program.mealOnly.description': 'خطة غذائية مخصصة بالكامل بناءً على أهدافك وقياسات جسمك وتفضيلاتك الغذائية. لا تخمين — فقط هيكل غذائي واضح ولذيذ يعمل.',
  'program.mealOnly.ideal': 'مَن يتدرب باستقلالية ويريد تغذية احترافية تُكمّل روتين التمرين الحالي.',
  'program.mealOnly.i1': 'خطة وجبات مخصصة (إفطار، غداء، سناك، عشاء)',
  'program.mealOnly.i2': 'أهداف الماكرو والسعرات لكل وجبة',
  'program.mealOnly.i3': 'احترام كامل للقيود الغذائية',
  'program.mealOnly.i4': 'خيارات غذائية مناسبة للبقالة',
  'program.mealOnly.i5': 'تجديد شهري لخطة الوجبات',

  // About page
  'about.badge': 'عن OMR+',
  'about.title': 'تدريب متميز،',
  'about.titleHighlight': 'نتائج حقيقية',
  'about.subtitle': 'OMR+ منصة تدريب رياضي متميزة مبنية لمن هم جادون في تحويل أجسامهم — بتوجيه احترافي، لا بالتخمين.',
  'about.mission.title': 'مهمتنا',
  'about.mission.body': 'تقديم تدريب رياضي عالمي المستوى يكون متاحاً ومخصصاً ومبنياً على نتائج حقيقية — لا وعود فارغة.',
  'about.approach.title': 'نهجنا',
  'about.approach.body': 'كل عميل يحصل على خطة مخصصة بالكامل — تمارين مصممة خصيصاً، خطط غذائية مخصصة، ومتابعة أسبوعية مع مدرب مخصص.',
  'about.values.title': 'قيمنا',
  'about.values.b1': 'التخصيص بدلاً من الخطط العامة',
  'about.values.b2': 'الشفافية والتواصل الصادق',
  'about.values.b3': 'المساءلة الموجهة بالنتائج',
  'about.values.b4': 'الجودة المتميزة في كل ما نقدمه',
  'about.cta': 'ابدأ تحولك',

  // Contact page
  'contact.badge': 'تواصل معنا',
  'contact.title': 'لنتحدث',
  'contact.titleHighlight': '',
  'contact.subtitle': 'هل لديك سؤال أو أنت مستعد للبدء؟ تواصل معنا وسنرد عليك.',
  'contact.whatsapp.title': 'واتساب',
  'contact.whatsapp.desc': 'راسلنا مباشرة للحصول على أسرع رد.',
  'contact.whatsapp.btn': 'المراسلة على واتساب',
  'contact.email.title': 'البريد الإلكتروني',
  'contact.email.desc': 'أرسل لنا رسالة وسنرد في غضون 24 ساعة.',
  'contact.form.title': 'أرسل رسالة',
  'contact.form.name': 'الاسم الكامل',
  'contact.form.namePlaceholder': 'اسمك',
  'contact.form.email': 'البريد الإلكتروني',
  'contact.form.emailPlaceholder': 'بريدك@مثال.com',
  'contact.form.message': 'الرسالة',
  'contact.form.messagePlaceholder': 'كيف يمكننا مساعدتك؟',
  'contact.form.submit': 'إرسال الرسالة',
  'contact.form.sending': 'جارٍ الإرسال…',
  'contact.form.success': 'تم إرسال الرسالة! سنتواصل معك قريباً.',

  // Marketplace page
  'marketplace.badge': 'المتجر',
  'marketplace.title': 'مكملات متميزة',
  'marketplace.titleHighlight': 'والمزيد',
  'marketplace.subtitle': 'مكملات ومنتجات تغذية ومصادر متخصصة لدعم رحلتك الرياضية.',
  'marketplace.comingSoon': 'قريباً',
  'marketplace.comingSoonTitle': 'المتجر يفتح قريباً',
  'marketplace.comingSoonDesc': 'نقوم باختيار أفضل المكملات ومنتجات التغذية لك. تابعنا قريباً.',
  'marketplace.notifyBtn': 'أعلمني',

  // How It Works section
  'hiw.badge': 'كيف يعمل',
  'hiw.title': 'رحلتك نحو',
  'hiw.titleHighlight': 'التحول',
  'hiw.step1.title': 'استشارة مجانية',
  'hiw.step1.desc': 'احجز استشارة مجانية مع فريقنا. سنقيّم أهدافك وأسلوب حياتك ومستواك الرياضي لمطابقتك مع البرنامج المناسب.',
  'hiw.step2.title': 'احصل على خطتك',
  'hiw.step2.desc': 'احصل على خطة تمرين وتغذية مخصصة بالكامل، مُصممة خصيصاً لجسمك وأهدافك وجدولك.',
  'hiw.step3.title': 'دعم المدرب',
  'hiw.step3.desc': 'ابق على تواصل مع مدربك المخصص. متابعة أسبوعية وتعديلات على الخطة ومراسلة فورية لإبقائك على المسار.',
  'hiw.step4.title': 'تتبع التقدم',
  'hiw.step4.desc': 'سجّل تقدمك، ارفع فحوصات الجسم، وشاهد تحولك يتكشف بأفكار مبنية على البيانات.',

  // Transformations section
  'trans.badge': 'قبل وبعد',
  'trans.title': 'أشخاص حقيقيون،',
  'trans.titleHighlight': 'نتائج حقيقية',
  'trans.subtitle': 'تحولات عملاء محمية بالخصوصية. النتائج تتفاوت حسب التزام الفرد والبرنامج.',
  'trans.disclaimer': 'هويات العملاء محمية. النتائج المعروضة بإذن.',
  'trans.verified': 'نتيجة موثقة',
  'trans.more': 'مئات القصص الأخرى تنتظر أن تُروى',
  'trans.viewAll': 'عرض جميع التحولات',
  'trans.t1.label': 'خسر',
  'trans.t1.program': 'فقدان الدهون',
  'trans.t1.duration': '١٢ أسبوعاً',
  'trans.t1.change': 'تحسّن تكوين الجسم بشكل ملحوظ. التدريب المنتظم والتغذية المخصصة صنعا الفارق.',
  'trans.t2.label': 'اكتسب',
  'trans.t2.program': 'بناء العضلات',
  'trans.t2.duration': '١٦ أسبوعاً',
  'trans.t2.change': 'زادت القوة بنسبة ٤٠٪. التحميل التدريجي وتخطيط التغذية الدقيق أرسيا أساساً يدوم.',
  'trans.t3.label': 'ثقة',
  'trans.t3.program': 'جسم صيفي',
  'trans.t3.duration': '١٢ أسبوعاً',
  'trans.t3.change': 'طاقة أكبر، قوام أفضل، وجسم يستحق الفخر — تحقّق بفضل الاتساق والإرشاد المتخصص.',
  'trans.stat1': 'عضو نشط',
  'trans.stat2': 'نسبة النجاح',
  'trans.stat3': 'متوسط المدة',
  'trans.stat4': 'متابعة منجزة',

  // Pricing section
  'pricing.badge': 'الأسعار',
  'pricing.title': 'أسعار',
  'pricing.titleHighlight': 'شفافة وبسيطة',
  'pricing.subtitle': 'لا رسوم خفية. لا تجارب مجانية. اختر الخطة التي تناسب أهدافك.',
  'pricing.perMonth': '/شهر',
  'pricing.getStarted': 'ابدأ الآن',
  'pricing.popular': 'الأكثر شعبية',
  'pricing.consultation': 'احجز استشارة مجانية',
  'pricing.footer1': 'جميع الأسعار بالريال السعودي. تُدار الأسعار من لوحة التحكم وقد تتغير.',
  'pricing.footer2': 'لست متأكداً من الخطة المناسبة؟ احجز استشارتك المجانية — بدون أي التزام.',
  'pricing.plan1.name': 'الخطة فقط',
  'pricing.plan1.tagline': 'تدرّب بوتيرتك الخاصة',
  'pricing.plan1.desc': 'احصل على خطة غذاء أو تمرين مخصصة بالكامل حول جسمك وأهدافك وأسلوب حياتك.',
  'pricing.plan1.cta': 'ابدأ الآن',
  'pricing.plan1.f1': 'خطة غذاء أو تمرين مخصصة',
  'pricing.plan1.f2': 'مصممة وفق أهدافك',
  'pricing.plan1.f3': 'مراعاة القيود الغذائية',
  'pricing.plan1.f4': 'تحديث أسبوعي للخطة',
  'pricing.plan1.f5': 'إمكانية تحميل PDF',
  'pricing.plan2.name': 'التدريب الكامل',
  'pricing.plan2.tagline': 'البرنامج الأكثر اختياراً',
  'pricing.plan2.desc': 'تجربة تدريب متكاملة — خطط مخصصة، متابعة أسبوعية، ووصول مباشر لمدربك.',
  'pricing.plan2.cta': 'ابدأ التدريب',
  'pricing.plan2.f1': 'خطة غذاء + تمرين مخصصة',
  'pricing.plan2.f2': 'مدرب شخصي مخصص',
  'pricing.plan2.f3': 'متابعة أسبوعية فردية',
  'pricing.plan2.f4': 'مراسلة فورية مع المدرب',
  'pricing.plan2.f5': 'تتبع التقدم وتعديل الخطط',
  'pricing.plan2.f6': 'دعم تحليل InBody',
  'pricing.plan2.f7': 'تحديثات ذات أولوية للخطة',
  'pricing.plan3.name': 'النخبة',
  'pricing.plan3.tagline': 'أقصى النتائج',
  'pricing.plan3.desc': 'تجربة OMR+ الكاملة — تدريب نخبوي مع إضافات متميزة لمن يريد الأفضل.',
  'pricing.plan3.cta': 'انضم للنخبة',
  'pricing.plan3.f1': 'كل مزايا التدريب الكامل',
  'pricing.plan3.f2': 'رسائل غير محدودة مع المدرب',
  'pricing.plan3.f3': 'استشارات فيديو كل أسبوعين',
  'pricing.plan3.f4': 'إرشاد المكملات الغذائية',
  'pricing.plan3.f5': 'دعم التحضير للمسابقات',
  'pricing.plan3.f6': 'تأهيل ذو أولوية',

  // Consultation CTA
  'cta.title': 'مستعد للتحول؟',
  'cta.subtitle': 'احجز استشارتك المجانية اليوم واخطُ أولى خطواتك نحو الجسم الذي تستحقه.',
  'cta.btn': 'احجز استشارة مجانية',

  // Testimonials
  'testimonials.badge': 'آراء العملاء',
  'testimonials.title': 'ما يقوله',
  'testimonials.titleHighlight': 'أعضاؤنا',

  // Login page
  'login.memberPortal': 'بوابة الأعضاء',
  'login.title': 'مرحباً بعودتك',
  'login.subtitle': 'سجّل دخولك للوصول إلى لوحة التدريب',
  'login.email': 'البريد الإلكتروني',
  'login.emailPlaceholder': 'أنت@مثال.com',
  'login.password': 'كلمة المرور',
  'login.forgotPassword': 'نسيت كلمة المرور؟',
  'login.signIn': 'تسجيل الدخول',
  'login.signingIn': 'جارٍ تسجيل الدخول…',
  'login.noAccount': 'ليس لديك حساب؟',
  'login.createOne': 'أنشئ حساباً',
  'login.secureLogin': 'تسجيل آمن',
  'login.dataPrivate': 'بياناتك خاصة',

  // Signup page
  'signup.memberPortal': 'عضو جديد',
  'signup.title': 'أنشئ حسابك',
  'signup.subtitle': 'انضم إلى OMR+ وابدأ تحولك',
  'signup.fullName': 'الاسم الكامل',
  'signup.fullNamePlaceholder': 'اسمك الكامل',
  'signup.email': 'البريد الإلكتروني',
  'signup.emailPlaceholder': 'أنت@مثال.com',
  'signup.password': 'كلمة المرور',
  'signup.passwordPlaceholder': '••••••••',
  'signup.confirmPassword': 'تأكيد كلمة المرور',
  'signup.confirmPlaceholder': '••••••••',
  'signup.createAccount': 'إنشاء حساب',
  'signup.creating': 'جارٍ الإنشاء…',
  'signup.haveAccount': 'لديك حساب بالفعل؟',
  'signup.signIn': 'سجّل دخولك',
  'signup.secureSignup': 'تسجيل آمن',
  'signup.dataPrivate': 'بياناتك خاصة',

  // Dashboard Shell
  'dash.memberPortal': 'بوابة الأعضاء',
  'dash.coachPortal': 'بوابة المدرب',
  'dash.adminPanel': 'لوحة الإدارة',
  'dash.signOut': 'تسجيل الخروج',
  'dash.backToSite': 'العودة للموقع',

  // Client Dashboard
  'client.overview': 'نظرة عامة',
  'client.mealPlan': 'خطة الطعام',
  'client.workoutPlan': 'خطة التمرين',
  'client.progress': 'التقدم',
  'client.messages': 'الرسائل',
  'client.subscription': 'الاشتراك',
  'client.welcome': 'مرحباً بعودتك',
  'client.yourCoach': 'مدربك',
  'client.noCoach': 'لم يتم تعيين مدرب بعد',
  'client.activePlan': 'الخطة النشطة',
  'client.loading': 'جارٍ التحميل…',
  'client.noMealPlan': 'لم يتم تعيين خطة طعام بعد',
  'client.noWorkoutPlan': 'لم يتم تعيين خطة تمرين بعد',
  'client.watchVideo': 'مشاهدة',

  // Coach Dashboard
  'coach.clients': 'العملاء',
  'coach.mealBuilder': 'بناء الوجبات',
  'coach.workoutBuilder': 'بناء التمارين',
  'coach.progress': 'التقدم',
  'coach.messages': 'الرسائل',
  'coach.welcome': 'مرحباً بك، أيها المدرب',
  'coach.myClients': 'عملائي',
  'coach.assignedClients': 'العملاء المُعيَّنون',

  // Admin Dashboard
  'admin.overview': 'نظرة عامة',
  'admin.users': 'المستخدمون',
  'admin.coaches': 'المدربون',
  'admin.subscriptions': 'الاشتراكات',
  'admin.marketplace': 'المتجر',
  'admin.pricing': 'الأسعار',
  'admin.videos': 'الفيديوهات',
  'admin.analytics': 'التحليلات',
  'admin.chat': 'المحادثات',
  'admin.welcome': 'مرحباً، المدير',
};

// ── Provider ─────────────────────────────────────────────────────────────────

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('omr_lang') as Language | null;
    if (saved === 'ar' || saved === 'en') setLangState(saved);
  }, []);

  const setLang = useCallback((l: Language) => {
    setLangState(l);
    localStorage.setItem('omr_lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const dict = lang === 'ar' ? ar : en;
  const t = useCallback((key: string) => dict[key] ?? key, [dict]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
}
