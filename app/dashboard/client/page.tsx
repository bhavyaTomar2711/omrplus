'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

/* ─── Icons ──────────────────────────────────────────── */
const Icons = {
  grid: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
  meal: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5M12 8.25V6.75m0 0c-1.354 0-2.7.055-4.024.166C6.845 6.885 6 7.647 6 8.55V6.75m6 1.5V6.75m6 1.5c-.224-.016-.449-.03-.676-.041m.676.041V6.75" /></svg>,
  bolt: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  chart: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
  chat: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>,
  card: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
  fire: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" /></svg>,
  arrow: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  send: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>,
  upload: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>,
  check: <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>,
  user: <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>,
};

const navItems: NavItem[] = [
  { id: 'overview',     label: 'Overview',     icon: Icons.grid  },
  { id: 'meal-plan',    label: 'Meal Plan',     icon: Icons.meal  },
  { id: 'workout',      label: 'Workout Plan',  icon: Icons.bolt  },
  { id: 'progress',     label: 'Progress',      icon: Icons.chart },
  { id: 'messages',     label: 'Messages',      icon: Icons.chat  },
  { id: 'subscription', label: 'Subscription',  icon: Icons.card  },
];

/* ─── Types ──────────────────────────────────────────── */
interface MealPlanItem { id:string; meal_type:string; meal_timing:string|null; food_name:string; quantity_g:number|null; calories:number|null; }
interface MealPlan { id:string; title:string; meal_plan_items: MealPlanItem[]; }
interface WorkoutExercise { id:string; exercise_name:string; sets:number|null; reps:string|null; rest_seconds:number|null; notes:string|null; sort_order:number; }
interface WorkoutDay { id:string; day_label:string; focus:string|null; sort_order:number; workout_exercises: WorkoutExercise[]; }
interface WorkoutPlan { id:string; title:string; workout_plan_days: WorkoutDay[]; }
interface ProgressLog { id:string; weight_kg:number|null; notes:string|null; logged_at:string; }
interface Message { id:string; sender_id:string; content:string; created_at:string; }

