'use client';

import { useState, useRef, useEffect } from 'react';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';
import { supabase } from '@/lib/supabase';

/* ─── Nav Items ──────────────────────────────────────── */
const navItems: NavItem[] = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
  },
  {
    id: 'clients', label: 'My Clients',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
  },
  {
    id: 'meal-builder', label: 'Meal Plans',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5M12 8.25V6.75" /></svg>,
  },
  {
    id: 'workout-builder', label: 'Workout Plans',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  },
  {
    id: 'progress', label: 'Progress Monitor',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" /></svg>,
  },
  {
    id: 'messages', label: 'Messages',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>,
  },
];

/* ─── Mock clients ───────────────────────────────────── */
const mockClients = [
  { id: 'c1', name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', goal: 'Fat Loss', plan: 'Full Coaching', weight: 88.5, targetWeight: 80, startDate: 'Feb 1', streak: 14, status: 'active' },
  { id: 'c2', name: 'Sara Ibrahim', email: 'sara@example.com', goal: 'Muscle Building', plan: 'Full Coaching', weight: 62.0, targetWeight: 65, startDate: 'Feb 15', streak: 7, status: 'active' },
  { id: 'c3', name: 'Khalid Mohammed', email: 'khalid@example.com', goal: 'Summer Body', plan: 'Elite Coaching', weight: 91.0, targetWeight: 82, startDate: 'Mar 1', streak: 5, status: 'active' },
  { id: 'c4', name: 'Nour Hassan', email: 'nour@example.com', goal: 'Workout Plan', plan: 'Plan Only', weight: 70.0, targetWeight: 68, startDate: 'Mar 15', streak: 0, status: 'inactive' },
];

/* ─── Overview Tab ───────────────────────────────────── */
function CoachOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const stats = [
    { label: 'Total Clients', value: '4', sub: '+1 this month', color: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)' },
    { label: 'Active Plans', value: '7', sub: '4 meal + 3 workout', color: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)' },
    { label: 'Unread Messages', value: '3', sub: 'From 2 clients', color: 'rgba(100,180,255,0.08)', border: 'rgba(100,180,255,0.2)' },
    { label: 'Avg Client Progress', value: '−1.8 kg', sub: 'This month', color: 'rgba(80,200,120,0.08)', border: 'rgba(80,200,120,0.2)' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Coach Dashboard</h2>
        <p className="text-white/35 text-sm">Manage your clients, build plans, and track progress.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="ds-card p-5" style={{ background: s.color, borderColor: s.border }}>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-white/55 mt-0.5">{s.label}</p>
            <p className="text-xs text-white/30 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent clients */}
      <div className="ds-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Clients</h3>
          <button onClick={() => onNavigate('clients')} className="text-xs" style={{ color: '#C9A84C' }}>View all →</button>
        </div>
        <div className="space-y-3">
          {mockClients.slice(0, 3).map(c => (
            <div key={c.id} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>{c.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{c.name}</p>
                <p className="text-xs text-white/35">{c.goal} · {c.plan}</p>
              </div>
              <div className="text-right text-xs">
                <p className="text-white/55">{c.weight} kg</p>
                <p className="text-white/30">{c.streak}d streak</p>
              </div>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${c.status === 'active' ? 'text-green-400' : 'text-white/30'}`}
                style={{ background: c.status === 'active' ? 'rgba(80,200,120,0.1)' : 'rgba(255,255,255,0.05)', border: c.status === 'active' ? '1px solid rgba(80,200,120,0.2)' : '1px solid rgba(255,255,255,0.08)' }}>
                {c.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Clients Tab ────────────────────────────────────── */
function ClientsTab({ onNavigate }: { onNavigate: (tab: string, clientId?: string) => void }) {
  const [addMode, setAddMode] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null);
  const [adding, setAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    // In production: supabase query to find user by email and assign to coach
    await new Promise(r => setTimeout(r, 800));
    setAdding(false);
    setAddSuccess(true);
    setEmail('');
    setTimeout(() => { setAddSuccess(false); setAddMode(false); }, 2500);
  };

  if (selectedClient) {
    return (
      <div>
        <button onClick={() => setSelectedClient(null)} className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Clients
        </button>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Profile */}
          <div className="lg:col-span-1 ds-card p-6">
            <div className="text-center mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.3)' }}>
                <span className="text-2xl font-bold" style={{ color: '#C9A84C' }}>{selectedClient.name[0]}</span>
              </div>
              <h3 className="font-bold text-white">{selectedClient.name}</h3>
              <p className="text-xs text-white/35">{selectedClient.email}</p>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Goal', value: selectedClient.goal },
                { label: 'Plan', value: selectedClient.plan },
                { label: 'Current Weight', value: `${selectedClient.weight} kg` },
                { label: 'Target Weight', value: `${selectedClient.targetWeight} kg` },
                { label: 'Start Date', value: selectedClient.startDate },
                { label: 'Active Streak', value: `${selectedClient.streak} days` },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-white/35">{item.label}</span>
                  <span className="text-white/75 font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="ds-divider" />
            <div className="flex flex-col gap-2">
              <button onClick={() => onNavigate('meal-builder')} className="ds-btn-gold w-full justify-center text-xs">
                Build Meal Plan
              </button>
              <button onClick={() => onNavigate('workout-builder')} className="ds-btn-outline w-full justify-center text-xs">
                Build Workout Plan
              </button>
              <button onClick={() => onNavigate('messages')} className="ds-btn-outline w-full justify-center text-xs">
                Message Client
              </button>
            </div>
          </div>

          {/* Onboarding & Stats */}
          <div className="lg:col-span-2 space-y-5">
            <div className="ds-card p-6">
              <h4 className="font-semibold text-white mb-4">Onboarding Answers</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Fitness Goal', value: selectedClient.goal },
                  { label: 'Activity Level', value: 'Moderately Active (3–5x/week)' },
                  { label: 'Experience', value: 'Intermediate' },
                  { label: 'Dietary Restrictions', value: 'Halal only' },
                  { label: 'Health Conditions', value: 'None reported' },
                  { label: 'Height', value: '178 cm' },
                  { label: 'Age', value: '29' },
                  { label: 'Gender', value: 'Male' },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">{item.label}</p>
                    <p className="text-sm text-white/70">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="ds-card p-6">
              <h4 className="font-semibold text-white mb-4">Recent Progress Logs</h4>
              <div className="space-y-2">
                {[
                  { date: 'Mar 30', weight: selectedClient.weight, notes: 'Feeling good' },
                  { date: 'Mar 27', weight: selectedClient.weight + 0.7, notes: '' },
                  { date: 'Mar 24', weight: selectedClient.weight + 1.5, notes: '' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-white/05 last:border-0 text-sm">
                    <span className="text-white/35 w-16">{log.date}</span>
                    <span className="font-semibold text-white">{log.weight} kg</span>
                    <span className="text-white/30 flex-1">{log.notes || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">My Clients</h2>
          <p className="text-white/35 text-sm">{mockClients.length} clients assigned to you</p>
        </div>
        <button onClick={() => setAddMode(true)} className="ds-btn-gold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Client by Email
        </button>
      </div>

      {/* Add client modal */}
      {addMode && (
        <div className="ds-card p-6 mb-6" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          {addSuccess ? (
            <div className="text-center py-2">
              <p className="text-2xl mb-1">✅</p>
              <p className="text-sm text-white/60">Client invite sent!</p>
            </div>
          ) : (
            <form onSubmit={handleAddClient}>
              <h3 className="font-semibold text-white mb-3">Add Client by Email</h3>
              <div className="flex gap-3">
                <input type="email" className="ds-input flex-1" placeholder="client@example.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
                <button type="submit" className="ds-btn-gold" disabled={adding}>
                  {adding ? 'Sending…' : 'Add Client'}
                </button>
                <button type="button" onClick={() => setAddMode(false)} className="ds-btn-outline">Cancel</button>
              </div>
              <p className="text-xs text-white/25 mt-2">The client must already have an account. They will be notified.</p>
            </form>
          )}
        </div>
      )}

      {/* Client list */}
      <div className="grid gap-4">
        {mockClients.map(client => (
          <div key={client.id} className="ds-card p-5 flex items-center gap-4 cursor-pointer group hover:border-gold-200 transition-all"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedClient(client)}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <span className="font-bold" style={{ color: '#C9A84C' }}>{client.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{client.name}</p>
                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full`}
                  style={{
                    background: client.status === 'active' ? 'rgba(80,200,120,0.1)' : 'rgba(255,255,255,0.05)',
                    color: client.status === 'active' ? 'rgba(80,200,120,0.9)' : 'rgba(255,255,255,0.3)',
                    border: client.status === 'active' ? '1px solid rgba(80,200,120,0.2)' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  {client.status}
                </span>
              </div>
              <p className="text-xs text-white/35">{client.email} · {client.goal} · {client.plan}</p>
            </div>
            <div className="hidden sm:grid grid-cols-3 gap-4 text-center text-xs">
              <div>
                <p className="text-white/25 text-[10px] uppercase tracking-wider">Weight</p>
                <p className="text-white/70 font-semibold mt-0.5">{client.weight} kg</p>
              </div>
              <div>
                <p className="text-white/25 text-[10px] uppercase tracking-wider">Target</p>
                <p className="text-white/70 font-semibold mt-0.5">{client.targetWeight} kg</p>
              </div>
              <div>
                <p className="text-white/25 text-[10px] uppercase tracking-wider">Streak</p>
                <p className="text-white/70 font-semibold mt-0.5">{client.streak}d</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Meal Plan Builder ──────────────────────────────── */
function MealBuilder() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [planName, setPlanName] = useState('');
  const [meals, setMeals] = useState([
    {
      mealType: 'Breakfast', timing: '7:00 AM',
      items: [{ food_name: '', grams: '', calories: '' }],
    },
  ]);
  const [saved, setSaved] = useState(false);

  const addMeal = () => setMeals(m => [...m, {
    mealType: 'Snack', timing: '',
    items: [{ food_name: '', grams: '', calories: '' }],
  }]);

  const updateMeal = (i: number, key: string, val: string) =>
    setMeals(m => m.map((meal, idx) => idx === i ? { ...meal, [key]: val } : meal));

  const addItem = (mealIdx: number) =>
    setMeals(m => m.map((meal, idx) => idx === mealIdx ? { ...meal, items: [...meal.items, { food_name: '', grams: '', calories: '' }] } : meal));

  const updateItem = (mealIdx: number, itemIdx: number, key: string, val: string) =>
    setMeals(m => m.map((meal, mi) => mi === mealIdx ? {
      ...meal,
      items: meal.items.map((item, ii) => ii === itemIdx ? { ...item, [key]: val } : item),
    } : meal));

  const removeItem = (mealIdx: number, itemIdx: number) =>
    setMeals(m => m.map((meal, mi) => mi === mealIdx ? {
      ...meal, items: meal.items.filter((_, ii) => ii !== itemIdx),
    } : meal));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: plan } = await supabase.from('meal_plans').insert({
      client_id: selectedClientId,
      trainer_id: user.id,
      title: planName,
    }).select().single();

    if (plan) {
      const items = meals.flatMap(meal => meal.items.map(item => ({
        meal_plan_id: plan.id,
        meal_type: meal.mealType,
        meal_timing: meal.timing,
        food_name: item.food_name,
        grams: item.grams ? parseFloat(item.grams) : null,
        calories: item.calories ? parseFloat(item.calories) : null,
      })));
      await supabase.from('meal_plan_items').insert(items);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Pre-Workout', 'Post-Workout'];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Meal Plan Builder</h2>
        <p className="text-white/35 text-sm">Create and assign personalised meal plans to clients</p>
      </div>

      {saved && (
        <div className="ds-card p-4 mb-5 flex items-center gap-3"
          style={{ background: 'rgba(80,200,120,0.06)', borderColor: 'rgba(80,200,120,0.2)' }}>
          <span className="text-green-400 font-semibold text-sm">✓ Meal plan saved and assigned successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="ds-card p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="ds-label">Assign to Client</label>
              <select className="ds-input" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} required>
                <option value="" style={{ background: '#111' }}>Select client…</option>
                {mockClients.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#111' }}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="ds-label">Plan Name</label>
              <input type="text" className="ds-input" placeholder="e.g. Fat Loss Phase 1"
                value={planName} onChange={e => setPlanName(e.target.value)} required />
            </div>
          </div>
        </div>

        {meals.map((meal, mealIdx) => (
          <div key={mealIdx} className="ds-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <select className="ds-input w-40" value={meal.mealType} onChange={e => updateMeal(mealIdx, 'mealType', e.target.value)}
                style={{ width: 'auto' }}>
                {mealTypeOptions.map(t => (
                  <option key={t} value={t} style={{ background: '#111' }}>{t}</option>
                ))}
              </select>
              <input type="text" className="ds-input" placeholder="Timing (e.g. 7:00 AM)" style={{ maxWidth: '150px' }}
                value={meal.timing} onChange={e => updateMeal(mealIdx, 'timing', e.target.value)} />
              {meals.length > 1 && (
                <button type="button" onClick={() => setMeals(m => m.filter((_, i) => i !== mealIdx))}
                  className="ml-auto text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove meal</button>
              )}
            </div>

            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 mb-1 text-[10px] uppercase tracking-wider text-white/25">
                <span className="col-span-6">Food Name</span>
                <span className="col-span-2">Grams</span>
                <span className="col-span-2">Calories</span>
                <span className="col-span-2" />
              </div>
              {meal.items.map((item, itemIdx) => (
                <div key={itemIdx} className="grid grid-cols-12 gap-2">
                  <input className="ds-input col-span-6" placeholder="e.g. Grilled chicken breast"
                    value={item.food_name} onChange={e => updateItem(mealIdx, itemIdx, 'food_name', e.target.value)} />
                  <input type="number" className="ds-input col-span-2" placeholder="200"
                    value={item.grams} onChange={e => updateItem(mealIdx, itemIdx, 'grams', e.target.value)} />
                  <input type="number" className="ds-input col-span-2" placeholder="330"
                    value={item.calories} onChange={e => updateItem(mealIdx, itemIdx, 'calories', e.target.value)} />
                  <div className="col-span-2 flex items-center gap-1">
                    <button type="button" onClick={() => removeItem(mealIdx, itemIdx)}
                      className="text-white/25 hover:text-red-400 transition-colors text-lg leading-none">×</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addItem(mealIdx)}
                className="text-xs mt-1" style={{ color: 'rgba(201,168,76,0.7)' }}>
                + Add food item
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addMeal} className="ds-btn-outline">
            + Add Meal
          </button>
          <button type="submit" className="ds-btn-gold">
            Save & Assign Plan
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Workout Plan Builder ───────────────────────────── */
function WorkoutBuilder() {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [planName, setPlanName] = useState('');
  const [days, setDays] = useState([
    {
      dayLabel: 'Day 1', focus: 'Upper Push',
      exercises: [{ name: '', sets: '', reps: '', rest: '', notes: '' }],
    },
  ]);
  const [saved, setSaved] = useState(false);

  const addDay = () => setDays(d => [...d, {
    dayLabel: `Day ${d.length + 1}`, focus: '',
    exercises: [{ name: '', sets: '', reps: '', rest: '', notes: '' }],
  }]);

  const updateDay = (i: number, key: string, val: string) =>
    setDays(d => d.map((day, idx) => idx === i ? { ...day, [key]: val } : day));

  const addExercise = (dayIdx: number) =>
    setDays(d => d.map((day, i) => i === dayIdx ? {
      ...day, exercises: [...day.exercises, { name: '', sets: '', reps: '', rest: '', notes: '' }],
    } : day));

  const updateExercise = (dayIdx: number, exIdx: number, key: string, val: string) =>
    setDays(d => d.map((day, di) => di === dayIdx ? {
      ...day,
      exercises: day.exercises.map((ex, ei) => ei === exIdx ? { ...ex, [key]: val } : ex),
    } : day));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: plan } = await supabase.from('workout_plans').insert({
      client_id: selectedClientId,
      trainer_id: user.id,
      title: planName,
    }).select().single();

    if (plan) {
      for (const day of days) {
        const { data: dayRow } = await supabase.from('workout_plan_days').insert({
          workout_plan_id: plan.id,
          day_label: day.dayLabel,
          focus: day.focus,
        }).select().single();

        if (dayRow) {
          const exercises = day.exercises.map((ex, order) => ({
            workout_plan_day_id: dayRow.id,
            exercise_name: ex.name,
            sets: ex.sets ? parseInt(ex.sets) : null,
            reps: ex.reps,
            rest_time: ex.rest,
            notes: ex.notes || null,
            order_index: order,
          }));
          await supabase.from('workout_exercises').insert(exercises);
        }
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Workout Plan Builder</h2>
        <p className="text-white/35 text-sm">Build day-by-day workout plans for your clients. Exercise names are free text.</p>
      </div>

      {saved && (
        <div className="ds-card p-4 mb-5" style={{ background: 'rgba(80,200,120,0.06)', borderColor: 'rgba(80,200,120,0.2)' }}>
          <span className="text-green-400 font-semibold text-sm">✓ Workout plan saved and assigned successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="ds-card p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="ds-label">Assign to Client</label>
              <select className="ds-input" value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} required>
                <option value="" style={{ background: '#111' }}>Select client…</option>
                {mockClients.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#111' }}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="ds-label">Plan Name</label>
              <input type="text" className="ds-input" placeholder="e.g. 4-Day Upper/Lower Split"
                value={planName} onChange={e => setPlanName(e.target.value)} required />
            </div>
          </div>
        </div>

        {days.map((day, dayIdx) => (
          <div key={dayIdx} className="ds-card p-6">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <input className="ds-input" style={{ maxWidth: '100px' }} placeholder="Day 1"
                value={day.dayLabel} onChange={e => updateDay(dayIdx, 'dayLabel', e.target.value)} />
              <input className="ds-input flex-1" placeholder="Focus (e.g. Upper Push, Legs, Rest)"
                value={day.focus} onChange={e => updateDay(dayIdx, 'focus', e.target.value)} />
              {days.length > 1 && (
                <button type="button" onClick={() => setDays(d => d.filter((_, i) => i !== dayIdx))}
                  className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>
              )}
            </div>

            <div className="space-y-2">
              <div className="hidden sm:grid grid-cols-12 gap-2 mb-1 text-[10px] uppercase tracking-wider text-white/25">
                <span className="col-span-4">Exercise Name (free text)</span>
                <span className="col-span-1">Sets</span>
                <span className="col-span-2">Reps</span>
                <span className="col-span-2">Rest</span>
                <span className="col-span-3">Notes</span>
              </div>
              {day.exercises.map((ex, exIdx) => (
                <div key={exIdx} className="grid grid-cols-12 gap-2">
                  <input className="ds-input col-span-12 sm:col-span-4" placeholder="e.g. Flat Bench Press"
                    value={ex.name} onChange={e => updateExercise(dayIdx, exIdx, 'name', e.target.value)} />
                  <input type="number" className="ds-input col-span-4 sm:col-span-1" placeholder="4"
                    value={ex.sets} onChange={e => updateExercise(dayIdx, exIdx, 'sets', e.target.value)} />
                  <input className="ds-input col-span-4 sm:col-span-2" placeholder="8–10"
                    value={ex.reps} onChange={e => updateExercise(dayIdx, exIdx, 'reps', e.target.value)} />
                  <input className="ds-input col-span-4 sm:col-span-2" placeholder="90s"
                    value={ex.rest} onChange={e => updateExercise(dayIdx, exIdx, 'rest', e.target.value)} />
                  <div className="col-span-11 sm:col-span-3 flex gap-2">
                    <input className="ds-input flex-1" placeholder="Notes…"
                      value={ex.notes} onChange={e => updateExercise(dayIdx, exIdx, 'notes', e.target.value)} />
                    <button type="button" onClick={() => setDays(d => d.map((dy, di) => di === dayIdx ? {
                      ...dy, exercises: dy.exercises.filter((_, ei) => ei !== exIdx),
                    } : dy))} className="text-white/25 hover:text-red-400 text-lg leading-none">×</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addExercise(dayIdx)}
                className="text-xs mt-1" style={{ color: 'rgba(201,168,76,0.7)' }}>
                + Add exercise
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-3">
          <button type="button" onClick={addDay} className="ds-btn-outline">
            + Add Day
          </button>
          <button type="submit" className="ds-btn-gold">
            Save & Assign Plan
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─── Progress Monitor ───────────────────────────────── */
function ProgressMonitor() {
  const [selectedClientId, setSelectedClientId] = useState(mockClients[0].id);
  const client = mockClients.find(c => c.id === selectedClientId) ?? mockClients[0];

  const logs = [
    { date: 'Mar 30', weight: client.weight, notes: 'Feeling good', bodyCheck: false },
    { date: 'Mar 27', weight: client.weight + 0.7, notes: '', bodyCheck: true },
    { date: 'Mar 24', weight: client.weight + 1.5, notes: 'Bloated from cheat meal', bodyCheck: false },
    { date: 'Mar 21', weight: client.weight + 1.9, notes: '', bodyCheck: false },
    { date: 'Mar 18', weight: client.weight + 2.4, notes: 'Start weight', bodyCheck: true },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Progress Monitor</h2>
          <p className="text-white/35 text-sm">View client-submitted stats, body checks & InBody PDFs</p>
        </div>
        <select className="ds-input" style={{ width: 'auto' }} value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)}>
          {mockClients.map(c => (
            <option key={c.id} value={c.id} style={{ background: '#111' }}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Start Weight', value: `${(client.weight + 2.4).toFixed(1)} kg` },
          { label: 'Current Weight', value: `${client.weight} kg` },
          { label: 'Total Loss', value: `−${2.4} kg`, color: 'rgba(80,200,120,0.9)' },
        ].map(s => (
          <div key={s.label} className="ds-card p-5 text-center">
            <p className="text-xl font-bold" style={{ color: s.color ?? 'white' }}>{s.value}</p>
            <p className="text-xs text-white/35 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weight bar chart */}
      <div className="ds-card p-6 mb-6">
        <h3 className="font-semibold text-white mb-4">Weight Timeline</h3>
        <div className="flex items-end gap-3 h-28">
          {logs.map((log, i) => {
            const min = Math.min(...logs.map(l => l.weight));
            const max = Math.max(...logs.map(l => l.weight));
            const range = max - min || 1;
            const pct = ((log.weight - min) / range) * 55 + 30;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-white/40">{log.weight}</span>
                <div className="w-full rounded-t-md"
                  style={{
                    height: `${pct}%`,
                    background: i === 0 ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)',
                    border: '1px solid rgba(201,168,76,0.15)',
                  }} />
                <span className="text-[9px] text-white/30">{log.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Log history with body checks */}
      <div className="ds-card p-6">
        <h3 className="font-semibold text-white mb-4">Progress Entries</h3>
        <div className="space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-4 py-3 border-b border-white/05 last:border-0">
              <span className="text-sm text-white/40 w-16">{log.date}</span>
              <span className="text-sm font-semibold text-white">{log.weight} kg</span>
              <span className="text-xs text-white/35 flex-1">{log.notes || '—'}</span>
              {log.bodyCheck ? (
                <button className="text-xs flex items-center gap-1.5" style={{ color: '#C9A84C' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Body Check
                </button>
              ) : (
                <span className="text-xs text-white/20">—</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Coach Messages ─────────────────────────────────── */
function CoachMessages() {
  const [selectedClient, setSelectedClient] = useState(mockClients[0]);
  const [message, setMessage] = useState('');
  const [threads, setThreads] = useState<Record<string, { id: number; sender: string; text: string; time: string }[]>>({
    c1: [
      { id: 1, sender: 'client', text: 'Hi coach, I have a question about today\'s workout', time: '10:00 AM' },
      { id: 2, sender: 'coach', text: 'Sure! What\'s your question?', time: '10:05 AM' },
      { id: 3, sender: 'client', text: 'Should I do the deadlifts before or after squats?', time: '10:08 AM' },
    ],
    c2: [
      { id: 1, sender: 'client', text: 'Coach, I lost 0.5kg this week!', time: '9:30 AM' },
      { id: 2, sender: 'coach', text: 'Amazing progress Sara, keep it up! 💪', time: '9:45 AM' },
    ],
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threads, selectedClient]);

  const currentThread = threads[selectedClient.id] ?? [];

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    const newMsg = { id: currentThread.length + 1, sender: 'coach', text: message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setThreads(t => ({ ...t, [selectedClient.id]: [...(t[selectedClient.id] ?? []), newMsg] }));
    setMessage('');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Messages</h2>
        <p className="text-white/35 text-sm">Direct chat with your clients</p>
      </div>

      <div className="ds-card flex overflow-hidden" style={{ height: '560px' }}>
        {/* Client list */}
        <div className="w-56 flex-shrink-0 border-r border-white/06 flex flex-col">
          <div className="p-3 border-b border-white/06">
            <p className="text-[10px] uppercase tracking-wider text-white/25">Clients</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {mockClients.map(c => (
              <button key={c.id} onClick={() => setSelectedClient(c)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all"
                style={{
                  background: selectedClient.id === c.id ? 'rgba(201,168,76,0.06)' : 'transparent',
                  borderLeft: selectedClient.id === c.id ? '2px solid rgba(201,168,76,0.5)' : '2px solid transparent',
                }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>{c.name[0]}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/75 truncate">{c.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-white/30 truncate">{c.goal}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 p-4 border-b border-white/06">
            <p className="text-sm font-semibold text-white">{selectedClient.name}</p>
            <span className="text-xs text-white/30">{selectedClient.plan}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {currentThread.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'coach' ? 'justify-end' : 'justify-start'}`}>
                <div className="max-w-[75%] rounded-2xl px-4 py-2.5"
                  style={{
                    background: msg.sender === 'coach' ? 'rgba(201,168,76,0.12)' : 'rgba(255,255,255,0.05)',
                    border: msg.sender === 'coach' ? '1px solid rgba(201,168,76,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  }}>
                  <p className="text-sm text-white/85">{msg.text}</p>
                  <p className="text-[10px] text-white/25 mt-0.5 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
            {currentThread.length === 0 && (
              <div className="text-center py-10">
                <p className="text-white/25 text-sm">No messages yet with {selectedClient.name.split(' ')[0]}</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t border-white/06">
            <input className="ds-input flex-1" placeholder={`Message ${selectedClient.name.split(' ')[0]}…`}
              value={message} onChange={e => setMessage(e.target.value)} />
            <button type="submit" className="ds-btn-gold px-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleNavigate = (tab: string) => setActiveTab(tab);

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <CoachOverview onNavigate={handleNavigate} />;
      case 'clients': return <ClientsTab onNavigate={handleNavigate} />;
      case 'meal-builder': return <MealBuilder />;
      case 'workout-builder': return <WorkoutBuilder />;
      case 'progress': return <ProgressMonitor />;
      case 'messages': return <CoachMessages />;
      default: return null;
    }
  };

  return (
    <DashboardShell role="coach" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTab()}
    </DashboardShell>
  );
}
