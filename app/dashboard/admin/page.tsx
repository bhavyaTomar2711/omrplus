'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';
import Select from '@/components/ui/Select';
import { supabase } from '@/lib/supabase';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/context/LanguageContext';

/* ─── Nav icons (labels built inside component for i18n) ── */
const AdminNavIcons = {
  overview: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" /></svg>,
  users: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" /></svg>,
  trainers: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
  subscriptions: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
  marketplace: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" /></svg>,
  pricing: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>,
  analytics: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
  messages: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>,
  videos: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
};

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
  price_sar: number;
  started_at: string;
  expires_at: string | null;
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
  tagline: string | null;
  cta_text: string | null;
  price_sar: number;
  stripe_price_id: string | null;
  features: string[] | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
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
  const { t } = useLanguage();
  const activeSubs = subscriptions.filter(s => s.status === 'active').length;
  const revenue = subscriptions.filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.price_sar ?? 0), 0);
  const clients = users.filter(u => u.role === 'client');

  const stats = [
    {
      label: t('admin.totalMembers'), value: String(clients.length), sub: t('admin.registeredClients'),
      bg: 'rgba(201,168,76,0.06)', border: 'rgba(201,168,76,0.2)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" /></svg>,
    },
    {
      label: t('admin.activeCoaches'), value: String(coaches.length), sub: t('admin.platformTrainers'),
      bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>,
    },
    {
      label: t('admin.activeSubscriptions'), value: String(activeSubs), sub: t('admin.payingMembers'),
      bg: 'rgba(74,222,128,0.04)', border: 'rgba(74,222,128,0.18)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>,
    },
    {
      label: t('admin.monthlyRevenue'), value: `$${revenue.toLocaleString()}`, sub: t('admin.activeSubscriptionsLabel'),
      bg: 'rgba(255,200,80,0.04)', border: 'rgba(255,200,80,0.18)',
      icon: <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>,
    },
  ];

  return (
    <div>
      <div className="mb-7">
        <div className="ds-gold-pill mb-3">
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A84C', flexShrink: 0, display: 'inline-block' }} />
          {t('dash.adminPanel')}
        </div>
        <h2 dir="auto" style={{ fontSize: '1.6rem', fontWeight: 700, color: 'white', marginBottom: '0.35rem' }}>{t('admin.platformOverview')}</h2>
        <p dir="auto" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)' }}>{t('admin.platformSubtitle')}</p>
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
            <p dir="auto" className="ds-section-title">{t('admin.recentMembers')}</p>
            <button className="ds-btn-gold" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }} onClick={() => onNavigate('users')}>{t('admin.viewAll')}</button>
          </div>
          {clients.slice(0, 4).map(u => (
            <div key={u.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 10, fontWeight: 700, color: '#C9A84C' }}>
                {u.full_name?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <p style={{ flex: 1, fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name ?? t('admin.unnamed')}</p>
              <span className={u.subscription_status === 'active' ? 'ds-badge-green' : 'ds-badge-gray'} style={{ fontSize: '0.6rem' }}>
                {u.subscription_status === 'active' ? t('admin.statusActive') : t('admin.statusFree')}
              </span>
            </div>
          ))}
        </div>

        {/* Coaches */}
        <div className="ds-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <p dir="auto" className="ds-section-title">{t('admin.coaches')}</p>
            <button className="ds-btn-gold" style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }} onClick={() => onNavigate('trainers')}>{t('admin.manage')}</button>
          </div>
          {coaches.length === 0 ? (
            <p dir="auto" style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>{t('admin.noCoaches')}</p>
          ) : coaches.map(c => (
            <div key={c.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 10, fontWeight: 700, color: '#C9A84C' }}>
                {c.full_name?.[0]?.toUpperCase() ?? 'C'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>{c.full_name ?? t('admin.unnamed')}</p>
                <p dir="ltr" style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.28)' }}>{c.client_count} {t('admin.clients')}</p>
              </div>
              <span className="ds-badge-green" style={{ fontSize: '0.6rem' }}>{t('admin.statusActive')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Users Tab ───────────────────────────────────────── */
function UsersTab({ users, coaches, onRefresh }: { users: AdminUser[]; coaches: AdminCoach[]; onRefresh: () => void }) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [assigning, setAssigning] = useState<string | null>(null);
  const [assignCoachId, setAssignCoachId] = useState('');
  const [saving, setSaving] = useState(false);

  const filtered = users.filter(u =>
    u.role === 'client' &&
    (!search || (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()))
  );

  const [assignError, setAssignError] = useState('');

  const assignCoach = async (userId: string) => {
    if (!assignCoachId) return;
    setSaving(true);
    setAssignError('');
    try {
      // Remove any existing assignment for this client
      const { error: delError } = await supabase
        .from('trainer_client_assignments')
        .delete()
        .eq('client_id', userId);
      if (delError) throw new Error(delError.message);

      // Insert new assignment
      const { error: insError } = await supabase
        .from('trainer_client_assignments')
        .insert({ client_id: userId, trainer_id: assignCoachId });
      if (insError) throw new Error(insError.message);

      setAssigning(null);
      setAssignCoachId('');
      onRefresh();
    } catch (err: unknown) {
      setAssignError(err instanceof Error ? err.message : 'Failed to assign coach');
    } finally {
      setSaving(false);
    }
  };

  const changeRole = async (userId: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    onRefresh();
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p dir="auto" className="ds-section-title">{t('admin.usersTab')}</p>
          <p dir="ltr" className="ds-section-sub">{filtered.length} {t('admin.clients')}</p>
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
                <th>{t('admin.member')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.onboarded')}</th>
                <th>{t('admin.coach')}</th>
                <th>{t('admin.joined')}</th>
                <th></th>
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
                        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{u.full_name ?? t('admin.unnamed')}</p>
                      </div>
                    </td>
                    <td><span className={u.subscription_status === 'active' ? 'ds-badge-green' : 'ds-badge-gray'} style={{ whiteSpace: 'nowrap' }}>{u.subscription_status === 'active' ? t('admin.statusActive') : (u.subscription_status ?? t('admin.statusFree'))}</span></td>
                    <td><span className={u.onboarding_completed ? 'ds-badge-green' : 'ds-badge-gray'}>{u.onboarding_completed ? t('admin.yes') : t('admin.no')}</span></td>
                    <td style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>{u.assigned_coach ?? t('admin.noCoachAssigned')}</td>
                    <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="ds-btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.73rem' }}
                        onClick={() => { setAssigning(assigning === u.id ? null : u.id); setAssignCoachId(''); }}
                      >
                        {t('admin.assignCoach')}
                      </button>
                    </td>
                  </tr>
                  {assigning === u.id && (
                    <tr>
                      <td colSpan={6} style={{ padding: '0.75rem 1rem', background: 'rgba(201,168,76,0.03)' }}>
                        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <Select
                            style={{ width: 240 }}
                            value={assignCoachId}
                            onChange={setAssignCoachId}
                            placeholder="— select coach —"
                            options={coaches.map(c => ({ value: c.id, label: c.full_name ?? c.id }))}
                          />
                          <button className="ds-btn-gold" style={{ padding: '0.5rem 1rem', fontSize: '0.78rem' }} disabled={saving || !assignCoachId} onClick={() => assignCoach(u.id)}>
                            {saving ? t('admin.saving') : t('admin.save')}
                          </button>
                          <button className="ds-btn-outline" style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem' }} onClick={() => { setAssigning(null); setAssignError(''); }}>{t('admin.cancel')}</button>
                          {assignError && <span style={{ fontSize: '0.75rem', color: 'rgba(239,68,68,0.85)' }}>{assignError}</span>}
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
  const { t } = useLanguage();
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
          <p dir="auto" className="ds-section-title">{t('admin.coaches')}</p>
          <p dir="ltr" className="ds-section-sub">{coaches.length} {t('admin.clients')}</p>
        </div>
        <button className="ds-btn-gold" onClick={() => { setShowCreate(!showCreate); setError(''); setSuccess(''); }}>
          <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {t('admin.createCoach')}
        </button>
      </div>

      {success && (
        <div style={{ padding: '0.8rem 1rem', marginBottom: '1.25rem', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, fontSize: '0.82rem', color: 'rgba(74,222,128,0.9)' }}>{success}</div>
      )}

      {showCreate && (
        <div className="ds-card-gold" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
          <p dir="auto" className="ds-section-title" style={{ marginBottom: '1.25rem' }}>{t('admin.createCoach')}</p>
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
            <button className="ds-btn-gold" disabled={saving} onClick={createCoach}>{saving ? t('admin.saving') : t('admin.createCoach')}</button>
            <button className="ds-btn-outline" onClick={() => { setShowCreate(false); setError(''); }}>{t('admin.cancel')}</button>
          </div>
        </div>
      )}

      {coaches.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
          </div>
          <p dir="auto">{t('admin.noCoaches')}</p>
        </div>
      ) : (
        <div className="ds-card" style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead>
              <tr><th>{t('admin.coach')}</th><th>{t('admin.clients')}</th><th>{t('admin.joined')}</th></tr>
            </thead>
            <tbody>
              {coaches.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', fontSize: 11, fontWeight: 700, color: '#C9A84C' }}>
                        {c.full_name?.[0]?.toUpperCase() ?? 'C'}
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)' }}>{c.full_name ?? t('admin.unnamed')}</p>
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
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? subscriptions : subscriptions.filter(s => s.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="ds-section-title">{t('admin.subscriptionsTitle')}</p>
          <p className="ds-section-sub">{subscriptions.length} {t('admin.totalSubscriptions')}</p>
        </div>
        <Select
          style={{ width: 160 }}
          value={filter}
          onChange={setFilter}
          placeholder=""
          options={[
            { value: 'all', label: t('admin.filterAll') },
            { value: 'active', label: t('admin.filterActive') },
            { value: 'cancelled', label: t('admin.filterCancelled') },
            { value: 'expired', label: t('admin.filterExpired') },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" /></svg>
          </div>
          <p>{t('admin.noSubscriptions')}</p>
        </div>
      ) : (
        <div className="ds-card" style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead>
              <tr><th>{t('admin.member')}</th><th>{t('admin.colPlan')}</th><th>{t('admin.colAmount')}</th><th>{t('admin.status')}</th><th>{t('admin.colStart')}</th><th>{t('admin.colExpires')}</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>{s.user_name ?? s.user_id.slice(0, 8)}</td>
                  <td style={{ color: 'rgba(255,255,255,0.65)' }}>{s.plan_name}</td>
                  <td style={{ color: '#C9A84C', fontWeight: 600 }}>SAR {s.price_sar ?? '—'}</td>
                  <td>
                    <span className={s.status === 'active' ? 'ds-badge-green' : s.status === 'cancelled' ? 'ds-badge-red' : 'ds-badge-gray'}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{new Date(s.started_at).toLocaleDateString()}</td>
                  <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{s.expires_at ? new Date(s.expires_at).toLocaleDateString() : '—'}</td>
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
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price_sar: '', type: 'supplement', image_url: '', is_active: true });
  const [saving, setSaving] = useState(false);

  const categories = ['supplement', 'snack', 'ebook', 'equipment', 'other'];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      setProducts(data ?? []);
    } catch (err) {
      console.error('MarketplaceTab load error:', err);
    } finally {
      setLoading(false);
    }
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
          <p className="ds-section-title">{t('admin.marketplaceTitle')}</p>
          <p className="ds-section-sub">{t('admin.marketplaceSub')}</p>
        </div>
        <button className="ds-btn-gold" onClick={() => { setShowForm(!showForm); setEditProduct(null); setForm({ name: '', description: '', price_sar: '', type: 'supplement', image_url: '', is_active: true }); }}>
          <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          {t('admin.addProduct')}
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
            <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{t('admin.activeInStore')}</label>
            <button
              className="ds-toggle"
              style={{ background: form.is_active ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
            >
              <span className="ds-toggle-knob" style={{ left: form.is_active ? '23px' : '3px' }} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="ds-btn-gold" disabled={saving} onClick={saveProduct}>{saving ? t('admin.saving') : t('admin.save')}</button>
            <button className="ds-btn-outline" onClick={() => { setShowForm(false); setEditProduct(null); }}>{t('admin.cancel')}</button>
          </div>
        </div>
      )}

      {loading ? (
        <p dir="auto" className="ds-loading" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.35)' }}>{t('admin.loading')}</p>
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
  name: '', description: '', tagline: '', cta_text: 'Get Started',
  price_sar: 0, stripe_price_id: '', features: [], is_published: false, is_featured: false,
};

function PricingTab() {
  const { t } = useLanguage();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PricingPlan>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [featuresText, setFeaturesText] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/pricing-plans');
      const json = await res.json();
      setPlans(json.plans ?? []);
    } catch (err) {
      console.error('PricingTab load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (plan: PricingPlan) => {
    setEditId(plan.id);
    setFeaturesText((plan.features ?? []).join('\n'));
    setEditForm({
      name: plan.name,
      description: plan.description ?? '',
      tagline: plan.tagline ?? '',
      cta_text: plan.cta_text ?? 'Get Started',
      price_sar: plan.price_sar,
      stripe_price_id: plan.stripe_price_id ?? '',
      features: plan.features ?? [],
      is_published: plan.is_published,
      is_featured: plan.is_featured,
      sort_order: plan.sort_order,
    });
  };

  const startNew = () => {
    setEditId('new');
    setFeaturesText('');
    setEditForm({ ...BLANK_PLAN, sort_order: plans.length + 1 });
  };

  const saveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    setSaveError(null);
    const features = featuresText.split('\n').map(s => s.trim()).filter(Boolean);
    const payload = {
      name: editForm.name,
      description: editForm.description || null,
      tagline: editForm.tagline || null,
      cta_text: editForm.cta_text || 'Get Started',
      price_sar: editForm.price_sar ?? 0,
      stripe_price_id: editForm.stripe_price_id || null,
      features,
      is_published: editForm.is_published ?? false,
      is_featured: editForm.is_featured ?? false,
      sort_order: editForm.sort_order ?? plans.length + 1,
    };

    try {
      const res = await fetch('/api/admin/pricing-plans', {
        method: editId === 'new' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editId === 'new' ? payload : { id: editId, ...payload }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSaveError(json.error ?? 'Save failed');
        return;
      }
      await load();
      setEditId(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (id: string) => {
    setDeleting(id);
    try {
      await fetch('/api/admin/pricing-plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } finally {
      setPlans(prev => prev.filter(p => p.id !== id));
      setDeleting(null);
    }
  };

  const togglePublish = async (plan: PricingPlan) => {
    const updated = !plan.is_published;
    setPlans(prev => prev.map(p => p.id === plan.id ? { ...p, is_published: updated } : p));
    await fetch('/api/admin/pricing-plans', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, is_published: updated }),
    });
  };

  const planFormJsx = editId ? (
    <div className="ds-card-gold" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      <p dir="auto" className="ds-section-title" style={{ marginBottom: '1.25rem' }}>
        {editId === 'new' ? t('admin.newPlan') : t('admin.editPlan')}
      </p>
      <div style={{ display: 'grid', gap: '0.85rem' }}>

        {/* Row 1: Name + Tagline */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="ds-label">Plan Name *</label>
            <input className="ds-input" placeholder="e.g. Full Coaching" value={editForm.name ?? ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="ds-label">Tagline</label>
            <input className="ds-input" placeholder="e.g. MOST POPULAR" value={editForm.tagline ?? ''} onChange={e => setEditForm(p => ({ ...p, tagline: e.target.value }))} />
          </div>
        </div>

        {/* Row 2: Description + CTA */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
          <div>
            <label className="ds-label">Description</label>
            <input className="ds-input" placeholder="Short description shown on the card" value={editForm.description ?? ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <label className="ds-label">Button Text</label>
            <input className="ds-input" placeholder="Get Started" value={editForm.cta_text ?? ''} onChange={e => setEditForm(p => ({ ...p, cta_text: e.target.value }))} />
          </div>
        </div>

        {/* Row 3: Price + Stripe Price ID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
          <div>
            <label className="ds-label">Price (SAR/mo) *</label>
            <input className="ds-input" type="number" min="0" placeholder="349" value={editForm.price_sar ?? ''} onChange={e => setEditForm(p => ({ ...p, price_sar: Number(e.target.value) }))} />
          </div>
          <div>
            <label className="ds-label">Stripe Price ID *</label>
            <input
              className="ds-input"
              placeholder="price_1Xyz..."
              value={editForm.stripe_price_id ?? ''}
              onChange={e => setEditForm(p => ({ ...p, stripe_price_id: e.target.value }))}
              style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}
            />
          </div>
        </div>

        {/* Stripe help note */}
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.28)', marginTop: -4, lineHeight: 1.5 }}>
          Get the Price ID from your Stripe Dashboard → Products → select a product → copy the Price ID (starts with <code style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 4px', borderRadius: 3 }}>price_</code>).
        </p>

        {/* Features */}
        <div>
          <label className="ds-label">Features (one per line)</label>
          <textarea
            className="ds-input"
            value={featuresText}
            onChange={e => setFeaturesText(e.target.value)}
            placeholder="Custom meal plan&#10;Weekly check-ins&#10;Real-time messaging"
            style={{ minHeight: 110, resize: 'vertical', fontFamily: 'inherit' }}
          />
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              className="ds-toggle"
              style={{ background: editForm.is_published ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setEditForm(p => ({ ...p, is_published: !p.is_published }))}
            >
              <span className="ds-toggle-knob" style={{ left: editForm.is_published ? '23px' : '3px' }} />
            </button>
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Published</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>Visible on site</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              className="ds-toggle"
              style={{ background: editForm.is_featured ? '#C9A84C' : 'rgba(255,255,255,0.1)' }}
              onClick={() => setEditForm(p => ({ ...p, is_featured: !p.is_featured }))}
            >
              <span className="ds-toggle-knob" style={{ left: editForm.is_featured ? '23px' : '3px' }} />
            </button>
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Featured</p>
              <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)'}}>&ldquo;Most Popular&rdquo; badge</p>
            </div>
          </div>
        </div>
      </div>

      {saveError && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'rgba(248,113,113,0.07)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 10, fontSize: '0.78rem', color: 'rgba(248,113,113,0.9)' }}>
          Error: {saveError}
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
        <button className="ds-btn-gold" disabled={saving || !editForm.name || !editForm.price_sar} onClick={saveEdit}>
          {saving ? t('admin.saving') : editId === 'new' ? t('admin.addPlan') : t('admin.save')}
        </button>
        <button className="ds-btn-outline" onClick={() => { setEditId(null); setSaveError(null); }}>{t('admin.cancel')}</button>
      </div>
    </div>
  ) : null;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <p className="ds-section-title">{t('admin.pricingTitle')}</p>
          <p className="ds-section-sub">{t('admin.pricingSubtitle')}</p>
        </div>
        {!editId && (
          <button className="ds-btn-gold" onClick={startNew}>
            <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {t('admin.addPlan')}
          </button>
        )}
      </div>

      {planFormJsx}

      {loading ? (
        <p dir="auto" className="ds-loading" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.35)' }}>{t('admin.loading')}</p>
      ) : plans.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /></svg>
          </div>
          <p>No pricing plans yet</p>
          <small>Click &ldquo;Add Plan&rdquo; to create your first plan, then publish it.</small>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              className={plan.is_published ? 'ds-card-gold' : 'ds-card'}
              style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', opacity: plan.is_published ? 1 : 0.7 }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <div>
                  {plan.tagline && (
                    <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.55)', marginBottom: '0.25rem' }}>
                      {plan.tagline}
                    </p>
                  )}
                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>{plan.name}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
                  <span className={plan.is_published ? 'ds-badge-green' : 'ds-badge-gray'}>{plan.is_published ? 'published' : 'draft'}</span>
                  {plan.is_featured && <span className="ds-badge-green" style={{ background: 'rgba(201,168,76,0.12)', color: '#C9A84C', borderColor: 'rgba(201,168,76,0.25)' }}>featured</span>}
                </div>
              </div>

              {/* Description */}
              {plan.description && (
                <p style={{ fontSize: '0.76rem', color: 'rgba(255,255,255,0.38)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                  {plan.description}
                </p>
              )}

              {/* Price */}
              <div style={{ marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 700, color: '#C9A84C' }}>{plan.price_sar}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginLeft: 4 }}>SAR/mo</span>
              </div>

              {/* Stripe Price ID */}
              <div style={{ marginBottom: '0.85rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8 }}>
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.28)', marginBottom: 2 }}>STRIPE PRICE ID</p>
                <p style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: plan.stripe_price_id ? 'rgba(201,168,76,0.7)' : 'rgba(255,100,100,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {plan.stripe_price_id || '⚠ Not set — checkout will fail'}
                </p>
              </div>

              {/* Features */}
              <ul style={{ flex: 1, marginBottom: '1.25rem', paddingLeft: 0, listStyle: 'none', display: 'grid', gap: '0.3rem' }}>
                {(plan.features ?? []).slice(0, 4).map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.77rem', color: 'rgba(255,255,255,0.5)' }}>
                    <span style={{ color: '#C9A84C', flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
                {(plan.features ?? []).length > 4 && (
                  <li style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)' }}>+{(plan.features ?? []).length - 4} more</li>
                )}
              </ul>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                <button
                  className={plan.is_published ? 'ds-btn-outline' : 'ds-btn-gold'}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.74rem' }}
                  onClick={() => togglePublish(plan)}
                >
                  {plan.is_published ? t('admin.unpublish') : t('admin.publish')}
                </button>
                <button className="ds-btn-outline" style={{ padding: '0 0.75rem' }} onClick={() => startEdit(plan)} title="Edit">
                  <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" /></svg>
                </button>
                <button
                  style={{ background: 'none', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, color: 'rgba(248,113,113,0.55)', cursor: 'pointer', padding: '0 0.65rem' }}
                  disabled={deleting === plan.id}
                  onClick={() => deletePlan(plan.id)}
                  title="Delete"
                >
                  <svg style={{ width: 13, height: 13 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Chat Threads Tab ────────────────────────────────── */
interface ChatThread {
  id: string;
  client_id: string;
  coach_id: string;
  created_at: string;
  client_name: string | null;
  coach_name: string | null;
}

function ChatThreadsTab() {
  const { t } = useLanguage();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<{ id: string; sender_id: string; content: string; created_at: string }[]>([]);
  const [profileNames, setProfileNames] = useState<Record<string, string>>({});
  const [msgLoading, setMsgLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase
          .from('message_threads')
          .select(`
            id, client_id, coach_id, created_at,
            client:profiles!message_threads_client_id_fkey(full_name),
            coach:profiles!message_threads_coach_id_fkey(full_name)
          `)
          .order('created_at', { ascending: false });
        if (data) {
          setThreads(data.map(t => ({
            id: t.id,
            client_id: t.client_id,
            coach_id: t.coach_id,
            created_at: t.created_at,
            client_name: (t.client as unknown as { full_name: string | null } | null)?.full_name ?? null,
            coach_name: (t.coach as unknown as { full_name: string | null } | null)?.full_name ?? null,
          })));
        }
      } catch (err) {
        console.error('ChatThreadsTab load error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openThread = async (thread: ChatThread) => {
    setSelected(thread);
    setMsgLoading(true);
    const { data: msgs } = await supabase
      .from('messages')
      .select('id, sender_id, content, created_at')
      .eq('thread_id', thread.id)
      .order('created_at', { ascending: true });
    setMessages(msgs ?? []);
    const ids = [...new Set((msgs ?? []).map(m => m.sender_id))];
    if (ids.length > 0) {
      const { data: profs } = await supabase.from('profiles').select('id, full_name').in('id', ids);
      const map: Record<string, string> = {};
      (profs ?? []).forEach(p => { map[p.id] = p.full_name ?? 'Unknown'; });
      setProfileNames(map);
    }
    setMsgLoading(false);
  };

  if (selected) {
    return (
      <div>
        <button className="ds-btn-outline" style={{ marginBottom: '1.5rem' }} onClick={() => { setSelected(null); setMessages([]); }}>
          <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Back to Threads
        </button>
        <div className="ds-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div>
            <p className="ds-section-title">{selected.client_name ?? 'Client'} ↔ {selected.coach_name ?? 'Coach'}</p>
            <p className="ds-section-sub">{messages.length} message{messages.length !== 1 ? 's' : ''} · Read-only admin view</p>
          </div>
        </div>
        <div className="ds-card" style={{ padding: '1.25rem', maxHeight: 500, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {msgLoading && <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Loading messages…</p>}
          {!msgLoading && messages.length === 0 && (
            <p style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>No messages in this thread.</p>
          )}
          {messages.map(msg => {
            const isClient = msg.sender_id === selected.client_id;
            const name = profileNames[msg.sender_id] ?? (isClient ? 'Client' : 'Coach');
            return (
              <div key={msg.id} style={{ display: 'flex', justifyContent: isClient ? 'flex-start' : 'flex-end' }}>
                <div style={{ maxWidth: '70%' }}>
                  <p style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)', marginBottom: 3 }}>{name}</p>
                  <div style={{
                    padding: '0.65rem 1rem', borderRadius: 12,
                    background: isClient ? 'rgba(255,255,255,0.05)' : 'rgba(201,168,76,0.1)',
                    border: isClient ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(201,168,76,0.2)',
                    fontSize: '0.84rem', color: 'rgba(255,255,255,0.8)',
                  }}>
                    {msg.content}
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', marginTop: 4, textAlign: 'right' }}>
                      {new Date(msg.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="ds-section-title">{t('admin.chatTitle')}</p>
        <p className="ds-section-sub">{t('admin.chatSubtitle')}</p>
      </div>
      {loading ? (
        <p className="ds-loading" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.35)' }}>Loading…</p>
      ) : threads.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
          </div>
          <p>{t('admin.noConversations')}</p>
          <small>{t('admin.noConversationsSub')}</small>
        </div>
      ) : (
        <div className="ds-card" style={{ overflowX: 'auto' }}>
          <table className="ds-table">
            <thead>
              <tr><th>{t('admin.colClient')}</th><th>{t('admin.colCoach')}</th><th>{t('admin.colStarted')}</th><th></th></tr>
            </thead>
            <tbody>
              {threads.map(thread => (
                <tr key={thread.id}>
                  <td style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem' }}>{thread.client_name ?? '—'}</td>
                  <td style={{ color: 'rgba(255,255,255,0.65)' }}>{thread.coach_name ?? '—'}</td>
                  <td style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.75rem' }}>{new Date(thread.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="ds-btn-outline" style={{ padding: '0.35rem 0.8rem', fontSize: '0.72rem' }} onClick={() => openThread(thread)}>
                      {t('admin.viewThread')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Videos Tab (Cloudinary) ─────────────────────────── */
interface WorkoutVideo {
  id: string;
  title: string;
  cloudinary_url: string;
  public_id: string;
  thumbnail_url: string | null;
  bytes: number | null;
  duration: number | null;
  created_at: string;
}

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

function getThumbUrl(public_id: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_400,h_225,c_fill,so_2/${public_id}.jpg`;
}

function VideosTab() {
  const { t } = useLanguage();
  const [videos, setVideos] = useState<WorkoutVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/list-videos');
      const json = await res.json();
      setVideos(json.videos ?? []);
    } catch (err) {
      console.error('VideosTab load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadVideos(); }, [loadVideos]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    // Simulate progress since fetch doesn't support real progress events
    setUploadProgress(5);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 600);

    let json: Record<string, unknown> | null = null;
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
      );
      clearInterval(interval);
      if (!res.ok) throw new Error('Cloudinary upload failed');
      setUploadProgress(100);
      json = await res.json() as Record<string, unknown>;
    } catch (err) {
      clearInterval(interval);
      console.error('Cloudinary upload error:', err);
    } finally {
      // Always reset UI — never leave the user stuck
      setUploading(false);
      setUploadProgress(0);
      if (fileRef.current) fileRef.current.value = '';
    }

    // Save metadata to DB via server API (bypasses RLS) and refresh list
    if (json?.secure_url) {
      const saveRes = await fetch('/api/admin/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          cloudinary_url: json.secure_url,
          public_id: json.public_id,
          thumbnail_url: getThumbUrl(json.public_id as string),
          bytes: json.bytes ?? null,
          duration: json.duration ?? null,
        }),
      });
      if (!saveRes.ok) {
        const errJson = await saveRes.json().catch(() => ({ error: 'Unknown error' }));
        alert(`Video uploaded to Cloudinary but failed to save to database: ${errJson.error}`);
      } else {
        await loadVideos();
      }
    }
  };

  const deleteVideo = async (id: string, public_id: string) => {
    try {
      const res = await fetch('/api/admin/delete-video', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, public_id }),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({ error: 'Unknown error' }));
        console.error('deleteVideo error:', errJson.error);
      }
    } catch (err) {
      console.error('deleteVideo error:', err);
    } finally {
      setVideos(prev => prev.filter(v => v.id !== id));
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDuration = (sec: number | null) => {
    if (!sec) return '';
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <p className="ds-section-title">{t('admin.videosTitle')}</p>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input ref={fileRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleUpload} />
            <button className="ds-btn-gold" disabled={uploading} onClick={() => fileRef.current?.click()}>
              <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              {uploading ? (uploadProgress < 100 ? `${t('admin.uploading')} ${uploadProgress}%` : t('admin.processing')) : t('admin.uploadVideo')}
            </button>
          </div>
        </div>
        {uploading && (
          <div style={{ marginTop: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.35rem' }}>
              <span>{uploadProgress < 100 ? t('admin.uploadingVideo') : t('admin.processingCloudinary')}</span>
              <span>{uploadProgress < 100 ? `${uploadProgress}%` : ''}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: uploadProgress < 100 ? `${uploadProgress}%` : '100%',
                background: uploadProgress < 100 ? 'linear-gradient(90deg, #C9A84C, #e8c96b)' : 'linear-gradient(90deg, #C9A84C, #e8c96b, #C9A84C)',
                backgroundSize: uploadProgress < 100 ? 'auto' : '200% 100%',
                animation: uploadProgress >= 100 ? 'shimmer 1.2s infinite linear' : 'none',
                borderRadius: 999,
                transition: 'width 0.2s ease',
              }} />
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <p className="ds-loading" style={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.35)' }}>Loading…</p>
      ) : videos.length === 0 ? (
        <div className="ds-empty">
          <div className="ds-empty-icon">
            <svg style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </div>
          <p>No videos uploaded yet</p>
          <small>Upload workout demonstration videos to use in client plans.</small>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
          {videos.map(v => (
            <div key={v.id} className="ds-card" style={{ padding: '1.25rem' }}>
              {/* Cloudinary auto-generated thumbnail */}
              <div style={{ position: 'relative', marginBottom: '0.9rem' }}>
                {v.thumbnail_url ? (
                  <img
                    src={v.thumbnail_url}
                    alt={v.title}
                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, display: 'block' }}
                  />
                ) : (
                  <div style={{ width: '100%', height: 140, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ width: 28, height: 28, color: 'rgba(255,255,255,0.2)' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                  </div>
                )}
                {v.duration && (
                  <span style={{ position: 'absolute', bottom: 6, right: 6, background: 'rgba(0,0,0,0.72)', color: 'white', fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: 4 }}>
                    {formatDuration(v.duration)}
                  </span>
                )}
              </div>

              <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {v.title}
              </p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.28)', marginBottom: '0.9rem' }}>
                {formatSize(v.bytes)}{v.created_at ? ` · ${new Date(v.created_at).toLocaleDateString()}` : ''}
              </p>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  className="ds-btn-outline"
                  style={{ flex: 1, justifyContent: 'center', padding: '0.45rem 0.75rem', fontSize: '0.73rem' }}
                  onClick={() => copyUrl(v.cloudinary_url, v.id)}
                >
                  {copied === v.id ? 'Copied!' : 'Copy URL'}
                </button>
                <a
                  href={v.cloudinary_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.65rem', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}
                  title="Preview video"
                >
                  <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </a>
                <button
                  style={{ background: 'none', border: '1px solid rgba(248,113,113,0.2)', borderRadius: 10, color: 'rgba(248,113,113,0.55)', cursor: 'pointer', padding: '0 0.65rem' }}
                  onClick={() => deleteVideo(v.id, v.public_id)}
                  title="Remove from list"
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
  const { t } = useLanguage();
  const clients = users.filter(u => u.role === 'client');
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const cancelledSubs = subscriptions.filter(s => s.status === 'cancelled');
  const onboarded = clients.filter(u => u.onboarding_completed);
  const totalRevenue = activeSubs.reduce((sum, s) => sum + (s.price_sar ?? 0), 0);

  // Build last-6-months chart data
  const getLast6Months = () => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      result.push({
        month: d.toLocaleDateString('en', { month: 'short' }),
        prefix: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      });
    }
    return result;
  };
  const months = getLast6Months();
  const signupData = months.map(m => ({
    month: m.month,
    signups: clients.filter(u => u.created_at.startsWith(m.prefix)).length,
  }));
  const revenueData = months.map(m => ({
    month: m.month,
    revenue: subscriptions
      .filter(s => s.started_at?.startsWith(m.prefix))
      .reduce((sum, s) => sum + (s.price_sar ?? 0), 0),
  }));

  const metrics = [
    { label: t('admin.totalRegistered'), value: String(clients.length), sub: t('admin.allTimeSignups') },
    { label: t('admin.activeSubscribers'), value: String(activeSubs.length), sub: t('admin.currentlyPaying') },
    { label: t('admin.churned'), value: String(cancelledSubs.length), sub: t('admin.cancelledSubscriptions') },
    { label: t('admin.onboardingRate'), value: clients.length ? `${Math.round((onboarded.length / clients.length) * 100)}%` : '—', sub: t('admin.completedQuestionnaire') },
    { label: t('admin.monthlyRevenue'), value: `SAR ${totalRevenue.toLocaleString()}`, sub: t('admin.fromActivePlans') },
    { label: t('admin.avgRevenueUser'), value: clients.length ? `SAR ${Math.round(totalRevenue / clients.length)}` : '—', sub: t('admin.perRegisteredClient') },
  ];

  const tooltipStyle = { background: '#111', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, fontSize: 12, color: '#fff' };

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <p className="ds-section-title">{t('admin.analyticsTitle')}</p>
        <p className="ds-section-sub">{t('admin.analyticsSub')}</p>
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

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="ds-card" style={{ padding: '1.75rem' }}>
          <p className="ds-section-title" style={{ marginBottom: '0.25rem' }}>{t('admin.newMembers')}</p>
          <p className="ds-section-sub" style={{ marginBottom: '1.25rem' }}>{t('admin.last6Months')}</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={signupData}>
              <defs>
                <linearGradient id="signupGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.28} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="signups" stroke="#C9A84C" fill="url(#signupGrad)" strokeWidth={2} dot={{ r: 3, fill: '#C9A84C' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="ds-card" style={{ padding: '1.75rem' }}>
          <p className="ds-section-title" style={{ marginBottom: '0.25rem' }}>{t('admin.revenueSAR')}</p>
          <p className="ds-section-sub" style={{ marginBottom: '1.25rem' }}>{t('admin.last6Months')}</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} width={38} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="revenue" fill="#C9A84C" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ds-card" style={{ padding: '1.75rem' }}>
        <p className="ds-section-title" style={{ marginBottom: '0.5rem' }}>{t('admin.subscriptionBreakdown')}</p>
        <p className="ds-section-sub" style={{ marginBottom: '1.5rem' }}>{t('admin.statusDistribution')}</p>
        {['active', 'cancelled', 'expired', 'past_due'].map(status => {
          const count = subscriptions.filter(s => s.status === status).length;
          const pct = subscriptions.length ? (count / subscriptions.length) * 100 : 0;
          const statusLabel: Record<string, string> = {
            active: t('admin.filterActive'),
            cancelled: t('admin.statusCancelled'),
            expired: t('admin.statusExpired'),
            past_due: t('admin.statusPastDue'),
          };
          return (
            <div key={status} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)' }}>{statusLabel[status] ?? status}</span>
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
  const { t } = useLanguage();
  const navItems: NavItem[] = [
    { id: 'overview',      label: t('admin.overview'),      icon: AdminNavIcons.overview },
    { id: 'users',         label: t('admin.users'),         icon: AdminNavIcons.users },
    { id: 'trainers',      label: t('admin.coaches'),       icon: AdminNavIcons.trainers },
    { id: 'subscriptions', label: t('admin.subscriptions'), icon: AdminNavIcons.subscriptions },
    { id: 'marketplace',   label: t('admin.marketplace'),   icon: AdminNavIcons.marketplace },
    { id: 'pricing',       label: t('admin.pricing'),       icon: AdminNavIcons.pricing },
    { id: 'analytics',     label: t('admin.analytics'),     icon: AdminNavIcons.analytics },
    { id: 'messages',      label: t('admin.chat'),          icon: AdminNavIcons.messages },
    { id: 'videos',        label: t('admin.videos'),        icon: AdminNavIcons.videos },
  ];
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [coaches, setCoaches] = useState<AdminCoach[]>([]);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesRes, subsRes, assignmentsRes] = await Promise.all([
        supabase.from('profiles').select('id, full_name, role, onboarding_completed, created_at').order('created_at', { ascending: false }),
        supabase.from('subscriptions').select('id, user_id, plan_name, status, price_sar, started_at, expires_at').order('created_at', { ascending: false }),
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
    } catch (err) {
      console.error('Admin loadData error:', err);
    } finally {
      setLoading(false);
    }
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
      {activeTab === 'messages' && (
        <ChatThreadsTab />
      )}
      {activeTab === 'videos' && (
        <VideosTab />
      )}
    </DashboardShell>
  );
}