/* ─── Onboarding Modal ───────────────────────────────── */
function OnboardingModal({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const total = 4;
  const [form, setForm] = useState({ goal:'', currentWeight:'', targetWeight:'', height:'', age:'', gender:'', activityLevel:'', dietaryRestrictions:'', healthConditions:'', experience:'' });
  const set = (k:string,v:string) => setForm(f=>({...f,[k]:v}));

  const Chip = ({ label, field, value }: { label:string; field:string; value:string }) => {
    const active = (form as Record<string,string>)[field] === value;
    return (
      <button type="button" onClick={() => set(field, value)}
        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
        style={{ background: active ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)', border: active ? '1px solid rgba(201,168,76,0.45)' : '1px solid rgba(255,255,255,0.08)', color: active ? '#C9A84C' : 'rgba(255,255,255,0.5)' }}>
        {label}
      </button>
    );
  };

  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('onboarding_responses').upsert({ user_id:user.id, goal:form.goal, current_weight:form.currentWeight?parseFloat(form.currentWeight):null, target_weight:form.targetWeight?parseFloat(form.targetWeight):null, height:form.height?parseFloat(form.height):null, age:form.age?parseInt(form.age):null, gender:form.gender, activity_level:form.activityLevel, dietary_restrictions:form.dietaryRestrictions, health_conditions:form.healthConditions, experience_level:form.experience });
    await supabase.from('profiles').update({ onboarding_completed:true }).eq('id', user.id);
    onComplete();
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem', background:'rgba(0,0,0,0.88)', backdropFilter:'blur(8px)' }}>
      <div style={{ width:'100%', maxWidth:520, background:'#0E0E0E', border:'1px solid rgba(201,168,76,0.22)', borderRadius:24, padding:'2.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.75rem' }}>
          <div>
            <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(255,255,255,0.28)' }}>Step {step} of {total}</p>
            <div style={{ display:'flex', gap:6, marginTop:8 }}>
              {Array.from({length:total}).map((_,i) => <div key={i} style={{ height:3, width:36, borderRadius:4, background: i<step ? '#C9A84C' : 'rgba(255,255,255,0.1)', transition:'background 0.3s' }} />)}
            </div>
          </div>
        </div>

        {step===1 && <div>
          <h2 style={{ fontSize:'1.5rem', fontWeight:700, color:'white', marginBottom:6 }}>Welcome to OMR+</h2>
          <p style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.38)', marginBottom:'1.5rem' }}>What&apos;s your primary goal?</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {['Muscle Building','Fat Loss','Summer Body','General Fitness','Workout Only','Meal Plan Only'].map(g => <Chip key={g} label={g} value={g} field="goal" />)}
          </div>
        </div>}

        {step===2 && <div>
          <h2 style={{ fontSize:'1.5rem', fontWeight:700, color:'white', marginBottom:6 }}>Your Body Stats</h2>
          <p style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.38)', marginBottom:'1.5rem' }}>Used to calculate your personalised plan</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            {[{label:'Current Weight (kg)',key:'currentWeight',ph:'75'},{label:'Target Weight (kg)',key:'targetWeight',ph:'70'},{label:'Height (cm)',key:'height',ph:'175'},{label:'Age',key:'age',ph:'28'}].map(f=>(
              <div key={f.key}><label className="ds-label">{f.label}</label><input type="number" className="ds-input" placeholder={f.ph} value={(form as Record<string,string>)[f.key]} onChange={e=>set(f.key,e.target.value)} /></div>
            ))}
            <div style={{ gridColumn:'span 2' }}>
              <label className="ds-label">Gender</label>
              <div style={{ display:'flex', gap:10 }}>
                {['Male','Female'].map(g=><Chip key={g} label={g} value={g} field="gender" />)}
              </div>
            </div>
          </div>
        </div>}

        {step===3 && <div>
          <h2 style={{ fontSize:'1.5rem', fontWeight:700, color:'white', marginBottom:6 }}>Activity & Experience</h2>
          <p style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.38)', marginBottom:'1.25rem' }}>This shapes your workout intensity</p>
          <label className="ds-label" style={{ marginBottom:10, display:'block' }}>Activity Level</label>
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:'1.25rem' }}>
            {['Sedentary (desk job)','Lightly Active (1–3x/week)','Moderately Active (3–5x/week)','Very Active (6–7x/week)'].map(a=><Chip key={a} label={a} value={a} field="activityLevel" />)}
          </div>
          <label className="ds-label" style={{ marginBottom:10, display:'block' }}>Training Experience</label>
          <div style={{ display:'flex', gap:8 }}>
            {['Beginner','Intermediate','Advanced'].map(e=><Chip key={e} label={e} value={e} field="experience" />)}
          </div>
        </div>}

        {step===4 && <div>
          <h2 style={{ fontSize:'1.5rem', fontWeight:700, color:'white', marginBottom:6 }}>Health & Dietary Info</h2>
          <p style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.38)', marginBottom:'1.5rem' }}>Helps your coach personalise your meal plan safely</p>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div><label className="ds-label">Dietary Restrictions</label><input type="text" className="ds-input" placeholder="e.g. vegetarian, lactose intolerant, halal only…" value={form.dietaryRestrictions} onChange={e=>set('dietaryRestrictions',e.target.value)} /></div>
            <div><label className="ds-label">Health Conditions</label><textarea className="ds-input" style={{ resize:'none', minHeight:80 }} placeholder="e.g. diabetes, knee injury, hypertension…" value={form.healthConditions} onChange={e=>set('healthConditions',e.target.value)} /></div>
            <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.22)', lineHeight:1.7 }}>All information is private and only visible to your assigned coach.</p>
          </div>
        </div>}

        <div style={{ display:'flex', justifyContent:'space-between', marginTop:'2rem' }}>
          {step>1 ? <button onClick={()=>setStep(s=>s-1)} className="ds-btn-outline">Back</button> : <div />}
          {step<total
            ? <button onClick={()=>setStep(s=>s+1)} className="ds-btn-gold" disabled={step===1&&!form.goal}>Continue →</button>
            : <button onClick={handleSubmit} className="ds-btn-gold">Complete Setup</button>}
        </div>
      </div>
    </div>
  );
}

