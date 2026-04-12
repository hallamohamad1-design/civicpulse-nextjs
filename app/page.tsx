'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const translations = {
  en: {
    dir: 'ltr',
    nav: { report: 'Report Issue', map: 'Live Map', dashboard: 'Dashboard', signin: 'Sign In' },
    hero: {
      badge: 'Civic Infrastructure Platform',
      title: 'Your City.\nYour Voice.\nYour Impact.',
      subtitle: 'Report local infrastructure issues, track government responses, and hold authorities accountable — in real time.',
      cta: 'Report an Issue',
      secondary: 'Explore the Map',
    },
    stats: [
      { value: '12,400+', label: 'Issues Reported' },
      { value: '68%', label: 'Resolved' },
      { value: '< 4 days', label: 'Avg. Response' },
      { value: '24', label: 'Cities Active' },
    ],
    features: {
      title: 'Everything your city needs',
      items: [
        { icon: '📍', title: 'Geo-Tagged Reports', desc: 'Pin issues directly on the map with photos and descriptions.' },
        { icon: '🗳️', title: 'Community Upvoting', desc: 'Vote on the most urgent issues to surface what matters most.' },
        { icon: '🤖', title: 'AI Categorization', desc: 'Claude AI auto-tags every report with category and severity.' },
        { icon: '🔔', title: 'Live Notifications', desc: 'Get instant alerts when your followed issues are updated.' },
        { icon: '🌍', title: 'Multilingual', desc: 'Full support for English, Arabic (RTL), and French.' },
        { icon: '📊', title: 'Public Dashboard', desc: 'Live stats, charts, and open data exports for researchers.' },
      ],
    },
    pipeline: {
      title: 'Issue Lifecycle',
      steps: ['Submitted', 'Under Review', 'In Progress', 'Resolved'],
    },
  },
  ar: {
    dir: 'rtl',
    nav: { report: 'الإبلاغ عن مشكلة', map: 'الخريطة المباشرة', dashboard: 'لوحة التحكم', signin: 'تسجيل الدخول' },
    hero: {
      badge: 'منصة البنية التحتية المدنية',
      title: 'مدينتك.\nصوتك.\nتأثيرك.',
      subtitle: 'أبلغ عن مشاكل البنية التحتية المحلية وتتبع استجابات الحكومة وحاسب السلطات في الوقت الفعلي.',
      cta: 'الإبلاغ عن مشكلة',
      secondary: 'استكشاف الخريطة',
    },
    stats: [
      { value: '+12,400', label: 'مشكلة مُبلَّغ عنها' },
      { value: '68%', label: 'تم حلها' },
      { value: '< 4 أيام', label: 'متوسط الاستجابة' },
      { value: '24', label: 'مدينة نشطة' },
    ],
    features: {
      title: 'كل ما تحتاجه مدينتك',
      items: [
        { icon: '📍', title: 'تقارير جيو-مُعلَّمة', desc: 'حدد المشاكل مباشرة على الخريطة مع الصور والأوصاف.' },
        { icon: '🗳️', title: 'تصويت المجتمع', desc: 'صوت على أهم المشكلات لإبراز ما يهمك.' },
        { icon: '🤖', title: 'تصنيف بالذكاء الاصطناعي', desc: 'يقوم Claude AI بتصنيف كل تقرير تلقائياً.' },
        { icon: '🔔', title: 'إشعارات فورية', desc: 'احصل على تنبيهات فورية عند تحديث المشاكل التي تتابعها.' },
        { icon: '🌍', title: 'متعدد اللغات', desc: 'دعم كامل للعربية والإنجليزية والفرنسية.' },
        { icon: '📊', title: 'لوحة تحكم عامة', desc: 'إحصاءات مباشرة ورسوم بيانية وتصدير بيانات مفتوح.' },
      ],
    },
    pipeline: {
      title: 'دورة حياة المشكلة',
      steps: ['مُقدَّمة', 'قيد المراجعة', 'قيد التنفيذ', 'تم الحل'],
    },
  },
  fr: {
    dir: 'ltr',
    nav: { report: 'Signaler', map: 'Carte en direct', dashboard: 'Tableau de bord', signin: 'Connexion' },
    hero: {
      badge: 'Plateforme d\'infrastructure civique',
      title: 'Votre ville.\nVotre voix.\nVotre impact.',
      subtitle: 'Signalez les problèmes d\'infrastructure locale, suivez les réponses gouvernementales et responsabilisez les autorités en temps réel.',
      cta: 'Signaler un problème',
      secondary: 'Explorer la carte',
    },
    stats: [
      { value: '12 400+', label: 'Problèmes signalés' },
      { value: '68%', label: 'Résolus' },
      { value: '< 4 jours', label: 'Réponse moyenne' },
      { value: '24', label: 'Villes actives' },
    ],
    features: {
      title: 'Tout ce dont votre ville a besoin',
      items: [
        { icon: '📍', title: 'Rapports géolocalisés', desc: 'Épinglez les problèmes directement sur la carte avec photos.' },
        { icon: '🗳️', title: 'Vote communautaire', desc: 'Votez pour les problèmes les plus urgents.' },
        { icon: '🤖', title: 'Catégorisation IA', desc: 'Claude AI classe automatiquement chaque rapport.' },
        { icon: '🔔', title: 'Notifications en direct', desc: 'Recevez des alertes instantanées sur les mises à jour.' },
        { icon: '🌍', title: 'Multilingue', desc: 'Support complet du français, de l\'arabe et de l\'anglais.' },
        { icon: '📊', title: 'Tableau de bord public', desc: 'Statistiques en direct et exports de données ouvertes.' },
      ],
    },
    pipeline: {
      title: 'Cycle de vie du problème',
      steps: ['Soumis', 'En examen', 'En cours', 'Résolu'],
    },
  },
};

