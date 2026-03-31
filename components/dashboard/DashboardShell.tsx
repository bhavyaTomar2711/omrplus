'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  role: 'client' | 'coach' | 'admin';
  navItems: NavItem[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
}

const roleConfig = {
  client: { label: 'Member Portal', color: '#C9A84C' },
  coach: { label: 'Coach Portal', color: '#C9A84C' },
  admin: { label: 'Admin Panel', color: '#C9A84C' },
};

export default function DashboardShell({ role, navItems, activeTab, onTabChange, children }: DashboardShellProps) {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const config = roleConfig[role];

  return (
    <>
      <style>{`
        .ds-root {
          display: flex;
          min-height: 100vh;
          background: #080808;
          font-family: inherit;
        }
        /* Sidebar */
        .ds-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.025);
          border-right: 1px solid rgba(255,255,255,0.07);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 40;
          transition: transform 0.3s ease;
        }
        .ds-sidebar.closed { transform: translateX(-100%); }
        @media (min-width: 1024px) {
          .ds-sidebar { position: sticky; top: 0; height: 100vh; transform: none !important; flex-shrink: 0; }
        }
        .ds-sidebar-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .ds-nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1.25rem;
          margin: 0.1rem 0.75rem;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          border: none;
          background: transparent;
          width: calc(100% - 1.5rem);
          text-align: left;
          transition: all 0.2s ease;
        }
        .ds-nav-item:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.04);
        }
        .ds-nav-item.active {
          color: #C9A84C;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.18);
        }
        .ds-nav-item .icon { opacity: 0.7; flex-shrink: 0; }
        .ds-nav-item.active .icon { opacity: 1; }
        /* Main area */
        .ds-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        /* Top bar */
        .ds-topbar {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.015);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 30;
        }
        .ds-content {
          flex: 1;
          padding: 2rem 1.5rem;
          overflow-y: auto;
        }
        @media (max-width: 1023px) {
          .ds-content { padding: 1.25rem 1rem; }
        }
        /* Overlay */
        .ds-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 35;
        }
        .ds-overlay.active { display: block; }
        /* Glass card utility */
        .ds-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          backdrop-filter: blur(20px);
        }
        .ds-gold-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #C9A84C;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.2);
        }
        .ds-btn-gold {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #C9A84C;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ds-btn-gold:hover {
          background: rgba(201,168,76,0.14);
          border-color: rgba(201,168,76,0.55);
        }
        .ds-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.2rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(255,255,255,0.55);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .ds-btn-outline:hover {
          color: rgba(255,255,255,0.85);
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.04);
        }
        .ds-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.65rem 1rem;
          font-size: 0.83rem;
          color: rgba(255,255,255,0.85);
          outline: none;
          transition: border-color 0.2s ease;
        }
        .ds-input::placeholder { color: rgba(255,255,255,0.25); }
        .ds-input:focus { border-color: rgba(201,168,76,0.45); }
        .ds-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 0.5rem;
        }
        .ds-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 1.5rem 0;
        }
      `}</style>

      <div className="ds-root">
        {/* Sidebar overlay for mobile */}
        <div
          className={`ds-overlay ${sidebarOpen ? 'active' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`ds-sidebar ${sidebarOpen ? '' : 'closed'}`}>
          <div className="ds-sidebar-header">
            <Link href="/" onClick={() => setSidebarOpen(false)}>
              <img
                src="https://res.cloudinary.com/dqiuwzvfb/image/upload/v1774866904/B9EBAC3E-ECDA-4CA9-81C7-F14DCC3E7A9D_1_-Photoroom_s5ro4z.png"
                alt="OMR+"
                className="h-10 w-auto object-contain mb-3"
              />
            </Link>
            <div className="ds-gold-pill">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9A84C' }} />
              {config.label}
            </div>
          </div>

          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`ds-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User info + signout */}
          <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)' }}>
                <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>
                  {user?.profile?.full_name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase() ?? 'U'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/70 truncate">
                  {user?.profile?.full_name ?? 'User'}
                </p>
                <p className="text-[10px] text-white/30 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="ds-nav-item w-full"
              style={{ width: '100%', margin: 0, color: 'rgba(255,255,255,0.35)' }}
            >
              <svg className="w-4 h-4 icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="ds-main" style={{ marginLeft: 0 }}>
          {/* Top bar */}
          <header className="ds-topbar">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-white/50 hover:text-white/80 transition-colors"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <h1 className="text-sm font-semibold text-white/70">
                {navItems.find(n => n.id === activeTab)?.label ?? 'Dashboard'}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs text-white/30">
                Welcome, <span className="text-white/55">{user?.profile?.full_name?.split(' ')[0] ?? 'there'}</span>
              </div>
              <Link href="/" className="text-xs text-white/30 hover:text-brand-gold transition-colors hidden sm:block">
                ← Back to site
              </Link>
            </div>
          </header>

          {/* Content */}
          <main className="ds-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
