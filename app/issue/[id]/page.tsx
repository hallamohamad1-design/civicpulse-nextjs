'use client';

import { useState } from 'react';

const mockIssue = {
  id: 1,
  title: 'Broken streetlight on Al-Nasr Road',
  description: 'The streetlight at the corner of Al-Nasr Road and Street 9 has been broken for over two weeks. The area is completely dark at night, making it dangerous for pedestrians and drivers alike. Multiple residents have complained about near-miss accidents.',
  category: 'Lighting',
  status: 'in_progress',
  votes: 142,
  days: 3,
  location: 'Al-Nasr Road, Nasr City, Cairo',
  submittedBy: 'Mohamed H.',
  createdAt: 'April 10, 2026',
  severity: 'High',
};

const mockTimeline = [
  { status: 'submitted', label: 'Submitted', date: 'Apr 10, 2026 · 09:14', by: 'Mohamed H.' },
  { status: 'under_review', label: 'Under Review', date: 'Apr 11, 2026 · 11:30', by: 'City Moderator' },
  { status: 'in_progress', label: 'In Progress', date: 'Apr 12, 2026 · 08:00', by: 'Official ✓ Cairo Municipality' },
];

const mockComments = [
  { id: 1, user: 'Sarah K.', role: 'citizen', text: 'This has been dark for weeks! My kids walk past here every day.', time: '2 days ago', votes: 23 },
  { id: 2, user: 'Cairo Municipality', role: 'official', text: 'We have dispatched a maintenance crew. The repair is scheduled for April 15th. Thank you for your patience.', time: '1 day ago', votes: 45 },
  { id: 3, user: 'Ahmed R.', role: 'citizen', text: 'There was almost an accident here last night. Please prioritize this!', time: '18 hours ago', votes: 17 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  submitted:    { label: 'Submitted',    color: '#9CA3AF', bg: 'rgba(156,163,175,0.12)' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  in_progress:  { label: 'In Progress',  color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  resolved:     { label: 'Resolved',     color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
};

const allStatuses = ['submitted', 'under_review', 'in_progress', 'resolved'];

export default function IssuePage() {
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(mockIssue.votes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(mockComments);
  const [following, setFollowing] = useState(false);

  const handleVote = () => {
    setVoted(!voted);
    setVoteCount(c => voted ? c - 1 : c + 1);
  };

  const handleComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [...prev, { id: Date.now(), user: 'You', role: 'citizen', text: comment, time: 'just now', votes: 0 }]);
    setComment('');
  };

  const sc = statusConfig[mockIssue.status];
  const currentStep = allStatuses.indexOf(mockIssue.status);

  return (
    <div style={{ fontFamily: "'Syne','DM Sans',sans-serif", background: '#040614', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: #fff; font-size: 14px; font-family: inherit; padding: 12px 14px; width: 100%; resize: vertical; outline: none; transition: border-color 0.2s; }
        textarea:focus { border-color: rgba(14,165,233,0.4); }
        textarea::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Navbar */}
      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,6,20,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#fff' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18, fontFamily: 'Syne' }}>CivicPulse</span>
        </a>
        <div style={{ display: 'flex', gap: 32 }}>
          <a href="/" className="nav-link">Home</a>
          <a href="/map" className="nav-link">Live Map</a>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/submit" className="nav-link">Report</a>
        </div>
        <a href="/auth/signin" style={{ background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Sign In</a>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 40px' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: 28, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          <a href="/map" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>← Back to Map</a>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Issue Header */}
            <div className="card" style={{ padding: '28px 28px' }}>
              <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: sc.color, background: sc.bg, padding: '4px 12px', borderRadius: 20 }}>{sc.label}</span>
                <span style={{ fontSize: 12, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: 20 }}>⚠ {mockIssue.severity}</span>
                <span style={{ fontSize: 12, color: '#0ea5e9', background: 'rgba(14,165,233,0.1)', padding: '4px 12px', borderRadius: 20 }}>{mockIssue.category}</span>
              </div>

              <h1 style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Syne', lineHeight: 1.3, marginBottom: 16 }}>{mockIssue.title}</h1>

              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 20 }}>{mockIssue.description}</p>

              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap' }}>
                <span>📍 {mockIssue.location}</span>
                <span>👤 {mockIssue.submittedBy}</span>
                <span>📅 {mockIssue.createdAt}</span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="card" style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Syne', marginBottom: 24 }}>Issue Timeline</h3>

              {/* Progress bar */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
                {allStatuses.map((s, i) => {
                  const done = i <= currentStep;
                  const sc2 = statusConfig[s];
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < allStatuses.length - 1 ? 1 : 'none' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: done ? sc2.color : 'rgba(255,255,255,0.08)', border: `2px solid ${done ? sc2.color : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: done ? '#fff' : 'transparent' }}>✓</div>
                        <span style={{ fontSize: 10, color: done ? sc2.color : 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>{sc2.label}</span>
                      </div>
                      {i < allStatuses.length - 1 && (
                        <div style={{ flex: 1, height: 2, background: i < currentStep ? sc2.color : 'rgba(255,255,255,0.06)', margin: '0 4px', marginBottom: 20, borderRadius: 99 }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Timeline events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {mockTimeline.map((event, i) => {
                  const esc = statusConfig[event.status];
                  return (
                    <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < mockTimeline.length - 1 ? 20 : 0, position: 'relative' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: esc.color, flexShrink: 0, marginTop: 4 }} />
                        {i < mockTimeline.length - 1 && <div style={{ width: 1, flex: 1, background: 'rgba(255,255,255,0.06)', marginTop: 4 }} />}
                      </div>
                      <div style={{ paddingBottom: 4 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: esc.color, marginBottom: 3 }}>{event.label}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{event.date} · by {event.by}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Comments */}
            <div className="card" style={{ padding: '24px 28px' }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Syne', marginBottom: 20 }}>Discussion ({comments.length})</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                {comments.map(c => (
                  <div key={c.id} style={{ borderLeft: c.role === 'official' ? '3px solid #F59E0B' : '3px solid rgba(255,255,255,0.06)', paddingLeft: 16, paddingTop: 4, paddingBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: c.role === 'official' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: c.role === 'official' ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>
                        {c.user.charAt(0)}
                      </div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{c.user}</span>
                        {c.role === 'official' && <span style={{ marginLeft: 6, fontSize: 10, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 4 }}>✓ Official</span>}
                        <span style={{ marginLeft: 8, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{c.time}</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 8 }}>{c.text}</p>
                    <button style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>▲ {c.votes}</button>
                  </div>
                ))}
              </div>

              {/* Add comment */}
              <div>
                <textarea rows={3} placeholder="Add a comment... (sign in to post)" value={comment} onChange={e => setComment(e.target.value)} />
                <button
                  onClick={handleComment}
                  style={{ marginTop: 10, background: comment.trim() ? 'linear-gradient(135deg,#1d6fca,#0ea5e9)' : 'rgba(255,255,255,0.06)', color: comment.trim() ? '#fff' : 'rgba(255,255,255,0.3)', border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Vote */}
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Syne', color: voted ? '#0ea5e9' : '#fff', marginBottom: 4 }}>{voteCount}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>community votes</div>
              <button
                onClick={handleVote}
                style={{ width: '100%', background: voted ? 'rgba(14,165,233,0.15)' : 'rgba(255,255,255,0.06)', border: `1px solid ${voted ? '#0ea5e9' : 'rgba(255,255,255,0.1)'}`, color: voted ? '#0ea5e9' : '#fff', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', marginBottom: 10 }}
              >
                {voted ? '▲ Upvoted' : '▲ Upvote'}
              </button>
              <button
                onClick={() => setFollowing(!following)}
                style={{ width: '100%', background: following ? 'rgba(16,185,129,0.1)' : 'transparent', border: `1px solid ${following ? '#10B981' : 'rgba(255,255,255,0.08)'}`, color: following ? '#10B981' : 'rgba(255,255,255,0.4)', padding: '10px', borderRadius: 10, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
              >
                {following ? '🔔 Following' : '🔔 Follow Issue'}
              </button>
            </div>

            {/* Details */}
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Syne', marginBottom: 16, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Details</h4>
              {[
                { label: 'Status', value: sc.label, color: sc.color },
                { label: 'Category', value: mockIssue.category, color: '#0ea5e9' },
                { label: 'Severity', value: mockIssue.severity, color: '#F59E0B' },
                { label: 'Days Open', value: `${mockIssue.days} days`, color: mockIssue.days >= 7 ? '#F59E0B' : 'rgba(255,255,255,0.7)' },
                { label: 'Submitted', value: mockIssue.createdAt, color: 'rgba(255,255,255,0.5)' },
              ].map(d => (
                <div key={d.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{d.label}</span>
                  <span style={{ fontSize: 12, color: d.color, fontWeight: 500 }}>{d.value}</span>
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Syne', marginBottom: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Share</h4>
              <div style={{ display: 'flex', gap: 8 }}>
                {['X', 'FB', 'Copy'].map(s => (
                  <button key={s} style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '8px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>{s}</button>
                ))}
              </div>
            </div>

            <a href="/map" style={{ display: 'block', textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', padding: '12px', borderRadius: 10, textDecoration: 'none', fontSize: 13 }}>← Back to Map</a>
          </div>
        </div>
      </div>
    </div>
  );
}