type Lang = 'en' | 'ar' | 'fr';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lang, setLang] = useState<Lang>('en');
  const t = translations[lang];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: -Math.random() * 2 - 0.5,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(4, 6, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.z <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.z = 1000;
        }

        const scale = 1000 / p.z;
        const sx = (p.x - cx) * scale + cx;
        const sy = (p.y - cy) * scale + cy;
        const r = Math.max(0.2, scale * 0.8);
        const alpha = Math.min(1, (1000 - p.z) / 1000);

        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 255, ${alpha * 0.8})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const scaleA = 1000 / a.z;
          const scaleB = 1000 / b.z;
          const ax = (a.x - cx) * scaleA + cx;
          const ay = (a.y - cy) * scaleA + cy;
          const bx = (b.x - cx) * scaleB + cx;
          const by = (b.y - cy) * scaleB + cy;
          const dist = Math.hypot(ax - bx, ay - by);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = `rgba(100, 180, 255, ${(1 - dist / 80) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const pipelineColors = ['#6B7280', '#F59E0B', '#3B82F6', '#10B981'];

  return (
    <div dir={t.dir} style={{ fontFamily: "'Syne', 'DM Sans', sans-serif", background: '#040614', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .glow { text-shadow: 0 0 40px rgba(100,180,255,0.4); }
        .card-glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(12px); border-radius: 16px; transition: all 0.3s ease; }
        .card-glass:hover { background: rgba(255,255,255,0.07); border-color: rgba(100,180,255,0.2); transform: translateY(-2px); }
        .btn-primary { background: linear-gradient(135deg, #1d6fca, #0ea5e9); color: #fff; padding: 14px 32px; border-radius: 50px; font-weight: 600; font-size: 15px; text-decoration: none; display: inline-block; transition: all 0.3s; border: none; cursor: pointer; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(14,165,233,0.35); }
        .btn-ghost { background: transparent; color: rgba(255,255,255,0.7); padding: 14px 32px; border-radius: 50px; font-weight: 500; font-size: 15px; text-decoration: none; display: inline-block; border: 1px solid rgba(255,255,255,0.15); transition: all 0.3s; }
        .btn-ghost:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        .lang-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7); padding: 6px 14px; border-radius: 20px; font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .lang-btn:hover, .lang-btn.active { background: rgba(14,165,233,0.15); border-color: rgba(14,165,233,0.4); color: #0ea5e9; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .fade-up-2 { animation: fadeUp 0.8s 0.2s ease both; }
        .fade-up-3 { animation: fadeUp 0.8s 0.4s ease both; }
        .fade-up-4 { animation: fadeUp 0.8s 0.6s ease both; }
      `}</style>

      {/* 3D Canvas */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.7 }} />

      {/* Gradient overlays */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, background: 'radial-gradient(ellipse at 30% 20%, rgba(14,100,200,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(16,185,129,0.06) 0%, transparent 60%)' }} />

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,6,20,0.8)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #1d6fca, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 18, fontFamily: 'Syne' }}>CivicPulse</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/map" className="nav-link">{t.nav.map}</Link>
          <Link href="/dashboard" className="nav-link">{t.nav.dashboard}</Link>
          <Link href="/submit" className="nav-link">{t.nav.report}</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {(['en', 'ar', 'fr'] as Lang[]).map(l => (
            <button key={l} className={`lang-btn ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>
              {l === 'en' ? '🇺🇸 EN' : l === 'ar' ? '🇪🇬 AR' : '🇫🇷 FR'}
            </button>
          ))}
          <Link href="/auth/signin" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13, marginLeft: 8 }}>{t.nav.signin}</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 40px 60px' }}>
        <div className="fade-up" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.25)', borderRadius: 50, padding: '6px 16px', marginBottom: 32 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0ea5e9', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 500, letterSpacing: '0.05em' }}>{t.hero.badge}</span>
        </div>

        <h1 className="fade-up-2 glow" style={{ fontSize: 'clamp(52px, 8vw, 96px)', fontWeight: 800, lineHeight: 1.05, fontFamily: 'Syne', letterSpacing: '-0.02em', marginBottom: 28, whiteSpace: 'pre-line' }}>
          {t.hero.title}
        </h1>

        <p className="fade-up-3" style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.55)', maxWidth: 580, lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>
          {t.hero.subtitle}
        </p>

        <div className="fade-up-4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/submit" className="btn-primary">{t.hero.cta}</Link>
          <Link href="/map" className="btn-ghost">{t.hero.secondary}</Link>
        </div>

        {/* Stats */}
        <div className="fade-up-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginTop: 80, width: '100%', maxWidth: 800 }}>
          {t.stats.map((s, i) => (
            <div key={i} className="card-glass" style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, fontFamily: 'Syne', color: '#fff', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 700, fontFamily: 'Syne', marginBottom: 64 }}>{t.features.title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          {t.features.items.map((f, i) => (
            <div key={i} className="card-glass" style={{ padding: '32px 28px' }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, fontFamily: 'Syne', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Issue Pipeline */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 40px 120px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 700, fontFamily: 'Syne', marginBottom: 52 }}>{t.pipeline.title}</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
          {t.pipeline.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: pipelineColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>{step}</span>
              </div>
              {i < t.pipeline.steps.length - 1 && (
                <div style={{ width: 80, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))', margin: '0 12px', marginBottom: 24 }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2026 CivicPulse Global</span>
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Built for Arab Academy for Science & Technology</span>
      </footer>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  );
}
