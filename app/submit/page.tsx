'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = ['Roads & Pavements', 'Street Lighting', 'Water & Drainage', 'Sanitation', 'Parks & Green Spaces', 'Public Transport', 'Other'];
const severities = ['Low', 'Medium', 'High', 'Critical'];

export default function Submit() {
  const [form, setForm] = useState({ title: '', description: '', category: '', severity: '', location: '' });
  const [aiSuggestion, setAiSuggestion] = useState<{ category: string; severity: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const getAiSuggestion = async () => {
    if (!form.title || form.title.length < 10) return;
    setLoading(true);
    // Simulate AI suggestion (in production this calls /api/categorize)
    await new Promise(r => setTimeout(r, 1200));
    const suggestions = [
      { category: 'Roads & Pavements', severity: 'Medium' },
      { category: 'Street Lighting', severity: 'High' },
      { category: 'Water & Drainage', severity: 'Critical' },
    ];
    const s = suggestions[Math.floor(Math.random() * suggestions.length)];
    setAiSuggestion(s);
    setForm(prev => ({ ...prev, category: s.category, severity: s.severity }));
    setLoading(false);
  };

  const handleSubmit = () => {
    if (!form.title || !form.category) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ fontFamily: "'Syne','DM Sans',sans-serif", background: '#040614', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@300;400;500&display=swap'); * { margin:0; padding:0; box-sizing:border-box; }`}</style>
        <div style={{ textAlign: 'center', maxWidth: 480, padding: 40 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne', marginBottom: 16 }}>Issue Submitted!</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>Your report has been received and will be reviewed by our team. You'll be notified when the status changes.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/dashboard" style={{ background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '12px 28px', borderRadius: 50, textDecoration: 'none', fontWeight: 600 }}>View Dashboard</Link>
            <Link href="/" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 28px', borderRadius: 50, textDecoration: 'none' }}>Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Syne','DM Sans',sans-serif", background: '#040614', color: '#fff', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        .field { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 14px 16px; color: #fff; font-size: 15px; font-family: inherit; width: 100%; outline: none; transition: border-color 0.2s; resize: vertical; }
        .field:focus { border-color: rgba(14,165,233,0.5); background: rgba(255,255,255,0.06); }
        .field option { background: #0d1b2a; }
        label { font-size: 13px; color: rgba(255,255,255,0.5); margin-bottom: 8px; display: block; font-weight: 500; letter-spacing: 0.03em; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; }
        .nav-link:hover { color: #fff; }
      `}</style>

      <nav style={{ padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,6,20,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#fff' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18, fontFamily: 'Syne' }}>CivicPulse</span>
        </Link>
        <div style={{ display: 'flex', gap: 32 }}>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/map" className="nav-link">Map</Link>
          <Link href="/dashboard" className="nav-link">Dashboard</Link>
        </div>
        <Link href="/auth/signin" style={{ background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
      </nav>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 40px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Syne', marginBottom: 10 }}>Report an Issue</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15 }}>Help improve your city by reporting infrastructure problems.</p>
        </div>

        {/* AI Banner */}
        <div style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 12, padding: '16px 20px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0ea5e9', marginBottom: 2 }}>AI-Powered Categorization</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Claude AI will automatically suggest a category and severity based on your description.</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Title */}
          <div>
            <label>Issue Title *</label>
            <input
              className="field"
              placeholder="e.g. Large pothole on Main Street near bus stop"
              value={form.title}
              onChange={e => handleChange('title', e.target.value)}
              onBlur={getAiSuggestion}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 15, fontFamily: 'inherit', width: '100%', outline: 'none' }}
            />
          </div>

          {/* Description */}
          <div>
            <label>Description</label>
            <textarea
              className="field"
              rows={4}
              placeholder="Describe the issue in detail — size, exact location, how long it's been there..."
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>

          {/* AI Suggestion Banner */}
          {loading && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#F59E0B' }}>
              🤖 AI is analyzing your report...
            </div>
          )}
          {aiSuggestion && !loading && (
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#10B981' }}>
              ✨ AI suggested: <strong>{aiSuggestion.category}</strong> · Severity: <strong>{aiSuggestion.severity}</strong> — you can adjust below
            </div>
          )}

          {/* Category + Severity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label>Category {aiSuggestion && <span style={{ color: '#10B981', fontSize: 11 }}>AI suggested</span>}</label>
              <select className="field" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label>Severity {aiSuggestion && <span style={{ color: '#10B981', fontSize: 11 }}>AI suggested</span>}</label>
              <select className="field" value={form.severity} onChange={e => handleChange('severity', e.target.value)}>
                <option value="">Select severity</option>
                {severities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label>Location / Address</label>
            <input
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 16px', color: '#fff', fontSize: 15, fontFamily: 'inherit', width: '100%', outline: 'none' }}
              placeholder="e.g. 15 Al-Nasr Street, Nasr City, Cairo"
              value={form.location}
              onChange={e => handleChange('location', e.target.value)}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!form.title || !form.category}
            style={{ background: form.title && form.category ? 'linear-gradient(135deg,#1d6fca,#0ea5e9)' : 'rgba(255,255,255,0.08)', color: form.title && form.category ? '#fff' : 'rgba(255,255,255,0.3)', padding: '16px', borderRadius: 50, fontSize: 16, fontWeight: 600, border: 'none', cursor: form.title && form.category ? 'pointer' : 'not-allowed', fontFamily: 'inherit', transition: 'all 0.3s' }}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
