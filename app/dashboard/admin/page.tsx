'use client';

import { useState, useRef } from 'react';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';
import { supabase } from '@/lib/supabase';

/* ─── Nav Items ──────────────────────────────────────── */
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
    id: 'trainers', label: 'Trainers',
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
    id: 'content', label: 'Content',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" /></svg>,
  },
  {
    id: 'pricing', label: 'Pricing',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" /></svg>,
  },
  {
    id: 'analytics', label: 'Analytics',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>,
  },
  {
    id: 'videos', label: 'Videos',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>,
  },
];

/* ─── Mock Data ──────────────────────────────────────── */
const mockUsers = [
  { id: 'u1', name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', role: 'client', plan: 'Full Coaching', status: 'active', joined: 'Feb 1, 2026', trainer: 'Coach Omar' },
  { id: 'u2', name: 'Sara Ibrahim', email: 'sara@example.com', role: 'client', plan: 'Full Coaching', status: 'active', joined: 'Feb 15, 2026', trainer: 'Coach Omar' },
  { id: 'u3', name: 'Khalid Mohammed', email: 'khalid@example.com', role: 'client', plan: 'Elite', status: 'active', joined: 'Mar 1, 2026', trainer: 'Coach Reem' },
  { id: 'u4', name: 'Nour Hassan', email: 'nour@example.com', role: 'client', plan: 'Plan Only', status: 'inactive', joined: 'Mar 15, 2026', trainer: '—' },
  { id: 'u5', name: 'Fatima Al-Zahra', email: 'fatima@example.com', role: 'client', plan: 'Full Coaching', status: 'active', joined: 'Mar 20, 2026', trainer: 'Coach Omar' },
];

const mockTrainers = [
  { id: 't1', name: 'Coach Omar', email: 'omar@omrplus.com', clients: 3, status: 'active', joined: 'Jan 1, 2026' },
  { id: 't2', name: 'Coach Reem', email: 'reem@omrplus.com', clients: 1, status: 'active', joined: 'Feb 1, 2026' },
];

const mockProducts = [
  { id: 'p1', name: 'Whey Protein - Chocolate', category: 'Supplements', price: 189, sar: true, isActive: false, type: 'physical' },
  { id: 'p2', name: 'Fitness Transformation Guide', category: 'Ebooks & Guides', price: 49, sar: true, isActive: false, type: 'digital' },
  { id: 'p3', name: 'Healthy Meal Prep Ebook', category: 'Ebooks & Guides', price: 29, sar: true, isActive: false, type: 'digital' },
  { id: 'p4', name: 'BCAAs - Watermelon', category: 'Supplements', price: 119, sar: true, isActive: false, type: 'physical' },
];

/* ─── Overview ───────────────────────────────────────── */
function AdminOverview({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const stats = [
    { label: 'Total Users', value: '47', change: '+5 this week', color: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)' },
    { label: 'Active Subscriptions', value: '38', change: '80% retention', color: 'rgba(80,200,120,0.06)', border: 'rgba(80,200,120,0.18)' },
    { label: 'Monthly Revenue', value: 'SAR 13,272', change: '+12% vs last month', color: 'rgba(100,180,255,0.06)', border: 'rgba(100,180,255,0.18)' },
    { label: 'Active Trainers', value: '2', change: '3 clients avg', color: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Admin Panel</h2>
        <p className="text-white/35 text-sm">Full platform control and analytics.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="ds-card p-5" style={{ background: s.color, borderColor: s.border }}>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-white/50 mt-0.5">{s.label}</p>
            <p className="text-xs text-white/30 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { tab: 'users', label: 'Manage Users', icon: '👥' },
          { tab: 'trainers', label: 'Assign Trainers', icon: '🏋️' },
          { tab: 'pricing', label: 'Edit Pricing', icon: '💰' },
          { tab: 'marketplace', label: 'Add Products', icon: '🛒' },
        ].map(a => (
          <button key={a.tab} onClick={() => onNavigate(a.tab)}
            className="ds-card p-4 text-left group hover:border-gold/30 transition-all" style={{ cursor: 'pointer' }}>
            <span className="text-2xl block mb-2">{a.icon}</span>
            <p className="text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">{a.label}</p>
          </button>
        ))}
      </div>

      {/* Recent users */}
      <div className="ds-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Recent Signups</h3>
          <button onClick={() => onNavigate('users')} className="text-xs" style={{ color: '#C9A84C' }}>View all →</button>
        </div>
        <div className="space-y-3">
          {mockUsers.slice(0, 4).map(u => (
            <div key={u.id} className="flex items-center gap-3 py-1.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="text-xs font-bold text-white/60">{u.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/85 truncate">{u.name}</p>
                <p className="text-xs text-white/35">{u.email}</p>
              </div>
              <span className="text-xs text-white/40">{u.plan}</span>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full`}
                style={{
                  background: u.status === 'active' ? 'rgba(80,200,120,0.1)' : 'rgba(255,255,255,0.05)',
                  color: u.status === 'active' ? 'rgba(80,200,120,0.9)' : 'rgba(255,255,255,0.3)',
                  border: u.status === 'active' ? '1px solid rgba(80,200,120,0.2)' : '1px solid rgba(255,255,255,0.08)',
                }}>
                {u.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Users Management ───────────────────────────────── */
function UsersTab() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editUser, setEditUser] = useState<typeof mockUsers[0] | null>(null);

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Users</h2>
          <p className="text-white/35 text-sm">All platform users — clients, coaches, admins</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <input type="text" className="ds-input" style={{ maxWidth: '260px' }}
          placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="ds-input" style={{ width: 'auto' }} value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="all" style={{ background: '#111' }}>All roles</option>
          <option value="client" style={{ background: '#111' }}>Clients</option>
          <option value="coach" style={{ background: '#111' }}>Coaches</option>
          <option value="admin" style={{ background: '#111' }}>Admins</option>
        </select>
      </div>

      {/* Edit panel */}
      {editUser && (
        <div className="ds-card p-6 mb-5" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Edit User: {editUser.name}</h3>
            <button onClick={() => setEditUser(null)} className="text-white/30 hover:text-white/60 text-xl leading-none">×</button>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="ds-label">Role</label>
              <select className="ds-input" defaultValue={editUser.role}>
                <option value="client" style={{ background: '#111' }}>Client</option>
                <option value="coach" style={{ background: '#111' }}>Coach</option>
                <option value="admin" style={{ background: '#111' }}>Admin</option>
              </select>
            </div>
            <div>
              <label className="ds-label">Assigned Trainer</label>
              <select className="ds-input" defaultValue={editUser.trainer}>
                <option value="—" style={{ background: '#111' }}>— None —</option>
                {mockTrainers.map(t => (
                  <option key={t.id} value={t.name} style={{ background: '#111' }}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="ds-label">Status</label>
              <select className="ds-input" defaultValue={editUser.status}>
                <option value="active" style={{ background: '#111' }}>Active</option>
                <option value="inactive" style={{ background: '#111' }}>Inactive</option>
                <option value="suspended" style={{ background: '#111' }}>Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="ds-btn-gold" onClick={() => setEditUser(null)}>Save Changes</button>
            <button className="ds-btn-outline" onClick={() => setEditUser(null)}>Cancel</button>
            <button className="ml-auto text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,80,80,0.7)', border: '1px solid rgba(255,80,80,0.2)', background: 'transparent' }}>
              Deactivate Account
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="ds-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['User', 'Email', 'Role', 'Plan', 'Trainer', 'Status', 'Joined', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <span className="text-xs font-bold text-white/50">{u.name[0]}</span>
                      </div>
                      <span className="text-white/80 font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/45">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                      style={{
                        background: u.role === 'admin' ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.05)',
                        color: u.role === 'admin' ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                        border: u.role === 'admin' ? '1px solid rgba(201,168,76,0.2)' : '1px solid rgba(255,255,255,0.08)',
                      }}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-white/45">{u.plan}</td>
                  <td className="px-4 py-3 text-white/45">{u.trainer}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full`}
                      style={{
                        background: u.status === 'active' ? 'rgba(80,200,120,0.1)' : 'rgba(255,80,80,0.08)',
                        color: u.status === 'active' ? 'rgba(80,200,120,0.9)' : 'rgba(255,100,100,0.7)',
                        border: u.status === 'active' ? '1px solid rgba(80,200,120,0.2)' : '1px solid rgba(255,80,80,0.15)',
                      }}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-white/35 text-xs">{u.joined}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setEditUser(u)} className="text-xs" style={{ color: '#C9A84C' }}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Trainers Management ────────────────────────────── */
function TrainersTab() {
  const [addMode, setAddMode] = useState(false);
  const [trainerForm, setTrainerForm] = useState({ name: '', email: '' });
  const [assignMode, setAssignMode] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Trainers</h2>
          <p className="text-white/35 text-sm">Manage coaches and assign them to clients</p>
        </div>
        <button onClick={() => setAddMode(true)} className="ds-btn-gold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Trainer
        </button>
      </div>

      {addMode && (
        <div className="ds-card p-6 mb-5" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <h3 className="font-semibold text-white mb-4">Add New Trainer</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="ds-label">Full Name</label>
              <input className="ds-input" placeholder="Coach name" value={trainerForm.name}
                onChange={e => setTrainerForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">Email</label>
              <input type="email" className="ds-input" placeholder="coach@omrplus.com" value={trainerForm.email}
                onChange={e => setTrainerForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>
          <p className="text-xs text-white/25 mb-4">A temporary password will be sent to this email. The trainer will be created with the &apos;coach&apos; role.</p>
          <div className="flex gap-3">
            <button className="ds-btn-gold">Create Trainer Account</button>
            <button onClick={() => setAddMode(false)} className="ds-btn-outline">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {mockTrainers.map(trainer => (
          <div key={trainer.id} className="ds-card p-5">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                <span className="font-bold text-lg" style={{ color: '#C9A84C' }}>{trainer.name.split(' ').pop()![0]}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white">{trainer.name}</h3>
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(80,200,120,0.1)', color: 'rgba(80,200,120,0.9)', border: '1px solid rgba(80,200,120,0.2)' }}>
                    Active
                  </span>
                </div>
                <p className="text-xs text-white/35">{trainer.email}</p>
                <p className="text-xs text-white/40 mt-1">{trainer.clients} clients assigned · Member since {trainer.joined}</p>
              </div>
            </div>

            {/* Assigned clients */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-white/25 mb-2">Assigned Clients</p>
              <div className="flex flex-wrap gap-2">
                {mockUsers.filter(u => u.trainer === trainer.name).map(u => (
                  <span key={u.id} className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                    {u.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Assign client */}
            {assignMode === trainer.id ? (
              <div className="flex gap-3">
                <select className="ds-input flex-1">
                  <option value="" style={{ background: '#111' }}>Select client to assign…</option>
                  {mockUsers.filter(u => u.trainer === '—').map(u => (
                    <option key={u.id} style={{ background: '#111' }}>{u.name}</option>
                  ))}
                </select>
                <button className="ds-btn-gold text-xs">Assign</button>
                <button onClick={() => setAssignMode(null)} className="ds-btn-outline text-xs">Cancel</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setAssignMode(trainer.id)} className="ds-btn-outline text-xs">Assign Client</button>
                <button className="ds-btn-outline text-xs">View Chat Threads</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Subscriptions Management ───────────────────────── */
function SubscriptionsTab() {
  const subs = [
    { user: 'Ahmed Al-Rashid', plan: 'Full Coaching', price: 'SAR 349', status: 'active', nextBilling: 'May 1, 2026', startDate: 'Feb 1, 2026' },
    { user: 'Sara Ibrahim', plan: 'Full Coaching', price: 'SAR 349', status: 'active', nextBilling: 'Apr 15, 2026', startDate: 'Feb 15, 2026' },
    { user: 'Khalid Mohammed', plan: 'Elite Coaching', price: 'SAR 549', status: 'active', nextBilling: 'Apr 1, 2026', startDate: 'Mar 1, 2026' },
    { user: 'Nour Hassan', plan: 'Plan Only', price: 'SAR 149', status: 'expired', nextBilling: '—', startDate: 'Mar 15, 2026' },
    { user: 'Fatima Al-Zahra', plan: 'Full Coaching', price: 'SAR 349', status: 'active', nextBilling: 'Apr 20, 2026', startDate: 'Mar 20, 2026' },
  ];

  const totalMRR = subs.filter(s => s.status === 'active').reduce((sum, s) => {
    const num = parseInt(s.price.replace(/[^0-9]/g, ''));
    return sum + num;
  }, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Subscriptions</h2>
        <p className="text-white/35 text-sm">View and manage all client subscriptions and payments</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Subscriptions', value: subs.filter(s => s.status === 'active').length.toString() },
          { label: 'Monthly Revenue (MRR)', value: `SAR ${totalMRR.toLocaleString()}` },
          { label: 'Expired / Cancelled', value: subs.filter(s => s.status !== 'active').length.toString() },
        ].map(s => (
          <div key={s.label} className="ds-card p-5 text-center">
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/35 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="ds-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Client', 'Plan', 'Amount', 'Status', 'Start Date', 'Next Billing', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-wider font-semibold text-white/25">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subs.map((s, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-white/80 font-medium">{s.user}</td>
                  <td className="px-4 py-3 text-white/50">{s.plan}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#C9A84C' }}>{s.price}</td>
                  <td className="px-4 py-3">
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: s.status === 'active' ? 'rgba(80,200,120,0.1)' : 'rgba(255,80,80,0.08)',
                        color: s.status === 'active' ? 'rgba(80,200,120,0.9)' : 'rgba(255,100,100,0.7)',
                        border: s.status === 'active' ? '1px solid rgba(80,200,120,0.2)' : '1px solid rgba(255,80,80,0.15)',
                      }}>{s.status}</span>
                  </td>
                  <td className="px-4 py-3 text-white/40 text-xs">{s.startDate}</td>
                  <td className="px-4 py-3 text-white/40 text-xs">{s.nextBilling}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs" style={{ color: '#C9A84C' }}>Invoice</button>
                      <button className="text-xs text-white/35 hover:text-red-400 transition-colors">Cancel</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Marketplace Management ─────────────────────────── */
function MarketplaceTab() {
  const [products, setProducts] = useState(mockProducts);
  const [addMode, setAddMode] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Supplements', price: '', type: 'physical', description: '' });
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleActive = (id: string) => {
    setProducts(p => p.map(prod => prod.id === id ? { ...prod, isActive: !prod.isActive } : prod));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = {
      id: `p${products.length + 1}`,
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      sar: true,
      isActive: false,
      type: form.type,
    };
    setProducts(p => [...p, newProduct]);
    setForm({ name: '', category: 'Supplements', price: '', type: 'physical', description: '' });
    setAddMode(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Marketplace</h2>
          <p className="text-white/35 text-sm">Manage products, ebooks, and digital downloads</p>
        </div>
        <button onClick={() => setAddMode(true)} className="ds-btn-gold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product / Ebook
        </button>
      </div>

      {/* Coming soon banner */}
      <div className="ds-card p-4 mb-5 flex items-center gap-3"
        style={{ background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.18)' }}>
        <span className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse" style={{ background: '#C9A84C' }} />
        <p className="text-sm text-white/55">
          Marketplace is currently in <span style={{ color: '#C9A84C' }}>Coming Soon</span> mode.
          Toggle products to <strong className="text-white/75">Active</strong> to publish them when you&apos;re ready to launch.
        </p>
      </div>

      {/* Add product form */}
      {addMode && (
        <div className="ds-card p-6 mb-5" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <h3 className="font-semibold text-white mb-4">Add New Product / Ebook</h3>
          <form onSubmit={handleAddProduct}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="ds-label">Product Name</label>
                <input className="ds-input" placeholder="e.g. Whey Protein - Chocolate" required
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="ds-label">Category</label>
                <select className="ds-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {['Supplements', 'Healthy Snacks', 'Nutrition Items', 'Ebooks & Guides'].map(c => (
                    <option key={c} style={{ background: '#111' }}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="ds-label">Price (SAR)</label>
                <input type="number" className="ds-input" placeholder="149" required
                  value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div>
                <label className="ds-label">Type</label>
                <select className="ds-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  <option value="physical" style={{ background: '#111' }}>Physical Product</option>
                  <option value="digital" style={{ background: '#111' }}>Digital Download / Ebook</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="ds-label">Description</label>
                <textarea className="ds-input" style={{ minHeight: '70px', resize: 'none' }}
                  placeholder="Brief product description…"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="ds-label">Product Image / File</label>
                <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.pdf"
                  className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="ds-btn-gold">Save Product</button>
              <button type="button" onClick={() => setAddMode(false)} className="ds-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Products list */}
      <div className="grid gap-3">
        {products.map(prod => (
          <div key={prod.id} className="ds-card p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)' }}>
              <span className="text-base">{prod.type === 'digital' ? '📘' : '📦'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{prod.name}</p>
              <p className="text-xs text-white/35">{prod.category} · {prod.type === 'digital' ? 'Digital' : 'Physical'}</p>
            </div>
            <span className="text-sm font-bold" style={{ color: '#C9A84C' }}>SAR {prod.price}</span>
            <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full`}
              style={{
                background: prod.isActive ? 'rgba(80,200,120,0.1)' : 'rgba(255,255,255,0.05)',
                color: prod.isActive ? 'rgba(80,200,120,0.9)' : 'rgba(255,255,255,0.3)',
                border: prod.isActive ? '1px solid rgba(80,200,120,0.2)' : '1px solid rgba(255,255,255,0.08)',
              }}>
              {prod.isActive ? 'Live' : 'Hidden'}
            </span>
            <div className="flex gap-2">
              <button onClick={() => toggleActive(prod.id)} className="ds-btn-outline text-xs px-3">
                {prod.isActive ? 'Hide' : 'Publish'}
              </button>
              <button className="text-xs text-red-400/50 hover:text-red-400 transition-colors px-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Content Management ─────────────────────────────── */
function ContentTab() {
  const [sections, setSections] = useState({
    heroHeadline: 'Transform Your Body. Elevate Your Life.',
    heroSubheadline: 'Premium coaching tailored to your goals.',
    showTransformations: true,
    showTestimonials: true,
    showCoachSection: false, // Hidden until admin enables
    ctaLabel: 'Free Consultation',
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Content Control</h2>
        <p className="text-white/35 text-sm">Control what&apos;s visible on the website without touching code</p>
      </div>

      <div className="space-y-5">
        {/* Hero copy */}
        <div className="ds-card p-6">
          <h3 className="font-semibold text-white mb-4">Home Page — Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="ds-label">Main Headline</label>
              <input className="ds-input" value={sections.heroHeadline}
                onChange={e => setSections(s => ({ ...s, heroHeadline: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">Sub-headline</label>
              <input className="ds-input" value={sections.heroSubheadline}
                onChange={e => setSections(s => ({ ...s, heroSubheadline: e.target.value }))} />
            </div>
            <div>
              <label className="ds-label">CTA Button Label</label>
              <input className="ds-input" value={sections.ctaLabel}
                onChange={e => setSections(s => ({ ...s, ctaLabel: e.target.value }))} />
            </div>
          </div>
        </div>

        {/* Section visibility toggles */}
        <div className="ds-card p-6">
          <h3 className="font-semibold text-white mb-4">Section Visibility</h3>
          <div className="space-y-4">
            {[
              { key: 'showTransformations', label: 'Transformations Section', desc: 'Show client transformation gallery on home page' },
              { key: 'showTestimonials', label: 'Testimonials Section', desc: 'Show video testimonials section' },
              { key: 'showCoachSection', label: 'Coach Profiles Section', desc: 'Hidden until owner assigns coaches (per business rule)' },
            ].map(item => (
              <div key={item.key} className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/35">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSections(s => ({ ...s, [item.key]: !(s as Record<string, boolean | string>)[item.key] }))}
                  className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
                  style={{
                    background: (sections as Record<string, boolean | string>)[item.key] ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)',
                    border: (sections as Record<string, boolean | string>)[item.key] ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(255,255,255,0.15)',
                  }}>
                  <span className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
                    style={{
                      background: 'white',
                      left: (sections as Record<string, boolean | string>)[item.key] ? '22px' : '2px',
                    }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button className="ds-btn-gold">Save Content Changes</button>
      </div>
    </div>
  );
}

/* ─── Pricing Management ─────────────────────────────── */
function PricingTab() {
  const [plans, setPlans] = useState([
    { id: 'plan-only', name: 'Plan Only', nameAr: 'خطة فقط', price: 149, description: 'Workout or meal plan without coaching', features: ['1 plan assigned', 'View-only access', 'No coach support'], popular: false, active: true },
    { id: 'full-coaching', name: 'Full Coaching', nameAr: 'تدريب كامل', price: 349, description: 'Meal plan + workout plan + coach support', features: ['Full meal plan', 'Full workout plan', 'Direct coach messaging', 'Progress tracking'], popular: true, active: true },
    { id: 'elite', name: 'Elite Coaching', nameAr: 'تدريب نخبة', price: 549, description: 'Full Coaching + weekly check-ins + priority support', features: ['Everything in Full Coaching', 'Weekly video check-ins', 'Priority response', 'Custom supplements guide'], popular: false, active: true },
  ]);

  const updatePrice = (id: string, price: string) => {
    setPlans(p => p.map(plan => plan.id === id ? { ...plan, price: parseFloat(price) || 0 } : plan));
  };

  const updateField = (id: string, field: string, value: string | boolean) => {
    setPlans(p => p.map(plan => plan.id === id ? { ...plan, [field]: value } : plan));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Pricing Management</h2>
        <p className="text-white/35 text-sm">Edit membership prices — changes reflect immediately on the platform</p>
      </div>

      <div className="ds-card p-4 mb-5 flex items-center gap-3"
        style={{ background: 'rgba(201,168,76,0.04)', borderColor: 'rgba(201,168,76,0.18)' }}>
        <svg className="w-4 h-4 flex-shrink-0" style={{ color: '#C9A84C' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
        <p className="text-sm text-white/50">Prices are managed here — never hardcoded in the UI. Connected to Stripe via webhook on save.</p>
      </div>

      <div className="grid gap-5">
        {plans.map(plan => (
          <div key={plan.id} className="ds-card p-6"
            style={{ borderColor: plan.popular ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.07)' }}>
            <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
              <div className="flex items-center gap-3">
                {plan.popular && <span className="ds-gold-pill text-[9px]">Featured</span>}
                <div>
                  <h3 className="font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-white/30">{plan.nameAr}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-white/35">Active</span>
                <button
                  onClick={() => updateField(plan.id, 'active', !plan.active)}
                  className="relative w-11 h-6 rounded-full transition-all"
                  style={{
                    background: plan.active ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)',
                    border: plan.active ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(255,255,255,0.15)',
                  }}>
                  <span className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
                    style={{ background: 'white', left: plan.active ? '22px' : '2px' }} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="ds-label">Price (SAR / month)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 text-sm">SAR</span>
                  <input type="number" className="ds-input" style={{ paddingLeft: '52px' }}
                    value={plan.price} onChange={e => updatePrice(plan.id, e.target.value)} />
                </div>
              </div>
              <div>
                <label className="ds-label">Plan Description</label>
                <input className="ds-input" value={plan.description}
                  onChange={e => updateField(plan.id, 'description', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="ds-label mb-2 block">Features List</label>
              <div className="space-y-2">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex gap-2">
                    <input className="ds-input flex-1" value={feat}
                      onChange={e => updateField(plan.id, 'features', plan.features.map((f, fi) => fi === i ? e.target.value : f) as unknown as string)} />
                    <button type="button" className="text-white/25 hover:text-red-400 text-lg px-1">×</button>
                  </div>
                ))}
                <button type="button" className="text-xs" style={{ color: 'rgba(201,168,76,0.7)' }}
                  onClick={() => updateField(plan.id, 'features', [...plan.features, ''] as unknown as string)}>
                  + Add feature
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="ds-btn-gold mt-5">Save All Pricing Changes</button>
    </div>
  );
}

/* ─── Analytics ──────────────────────────────────────── */
function AnalyticsTab() {
  const monthlyData = [
    { month: 'Nov', revenue: 4200, users: 12 },
    { month: 'Dec', revenue: 6800, users: 19 },
    { month: 'Jan', revenue: 8900, users: 25 },
    { month: 'Feb', revenue: 10400, users: 31 },
    { month: 'Mar', revenue: 12100, users: 42 },
    { month: 'Apr', revenue: 13272, users: 47 },
  ];
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-1">Analytics</h2>
        <p className="text-white/35 text-sm">Platform revenue, user growth & engagement metrics</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: 'SAR 55,672', change: '+12% vs last month' },
          { label: 'MRR', value: 'SAR 13,272', change: 'Current month' },
          { label: 'Avg Revenue/User', value: 'SAR 282', change: 'Per active subscriber' },
          { label: 'Churn Rate', value: '4.2%', change: 'Last 30 days' },
        ].map(s => (
          <div key={s.label} className="ds-card p-5">
            <p className="text-xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-white/45 mt-0.5">{s.label}</p>
            <p className="text-[10px] text-white/25 mt-1">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="ds-card p-6 mb-6">
        <h3 className="font-semibold text-white mb-5">Monthly Revenue (SAR)</h3>
        <div className="flex items-end gap-3 h-40">
          {monthlyData.map((d, i) => {
            const pct = (d.revenue / maxRevenue) * 85 + 10;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-white/35">{d.revenue.toLocaleString()}</span>
                <div className="w-full rounded-t-lg transition-all"
                  style={{
                    height: `${pct}%`,
                    background: i === monthlyData.length - 1 ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.2)',
                    border: i === monthlyData.length - 1 ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(201,168,76,0.12)',
                  }} />
                <span className="text-[10px] text-white/30">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User growth + plan breakdown */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="ds-card p-6">
          <h3 className="font-semibold text-white mb-4">User Growth</h3>
          <div className="space-y-3">
            {monthlyData.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-white/35 w-8">{d.month}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.users / 50) * 100}%`, background: 'rgba(201,168,76,0.4)' }} />
                </div>
                <span className="text-xs font-semibold text-white/60 w-8 text-right">{d.users}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ds-card p-6">
          <h3 className="font-semibold text-white mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Full Coaching', count: 28, pct: 60, color: 'rgba(201,168,76,0.5)' },
              { label: 'Elite Coaching', count: 9, pct: 19, color: 'rgba(201,168,76,0.3)' },
              { label: 'Plan Only', count: 10, pct: 21, color: 'rgba(255,255,255,0.2)' },
            ].map(p => (
              <div key={p.label} className="flex items-center gap-3">
                <span className="text-xs text-white/45 w-28 truncate">{p.label}</span>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
                </div>
                <span className="text-xs font-semibold text-white/60 w-8 text-right">{p.count}</span>
              </div>
            ))}
          </div>

          <div className="ds-divider" />

          <div className="text-center">
            <p className="text-xs text-white/25 mb-2">All chat threads</p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-bold text-white">142</p>
                <p className="text-[10px] text-white/30">Total msgs</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">8</p>
                <p className="text-[10px] text-white/30">Active threads</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-white">3</p>
                <p className="text-[10px] text-white/30">Unread</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Videos Management ──────────────────────────────── */
function VideosTab() {
  const [videos, setVideos] = useState([
    { id: 'v1', title: 'Proper Squat Form', category: 'Lower Body', url: 'https://res.cloudinary.com/...', uploadedAt: 'Mar 15, 2026', size: '48 MB' },
    { id: 'v2', title: 'Bench Press Tutorial', category: 'Upper Push', url: 'https://res.cloudinary.com/...', uploadedAt: 'Mar 20, 2026', size: '62 MB' },
    { id: 'v3', title: 'Deadlift Walkthrough', category: 'Full Body', url: 'https://res.cloudinary.com/...', uploadedAt: 'Mar 25, 2026', size: '55 MB' },
  ]);
  const [uploadForm, setUploadForm] = useState({ title: '', category: '', url: '' });
  const [addMode, setAddMode] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newVideo = {
      id: `v${videos.length + 1}`,
      title: uploadForm.title,
      category: uploadForm.category,
      url: uploadForm.url || 'https://res.cloudinary.com/...',
      uploadedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      size: 'Uploaded',
    };
    setVideos(v => [...v, newVideo]);
    setUploadForm({ title: '', category: '', url: '' });
    setAddMode(false);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">Workout Videos</h2>
          <p className="text-white/35 text-sm">Upload and manage exercise demonstration videos</p>
        </div>
        <button onClick={() => setAddMode(true)} className="ds-btn-gold">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>
          Upload Video
        </button>
      </div>

      {addMode && (
        <div className="ds-card p-6 mb-5" style={{ borderColor: 'rgba(201,168,76,0.2)' }}>
          <h3 className="font-semibold text-white mb-4">Upload New Video</h3>
          <form onSubmit={handleAdd}>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="ds-label">Video Title</label>
                <input className="ds-input" placeholder="e.g. Proper Squat Form" required
                  value={uploadForm.title} onChange={e => setUploadForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div>
                <label className="ds-label">Category / Muscle Group</label>
                <input className="ds-input" placeholder="e.g. Lower Body, Upper Push…"
                  value={uploadForm.category} onChange={e => setUploadForm(f => ({ ...f, category: e.target.value }))} />
              </div>
              <div className="sm:col-span-2">
                <label className="ds-label">Video File</label>
                <input ref={fileRef} type="file" accept="video/*"
                  className="text-sm text-white/50 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold w-full" />
                <p className="text-xs text-white/25 mt-1.5">Or paste a Cloudinary / YouTube URL:</p>
                <input className="ds-input mt-1.5" placeholder="https://res.cloudinary.com/…"
                  value={uploadForm.url} onChange={e => setUploadForm(f => ({ ...f, url: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="ds-btn-gold">Save Video</button>
              <button type="button" onClick={() => setAddMode(false)} className="ds-btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3">
        {videos.map(video => (
          <div key={video.id} className="ds-card p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{video.title}</p>
              <p className="text-xs text-white/35">{video.category} · {video.size} · {video.uploadedAt}</p>
            </div>
            <div className="flex gap-2">
              <button className="ds-btn-outline text-xs px-3">Preview</button>
              <button className="text-xs text-red-400/50 hover:text-red-400 transition-colors px-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTab = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview onNavigate={setActiveTab} />;
      case 'users': return <UsersTab />;
      case 'trainers': return <TrainersTab />;
      case 'subscriptions': return <SubscriptionsTab />;
      case 'marketplace': return <MarketplaceTab />;
      case 'content': return <ContentTab />;
      case 'pricing': return <PricingTab />;
      case 'analytics': return <AnalyticsTab />;
      case 'videos': return <VideosTab />;
      default: return null;
    }
  };

  return (
    <DashboardShell role="admin" navItems={navItems} activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTab()}
    </DashboardShell>
  );
}
