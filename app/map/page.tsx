'use client';

import { useState, useEffect, useRef } from 'react';

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

const statusConfig: Record<string, { label: string; color: string; bg: string; hex: string }> = {
  submitted:    { label: 'Submitted',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)', hex: '#9CA3AF' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  hex: '#F59E0B' },
  in_progress:  { label: 'In Progress',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)',  hex: '#3B82F6' },
  resolved:     { label: 'Resolved',     color: '#10B981', bg: 'rgba(16,185,129,0.12)',  hex: '#10B981' },
};

const categoryColors: Record<string, string> = {
  Roads: '#3B82F6', Lighting: '#F59E0B', Water: '#06B6D4',
  Sanitation: '#EF4444', Parks: '#10B981', Other: '#8B5CF6',
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const userMarkerRef = useRef<any>(null);
  const [selected, setSelected] = useState<typeof mockIssues[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const filtered = mockIssues.filter(i =>
    (filterStatus === 'all' || i.status === filterStatus) &&
    (filterCat === 'all' || i.category === filterCat)
  );

  useEffect(() => {
    if (typeof window === 'undefined' || leafletMap.current) return;

    const loadLeaflet = async () => {
      if (!(window as any).L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        await new Promise<void>((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      if (!mapRef.current || leafletMap.current) return;
      const L = (window as any).L;

      const map = L.map(mapRef.current, {
        center: [30.0500, 31.2357],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      leafletMap.current = map;
      setMapReady(true);
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!mapReady || !leafletMap.current) return;
    const L = (window as any).L;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filtered.forEach(issue => {
      const sc = statusConfig[issue.status];
      const isSelected = selected?.id === issue.id;
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:${isSelected ? 18 : 13}px;height:${isSelected ? 18 : 13}px;border-radius:50%;background:${sc.hex};border:2px solid rgba(255,255,255,${isSelected ? 1 : 0.35});box-shadow:0 0 ${isSelected ? 16 : 8}px ${sc.hex}90;cursor:pointer;transition:all 0.2s;"></div>`,
        iconSize: [isSelected ? 18 : 13, isSelected ? 18 : 13],
        iconAnchor: [isSelected ? 9 : 6.5, isSelected ? 9 : 6.5],
      });
      const marker = L.marker([issue.lat, issue.lng], { icon }).addTo(leafletMap.current);
      marker.on('click', () => {
        setSelected(prev => prev?.id === issue.id ? null : issue);
        leafletMap.current.flyTo([issue.lat, issue.lng], 15, { duration: 0.8 });
      });
      markersRef.current.push(marker);
    });
  }, [mapReady, filtered, selected]);

  const goToMyLocation = () => {
    setLocating(true);
    setLocError('');
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported by your browser');
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const L = (window as any).L;
        const map = leafletMap.current;
        if (!map) return;
        if (userMarkerRef.current) userMarkerRef.current.remove();
        const icon = L.divIcon({
          className: '',
          html: `<div style="position:relative;width:20px;height:20px;">
            <div style="position:absolute;inset:0;border-radius:50%;background:#0ea5e9;opacity:0.25;animation:pulse-ring 2s infinite;transform:scale(2);"></div>
            <div style="position:absolute;inset:3px;border-radius:50%;background:#0ea5e9;border:2px solid #fff;box-shadow:0 0 12px #0ea5e9;"></div>
          </div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        userMarkerRef.current = L.marker([latitude, longitude], { icon }).addTo(map);
        map.flyTo([latitude, longitude], 15, { duration: 1.5 });
        setLocating(false);
      },
      () => {
        setLocError('Location access denied. Please enable in browser settings.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const flyTo = (issue: typeof mockIssues[0]) => {
    setSelected(issue);
    if (leafletMap.current) {
      leafletMap.current.flyTo([issue.lat, issue.lng], 15, { duration: 0.8 });
    }
  };

  return (
    <div style={{ fontFamily: "'Syne','DM Sans',sans-serif", background: '#040614', color: '#fff', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .filter-btn { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.45); padding: 4px 11px; border-radius: 20px; font-size: 11px; cursor: pointer; transition: all 0.2s; font-family: inherit; white-space: nowrap; }
        .filter-btn.active { background: rgba(14,165,233,0.15); border-color: rgba(14,165,233,0.4); color: #0ea5e9; }
        .filter-btn:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }
        .issue-row { padding: 12px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background 0.15s; border-left: 2px solid transparent; }
        .issue-row:hover { background: rgba(255,255,255,0.025); }
        .issue-row.active { background: rgba(14,165,233,0.07); border-left-color: #0ea5e9; }
        .loc-btn { background: rgba(14,165,233,0.1); border: 1px solid rgba(14,165,233,0.25); color: #0ea5e9; padding: 8px 14px; border-radius: 8px; font-size: 12px; cursor: pointer; font-family: inherit; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%; }
        .loc-btn:hover:not(:disabled) { background: rgba(14,165,233,0.2); }
        .loc-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .leaflet-container { background: #07101f !important; }
        .leaflet-control-attribution { background: rgba(4,6,20,0.7) !important; color: rgba(255,255,255,0.3) !important; font-size: 9px !important; }
        .leaflet-control-attribution a { color: rgba(255,255,255,0.4) !important; }
        .leaflet-control-zoom a { background: rgba(6,13,30,0.9) !important; color: rgba(255,255,255,0.7) !important; border-color: rgba(255,255,255,0.1) !important; }
        .leaflet-control-zoom a:hover { background: rgba(14,165,233,0.2) !important; color: #fff !important; }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.4; } 100% { transform: scale(2.5); opacity: 0; } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,6,20,0.97)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, zIndex: 1000 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#fff' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 17, fontFamily: 'Syne' }}>CivicPulse</span>
        </a>
        <div style={{ display: 'flex', gap: 28 }}>
          <a href="/" className="nav-link">Home</a>
          <a href="/map" className="nav-link" style={{ color: '#0ea5e9' }}>Live Map</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/submit" className="nav-link">Report</a>
        </div>
        <a href="/auth/signin" style={{ background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '7px 18px', borderRadius: 50, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Sign In</a>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: 310, background: '#060d1e', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10 }}>
          <div style={{ padding: '14px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Syne' }}>Live Issues</h2>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: 20 }}>{filtered.length} shown</span>
            </div>
            <button className="loc-btn" onClick={goToMyLocation} disabled={locating} style={{ marginBottom: 8 }}>
              {locating ? '⏳ Getting location...' : '📍 Use My Location'}
            </button>
            {locError && <div style={{ fontSize: 10, color: '#EF4444', marginBottom: 6, lineHeight: 1.4 }}>{locError}</div>}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
              {['all', 'submitted', 'under_review', 'in_progress', 'resolved'].map(s => (
                <button key={s} className={`filter-btn ${filterStatus === s ? 'active' : ''}`} onClick={() => setFilterStatus(s)}>
                  {s === 'all' ? 'All' : statusConfig[s]?.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {['all', 'Roads', 'Lighting', 'Water', 'Sanitation', 'Parks'].map(c => (
                <button key={c} className={`filter-btn ${filterCat === c ? 'active' : ''}`} onClick={() => setFilterCat(c)}>{c}</button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(issue => {
              const sc = statusConfig[issue.status];
              return (
                <div key={issue.id} className={`issue-row ${selected?.id === issue.id ? 'active' : ''}`} onClick={() => flyTo(issue)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4, flex: 1, paddingRight: 8 }}>{issue.title}</span>
                    <span style={{ fontSize: 10, color: sc.color, background: sc.bg, padding: '2px 6px', borderRadius: 8, flexShrink: 0 }}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 10, color: categoryColors[issue.category] }}>{issue.category}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>▲ {issue.votes}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)' }}>{issue.days}d ago</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ padding: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <a href="/submit" style={{ display: 'block', textAlign: 'center', background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '10px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
              + Report an Issue
            </a>
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

          {/* Loading overlay */}
          {!mapReady && (
            <div style={{ position: 'absolute', inset: 0, background: '#07101f', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>🗺️</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Loading map...</div>
              </div>
            </div>
          )}

          {/* Issue detail panel */}
          {selected && (
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', width: 420, background: 'rgba(6,13,30,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '18px 20px', backdropFilter: 'blur(20px)', zIndex: 500 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, color: statusConfig[selected.status].color, background: statusConfig[selected.status].bg, padding: '2px 8px', borderRadius: 8 }}>{statusConfig[selected.status].label}</span>
                    <span style={{ fontSize: 10, color: categoryColors[selected.category], background: `${categoryColors[selected.category]}18`, padding: '2px 8px', borderRadius: 8 }}>{selected.category}</span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Syne', lineHeight: 1.3 }}>{selected.title}</h3>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: 'rgba(255,255,255,0.5)', width: 26, height: 26, borderRadius: '50%', cursor: 'pointer', fontSize: 14, flexShrink: 0, marginLeft: 10 }}>×</button>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 14 }}>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: '#0ea5e9' }}>▲ {selected.votes}</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>votes</div></div>
                <div><div style={{ fontSize: 18, fontWeight: 700, color: selected.days >= 7 ? '#F59E0B' : '#fff' }}>{selected.days}d</div><div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>open</div></div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`/issue/${selected.id}`} style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '9px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>View Issue</a>
                <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '9px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>▲ Upvote</button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(6,13,30,0.92)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '12px 14px', backdropFilter: 'blur(10px)', zIndex: 400 }}>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginBottom: 7, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Status</div>
            {Object.entries(statusConfig).map(([k, v]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: v.hex, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
