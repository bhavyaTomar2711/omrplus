'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';
import Select from '@/components/ui/Select';
import { supabase } from '@/lib/supabase';

/* ─── Nav ─────────────────────────────────────────────── */
const navItems: NavItem[] = [
  {
    id: 'overview', label: 'Overview',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
  },
  {
    id: 'users', label: 'Users',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
  },
  {
    id: 'trainers', label: 'Coaches',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
  },
  {
    id: 'subscriptions', label: 'Subscriptions',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
  },
  {
    id: 'marketplace', label: 'Marketplace',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>,
  },
  {
    id: 'pricing', label: 'Pricing',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>,
  },
  {
    id: 'analytics', label: 'Analytics',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
  },
];

/* ─── Types ───────────────────────────────────────────── */
interface AdminUser {
  id: string;
  full_name: string | null;
  role: string;
  onboarding_completed: boolean;
  created_at: string;
  subscription_status?: string;
  assigned_coach?: string | null;
}

interface AdminCoach {
  id: string;
  full_name: string | null;
  created_at: string;
  client_count: number;
}

interface AdminSubscription {
  id: string;
  user_id: string;
  plan_name: string;
  status: string;
  amount: number | null;
  billing_period: string | null;
  start_date: string;
  end_date: string | null;
  user_name?: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price_sar: number;
  type: string | null;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  features: string[] | null;
  is_active: boolean;
  display_order: number;
}

/* ─── Overview ────────────────────────────────────────── */
function AdminOverview({
  users, coaches, subscriptions,
  onNavigate,
}: {
  users: AdminUser[];
  coaches: AdminCoach[];
  subscriptions: AdminSubscription[];
  onNavigate: (tab: string) => void;
}) {
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;
  const revenue = subscriptions.filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.amount ?? 0), 0);
  const clients = users.filter(u => u.role === 'client');

  const stats = [
    {
      label: 'Total Members', value: String(clients.length), sub: 'Registered clients',
      bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.2)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /></svg>,
    },
    {
      label: 'Active Coaches', value: String(coaches.length), sub: 'Platform trainers',
      bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
    },
    {
      label: 'Active Subscriptions', value: String(activeSubs), sub: 'Paying members',
      bg: 'rgba(74,222,128,0.04)', border: 'rgba(74,222,128,0.18)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
    },
    {
      label: 'Monthly Revenue', value: `$${revenue.toLocaleString()}`, sub: 'Active subscriptions',
      bg: 'rgba(255,200,80,0.04)', border: 'rgba(255,200,80,0.18)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    },
  ];

  return (
    <div>
      <div className="mb-7">
        <div className="ds-gold-pill mb-3">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', flexShrink: 0, display: 'inline-block' }} />
          Admin Panel
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>Platform Overview</h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>Full control of the OMR+ platform.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} className="ds-stat" style={{ background: s.bg, borderColor: s.border }}>
            <div className="ds-stat-icon" style={{ background: s.bg, borderColor: s.border }}>{s.icon}</div>
            <div className="ds-stat-value">{s.value}</div>
            <div className="ds-stat-label">{s.label}</div>
            <div className="ds-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem' }}>
        {/* Recent users */}
        <div className="ds-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <p className="ds-section-title">Recent Members</p>
            <button className="ds-btn-gold" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }} onClick={() => onNavigate('users')}>View All</button>
          </div>
          {clients.slice(0, 4).map(u => (
            <div key={u.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 10, fontWeight: 700, color: '#C9A84C' }}>
                {u.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <p style={{ flex: 1, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name ?? 'Unnamed'}</p>
              <span className={u.subscription_status === 'active' ? 'ds-badge-green' : 'ds-badge-gray'} style={{ fontSize: '0.6rem' }}>
                {u.subscription_status ?? 'free'}
              </span>
            </div>
          ))}
        </div>

        {/* Coaches */}
        <div className="ds-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <p className="ds-section-title">Coaches</p>
            <button className="ds-btn-gold" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }} onClick={() => onNavigate('trainers')}>Manage</button>
          </div>
          {coaches.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>No coaches yet. Add one in the Coaches tab.</p>
          ) : coaches.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 10, fontWeight: 700, color: '#C9A84C' }}>
                {c.full_name?.[0]?.toUpperCase() ?? 'C'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{c.full_name ?? 'Unnamed'}</p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)' }}>{c.client_count} client{c.client_count !== 1 ? 's' : ''}</p>
              </div>
              <span className="ds-badge-green" style={{ fontSize: '0.6rem' }}>active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Users Tab ───────────────────────────────────────── */
