'use client';

import { useState } from 'react';

const mockIssues = [
  { id: 1, title: 'Broken streetlight on Al-Nasr Road', category: 'Lighting', status: 'in_progress', votes: 142, lat: 30.0626, lng: 31.2497, days: 3 },
  { id: 2, title: 'Pothole on Corniche Street', category: 'Roads', status: 'submitted', votes: 89, lat: 30.0444, lng: 31.2357, days: 1 },
  { id: 3, title: 'Water leak near City Hall', category: 'Water', status: 'resolved', votes: 201, lat: 30.0561, lng: 31.2394, days: 7 },
  { id: 4, title: 'Garbage overflow at Central Park', category: 'Sanitation', status: 'under_review', votes: 56, lat: 30.0500, lng: 31.2333, days: 2 },
  { id: 5, title: 'Damaged sidewalk near school', category: 'Roads', status: 'in_progress', votes: 77, lat: 30.0580, lng: 31.2450, days: 5 },
  { id: 6, title: 'Broken bench in Al-Azhar Garden', category: 'Parks', status: 'submitted', votes: 23, lat: 30.0460, lng: 31.2620, days: 1 },
  { id: 7, title: 'Sewage smell on Ring Road', category: 'Water', status: 'under_review', votes: 110, lat: 30.0390, lng: 31.2280, days: 4 },
  { id: 8, title: 'Traffic light malfunction', category: 'Roads', status: 'in_progress', votes: 98, lat: 30.0610, lng: 31.2530, days: 2 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  submitted:    { label: 'Submitted',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)', dot: '#9CA3AF' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  dot: '#F59E0B' },
  in_progress:  { label: 'In Progress',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  dot: '#3B82F6' },
  resolved:     { label: 'Resolved',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  dot: '#10B981' },
};

const categoryColors: Record<string, string> = {
  Roads: '#3B82F6', Lighting: '#F59E0B', Water: '#06B6D4',
  Sanitation: '#EF4444', Parks: '#10B981', Other: '#8B5CF6',
};

export default function MapPage() {
  const [selected, setSelected] = useState<typeof mockIssues[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCat, setFilterCat] = useState('all');

  const filtered = mockIssues.filter(i =>
    (filterStatus === 'all' || i.status === filterStatus) &&
    (filterCat === 'all' || i.category === filterCat)
  );

  // Simple grid-based map visualization (no API key needed)
  const minLat = 30.035, maxLat = 30.070, minLng = 31.220, maxLng = 31.270;
  const toX = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * 100;
  const toY = (lat: number) => (1 - (lat - minLat) / (maxLat - minLat)) * 100;

  return (
    <div style={{ fontFamily: "'Syne','DM Sans',sans-serif", background: '#040614', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .filter-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.5); padding: 5px 14px; border-radius: 20px; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: inherit; white-space: nowrap; }
        .filter-btn.active { background: rgba(14,165,233,0.15); border-color: rgba(14,165,233,0.4); color: #0ea5e9; }
        .filter-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
        .issue-row { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.15s; }
        .issue-row:hover { background: rgba(255,255,255,0.03); }
        .issue-row.active { background: rgba(14,165,233,0.08); border-left: 2px solid #0ea5e9; }
        .map-pin { position: absolute; transform: translate(-50%, -50%); cursor: pointer; transition: transform 0.2s; }
        .map-pin:hover { transform: translate(-50%, -50%) scale(1.3); z-index: 10; }
        .tooltip { position: absolute; background: rgba(10,15,40,0.95); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; font-size: 12px; white-space: nowrap; pointer-events: none; z-index: 20; transform: translate(-50%, -120%); min-width: 180px; white-space: normal; width: 200px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,6,20,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#fff' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18, fontFamily: 'Syne' }}>CivicPulse</span>
        </a>
        <div style={{ display: 'flex', gap: 32 }}>
          <a href="/" className="nav-link">Home</a>
          <a href="/map" className="nav-link" style={{ color: '#0ea5e9' }}>Live Map</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/submit" className="nav-link">Report</a>
        </div>
        <a href="/auth/signin" style={{ background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Sign In</a>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 64px)' }}>

        {/* Sidebar */}
        <div style={{ width: 340, background: 'rgba(255,255,255,0.02)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

          {/* Sidebar Header */}
          <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Syne' }}>Live Issues</h2>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 20 }}>{filtered.length} shown</span>
            </div>

            {/* Status filters */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
              {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map(s => (
                <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
                  {s === 'all' ? 'All' : statusConfig[s]?.label}
                </button>
              ))}
            </div>

            {/* Category filters */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['all', 'Roads', 'Lighting', 'Water', 'Sanitation', 'Parks'].map(c => (
                <button key={c} className={`filter-btn ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Issue List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(issue => {
              const sc = statusConfig[issue.status];
              return (
                <div key={issue.id} className={`issue-row ${selected?.id === issue.id ? 'active' : ''}`} onClick={() => setSelected(issue)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, flex: 1, paddingRight: 8 }}>{issue.title}</span>
                    <span style={{ fontSize: 11, color: sc.color, background: sc.bg, padding: '3px 8px', borderRadius: 10, flexShrink: 0 }}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: categoryColors[issue.category] || '#8B5CF6' }}>{issue.category}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>▲ {issue.votes}</span>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{issue.days}d ago</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report button */}
          <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <a href="/submit" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '12px', borderRadius: 10, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
              + Report an Issue
            </a>
          </div>
        </div>

        {/* Map Area */}
        <div style={{ flex: 1, position: 'relative', background: '#07101f', overflow: 'hidden' }}>

          {/* Grid background */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4a9eff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Map label */}
          <div style={{ position: 'absolute', top: 20, left: 20, background: 'rgba(10,15,40,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px', fontSize: 12, color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}>
            📍 Cairo, Egypt — Live Issue Map
          </div>

          {/* Legend */}
          <div style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(10,15,40,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.05em' }}>STATUS</div>
            {Object.entries(statusConfig).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: v.dot }} />
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{v.label}</span>
              </div>
            ))}
          </div>

          {/* Pins */}
          <div style={{ position: 'absolute', inset: 0 }}>
            {filtered.map(issue => {
              const sc = statusConfig[issue.status];
              const x = toX(issue.lng);
              const y = toY(issue.lat);
              const isSelected = selected?.id === issue.id;
              return (
                <div
                  key={issue.id}
                  className="map-pin"
                  style={{ left: `${x}%`, top: `${y}%`, zIndex: isSelected ? 15 : 5 }}
                  onClick={() => setSelected(selected?.id === issue.id ? null : issue)}
                >
                  <div style={{ width: isSelected ? 20 : 14, height: isSelected ? 20 : 14, borderRadius: '50%', background: sc.dot, boxShadow: `0 0 ${isSelected ? 16 : 8}px ${sc.dot}80`, border: `2px solid ${isSelected ? '#fff' : 'rgba(255,255,255,0.3)'}`, transition: 'all 0.2s' }} />
                  {isSelected && (
                    <div className="tooltip">
                      <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 6, color: '#fff' }}>{issue.title}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ color: sc.color, fontSize: 11 }}>{sc.label}</span>
                        <span style={{ color: categoryColors[issue.category], fontSize: 11 }}>{issue.category}</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>▲ {issue.votes}</span>
                      </div>
                      <a href={`/issue/${issue.id}`} style={{ display: 'block', marginTop: 8, fontSize: 11, color: '#0ea5e9', textDecoration: 'none' }}>View details →</a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', width: 480, background: 'rgba(10,15,40,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '24px', backdropFilter: 'blur(20px)', zIndex: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Syne', marginBottom: 8 }}>{selected.title}</h3>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 12, color: statusConfig[selected.status].color, background: statusConfig[selected.status].bg, padding: '4px 10px', borderRadius: 20 }}>{statusConfig[selected.status].label}</span>
                    <span style={{ fontSize: 12, color: categoryColors[selected.category], background: `${categoryColors[selected.category]}18`, padding: '4px 10px', borderRadius: 20 }}>{selected.category}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, fontFamily: 'inherit' }}>×</button>
              </div>
              <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#0ea5e9' }}>▲ {selected.votes}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>votes</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: selected.days >= 7 ? '#F59E0B' : '#fff' }}>{selected.days}d</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>open</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a href={`/issue/${selected.id}`} style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '10px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>View Full Issue</a>
                <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>▲ Upvote</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
