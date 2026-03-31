'use client';

import { useState, useEffect, useRef } from 'react';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

/* ─── Nav Items ─────────────────────────────────────── */
const navItems: NavItem[] = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
  },
  {
    id: 'meal-plan', label: 'Meal Plan',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5M12 8.25V6.75m0 0c-1.354 0-2.7.055-4.024.166C6.845 6.885 6 7.647 6 8.55V6.75m6 1.5V6.75m6 1.5c-.224-.016-.449-.03-.676-.041m.676.041V6.75m0 1.5c1.354 0 2.7.055 4.024.166" /></svg>,
  },
  {
    id: 'workout', label: 'Workout Plan',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  },
  {
    id: 'progress', label: 'Progress',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
  },
  {
    id: 'messages', label: 'Messages',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>,
  },
  {
    id: 'subscription', label: 'Subscription',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
  },
];

/* ─── Onboarding Modal ───────────────────────────────── */
function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [form, setForm] = useState({
    goal: '', currentWeight: '', targetWeight: '',
    height: '', age: '', gender: '',
    activityLevel: '', dietaryRestrictions: '', healthConditions: '', experience: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('onboarding_responses').upsert({
      user_id: user.id,
      goal: form.goal,
      current_weight: form.currentWeight ? parseFloat(form.currentWeight) : null,
      target_weight: form.targetWeight ? parseFloat(form.targetWeight) : null,
      height: form.height ? parseFloat(form.height) : null,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      activity_level: form.activityLevel,
      dietary_restrictions: form.dietaryRestrictions,
      health_conditions: form.healthConditions,
      experience_level: form.experience,
    });
    await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', user.id);
    onComplete();
  };

  const SelectBtn = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <button
      type="button"
      onClick={() => update(field, value)}
      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: (form as Record<string, string>)[field] === value ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.04)',
        border: (form as Record<string, string>)[field] === value ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(255,255,255,0.08)',
        color: (form as Record<string, string>)[field] === value ? '#C9A84C' : 'rgba(255,255,255,0.55)',
      }}
    >{label}</button>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-2xl p-8"
        style={{ background: '#111', border: '1px solid rgba(201,168,76,0.2)' }}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30">
              Step {step} of {totalSteps}
            </span>
            <div className="flex gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="h-1 w-8 rounded-full transition-all"
                  style={{ background: i < step ? '#C9A84C' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome to OMR+</h2>
            <p className="text-white/40 text-sm mb-6">Tell us your primary goal to personalise your experience.</p>
            <div className="grid grid-cols-2 gap-3">
              {['Muscle Building', 'Fat Loss', 'Summer Body', 'General Fitness', 'Workout Only', 'Meal Plan Only'].map(g => (
                <SelectBtn key={g} label={g} value={g} field="goal" />
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Body Stats</h2>
            <p className="text-white/40 text-sm mb-6">Used to calculate your personalised plan.</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Current Weight (kg)', key: 'currentWeight', placeholder: '75' },
                { label: 'Target Weight (kg)', key: 'targetWeight', placeholder: '70' },
                { label: 'Height (cm)', key: 'height', placeholder: '175' },
                { label: 'Age', key: 'age', placeholder: '28' },
              ].map(f => (
                <div key={f.key}>
                  <label className="ds-label">{f.label}</label>
                  <input
                    type="number"
                    className="ds-input"
                    placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => update(f.key, e.target.value)}
                  />
                </div>
              ))}
              <div>
                <label className="ds-label">Gender</label>
                <div className="flex gap-2">
                  {['Male', 'Female'].map(g => <SelectBtn key={g} label={g} value={g} field="gender" />)}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Activity & Experience</h2>
            <p className="text-white/40 text-sm mb-5">This shapes your workout intensity.</p>
            <div className="mb-5">
              <label className="ds-label mb-3 block">Activity Level</label>
              <div className="flex flex-col gap-2">
                {['Sedentary (desk job)', 'Lightly Active (1–3x/week)', 'Moderately Active (3–5x/week)', 'Very Active (6–7x/week)'].map(a => (
                  <SelectBtn key={a} label={a} value={a} field="activityLevel" />
                ))}
              </div>
            </div>
            <div>
              <label className="ds-label mb-3 block">Training Experience</label>
              <div className="flex gap-2 flex-wrap">
                {['Beginner', 'Intermediate', 'Advanced'].map(e => (
                  <SelectBtn key={e} label={e} value={e} field="experience" />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Health & Dietary Info</h2>
            <p className="text-white/40 text-sm mb-5">Helps your coach personalise your meal plan safely.</p>
            <div className="space-y-4">
              <div>
                <label className="ds-label">Dietary Restrictions</label>
                <input
                  type="text"
                  className="ds-input"
                  placeholder="e.g. vegetarian, lactose intolerant, halal only…"
                  value={form.dietaryRestrictions}
                  onChange={e => update('dietaryRestrictions', e.target.value)}
                />
              </div>
              <div>
                <label className="ds-label">Health Conditions</label>
                <textarea
                  className="ds-input"
                  style={{ resize: 'none', minHeight: '80px' }}
                  placeholder="e.g. diabetes, knee injury, hypertension…"
                  value={form.healthConditions}
                  onChange={e => update('healthConditions', e.target.value)}
                />
              </div>
              <p className="text-xs text-white/25 leading-relaxed">
                All information is private and only visible to your assigned coach.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="ds-btn-outline">Back</button>
          ) : <div />}
          {step < totalSteps ? (
            <button onClick={() => setStep(s => s + 1)} className="ds-btn-gold" disabled={step === 1 && !form.goal}>
              Continue →
            </button>
          ) : (
            <button onClick={handleSubmit} className="ds-btn-gold">
              Complete Setup ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Overview Tab ───────────────────────────────────── */
function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { user } = useAuth();
  const stats = [
    { label: 'Active Streak', value: '12 days', icon: '🔥', color: 'rgba(255,120,80,0.15)', border: 'rgba(255,120,80,0.25)' },
    { label: 'This Week', value: '4 workouts', icon: '💪', color: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)' },
    { label: 'Weight Change', value: '−1.4 kg', icon: '📉', color: 'rgba(80,200,120,0.1)', border: 'rgba(80,200,120,0.2)' },
    { label: 'Days to Goal', value: '38 days', icon: '🎯', color: 'rgba(100,180,255,0.1)', border: 'rgba(100,180,255,0.2)' },
  ];

  const quickLinks = [
    { tab: 'meal-plan', label: "Today's Meals", sub: 'View your meal plan', icon: '🥗' },
    { tab: 'workout', label: "Today's Workout", sub: 'Upper body push day', icon: '🏋️' },
    { tab: 'progress', label: 'Log Progress', sub: 'Update your stats', icon: '📊' },
    { tab: 'messages', label: 'Message Coach', sub: '1 unread message', icon: '💬', badge: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">
          Good morning, <span style={{ color: '#C9A84C' }}>{user?.profile?.full_name?.split(' ')[0] ?? 'there'}</span> 👋
        </h2>
        <p className="text-white/35 text-sm">Here&apos;s your daily summary.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="ds-card p-5" style={{ background: s.color, borderColor: s.border }}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {quickLinks.map(q => (
          <button key={q.tab} onClick={() => onNavigate(q.tab)}
            className="ds-card p-5 text-left hover:border-brand-gold/30 transition-all duration-300 group"
            style={{ cursor: 'pointer' }}>
            <div className="flex items-start gap-4">
              <span className="text-2xl">{q.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">{q.label}</p>
                  {q.badge && <span className="w-2 h-2 rounded-full" style={{ background: '#C9A84C' }} />}
                </div>
                <p className="text-xs text-white/35 mt-0.5">{q.sub}</p>
              </div>
              <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors mt-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {/* Subscription notice */}
      <div className="ds-card p-5 flex items-center gap-4"
        style={{ background: 'rgba(201,168,76,0.05)', borderColor: 'rgba(201,168,76,0.18)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <svg className="w-5 h-5" style={{ color: '#C9A84C' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-white">Full Coaching — Active</p>
          <p className="text-xs text-white/35">Renews on May 1, 2026 · 30 days remaining</p>
        </div>
        <button onClick={() => onNavigate('subscription')} className="ds-btn-gold text-xs">Manage</button>
      </div>
    </div>
  );
}

/* ─── Meal Plan Tab ──────────────────────────────────── */
function MealPlanTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const meals = [
    {
      label: 'Breakfast', time: '7:00 – 8:00 AM', emoji: '🍳',
      items: [
        { name: 'Oats with skimmed milk', grams: 80, calories: 290 },
        { name: 'Hard-boiled eggs', grams: 150, calories: 210 },
        { name: 'Banana', grams: 120, calories: 105 },
      ],
    },
    {
      label: 'Lunch', time: '1:00 – 2:00 PM', emoji: '🥗',
      items: [
        { name: 'Grilled chicken breast', grams: 200, calories: 330 },
        { name: 'Brown rice', grams: 100, calories: 216 },
        { name: 'Mixed salad', grams: 150, calories: 35 },
      ],
    },
    {
      label: 'Snack', time: '4:00 – 4:30 PM', emoji: '🥜',
      items: [
        { name: 'Greek yoghurt', grams: 150, calories: 130 },
        { name: 'Almonds', grams: 30, calories: 173 },
      ],
    },
    {
      label: 'Dinner', time: '7:30 – 8:30 PM', emoji: '🍛',
      items: [
        { name: 'Salmon fillet', grams: 180, calories: 376 },
        { name: 'Sweet potato', grams: 150, calories: 128 },
        { name: 'Steamed broccoli', grams: 200, calories: 54 },
      ],
    },
  ];

  const totalCalories = meals.flatMap(m => m.items).reduce((a, i) => a + i.calories, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Your Meal Plan</h2>
          <p className="text-white/35 text-sm">Assigned by your coach · View-only</p>
        </div>
        <div className="ds-gold-pill">~{totalCalories} kcal / day</div>
      </div>

      <div className="grid gap-5">
        {meals.map(meal => {
          const mealCal = meal.items.reduce((a, i) => a + i.calories, 0);
          return (
            <div key={meal.label} className="ds-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{meal.emoji}</span>
                  <div>
                    <p className="font-semibold text-white">{meal.label}</p>
                    <p className="text-xs text-white/30">{meal.time}</p>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: '#C9A84C' }}>{mealCal} kcal</span>
              </div>
              <div className="space-y-2">
                {meal.items.map(item => (
                  <div key={item.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-white/70">{item.name}</span>
                    <div className="flex gap-4 text-xs text-white/35">
                      <span>{item.grams}g</span>
                      <span>{item.calories} kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Request changes */}
      <div className="mt-6 ds-card p-5 flex items-center gap-4"
        style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.1)' }}>
        <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'rgba(201,168,76,0.6)' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p className="text-sm text-white/45 flex-1">Need changes to your meal plan? Message your coach directly.</p>
        <button onClick={() => onNavigate('messages')} className="ds-btn-gold text-xs">Message Coach</button>
      </div>
    </div>
  );
}

/* ─── Workout Plan Tab ───────────────────────────────── */
function WorkoutTab() {
  const [activeDay, setActiveDay] = useState(0);
  const days = [
    {
      day: 'Mon', label: 'Upper Push', status: 'done',
      exercises: [
        { name: 'Flat Bench Press', sets: 4, reps: '8–10', rest: '90s', notes: 'Control the eccentric' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10–12', rest: '60s', notes: '' },
        { name: 'Overhead Press', sets: 3, reps: '8–10', rest: '90s', notes: 'Keep core tight' },
        { name: 'Lateral Raises', sets: 4, reps: '15–20', rest: '45s', notes: '' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12–15', rest: '45s', notes: '' },
      ],
    },
    {
      day: 'Tue', label: 'Lower Squat', status: 'done',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '6–8', rest: '2min', notes: 'Depth below parallel' },
        { name: 'Romanian Deadlift', sets: 3, reps: '10–12', rest: '90s', notes: '' },
        { name: 'Leg Press', sets: 3, reps: '12–15', rest: '60s', notes: '' },
        { name: 'Walking Lunges', sets: 3, reps: '12 each', rest: '60s', notes: '' },
        { name: 'Calf Raises', sets: 4, reps: '20–25', rest: '30s', notes: '' },
      ],
    },
    {
      day: 'Wed', label: 'Rest Day', status: 'rest', exercises: [] },
    {
      day: 'Thu', label: 'Upper Pull', status: 'today',
      exercises: [
        { name: 'Pull-Ups', sets: 4, reps: '6–8', rest: '90s', notes: 'Use band if needed' },
        { name: 'Barbell Row', sets: 4, reps: '8–10', rest: '90s', notes: '' },
        { name: 'Seated Cable Row', sets: 3, reps: '10–12', rest: '60s', notes: '' },
        { name: 'Face Pulls', sets: 3, reps: '15–20', rest: '45s', notes: '' },
        { name: 'Barbell Bicep Curls', sets: 3, reps: '10–12', rest: '45s', notes: '' },
      ],
    },
    {
      day: 'Fri', label: 'Lower Hinge', status: 'upcoming',
      exercises: [
        { name: 'Conventional Deadlift', sets: 4, reps: '5–6', rest: '2–3min', notes: 'Brace hard' },
        { name: 'Hip Thrust', sets: 4, reps: '10–12', rest: '90s', notes: '' },
        { name: 'Leg Curl', sets: 3, reps: '12–15', rest: '60s', notes: '' },
        { name: 'Leg Extension', sets: 3, reps: '15', rest: '45s', notes: '' },
      ],
    },
    { day: 'Sat', label: 'Active Recovery', status: 'upcoming', exercises: [] },
    { day: 'Sun', label: 'Full Rest', status: 'upcoming', exercises: [] },
  ];

  const statusColors: Record<string, string> = {
    done: 'rgba(80,200,120,0.12)',
    today: 'rgba(201,168,76,0.12)',
    rest: 'rgba(255,255,255,0.03)',
    upcoming: 'rgba(255,255,255,0.03)',
  };
  const statusBorders: Record<string, string> = {
    done: 'rgba(80,200,120,0.25)',
    today: 'rgba(201,168,76,0.3)',
    rest: 'rgba(255,255,255,0.06)',
    upcoming: 'rgba(255,255,255,0.06)',
  };

  const current = days[activeDay];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Weekly Workout Plan</h2>
        <p className="text-white/35 text-sm">Assigned by your coach · Tap a day to view exercises</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {days.map((d, i) => (
          <button key={d.day} onClick={() => setActiveDay(i)}
            className="flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl transition-all"
            style={{
              background: activeDay === i ? statusColors[d.status] : 'rgba(255,255,255,0.02)',
              border: activeDay === i ? `1px solid ${statusBorders[d.status]}` : '1px solid rgba(255,255,255,0.05)',
              minWidth: '58px',
            }}>
            <span className="text-[10px] font-semibold tracking-wider text-white/40 uppercase">{d.day}</span>
            {d.status === 'done' && <span className="text-[10px]" style={{ color: 'rgba(80,200,120,0.9)' }}>✓</span>}
            {d.status === 'today' && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />}
            {(d.status === 'rest' || d.status === 'upcoming') && <span className="text-[10px] text-white/20">—</span>}
          </button>
        ))}
      </div>

      {/* Day detail */}
      <div className="ds-card p-6"
        style={{ background: statusColors[current.status], borderColor: statusBorders[current.status] }}>
        <div className="flex items-center gap-3 mb-5">
          <div>
            <h3 className="font-bold text-white text-lg">{current.label}</h3>
            <p className="text-xs text-white/35">{days[activeDay].day}
              {current.status === 'today' && <span className="ml-2 text-yellow-500">— Today</span>}
              {current.status === 'done' && <span className="ml-2 text-green-400">— Completed</span>}
            </p>
          </div>
        </div>

        {current.exercises.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-3">😴</p>
            <p className="text-white/40 text-sm">Recovery day — rest, hydrate, sleep well.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {current.exercises.map((ex, i) => (
              <div key={ex.name} className="rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(201,168,76,0.1)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{ex.name}</p>
                      {ex.notes && <p className="text-xs text-white/30 mt-0.5">{ex.notes}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 text-right flex-shrink-0">
                    <div>
                      <p className="text-[10px] text-white/25 uppercase tracking-wider">Sets</p>
                      <p className="text-sm font-bold text-white">{ex.sets}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/25 uppercase tracking-wider">Reps</p>
                      <p className="text-sm font-bold text-white">{ex.reps}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/25 uppercase tracking-wider">Rest</p>
                      <p className="text-sm font-bold text-white">{ex.rest}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Progress Tab ───────────────────────────────────── */
function ProgressTab() {
  const { user } = useAuth();
  const [logForm, setLogForm] = useState({ weight: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const logs = [
    { date: 'Mar 30', weight: 82.1, notes: 'Feeling good' },
    { date: 'Mar 27', weight: 82.8, notes: '' },
    { date: 'Mar 24', weight: 83.5, notes: 'Bloated from cheat meal' },
    { date: 'Mar 21', weight: 83.9, notes: '' },
    { date: 'Mar 18', weight: 84.2, notes: 'Start weight' },
  ];

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    await supabase.from('progress_logs').insert({
      user_id: u.id,
      weight: parseFloat(logForm.weight),
      notes: logForm.notes || null,
    });
    setSubmitted(true);
    setLogForm({ weight: '', notes: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleBodyCheckUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    const file = files[0];
    const ext = file.name.split('.').pop();
    const path = `body-checks/${u.id}/${Date.now()}.${ext}`;
    const { data: uploadData } = await supabase.storage.from('body-checks').upload(path, file);
    if (uploadData) {
      const { data: { publicUrl } } = supabase.storage.from('body-checks').getPublicUrl(path);
      await supabase.from('body_checks').insert({
        user_id: u.id,
        file_url: publicUrl,
        file_type: file.type,
      });
      setUploadMode(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Progress Tracking</h2>
        <p className="text-white/35 text-sm">Log your stats and upload body check files</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Log form */}
        <div className="ds-card p-6">
          <h3 className="font-semibold text-white mb-4">Log Today&apos;s Stats</h3>
          {submitted ? (
            <div className="text-center py-6">
              <p className="text-3xl mb-2">✅</p>
              <p className="text-sm text-white/60">Stats logged successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div>
                <label className="ds-label">Weight (kg)</label>
                <input type="number" step="0.1" className="ds-input" placeholder="82.5"
                  value={logForm.weight} onChange={e => setLogForm(f => ({ ...f, weight: e.target.value }))} required />
              </div>
              <div>
                <label className="ds-label">Notes (optional)</label>
                <input type="text" className="ds-input" placeholder="How are you feeling today?"
                  value={logForm.notes} onChange={e => setLogForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
              <button type="submit" className="ds-btn-gold w-full justify-center">
                Save Entry
              </button>
            </form>
          )}
        </div>

        {/* Weight chart (visual bar graph) */}
        <div className="ds-card p-6">
          <h3 className="font-semibold text-white mb-4">Weight Timeline</h3>
          <div className="flex items-end gap-2 h-32 mb-4">
            {logs.map((log, i) => {
              const min = Math.min(...logs.map(l => l.weight));
              const max = Math.max(...logs.map(l => l.weight));
              const range = max - min || 1;
              const pct = ((log.weight - min) / range) * 60 + 30;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-white/40">{log.weight}</span>
                  <div className="w-full rounded-t-md transition-all"
                    style={{
                      height: `${pct}%`,
                      background: i === 0 ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)',
                      border: i === 0 ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.12)',
                    }} />
                  <span className="text-[9px] text-white/30">{log.date}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-xs text-white/35">
            <span className="w-2 h-2 rounded-full" style={{ background: 'rgba(80,200,120,0.7)' }} />
            Total loss: <span className="text-green-400 font-semibold">−2.1 kg</span>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="ds-card p-6 mt-6">
        <h3 className="font-semibold text-white mb-4">Log History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/06">
                <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/25 font-semibold pb-3">Date</th>
                <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/25 font-semibold pb-3">Weight</th>
                <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/25 font-semibold pb-3">Change</th>
                <th className="text-left py-2 text-[10px] uppercase tracking-wider text-white/25 font-semibold pb-3">Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const prev = logs[i + 1]?.weight;
                const change = prev ? (log.weight - prev).toFixed(1) : null;
                return (
                  <tr key={i} className="border-b border-white/04 last:border-0">
                    <td className="py-3 text-white/60">{log.date}</td>
                    <td className="py-3 font-semibold text-white">{log.weight} kg</td>
                    <td className="py-3">
                      {change && (
                        <span className="text-xs font-medium" style={{ color: parseFloat(change) < 0 ? 'rgba(80,200,120,0.9)' : 'rgba(255,100,100,0.9)' }}>
                          {parseFloat(change) > 0 ? '+' : ''}{change} kg
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-white/35 text-xs">{log.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Body Check Upload */}
      <div className="ds-card p-6 mt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-white">Body Check Uploads</h3>
            <p className="text-xs text-white/35 mt-0.5">Upload InBody scans, progress photos, or PDFs</p>
          </div>
          <button onClick={() => setUploadMode(true)} className="ds-btn-gold text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload File
          </button>
        </div>
        {uploadMode && (
          <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(201,168,76,0.05)', border: '1px dashed rgba(201,168,76,0.3)' }}>
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleBodyCheckUpload}
              className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold"
              style={{ '--file-bg': 'rgba(201,168,76,0.1)' } as React.CSSProperties} />
            <button onClick={() => setUploadMode(false)} className="mt-2 text-xs text-white/30 hover:text-white/60">Cancel</button>
          </div>
        )}
        <div className="text-center py-6">
          <p className="text-sm text-white/25">No uploads yet. Add your first body check above.</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Messages Tab ───────────────────────────────────── */
function MessagesTab() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'coach', senderName: 'Coach Omar', text: 'Great progress this week! Your weight is trending down nicely. Keep it up 💪', time: '10:32 AM', isRead: true },
    { id: 2, sender: 'client', senderName: 'You', text: 'Thank you! I had a tough workout on Thursday but pushed through.', time: '11:05 AM', isRead: true },
    { id: 3, sender: 'coach', senderName: 'Coach Omar', text: "That's exactly the mindset. Let me know if you want to adjust any exercise for next week.", time: '11:10 AM', isRead: false },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    const newMsg = {
      id: messages.length + 1,
      sender: 'client' as const,
      senderName: 'You',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };
    setMessages(m => [...m, newMsg]);
    setMessage('');
    // In production: await supabase.from('messages').insert({ thread_id: threadId, sender_id: u.id, content: message })
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Messages</h2>
        <p className="text-white/35 text-sm">Direct chat with your assigned coach</p>
      </div>

      <div className="ds-card flex flex-col" style={{ height: '520px' }}>
        {/* Chat header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/06">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }}>
            <span className="text-sm font-bold" style={{ color: '#C9A84C' }}>C</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Coach Omar</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(80,200,120,0.9)' }} />
              <span className="text-[10px] text-white/35">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[75%]">
                <div className="rounded-2xl px-4 py-2.5"
                  style={{
                    background: msg.sender === 'client' ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.05)',
                    border: msg.sender === 'client' ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <p className="text-sm text-white/85 leading-relaxed">{msg.text}</p>
                </div>
                <p className="text-[10px] text-white/25 mt-1 px-1">
                  {msg.senderName} · {msg.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-white/06">
          <input
            type="text"
            className="ds-input flex-1"
            placeholder="Type a message…"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button type="submit" className="ds-btn-gold px-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Subscription Tab ───────────────────────────────── */
function SubscriptionTab() {
  const invoices = [
    { id: 'INV-0043', date: 'Apr 1, 2026', plan: 'Full Coaching', amount: 'SAR 349', status: 'Paid' },
    { id: 'INV-0031', date: 'Mar 1, 2026', plan: 'Full Coaching', amount: 'SAR 349', status: 'Paid' },
    { id: 'INV-0019', date: 'Feb 1, 2026', plan: 'Full Coaching', amount: 'SAR 349', status: 'Paid' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Subscription</h2>
        <p className="text-white/35 text-sm">Manage your plan, billing & invoices</p>
      </div>

      {/* Active plan card */}
      <div className="ds-card p-6 mb-6"
        style={{ background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.2)' }}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="ds-gold-pill mb-3">Active Plan</div>
            <h3 className="text-2xl font-bold text-white mb-1">Full Coaching</h3>
            <p className="text-sm text-white/40">Personalised meal plan + workout plan + coach support</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold" style={{ color: '#C9A84C' }}>SAR 349</p>
            <p className="text-xs text-white/35">/ month</p>
          </div>
        </div>

        <div className="ds-divider" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Status', value: 'Active', color: 'rgba(80,200,120,0.9)' },
            { label: 'Next billing', value: 'May 1, 2026', color: 'rgba(255,255,255,0.75)' },
            { label: 'Days remaining', value: '30 days', color: 'rgba(255,255,255,0.75)' },
            { label: 'Member since', value: 'Feb 1, 2026', color: 'rgba(255,255,255,0.75)' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">{item.label}</p>
              <p className="text-sm font-semibold" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Available plans */}
      <div className="ds-card p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Change Plan</h3>
        <div className="grid gap-3">
          {[
            { name: 'Plan Only', nameAr: 'خطة فقط', price: 'SAR 149', desc: 'Workout or meal plan without coaching', active: false },
            { name: 'Full Coaching', nameAr: 'تدريب كامل', price: 'SAR 349', desc: 'Meal plan + workout plan + coach support', active: true },
            { name: 'Elite Coaching', nameAr: 'تدريب نخبة', price: 'SAR 549', desc: 'Full Coaching + weekly check-ins + priority support', active: false },
          ].map(plan => (
            <div key={plan.name} className="rounded-xl p-4 flex items-center gap-4"
              style={{
                background: plan.active ? 'rgba(201,168,76,0.06)' : 'rgba(255,255,255,0.02)',
                border: plan.active ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.07)',
              }}>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-white">{plan.name}</p>
                  <span className="text-xs text-white/25">{plan.nameAr}</span>
                  {plan.active && <span className="ds-gold-pill" style={{ fontSize: '9px' }}>Current</span>}
                </div>
                <p className="text-xs text-white/35 mt-0.5">{plan.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: plan.active ? '#C9A84C' : 'rgba(255,255,255,0.6)' }}>{plan.price}<span className="text-xs font-normal text-white/30">/mo</span></p>
                {!plan.active && <button className="ds-btn-outline text-xs mt-1.5">Switch</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="ds-card p-6">
        <h3 className="font-semibold text-white mb-4">Invoice History</h3>
        <div className="space-y-2">
          {invoices.map(inv => (
            <div key={inv.id} className="flex items-center gap-4 py-3 border-b border-white/05 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{inv.plan}</p>
                <p className="text-xs text-white/30">{inv.date} · {inv.id}</p>
              </div>
              <span className="text-sm font-semibold text-white/70">{inv.amount}</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(80,200,120,0.1)', color: 'rgba(80,200,120,0.9)', border: '1px solid rgba(80,200,120,0.2)' }}>
                {inv.status}
              </span>
              <button className="ds-btn-outline text-xs px-3 py-1.5">PDF</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ClientDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user && user.profile && !user.profile.onboarding_completed) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleOnboardingComplete = () => setShowOnboarding(false);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab onNavigate={setActiveTab} />;
      case 'meal-plan': return <MealPlanTab onNavigate={setActiveTab} />;
      case 'workout': return <WorkoutTab />;
      case 'progress': return <ProgressTab />;
      case 'messages': return <MessagesTab />;
      case 'subscription': return <SubscriptionTab />;
      default: return null;
    }
  };

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <DashboardShell role="client" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
        {renderTab()}
      </DashboardShell>
    </>
  );
}