function UsersTab({ users, coaches, onRefresh }: { users: AdminUser[]; coaches: AdminCoach[]; onRefresh: () => void }) {
  const [search, setSearch] = useState('');
  const [assigning, setAssigning] = useState<string | null>(null);
  const [assignCoachId, setAssignCoachId] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = users.filter(u =>
    u.role === 'client' &&
    (!search || (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const assignCoach = async (userId: string) => {
    if (!assignCoachId) return;
    setSaving(true);
    // Remove existing assignment
    await supabase.from('trainer_client_assignments').delete().eq('client_id', userId);
    // Add new
    await supabase.from('trainer_client_assignments').insert({ client_id: userId, trainer_id: assignCoachId });
    setSaving(false);
    setAssigning(null);
    setAssignCoachId('');
    onRefresh();
  };

  const changeRole = async (userId: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="ds-section-title">Members</p>
          <p className="ds-section-sub">{filtered.length} client{filtered.length !== 1 ? 's' : ''}</p>
        </div>
        <input className="ds-input" style={{ width: 220 }} placeholder="Search by name…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {filtered.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /></svg>
          </div>
          <p>No members found</p>
        </div>
      ) : (
        <div className="ds-card" style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Status</th>
                <th>Onboarded</th>
                <th>Assigned Coach</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <React.Fragment key={u.id}>
                  <tr>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 11, fontWeight: 700, color: '#C9A84C' }}>
                          {u.full_name?.[0]?.toUpperCase() ?? 'U'}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{u.full_name ?? 'Unnamed'}</p>
                      </div>
                    </td>
                    <td><span className={u.subscription_status === 'active' ? 'ds-badge-green' : 'ds-badge-gray'}>{u.subscription_status ?? 'no plan'}</span></td>
                    <td><span className={u.onboarding_completed ? 'ds-badge-green' : 'ds-badge-gray'}>{u.onboarding_completed ? 'Yes' : 'No'}</span></td>
                    <td style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{u.assigned_coach ?? '—'}</td>
                    <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="ds-btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.73rem' }}
                        onClick={() => { setAssigning(assigning === u.id ? null : u.id); setAssignCoachId(''); }}
                      >
                        Assign Coach
                      </button>
                    </td>
                  </tr>
                  {assigning === u.id && (
                    <tr>
                      <td colSpan={6} style={{ padding: '0.75rem 1rem', background: 'rgba(201,168,76,0.03)' }}>
                        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                          <Select
                            style={{ width: 240 }}
                            value={assignCoachId}
                            onChange={setAssignCoachId}
                            placeholder="— select coach —"
                            options={coaches.map(c => ({ value: c.id, label: c.full_name ?? c.id }))}
                          />
                          <button className="ds-btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }} disabled={saving || !assignCoachId} onClick={() => assignCoach(u.id)}>
                            {saving ? 'Saving…' : 'Confirm'}
                          </button>
                          <button className="ds-btn-outline" style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }} onClick={() => setAssigning(null)}>Cancel</button>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Coaches Tab ─────────────────────────────────────── */
function CoachesTab({ coaches, onRefresh }: { coaches: AdminCoach[]; onRefresh: () => void }) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createCoach = async () => {
    if (!form.email || !form.password || !form.full_name) { setError('Name, email, and password are required.'); return; }
    setSaving(true); setError(''); setSuccess('');
    const res = await fetch('/api/admin/create-coach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.error) { setError(json.error); setSaving(false); return; }
    setSuccess('Coach account created successfully.');
    setForm({ full_name: '', email: '', password: '', phone: '' });
    setShowCreate(false);
    onRefresh();
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <p className="ds-section-title">Coaches</p>
          <p className="ds-section-sub">{coaches.length} coach account{coaches.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="ds-btn-gold" onClick={() => { setShowCreate(!showCreate); setError(''); setSuccess(''); }}>
          <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Coach
        </button>
      </div>

      {success && (
        <div style={{ padding: '0.8rem 1rem', marginBottom: '1.25rem', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, fontSize: '0.82rem', color: 'rgba(74,222,128,0.9)' }}>{success}</div>
      )}

      {showCreate && (
        <div className="ds-card-gold" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <p className="ds-section-title" style={{ marginBottom: '1.25rem' }}>Create Coach Account</p>
          {error && (
            <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', borderRadius: 10, fontSize: '0.8rem', color: 'rgba(239,68,68,0.85)' }}>{error}</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="ds-label">Full Name</label>
              <input className="ds-input" placeholder="Coach name" value={form.full_name} onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">Email</label>
              <input className="ds-input" type="email" placeholder="coach@omrplus.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">Password</label>
              <input className="ds-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">Phone (optional)</label>
              <input className="ds-input" placeholder="+966..." value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="ds-btn-gold" disabled={saving} onClick={createCoach}>{saving ? 'Creating…' : 'Create Coach'}</button>
            <button className="ds-btn-outline" onClick={() => { setShowCreate(false); setError(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {coaches.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
          </div>
          <p>No coaches yet</p>
          <small>Create a coach account using the button above.</small>
        </div>
      ) : (
        <div className="ds-card" style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead>
              <tr><th>Coach</th><th>Clients</th><th>Joined</th></tr>
            </thead>
            <tbody>
              {coaches.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 11, fontWeight: 700, color: '#C9A84C' }}>
                        {c.full_name?.[0]?.toUpperCase() ?? 'C'}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{c.full_name ?? 'Unnamed'}</p>
                    </div>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.55)' }}>{c.client_count}</td>
                  <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Subscriptions Tab ───────────────────────────────── */
function SubscriptionsTab({ subscriptions }: { subscriptions: AdminSubscription[] }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? subscriptions : subscriptions.filter(s => s.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="ds-section-title">Subscriptions</p>
          <p className="ds-section-sub">{subscriptions.length} total subscriptions</p>
        </div>
        <Select
          style={{ width: 160 }}
          value={filter}
          onChange={setFilter}
          placeholder=""
          options={[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'cancelled', label: 'Cancelled' },
            { value: 'expired', label: 'Expired' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
          </div>
          <p>No subscriptions found</p>
        </div>
      ) : (
        <div className="ds-card" style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead>
              <tr><th>Member</th><th>Plan</th><th>Amount</th><th>Status</th><th>Start</th><th>Expires</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>{s.user_name ?? s.user_id.slice(0, 8)}</td>
                  <td style={{ color: 'rgba(255,255,255,0.65)' }}>{s.plan_name}</td>
                  <td style={{ color: '#C9A84C', fontWeight: 600 }}>${s.amount ?? '—'}</td>
                  <td>
                    <span className={s.status === 'active' ? 'ds-badge-green' : s.status === 'cancelled' ? 'ds-badge-red' : 'ds-badge-gray'}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{new Date(s.start_date).toLocaleDateString()}</td>
                  <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{s.end_date ? new Date(s.end_date).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Marketplace Tab ─────────────────────────────────── */
function MarketplaceTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price_sar: '', type: 'supplement', image_url: '', is_active: true });
  const [saving, setSaving] = useState(false);

  const categories = ['supplement', 'snack', 'ebook', 'equipment', 'other'];

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ name: p.name, description: p.description ?? '', price_sar: String(p.price_sar), type: p.type ?? 'supplement', image_url: p.image_url ?? '', is_active: p.is_active });
    setShowForm(true);
  };

  const saveProduct = async () => {
    if (!form.name.trim() || !form.price_sar) return;
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price_sar: Number(form.price_sar),
      type: form.type,
      image_url: form.image_url.trim() || null,
      is_active: form.is_active,
    };
    if (editProduct) {
      await supabase.from('products').update(payload).eq('id', editProduct.id);
    } else {
      await supabase.from('products').insert(payload);
    }
    await load();
    setShowForm(false); setEditProduct(null); setForm({ name: '', description: '', price_sar: '', type: 'supplement', image_url: '', is_active: true });
    setSaving(false);
  };

  const deleteProduct = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('products').update({ is_active: !current }).eq('id', id);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !current } : p));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="ds-section-title">Marketplace</p>
          <p className="ds-section-sub">Manage products and ebooks</p>
        </div>
        <button className="ds-btn-gold" onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: '', description: '', price_sar: '', type: 'supplement', image_url: '', is_active: true }); }}>
          <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="ds-card-gold" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <p className="ds-section-title" style={{ marginBottom: '1.25rem' }}>{editProduct ? 'Edit Product' : 'New Product'}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label className="ds-label">Name</label>
              <input className="ds-input" placeholder="Product name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">Price ($)</label>
              <input className="ds-input" type="number" placeholder="0.00" value={form.price_sar} onChange={e => setForm(p => ({ ...p, price_sar: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">Category</label>
              <Select
                value={form.type}
                onChange={v => setForm(p => ({ ...p, type: v }))}
                placeholder=""
                options={categories.map(c => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <label className="ds-label">Image URL (optional)</label>
              <input className="ds-input" placeholder="https://..." value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label className="ds-label">Description</label>
            <textarea className="ds-input" placeholder="Product description…" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} style={{ minHeight: 72, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>Active (visible in store)</label>
            <button
              className="ds-toggle"
              style={{ background: form.is_active ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
            >
              <span className="ds-toggle-knob" style={{ left: form.is_active ? '23px' : '3px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="ds-btn-gold" disabled={saving} onClick={saveProduct}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="ds-btn-outline" onClick={() => { setShowForm(false); setEditProduct(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="ds-loading" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.35)' }}>Loading…</p>
      ) : products.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18" /></svg>
          </div>
          <p>No products yet</p>
          <small>Add products and ebooks for the marketplace.</small>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
          {products.map(p => (
            <div key={p.id} className="ds-card" style={{ padding: '1.25rem' }}>
              {p.image_url && (
                <img src={p.image_url} alt={p.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: '0.9rem' }} />
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{p.name}</p>
                <span className="ds-badge-gold" style={{ whiteSpace: 'nowrap' }}>${p.price_sar}</span>
              </div>
              {p.description && <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem', lineHeight: 1.4 }}>{p.description}</p>}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="ds-badge-gray" style={{ textTransform: 'capitalize' }}>{p.type}</span>
                  <button
                    className="ds-toggle"
                    style={{ width: 36, height: 20, background: p.is_active ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
                    onClick={() => toggleActive(p.id, p.is_active)}
                  >
                    <span className="ds-toggle-knob" style={{ width: 14, height: 14, left: p.is_active ? '19px' : '3px' }} />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className="ds-btn-outline" style={{ padding: '0.35rem 0.7rem', fontSize: '0.72rem' }} onClick={() => openEdit(p)}>Edit</button>
                  <button style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.5)', cursor: 'pointer', padding: 4 }} onClick={() => deleteProduct(p.id)}>
                    <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Pricing Tab ─────────────────────────────────────── */
const BLANK_PLAN: Partial<PricingPlan> = {
  name: '', description: '', price_monthly: 0, price_yearly: 0, features: [], is_active: true,
};

function PricingTab() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);  // existing plan id OR 'new'
  const [editForm, setEditForm] = useState<Partial<PricingPlan>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('pricing_plans').select('*').order('display_order');
    setPlans(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (plan: PricingPlan) => {
    setEditId(plan.id);
    setEditForm({
      name: plan.name, description: plan.description ?? '',
      price_monthly: plan.price_monthly, price_yearly: plan.price_yearly ?? 0,
      features: plan.features ?? [], is_active: plan.is_active,
    });
  };

  const startNew = () => {
    setEditId('new');
    setEditForm({ ...BLANK_PLAN, display_order: plans.length + 1 });
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    const payload = {
      name: editForm.name,
      description: editForm.description || null,
      price_monthly: editForm.price_monthly,
      price_yearly: editForm.price_yearly || null,
      features: editForm.features,
      is_active: editForm.is_active,
      display_order: editForm.display_order ?? plans.length + 1,
    };
    if (editId === 'new') {
      await supabase.from('pricing_plans').insert(payload);
    } else {
      await supabase.from('pricing_plans').update(payload).eq('id', editId);
    }
    await load();
    setEditId(null);
    setSaving(false);
  };

  const deletePlan = async (id: string) => {
    setDeleting(id);
    await supabase.from('pricing_plans').delete().eq('id', id);
    setPlans(prev => prev.filter(p => p.id !== id));
    setDeleting(null);
  };

  const PlanForm = () => (
    <div className="ds-card-gold" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <p className="ds-section-title" style={{ marginBottom: '1.25rem' }}>
        {editId === 'new' ? 'New Pricing Plan' : 'Edit Plan'}
      </p>
      <div style={{ display: 'grid', gap: '0.85rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="ds-label">Plan Name</label>
            <input className="ds-input" placeholder="e.g. Pro Coaching" value={editForm.name ?? ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="ds-label">Description</label>
            <input className="ds-input" placeholder="Short tagline" value={editForm.description ?? ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="ds-label">Monthly Price ($)</label>
            <input className="ds-input" type="number" value={editForm.price_monthly ?? ''} onChange={e => setEditForm(p => ({ ...p, price_monthly: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="ds-label">Yearly Price ($)</label>
            <input className="ds-input" type="number" value={editForm.price_yearly ?? ''} onChange={e => setEditForm(p => ({ ...p, price_yearly: Number(e.target.value) }))} />
          </div>
        </div>
        <div>
          <label className="ds-label">Features (one per line)</label>
          <textarea className="ds-input" value={(editForm.features ?? []).join('\n')}
            onChange={e => setEditForm(p => ({ ...p, features: e.target.value.split('\n').filter(Boolean) }))}
            style={{ minHeight: 96, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>Visible to clients</label>
          <button
            className="ds-toggle"
            style={{ background: editForm.is_active ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
            onClick={() => setEditForm(p => ({ ...p, is_active: !p.is_active }))}
          >
            <span className="ds-toggle-knob" style={{ left: editForm.is_active ? '23px' : '3px' }} />
          </button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button className="ds-btn-gold" disabled={saving || !editForm.name} onClick={saveEdit}>
          {saving ? 'Saving…' : editId === 'new' ? 'Create Plan' : 'Save Changes'}
        </button>
        <button className="ds-btn-outline" onClick={() => setEditId(null)}>Cancel</button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <p className="ds-section-title">Pricing Plans</p>
          <p className="ds-section-sub">Add, edit, or hide plans — changes reflect immediately on the site.</p>
        </div>
        {!editId && (
          <button className="ds-btn-gold" onClick={startNew}>
            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Plan
          </button>
        )}
      </div>

      {editId && <PlanForm />}

      {loading ? (
        <p className="ds-loading" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.35)' }}>Loading…</p>
      ) : plans.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /></svg>
          </div>
          <p>No pricing plans yet</p>
          <small>Click &ldquo;Add Plan&rdquo; to create your first plan.</small>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1.25rem' }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              className={plan.is_active ? 'ds-card-gold' : 'ds-card'}
              style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{plan.name}</p>
                <span className={plan.is_active ? 'ds-badge-green' : 'ds-badge-gray'}>{plan.is_active ? 'active' : 'hidden'}</span>
              </div>

              {/* Description */}
              {plan.description && (
                <p style={{ fontSize: '0.77rem', color: 'rgba(255,255,255,0.38)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  {plan.description}
                </p>
              )}

              {/* Price */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#C9A84C' }}>${plan.price_monthly}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>/mo</span>
                {plan.price_yearly && (
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>${plan.price_yearly}/year</p>
                )}
              </div>

              {/* Features — flex-grow pushes button down */}
              <ul style={{ flex: 1, marginBottom: '1.25rem', paddingLeft: 0, listStyle: 'none', display: 'grid', gap: '0.35rem' }}>
                {(plan.features ?? []).map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>
                    <span style={{ color: '#C9A84C', flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* Actions — always at bottom */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button className="ds-btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => startEdit(plan)}>
                  Edit
                </button>
                <button
                  style={{ background: 'none', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, color: 'rgba(248,113,113,0.55)', cursor: 'pointer', padding: '0 0.75rem', transition: 'all 0.2s' }}
                  disabled={deleting === plan.id}
                  onClick={() => deletePlan(plan.id)}
                  title="Delete plan"
                >
                  <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Analytics Tab ───────────────────────────────────── */
function AnalyticsTab({ users, subscriptions }: { users: AdminUser[]; subscriptions: AdminSubscription[] }) {
  const clients = users.filter(u => u.role === 'client');
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const cancelledSubs = subscriptions.filter(s => s.status === 'cancelled');
  const onboarded = clients.filter(u => u.onboarding_completed);
  const totalRevenue = activeSubs.reduce((sum, s) => sum + (s.amount ?? 0), 0);

  const metrics = [
    { label: 'Total Registered', value: String(clients.length), sub: 'All-time signups' },
    { label: 'Active Subscribers', value: String(activeSubs.length), sub: 'Currently paying' },
    { label: 'Churned', value: String(cancelledSubs.length), sub: 'Cancelled subscriptions' },
    { label: 'Onboarding Rate', value: clients.length ? `${Math.round((onboarded.length / clients.length) * 100)}%` : '—', sub: 'Completed questionnaire' },
    { label: 'Monthly Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'From active plans' },
    { label: 'Avg Revenue/User', value: clients.length ? `$${Math.round(totalRevenue / clients.length)}` : '—', sub: 'Per registered client' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="ds-section-title">Analytics</p>
        <p className="ds-section-sub">Platform performance summary</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {metrics.map(m => (
          <div key={m.label} className="ds-stat">
            <div className="ds-stat-value">{m.value}</div>
            <div className="ds-stat-label">{m.label}</div>
            <div className="ds-stat-sub">{m.sub}</div>
          </div>
        ))}
      </div>

      <div className="ds-card" style={{ padding: '1.75rem' }}>
        <p className="ds-section-title" style={{ marginBottom: '0.5rem' }}>Subscription Breakdown</p>
        <p className="ds-section-sub" style={{ marginBottom: '1.5rem' }}>Status distribution</p>
        {['active', 'cancelled', 'expired', 'past_due'].map(status => {
          const count = subscriptions.filter(s => s.status === status).length;
          const pct = subscriptions.length ? (count / subscriptions.length) * 100 : 0;
          return (
            <div key={status} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', textTransform: 'capitalize' }}>{status}</span>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.38)' }}>{count}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, borderRadius: 3, background: status === 'active' ? '#C9A84C' : 'rgba(255,255,255,0.15)', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [coaches, setCoaches] = useState<AdminCoach[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);

    const [profilesRes, subsRes, assignmentsRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, role, onboarding_completed, created_at').order('created_at', { ascending: false }),
      supabase.from('subscriptions').select('id, user_id, plan_name, status, amount, billing_period, start_date, end_date').order('created_at', { ascending: false }),
      supabase.from('trainer_client_assignments').select('client_id, trainer_id'),
    ]);

    const profiles = profilesRes.data ?? [];
    const subs = subsRes.data ?? [];
    const assignments = assignmentsRes.data ?? [];

    // Build active-sub map
    const activeSubMap: Record<string, string> = {};
    subs.filter(s => s.status === 'active').forEach(s => { activeSubMap[s.user_id] = 'active'; });

    // Build trainer assignment map
    const assignMap: Record<string, string> = {};
    assignments.forEach(a => {
      const coach = profiles.find(p => p.id === a.trainer_id);
      if (coach) assignMap[a.client_id] = coach.full_name ?? a.trainer_id;
    });

    const mappedUsers: AdminUser[] = profiles.map(p => ({
      id: p.id,
      full_name: p.full_name,
      role: p.role ?? 'client',
      onboarding_completed: p.onboarding_completed ?? false,
      created_at: p.created_at,
      subscription_status: activeSubMap[p.id],
      assigned_coach: assignMap[p.id] ?? null,
    }));

    // Coach client counts
    const coachList = profiles.filter(p => p.role === 'coach');
    const mappedCoaches: AdminCoach[] = coachList.map(c => ({
      id: c.id,
      full_name: c.full_name,
      created_at: c.created_at,
      client_count: assignments.filter(a => a.trainer_id === c.id).length,
    }));

    // Subscriptions with user name
    const mappedSubs: AdminSubscription[] = subs.map(s => ({
      ...s,
      user_name: profiles.find(p => p.id === s.user_id)?.full_name ?? null,
    }));

    setUsers(mappedUsers);
    setCoaches(mappedCoaches);
    setSubscriptions(mappedSubs);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) {
    return (
      <DashboardShell role="admin" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div className="ds-loading" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>Loading dashboard…</div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell role="admin" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <AdminOverview users={users} coaches={coaches} subscriptions={subscriptions} onNavigate={setActiveTab} />
      )}
      {activeTab === 'users' && (
        <UsersTab users={users} coaches={coaches} onRefresh={loadData} />
      )}
      {activeTab === 'trainers' && (
        <CoachesTab coaches={coaches} onRefresh={loadData} />
      )}
      {activeTab === 'subscriptions' && (
        <SubscriptionsTab subscriptions={subscriptions} />
      )}
      {activeTab === 'marketplace' && (
        <MarketplaceTab />
      )}
      {activeTab === 'pricing' && (
        <PricingTab />
      )}
      {activeTab === 'analytics' && (
        <AnalyticsTab users={users} subscriptions={subscriptions} />
      )}
    </DashboardShell>
  );
}
