'use client';

import { useState } from 'react';
import Link from 'next/link';

const mockIssues = [
  { id: 1, title: 'Broken streetlight on Al-Nasr Road', category: 'Lighting', status: 'in_progress', votes: 142, days: 3 },
  { id: 2, title: 'Pothole on Corniche Street', category: 'Roads', status: 'submitted', votes: 89, days: 1 },
  { id: 3, title: 'Water leak near City Hall', category: 'Water', status: 'resolved', votes: 201, days: 7 },
  { id: 4, title: 'Garbage overflow at Central Park', category: 'Sanitation', status: 'under_review', votes: 56, days: 2 },
  { id: 5, title: 'Damaged sidewalk near school', category: 'Roads', status: 'in_progress', votes: 77, days: 5 },
  { id: 6, title: 'Broken bench in Al-Azhar Garden', category: 'Parks', status: 'submitted', votes: 23, days: 1 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  in_progress: { label: 'In Progress', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  resolved: { label: 'Resolved', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
};

const categoryColors: Record<string, string> = {
  Roads: '#3B82F6', Lighting: '#F59E0B', Water: '#06B6D4',
  Sanitation: '#EF4444', Parks: '#10B981', Other: '#8B5CF6',
};

const categoryStats = [
  { name: 'Roads', count: 38, pct: 38 },
  { name: 'Lighting', count: 22, pct: 22 },
  { name: 'Water', count: 18, pct: 18 },
  { name: 'Sanitation', count: 12, pct: 12 },
  { name: 'Parks', count: 10, pct: 10 },
];

const weeklyData = [42, 58, 35, 71, 89, 64, 93, 78, 102, 88, 115, 97];
const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];

export default function Dashboard() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockIssues.filter(i =>
    (filter === 'all' || i.status === filter) &&
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  const maxWeekly = Math.max(...weeklyData);

  return (
    <div style={{ fontFamily: "'Syne', 'DM Sans', sans-serif", background: '#040614', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .filter-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); padding: 6px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: inherit; }
        .filter-btn.active, .filter-btn:hover { background: rgba(14,165,233,0.15); border-color: rgba(14,165,233,0.4); color: #0ea5e9; }
        .table-row { border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.15s; }
        .table-row:hover { background: rgba(255,255,255,0.02); }
        input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 8px 14px; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { border-color: rgba(14,165,233,0.4); }
      `}</style>

      {/* Navbar */}
      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,6,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#fff' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1d6fca, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
            <span style={{ fontWeight: 700, fontSize: 18, fontFamily: 'Syne' }}>CivicPulse</span>
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 32 }}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/map" className="nav-link">Live Map</Link>
          <Link href="/dashboard" className="nav-link" style={{ color: '#0ea5e9' }}>Dashboard</Link>
          <Link href="/submit" className="nav-link">Report</Link>
        </div>
        <Link href="/auth/signin" style={{ background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Syne', marginBottom: 8 }}>Public Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Live civic data — updated in real time</p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Reports', value: '1,247', icon: '📋', color: '#0ea5e9', delta: '+12% this week' },
            { label: 'Resolved', value: '68%', icon: '✅', color: '#10B981', delta: '+3% this month' },
            { label: 'Avg. Response', value: '3.8 days', icon: '⚡', color: '#F59E0B', delta: '-0.5 days' },
            { label: 'Active Issues', value: '392', icon: '🔴', color: '#EF4444', delta: '24 cities' },
          ].map((m, i) => (
            <div key={i} className="card" style={{ padding: '24px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{m.label}</span>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, fontFamily: 'Syne', color: m.color, marginBottom: 8 }}>{m.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{m.delta}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 32 }}>
          {/* Line Chart */}
          <div className="card" style={{ padding: '28px 24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Syne', marginBottom: 24 }}>Reports Over 12 Months</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
              {weeklyData.map((v, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', background: `rgba(14,165,233,${0.3 + (v / maxWeekly) * 0.6})`, borderRadius: '4px 4px 0 0', height: `${(v / maxWeekly) * 100}%`, transition: 'height 0.5s', minHeight: 4 }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card" style={{ padding: '28px 24px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Syne', marginBottom: 24 }}>By Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {categoryStats.map((c, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{c.name}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{c.count}</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${c.pct}%`, background: categoryColors[c.name] || '#8B5CF6', borderRadius: 99, transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Issues Table */}
        <div className="card" style={{ padding: '28px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Syne' }}>Recent Issues</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input placeholder="Search issues..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
              {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map(f => (
                <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : statusConfig[f]?.label}
                </button>
              ))}
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {['Issue', 'Category', 'Status', 'Votes', 'Days Open', 'Action'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(issue => {
                const sc = statusConfig[issue.status];
                const overdue = issue.days >= 7;
                return (
                  <tr key={issue.id} className="table-row">
                    <td style={{ padding: '14px 12px', fontSize: 14, maxWidth: 280 }}>
                      <span style={{ color: overdue ? '#F59E0B' : '#fff' }}>{issue.title}</span>
                      {overdue && <span style={{ marginLeft: 8, fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '2px 8px', borderRadius: 4 }}>OVERDUE</span>}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ fontSize: 12, color: categoryColors[issue.category] || '#8B5CF6', background: `${categoryColors[issue.category]}18` || 'rgba(139,92,246,0.1)', padding: '4px 10px', borderRadius: 20 }}>{issue.category}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ fontSize: 12, color: sc.color, background: sc.bg, padding: '4px 10px', borderRadius: 20 }}>{sc.label}</span>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>▲ {issue.votes}</td>
                    <td style={{ padding: '14px 12px', fontSize: 14, color: overdue ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>{issue.days}d</td>
                    <td style={{ padding: '14px 12px' }}>
                      <Link href={`/issue/${issue.id}`} style={{ fontSize: 12, color: '#0ea5e9', textDecoration: 'none' }}>View →</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.3)' }}>No issues found</div>
          )}
        </div>

        {/* Download */}
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <a href="/api/export?format=csv" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '10px 20px', borderRadius: 8, fontSize: 13, textDecoration: 'none', transition: 'all 0.2s' }}>⬇ Download CSV</a>
          <a href="/api/export?format=json" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', padding: '10px 20px', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}>⬇ Download JSON</a>
        </div>
      </div>
    </div>
  );
}