/* ─── Overview Tab ───────────────────────────────────── */
function OverviewTab({ progressLogs, mealPlan, workoutPlan, onNavigate }: {
  progressLogs: ProgressLog[]; mealPlan: MealPlan|null; workoutPlan: WorkoutPlan|null; onNavigate:(tab:string)=>void;
}) {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const weightChange = progressLogs.length >= 2
    ? (progressLogs[0].weight_kg ?? 0) - (progressLogs[progressLogs.length-1].weight_kg ?? 0)
    : null;

  const stats = [
    { label:'Active Streak', value:'12 days', sub:'Keep it up', icon:Icons.fire, color:'rgba(251,146,60,0.12)', border:'rgba(251,146,60,0.22)' },
    { label:'Meal Plan', value:mealPlan?'Assigned':'Pending', sub:mealPlan?mealPlan.title:'Awaiting coach', icon:Icons.meal, color:'rgba(201,168,76,0.08)', border:'rgba(201,168,76,0.2)' },
    { label:'Weight Change', value:weightChange!=null?`${weightChange>0?'+':''}${weightChange.toFixed(1)} kg`:'No logs yet', sub:'From first entry', icon:Icons.chart, color:'rgba(74,222,128,0.07)', border:'rgba(74,222,128,0.18)' },
    { label:'Workout Plan', value:workoutPlan?'Assigned':'Pending', sub:workoutPlan?workoutPlan.title:'Awaiting coach', icon:Icons.bolt, color:'rgba(100,180,255,0.07)', border:'rgba(100,180,255,0.18)' },
  ];

  const quick = [
    { tab:'meal-plan',    label:"Today's Meals",    sub: mealPlan?`${mealPlan.meal_plan_items.length} items today`:'No plan assigned yet' },
    { tab:'workout',      label:"Today's Workout",  sub: workoutPlan?workoutPlan.title:'No plan assigned yet' },
    { tab:'progress',     label:'Log Progress',     sub:'Update your weight & stats' },
    { tab:'messages',     label:'Message Coach',    sub:'Chat with your assigned coach' },
  ];

  return (
    <div>
      <div style={{ marginBottom:'1.75rem' }}>
        <h2 style={{ fontSize:'1.6rem', fontWeight:700, color:'white', marginBottom:4 }}>
          {greeting}, <span style={{ color:'#C9A84C' }}>{user?.profile?.full_name?.split(' ')[0] ?? 'there'}</span>
        </h2>
        <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.32)' }}>Here&apos;s your daily summary.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:20 }} className="lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="ds-stat" style={{ background:s.color, borderColor:s.border }}>
            <div className="ds-stat-icon" style={{ background:s.color, borderColor:s.border }}>{s.icon}</div>
            <div className="ds-stat-value" style={{ fontSize:'1.4rem' }}>{s.value}</div>
            <div className="ds-stat-label">{s.label}</div>
            <div className="ds-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:20 }}>
        {quick.map(q => (
          <button key={q.tab} onClick={()=>onNavigate(q.tab)}
            className="ds-card"
            style={{ padding:'1.35rem 1.5rem', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:'1rem', transition:'border-color 0.2s ease' }}
            onMouseEnter={e=>(e.currentTarget.style.borderColor='rgba(201,168,76,0.25)')}
            onMouseLeave={e=>(e.currentTarget.style.borderColor='rgba(255,255,255,0.07)')}>
            <div>
              <p style={{ fontSize:'0.85rem', fontWeight:600, color:'rgba(255,255,255,0.85)', marginBottom:3 }}>{q.label}</p>
              <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.32)' }}>{q.sub}</p>
            </div>
            <span style={{ marginLeft:'auto', color:'rgba(255,255,255,0.2)' }}>{Icons.arrow}</span>
          </button>
        ))}
      </div>

      <div className="ds-card-gold" style={{ padding:'1.35rem 1.5rem', display:'flex', alignItems:'center', gap:'1rem' }}>
        <div className="ds-icon-box">{Icons.card}</div>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:'0.85rem', fontWeight:600, color:'white' }}>Full Coaching — Active</p>
          <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.32)', marginTop:2 }}>Renews May 1, 2026 · 30 days remaining</p>
        </div>
        <button onClick={()=>onNavigate('subscription')} className="ds-btn-gold" style={{ padding:'0.5rem 1rem', fontSize:'0.75rem' }}>Manage</button>
      </div>
    </div>
  );
}

/* ─── Meal Plan Tab ──────────────────────────────────── */
function MealPlanTab({ mealPlan, loading, onNavigate }: { mealPlan:MealPlan|null; loading:boolean; onNavigate:(tab:string)=>void }) {
  if (loading) return <div className="ds-empty"><div className="ds-loading" style={{ height:200, background:'rgba(255,255,255,0.03)', borderRadius:16 }} /></div>;

  if (!mealPlan) return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}><p className="ds-section-title">Meal Plan</p><p className="ds-section-sub">View your personalised meal plan assigned by your coach</p></div>
      <div className="ds-card ds-empty">
        <div className="ds-empty-icon">{Icons.meal}</div>
        <p>No meal plan assigned yet</p>
        <small>Your coach will assign a meal plan once your onboarding is reviewed.</small>
      </div>
    </div>
  );

  // Ordered display labels keyed by the DB value coaches save
  const MEAL_LABELS: Record<string, string> = {
    breakfast: 'Breakfast',
    morning_snack: 'Morning Snack',
    lunch: 'Lunch',
    afternoon_snack: 'Afternoon Snack',
    dinner: 'Dinner',
    pre_workout: 'Pre-Workout',
    post_workout: 'Post-Workout',
    snack: 'Snack',
  };
  const ORDER = ['breakfast','morning_snack','lunch','afternoon_snack','dinner','pre_workout','post_workout','snack'];

  // Group by normalised meal_type (lowercase, trim)
  const grouped: Record<string, MealPlanItem[]> = {};
  for (const item of mealPlan.meal_plan_items) {
    const key = item.meal_type?.toLowerCase().trim() ?? 'other';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  // Sort groups by ORDER, put unknowns at end
  const sortedGroups = Object.entries(grouped).sort(([a],[b]) => {
    const ai = ORDER.indexOf(a), bi = ORDER.indexOf(b);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  const totalCal = mealPlan.meal_plan_items.reduce((s,i)=>s+(i.calories??0),0);

  return (
    <div>
      <div style={{ display:'flex', alignItems:'start', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:12 }}>
        <div><p className="ds-section-title">{mealPlan.title}</p><p className="ds-section-sub">Assigned by your coach · View-only</p></div>
        {totalCal > 0 && <span className="ds-gold-pill">{totalCal} kcal / day</span>}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {sortedGroups.map(([type, items]) => {
          const mealCal = items.reduce((s,i)=>s+(i.calories??0),0);
          const timing = items[0]?.meal_timing;
          const displayLabel = MEAL_LABELS[type] ?? type.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
          return (
            <div key={type} className="ds-card" style={{ padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <div className="ds-icon-box">{Icons.meal}</div>
                  <div>
                    <p style={{ fontWeight:600, color:'white', fontSize:'0.9rem' }}>{displayLabel}</p>
                    {timing && <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.28)' }}>{timing}</p>}
                  </div>
                </div>
                {mealCal > 0 && <span style={{ fontSize:'0.85rem', fontWeight:600, color:'#C9A84C' }}>{mealCal} kcal</span>}
              </div>
              <div>
                {items.map((item,i) => (
                  <div key={item.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.65rem 0', borderBottom: i<items.length-1?'1px solid rgba(255,255,255,0.05)':'none' }}>
                    <span style={{ fontSize:'0.83rem', color:'rgba(255,255,255,0.68)' }}>{item.food_name}</span>
                    <div style={{ display:'flex', gap:'1.5rem', fontSize:'0.75rem', color:'rgba(255,255,255,0.32)' }}>
                      {item.quantity_g && <span>{item.quantity_g}g</span>}
                      {item.calories && <span>{item.calories} kcal</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="ds-card" style={{ padding:'1.25rem 1.5rem', marginTop:16, display:'flex', alignItems:'center', gap:'1rem' }}>
        <div className="ds-icon-box"><svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg></div>
        <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.38)', flex:1 }}>Need changes to your meal plan? Message your coach directly.</p>
        <button onClick={()=>onNavigate('messages')} className="ds-btn-gold" style={{ padding:'0.5rem 1rem', fontSize:'0.75rem' }}>Message Coach</button>
      </div>
    </div>
  );
}

/* ─── Workout Plan Tab ───────────────────────────────── */
function WorkoutTab({ workoutPlan, loading }: { workoutPlan:WorkoutPlan|null; loading:boolean }) {
  const [activeDay, setActiveDay] = useState(0);
  if (loading) return <div className="ds-empty"><div className="ds-loading" style={{ height:200, background:'rgba(255,255,255,0.03)', borderRadius:16 }} /></div>;

  if (!workoutPlan) return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}><p className="ds-section-title">Workout Plan</p><p className="ds-section-sub">Your personalised workout schedule</p></div>
      <div className="ds-card ds-empty">
        <div className="ds-empty-icon">{Icons.bolt}</div>
        <p>No workout plan assigned yet</p>
        <small>Your coach will assign a workout plan once your onboarding is reviewed.</small>
      </div>
    </div>
  );

  const days = workoutPlan.workout_plan_days.sort((a,b)=>a.sort_order-b.sort_order);
  const current = days[activeDay];

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}>
        <p className="ds-section-title">{workoutPlan.title}</p>
        <p className="ds-section-sub">Assigned by your coach · Tap a day to view exercises</p>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {days.map((d,i) => (
          <button key={d.id} onClick={()=>setActiveDay(i)}
            style={{ flexShrink:0, minWidth:64, padding:'0.6rem 0.5rem', borderRadius:12, cursor:'pointer', textAlign:'center', background: i===activeDay?'rgba(201,168,76,0.1)':'rgba(255,255,255,0.03)', border: i===activeDay?'1px solid rgba(201,168,76,0.3)':'1px solid rgba(255,255,255,0.06)', transition:'all 0.18s' }}>
            <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color: i===activeDay?'#C9A84C':'rgba(255,255,255,0.38)', display:'block' }}>{d.day_label}</span>
            <span style={{ fontSize:'0.7rem', color: i===activeDay?'rgba(201,168,76,0.7)':'rgba(255,255,255,0.2)', marginTop:2, display:'block' }}>{d.focus?.split(' ').slice(0,2).join(' ') ?? '—'}</span>
          </button>
        ))}
      </div>

      {current && (
        <div className="ds-card" style={{ padding:'1.75rem', borderColor: activeDay===0?'rgba(201,168,76,0.2)':'rgba(255,255,255,0.07)' }}>
          <div style={{ marginBottom:'1.25rem' }}>
            <p style={{ fontWeight:700, color:'white', fontSize:'1.1rem' }}>{current.focus ?? current.day_label}</p>
            <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginTop:2 }}>{current.day_label}</p>
          </div>

          {current.workout_exercises.length === 0 ? (
            <div className="ds-empty" style={{ padding:'2rem' }}>
              <div className="ds-empty-icon" style={{ margin:'0 auto 1rem' }}><svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg></div>
              <p>Recovery day — rest, hydrate, sleep well</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {current.workout_exercises.sort((a,b)=>a.sort_order-b.sort_order).map((ex,i) => (
                <div key={ex.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'1rem' }}>
                  <span style={{ width:28, height:28, borderRadius:8, background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', color:'#C9A84C', fontSize:'0.75rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{i+1}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'0.85rem', fontWeight:600, color:'white' }}>{ex.exercise_name}</p>
                    {ex.notes && <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.28)', marginTop:2 }}>{ex.notes}</p>}
                  </div>
                  <div style={{ display:'flex', gap:20, textAlign:'center', flexShrink:0 }}>
                    {[['Sets',ex.sets],['Reps',ex.reps],['Rest',ex.rest_seconds ? `${ex.rest_seconds}s` : null]].map(([label,val]) => val && (
                      <div key={label as string}>
                        <p style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(255,255,255,0.22)' }}>{label}</p>
                        <p style={{ fontSize:'0.85rem', fontWeight:700, color:'white', marginTop:1 }}>{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Progress Tab ───────────────────────────────────── */
function ProgressTab({ progressLogs, onLogged }: { progressLogs:ProgressLog[]; onLogged:()=>void }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ weight:'', notes:'' });
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name:string; url:string}[]>([]);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleLog = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    await supabase.from('progress_logs').insert({ user_id:user.id, weight_kg:parseFloat(form.weight), notes:form.notes||null });
    setSubmitted(true); setForm({weight:'',notes:''});
    setTimeout(()=>{ setSubmitted(false); onLogged(); }, 2000);
  };

  const handleUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file || !user?.id) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      formData.append('folder', `body-checks/${user.id}`);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
        { method: 'POST', body: formData }
      );
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Upload failed');

      const fileUrl: string = json.secure_url;
      await supabase.from('body_checks').insert({ user_id:user.id, file_url:fileUrl, file_type:file.type });
      setUploadedFiles(prev => [...prev, { name:file.name, url:fileUrl }]);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const maxW = Math.max(...progressLogs.map(l=>l.weight_kg??0), 1);
  const minW = Math.min(...progressLogs.map(l=>l.weight_kg??0), maxW-1);
  const range = maxW-minW || 1;

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}><p className="ds-section-title">Progress Tracking</p><p className="ds-section-sub">Log your stats, view timeline, upload body checks</p></div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:20 }} className="lg:grid-cols-2">
        {/* Log form */}
        <div className="ds-card" style={{ padding:'1.75rem' }}>
          <p style={{ fontWeight:600, color:'white', marginBottom:'1.25rem' }}>Log Today&apos;s Stats</p>
          {submitted ? (
            <div style={{ textAlign:'center', padding:'2rem 0' }}>
              <div style={{ width:48, height:48, borderRadius:12, background:'rgba(74,222,128,0.1)', border:'1px solid rgba(74,222,128,0.25)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1rem', color:'rgba(74,222,128,0.9)' }}>{Icons.check}</div>
              <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.85rem' }}>Stats saved successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleLog} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label className="ds-label">Weight (kg)</label><input type="number" step="0.1" className="ds-input" placeholder="82.5" value={form.weight} onChange={e=>setForm(f=>({...f,weight:e.target.value}))} required /></div>
              <div><label className="ds-label">Notes (optional)</label><input className="ds-input" placeholder="How are you feeling today?" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} /></div>
              <button type="submit" className="ds-btn-gold" style={{ justifyContent:'center' }}>Save Entry</button>
            </form>
          )}
        </div>

        {/* Chart */}
        <div className="ds-card" style={{ padding:'1.75rem' }}>
          <p style={{ fontWeight:600, color:'white', marginBottom:'1.25rem' }}>Weight Timeline</p>
          {progressLogs.length === 0 ? (
            <div className="ds-empty" style={{ padding:'2rem 0' }}>
              <div className="ds-empty-icon" style={{ margin:'0 auto 0.75rem' }}>{Icons.chart}</div>
              <p style={{ fontSize:'0.8rem' }}>No logs yet — add your first entry</p>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:120, marginBottom:12 }}>
                {progressLogs.slice().reverse().slice(-8).map((log,i,arr) => {
                  const pct = (((log.weight_kg??0)-minW)/range)*70+25;
                  return (
                    <div key={log.id} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <span style={{ fontSize:'0.62rem', color:'rgba(255,255,255,0.35)' }}>{log.weight_kg}</span>
                      <div style={{ width:'100%', borderRadius:'4px 4px 0 0', height:`${pct}%`, background: i===arr.length-1?'rgba(201,168,76,0.55)':'rgba(201,168,76,0.2)', border:'1px solid rgba(201,168,76,0.15)' }} />
                      <span style={{ fontSize:'0.6rem', color:'rgba(255,255,255,0.25)' }}>{new Date(log.logged_at).toLocaleDateString('en',{month:'short',day:'numeric'})}</span>
                    </div>
                  );
                })}
              </div>
              {progressLogs.length >= 2 && (
                <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'0.75rem', color:'rgba(255,255,255,0.35)' }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:'rgba(74,222,128,0.7)', flexShrink:0 }} />
                  Total change: <span style={{ color:'rgba(74,222,128,0.9)', fontWeight:600 }}>
                    {((progressLogs[0].weight_kg??0)-(progressLogs[progressLogs.length-1].weight_kg??0)).toFixed(1)} kg
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* History */}
      {progressLogs.length > 0 && (
        <div className="ds-card" style={{ padding:'1.75rem', marginBottom:16 }}>
          <p style={{ fontWeight:600, color:'white', marginBottom:'1rem' }}>Log History</p>
          <div style={{ overflowX:'auto' }}>
            <table className="ds-table">
              <thead><tr><th>Date</th><th>Weight</th><th>Change</th><th>Notes</th></tr></thead>
              <tbody>
                {progressLogs.map((log,i) => {
                  const prev = progressLogs[i+1]?.weight_kg;
                  const ch = prev!=null?((log.weight_kg??0)-prev).toFixed(1):null;
                  return (
                    <tr key={log.id}>
                      <td>{new Date(log.logged_at).toLocaleDateString('en',{month:'short',day:'numeric',year:'2-digit'})}</td>
                      <td style={{ fontWeight:600, color:'white' }}>{log.weight_kg} kg</td>
                      <td>{ch && <span style={{ fontWeight:600, fontSize:'0.78rem', color: parseFloat(ch)<0?'rgba(74,222,128,0.9)':'rgba(248,113,113,0.85)' }}>{parseFloat(ch)>0?'+':''}{ch} kg</span>}</td>
                      <td style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.78rem' }}>{log.notes||'—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Body check upload */}
      <div className="ds-card" style={{ padding:'1.75rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <div>
            <p style={{ fontWeight:600, color:'white' }}>Body Check Uploads</p>
            <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.3)', marginTop:2 }}>Upload InBody scans, progress photos, or PDFs</p>
          </div>
          <label className="ds-btn-gold" style={{ cursor: uploading ? 'not-allowed' : 'pointer', fontSize:'0.78rem', opacity: uploading ? 0.6 : 1 }}>
            <span style={{ width:16, height:16, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{Icons.upload}</span>
            {uploading ? 'Uploading…' : 'Upload File'}
            <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} disabled={uploading} style={{ display:'none' }} />
          </label>
        </div>
        {uploading && <div className="ds-loading" style={{ height:6, background:'rgba(201,168,76,0.15)', borderRadius:8, marginBottom:12 }} />}
        {uploadError && (
          <p style={{ fontSize:'0.75rem', color:'rgba(248,113,113,0.85)', marginBottom:8 }}>{uploadError}</p>
        )}
        {uploadedFiles.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
            {uploadedFiles.map((f,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'0.5rem 0.75rem', background:'rgba(74,222,128,0.05)', border:'1px solid rgba(74,222,128,0.15)', borderRadius:8 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(74,222,128,0.8)', flexShrink:0 }} />
                <a href={f.url} target="_blank" rel="noreferrer" style={{ fontSize:'0.78rem', color:'rgba(74,222,128,0.85)', textDecoration:'none', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</a>
                <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.2)', marginLeft:'auto', flexShrink:0 }}>Uploaded</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Messages Tab ───────────────────────────────────── */
function MessagesTab() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadId, setThreadId] = useState<string|null>(null);
  const [trainerId, setTrainerId] = useState<string|null>(null);
  const [trainerName, setTrainerName] = useState('Your Coach');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [noCoach, setNoCoach] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollDown = useCallback(() => {
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}), 50);
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const init = async () => {
      // Find assigned trainer
      const { data:assign } = await supabase
        .from('trainer_client_assignments')
        .select('trainer_id')
        .eq('client_id', user.id)
        .single();

      if (!assign) { setNoCoach(true); setLoading(false); return; }
      setTrainerId(assign.trainer_id);

      // Get trainer name
      const { data:tp } = await supabase.from('profiles').select('full_name').eq('id', assign.trainer_id).single();
      if (tp?.full_name) setTrainerName(tp.full_name);

      // Find or create thread — table uses coach_id (not trainer_id)
      let tid: string;
      const { data:thread } = await supabase.from('message_threads').select('id').eq('client_id', user.id).eq('coach_id', assign.trainer_id).single();
      if (thread) {
        tid = thread.id;
      } else {
        const { data:nt } = await supabase.from('message_threads').insert({ client_id:user.id, coach_id:assign.trainer_id }).select('id').single();
        if (!nt) { setLoading(false); return; }
        tid = nt.id;
      }
      setThreadId(tid);

      // Load history
      const { data:msgs } = await supabase.from('messages').select('*').eq('thread_id', tid).order('created_at', { ascending:true });
      if (msgs) setMessages(msgs as Message[]);
      setLoading(false);
      scrollDown();

      // Realtime — subscribe and store ref for cleanup
      channel = supabase.channel(`client-thread-${tid}`)
        .on('postgres_changes', { event:'INSERT', schema:'public', table:'messages', filter:`thread_id=eq.${tid}` }, (payload) => {
          const incoming = payload.new as Message;
          setMessages(m => {
            if (m.find(x => x.id === incoming.id)) return m;
            return [...m, incoming];
          });
          scrollDown();
        })
        .subscribe();
    };

    init();
    return () => { if (channel) supabase.removeChannel(channel); };
  }, [user?.id, scrollDown]);

  useEffect(()=>{ scrollDown(); }, [messages, scrollDown]);

  const send = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()||!threadId||!user) return;
    const content = text.trim();
    setText('');
    // Optimistic update — show immediately
    const tempId = `temp-${Date.now()}`;
    const optimistic: Message = { id: tempId, sender_id: user.id, content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);
    scrollDown();
    const { data } = await supabase.from('messages').insert({ thread_id:threadId, sender_id:user.id, content }).select('*').single();
    // Replace temp — if realtime already added the real record, just remove the temp
    if (data) setMessages(prev => {
      const real = data as Message;
      const alreadyIn = prev.find(m => m.id === real.id);
      if (alreadyIn) return prev.filter(m => m.id !== tempId);
      return prev.map(m => m.id === tempId ? real : m);
    });
  };

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}><p className="ds-section-title">Messages</p><p className="ds-section-sub">Direct chat with your assigned coach</p></div>

      <div className="ds-card" style={{ display:'flex', flexDirection:'column', height:520 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'1rem 1.25rem', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#C9A84C', fontWeight:700, fontSize:'0.85rem', flexShrink:0 }}>
            {trainerName[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize:'0.85rem', fontWeight:600, color:'white' }}>{trainerName}</p>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'rgba(74,222,128,0.9)' }} />
              <span style={{ fontSize:'0.68rem', color:'rgba(255,255,255,0.3)' }}>Online</span>
            </div>
          </div>
        </div>

        <div className="ds-no-scroll" style={{ flex:1, overflowY:'auto', padding:'1rem 1.25rem', display:'flex', flexDirection:'column', gap:10 }}>
          {loading && <div className="ds-loading" style={{ height:60, background:'rgba(255,255,255,0.03)', borderRadius:12 }} />}
          {noCoach && (
            <div className="ds-empty" style={{ margin:'auto' }}>
              <div className="ds-empty-icon" style={{ margin:'0 auto 1rem' }}>{Icons.user}</div>
              <p>No coach assigned yet</p>
              <small>You&apos;ll be able to message your coach once they&apos;re assigned by the admin.</small>
            </div>
          )}
          {!loading && !noCoach && messages.length===0 && (
            <div className="ds-empty" style={{ margin:'auto' }}>
              <div className="ds-empty-icon" style={{ margin:'0 auto 1rem' }}>{Icons.chat}</div>
              <p>No messages yet</p>
              <small>Send your first message to {trainerName}</small>
            </div>
          )}
          {messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} style={{ display:'flex', justifyContent: isMe?'flex-end':'flex-start' }}>
                <div style={{ maxWidth:'75%', borderRadius:16, padding:'0.7rem 1rem', background: isMe?'rgba(201,168,76,0.1)':'rgba(255,255,255,0.05)', border: isMe?'1px solid rgba(201,168,76,0.22)':'1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.85)', lineHeight:1.6 }}>{msg.content}</p>
                  <p style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.22)', marginTop:4, textAlign: isMe?'right':'left' }}>
                    {new Date(msg.created_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {!noCoach && (
          <form onSubmit={send} style={{ display:'flex', gap:8, padding:'1rem 1.25rem', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
            <input className="ds-input" style={{ flex:1 }} placeholder="Type a message…" value={text} onChange={e=>setText(e.target.value)} />
            <button type="submit" className="ds-btn-gold" style={{ padding:'0.65rem 1rem', flexShrink:0 }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ─── Subscription Tab ───────────────────────────────── */
function SubscriptionTab() {
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      const { data:{user} } = await supabase.auth.getUser(); if (!user) return;
      const { data } = await supabase.from('subscriptions').select('*').eq('user_id', user.id).order('created_at',{ascending:false});
      if (data) setSubs(data);
      setLoading(false);
    })();
  },[]);

  const active = subs.find(s=>s.status==='active');

  const plans = [
    { name:'Plan Only', nameAr:'خطة فقط', price:149, desc:'Workout or meal plan without coaching', current: active?.plan_name==='Plan Only' },
    { name:'Full Coaching', nameAr:'تدريب كامل', price:349, desc:'Meal plan + workout plan + coach support', current: active?.plan_name==='Full Coaching' },
    { name:'Elite Coaching', nameAr:'تدريب نخبة', price:549, desc:'Full Coaching + weekly check-ins + priority support', current: active?.plan_name==='Elite Coaching' },
  ];

  return (
    <div>
      <div style={{ marginBottom:'1.5rem' }}><p className="ds-section-title">Subscription</p><p className="ds-section-sub">Manage your plan, billing & invoices</p></div>

      {loading ? <div className="ds-loading" style={{ height:120, background:'rgba(255,255,255,0.03)', borderRadius:16, marginBottom:16 }} /> :
      active ? (
        <div className="ds-card-gold" style={{ padding:'1.75rem', marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
            <div>
              <span className="ds-badge-gold" style={{ marginBottom:12, display:'inline-flex' }}>Active Plan</span>
              <h3 style={{ fontSize:'1.5rem', fontWeight:700, color:'white', marginTop:4, marginBottom:4 }}>{active.plan_name}</h3>
            </div>
            <div style={{ textAlign:'right' }}>
              <p style={{ fontSize:'2rem', fontWeight:700, color:'#C9A84C', lineHeight:1 }}>SAR {active.price_sar}</p>
              <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.3)', marginTop:4 }}>/ month</p>
            </div>
          </div>
          <div className="ds-divider" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[
              { label:'Status', value:'Active', color:'rgba(74,222,128,0.9)' },
              { label:'Next Billing', value: active.expires_at ? new Date(active.expires_at).toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'}) : '—', color:'rgba(255,255,255,0.7)' },
              { label:'Member Since', value: new Date(active.started_at).toLocaleDateString('en',{month:'short',year:'numeric'}), color:'rgba(255,255,255,0.7)' },
            ].map(i=>(
              <div key={i.label}><p style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(255,255,255,0.25)', marginBottom:4 }}>{i.label}</p><p style={{ fontSize:'0.88rem', fontWeight:600, color:i.color }}>{i.value}</p></div>
            ))}
          </div>
        </div>
      ) : (
        <div className="ds-card ds-empty" style={{ marginBottom:20 }}>
          <div className="ds-empty-icon">{Icons.card}</div>
          <p>No active subscription</p>
          <small>Contact your coach or admin to get started.</small>
        </div>
      )}

      <div className="ds-card" style={{ padding:'1.75rem', marginBottom:20 }}>
        <p style={{ fontWeight:600, color:'white', marginBottom:'1rem' }}>Available Plans</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {plans.map(p=>(
            <div key={p.name} style={{ padding:'1rem 1.25rem', borderRadius:12, background: p.current?'rgba(201,168,76,0.05)':'rgba(255,255,255,0.02)', border: p.current?'1px solid rgba(201,168,76,0.28)':'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:'1rem' }}>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <p style={{ fontSize:'0.85rem', fontWeight:600, color:'white' }}>{p.name}</p>
                  <p style={{ fontSize:'0.72rem', color:'rgba(255,255,255,0.25)' }}>{p.nameAr}</p>
                  {p.current && <span className="ds-badge-gold">Current</span>}
                </div>
                <p style={{ fontSize:'0.75rem', color:'rgba(255,255,255,0.35)', marginTop:2 }}>{p.desc}</p>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <p style={{ fontWeight:700, color: p.current?'#C9A84C':'rgba(255,255,255,0.55)', fontSize:'0.9rem' }}>SAR {p.price}<span style={{ fontSize:'0.7rem', fontWeight:400, color:'rgba(255,255,255,0.25)' }}>/mo</span></p>
                {!p.current && <button className="ds-btn-outline" style={{ fontSize:'0.72rem', padding:'0.4rem 0.8rem', marginTop:6 }}>Switch</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {subs.length > 0 && (
        <div className="ds-card" style={{ padding:'1.75rem' }}>
          <p style={{ fontWeight:600, color:'white', marginBottom:'1rem' }}>Invoice History</p>
          <table className="ds-table">
            <thead><tr><th>Plan</th><th>Amount</th><th>Date</th><th>Status</th><th /></tr></thead>
            <tbody>
              {subs.map(s=>(
                <tr key={s.id}>
                  <td style={{ color:'rgba(255,255,255,0.75)', fontWeight:500 }}>{s.plan_name}</td>
                  <td style={{ color:'#C9A84C', fontWeight:600 }}>SAR {s.price_sar}</td>
                  <td>{new Date(s.started_at).toLocaleDateString('en',{month:'short',day:'numeric',year:'numeric'})}</td>
                  <td><span className={s.status==='active'?'ds-badge-green':'ds-badge-red'}>{s.status}</span></td>
                  <td><button className="ds-btn-outline" style={{ fontSize:'0.72rem', padding:'0.35rem 0.75rem' }}>PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ClientDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mealPlan, setMealPlan] = useState<MealPlan|null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan|null>(null);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!user?.id) return;
    const [mp, wp, logs] = await Promise.all([
      supabase.from('meal_plans').select('id, title, meal_plan_items(*)').eq('client_id', user.id).order('created_at',{ascending:false}).limit(1).single(),
      supabase.from('workout_plans').select('id, title, workout_plan_days(id, day_label, focus, sort_order, workout_exercises(*))').eq('client_id', user.id).order('created_at',{ascending:false}).limit(1).single(),
      supabase.from('progress_logs').select('*').eq('user_id', user.id).order('logged_at',{ascending:false}).limit(30),
    ]);
    if (mp.data) setMealPlan(mp.data as unknown as MealPlan);
    if (wp.data) setWorkoutPlan(wp.data as unknown as WorkoutPlan);
    if (logs.data) setProgressLogs(logs.data as ProgressLog[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(()=>{ loadData(); }, [loadData]);

  useEffect(()=>{
    if (user?.profile && !user.profile.onboarding_completed) setShowOnboarding(true);
  }, [user]);

  const render = () => {
    switch(tab) {
      case 'overview':     return <OverviewTab progressLogs={progressLogs} mealPlan={mealPlan} workoutPlan={workoutPlan} onNavigate={setTab} />;
      case 'meal-plan':    return <MealPlanTab mealPlan={mealPlan} loading={loading} onNavigate={setTab} />;
      case 'workout':      return <WorkoutTab workoutPlan={workoutPlan} loading={loading} />;
      case 'progress':     return <ProgressTab progressLogs={progressLogs} onLogged={loadData} />;
      case 'messages':     return <MessagesTab />;
      case 'subscription': return <SubscriptionTab />;
      default: return null;
    }
  };

  return (
    <>
      {showOnboarding && <OnboardingModal onComplete={()=>{ setShowOnboarding(false); loadData(); }} />}
      <DashboardShell role="client" navItems={navItems} activeTab={tab} onTabChange={setTab}>
        {render()}
      </DashboardShell>
    </>
  );
}
