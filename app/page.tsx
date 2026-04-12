'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const languages = [
  { code: 'en', label: 'English',    flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', label: 'العربية',    flag: '🇪🇬', dir: 'rtl' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', label: 'Deutsch',    flag: '🇩🇪', dir: 'ltr' },
  { code: 'es', label: 'Español',    flag: '🇪🇸', dir: 'ltr' },
  { code: 'zh', label: '中文',       flag: '🇨🇳', dir: 'ltr' },
  { code: 'tr', label: 'Türkçe',     flag: '🇹🇷', dir: 'ltr' },
  { code: 'pt', label: 'Português',  flag: '🇧🇷', dir: 'ltr' },
];

const t: Record<string, any> = {
  en: {
    badge: 'Civic Infrastructure Platform',
    title: 'Your City. Your Voice.\nYour Impact.',
    subtitle: 'Report local infrastructure issues, track government responses, and hold authorities accountable — in real time.',
    cta: 'Report an Issue', secondary: 'Explore the Map',
    nav: { map: 'Live Map', dash: 'Dashboard', report: 'Report', signin: 'Sign In' },
    stats: [{ v: '12,400+', l: 'Issues Reported' }, { v: '68%', l: 'Resolved' }, { v: '< 4 days', l: 'Avg. Response' }, { v: '24', l: 'Cities Active' }],
    features: 'Everything your city needs',
    items: [
      { icon: '📍', t: 'Geo-Tagged Reports', d: 'Pin issues directly on the map with photos and descriptions.' },
      { icon: '🗳️', t: 'Community Upvoting', d: 'Vote on the most urgent issues to surface what matters most.' },
      { icon: '🤖', t: 'AI Categorization', d: 'Claude AI auto-tags every report with category and severity.' },
      { icon: '🔔', t: 'Live Notifications', d: 'Get instant alerts when your followed issues are updated.' },
      { icon: '🌍', t: 'Multilingual', d: 'Full support for 8 languages including Arabic RTL.' },
      { icon: '📊', t: 'Public Dashboard', d: 'Live stats, charts, and open data exports for researchers.' },
    ],
    pipeline: 'Issue Lifecycle',
    steps: ['Submitted', 'Under Review', 'In Progress', 'Resolved'],
  },
  ar: {
    badge: 'منصة البنية التحتية المدنية',
    title: 'مدينتك. صوتك.\nتأثيرك.',
    subtitle: 'أبلغ عن مشاكل البنية التحتية المحلية وتتبع استجابات الحكومة وحاسب السلطات في الوقت الفعلي.',
    cta: 'الإبلاغ عن مشكلة', secondary: 'استكشاف الخريطة',
    nav: { map: 'الخريطة المباشرة', dash: 'لوحة التحكم', report: 'الإبلاغ', signin: 'تسجيل الدخول' },
    stats: [{ v: '+12,400', l: 'مشكلة مُبلَّغ عنها' }, { v: '68%', l: 'تم حلها' }, { v: '< 4 أيام', l: 'متوسط الاستجابة' }, { v: '24', l: 'مدينة نشطة' }],
    features: 'كل ما تحتاجه مدينتك',
    items: [
      { icon: '📍', t: 'تقارير جيو-مُعلَّمة', d: 'حدد المشاكل مباشرة على الخريطة مع الصور والأوصاف.' },
      { icon: '🗳️', t: 'تصويت المجتمع', d: 'صوت على أهم المشكلات لإبراز ما يهمك.' },
      { icon: '🤖', t: 'تصنيف بالذكاء الاصطناعي', d: 'يقوم Claude AI بتصنيف كل تقرير تلقائياً.' },
      { icon: '🔔', t: 'إشعارات فورية', d: 'احصل على تنبيهات فورية عند تحديث المشاكل التي تتابعها.' },
      { icon: '🌍', t: 'متعدد اللغات', d: 'دعم كامل لـ 8 لغات بما فيها العربية.' },
      { icon: '📊', t: 'لوحة تحكم عامة', d: 'إحصاءات مباشرة ورسوم بيانية وتصدير بيانات مفتوح.' },
    ],
    pipeline: 'دورة حياة المشكلة',
    steps: ['مُقدَّمة', 'قيد المراجعة', 'قيد التنفيذ', 'تم الحل'],
  },
  fr: {
    badge: "Plateforme d'infrastructure civique",
    title: 'Votre ville. Votre voix.\nVotre impact.',
    subtitle: "Signalez les problèmes d'infrastructure locale, suivez les réponses gouvernementales et responsabilisez les autorités en temps réel.",
    cta: 'Signaler un problème', secondary: 'Explorer la carte',
    nav: { map: 'Carte en direct', dash: 'Tableau de bord', report: 'Signaler', signin: 'Connexion' },
    stats: [{ v: '12 400+', l: 'Problèmes signalés' }, { v: '68%', l: 'Résolus' }, { v: '< 4 jours', l: 'Réponse moy.' }, { v: '24', l: 'Villes actives' }],
    features: 'Tout ce dont votre ville a besoin',
    items: [
      { icon: '📍', t: 'Rapports géolocalisés', d: 'Épinglez les problèmes sur la carte avec photos.' },
      { icon: '🗳️', t: 'Vote communautaire', d: "Votez pour les problèmes les plus urgents." },
      { icon: '🤖', t: 'Catégorisation IA', d: 'Claude AI classe automatiquement chaque rapport.' },
      { icon: '🔔', t: 'Notifications', d: 'Recevez des alertes instantanées sur les mises à jour.' },
      { icon: '🌍', t: 'Multilingue', d: '8 langues supportées dont le français et l'arabe.' },
      { icon: '📊', t: 'Tableau de bord', d: 'Statistiques en direct et exports de données ouvertes.' },
    ],
    pipeline: 'Cycle de vie',
    steps: ['Soumis', 'En examen', 'En cours', 'Résolu'],
  },
  de: {
    badge: 'Bürgerinfrastruktur-Plattform',
    title: 'Ihre Stadt. Ihre Stimme.\nIhre Wirkung.',
    subtitle: 'Melden Sie lokale Infrastrukturprobleme, verfolgen Sie Regierungsantworten und halten Sie Behörden in Echtzeit rechenschaftspflichtig.',
    cta: 'Problem melden', secondary: 'Karte erkunden',
    nav: { map: 'Live-Karte', dash: 'Dashboard', report: 'Melden', signin: 'Anmelden' },
    stats: [{ v: '12.400+', l: 'Gemeldete Probleme' }, { v: '68%', l: 'Gelöst' }, { v: '< 4 Tage', l: 'Ø Reaktionszeit' }, { v: '24', l: 'Aktive Städte' }],
    features: 'Alles was Ihre Stadt braucht',
    items: [
      { icon: '📍', t: 'Geo-getaggte Berichte', d: 'Markieren Sie Probleme direkt auf der Karte.' },
      { icon: '🗳️', t: 'Community-Abstimmung', d: 'Stimmen Sie für die dringendsten Probleme ab.' },
      { icon: '🤖', t: 'KI-Kategorisierung', d: 'Claude KI kategorisiert jeden Bericht automatisch.' },
      { icon: '🔔', t: 'Live-Benachrichtigungen', d: 'Erhalten Sie sofortige Benachrichtigungen bei Updates.' },
      { icon: '🌍', t: 'Mehrsprachig', d: '8 Sprachen werden unterstützt.' },
      { icon: '📊', t: 'Öffentliches Dashboard', d: 'Live-Statistiken und offene Datenexporte.' },
    ],
    pipeline: 'Problem-Lebenszyklus',
    steps: ['Eingereicht', 'In Prüfung', 'In Bearbeitung', 'Gelöst'],
  },
  es: {
    badge: 'Plataforma de infraestructura cívica',
    title: 'Tu ciudad. Tu voz.\nTu impacto.',
    subtitle: 'Reporta problemas de infraestructura local, sigue las respuestas del gobierno y responsabiliza a las autoridades en tiempo real.',
    cta: 'Reportar un problema', secondary: 'Explorar el mapa',
    nav: { map: 'Mapa en vivo', dash: 'Panel', report: 'Reportar', signin: 'Iniciar sesión' },
    stats: [{ v: '12.400+', l: 'Problemas reportados' }, { v: '68%', l: 'Resueltos' }, { v: '< 4 días', l: 'Respuesta prom.' }, { v: '24', l: 'Ciudades activas' }],
    features: 'Todo lo que tu ciudad necesita',
    items: [
      { icon: '📍', t: 'Reportes geoetiquetados', d: 'Fija problemas directamente en el mapa con fotos.' },
      { icon: '🗳️', t: 'Votación comunitaria', d: 'Vota por los problemas más urgentes.' },
      { icon: '🤖', t: 'Categorización IA', d: 'Claude IA etiqueta cada reporte automáticamente.' },
      { icon: '🔔', t: 'Notificaciones en vivo', d: 'Recibe alertas instantáneas sobre actualizaciones.' },
      { icon: '🌍', t: 'Multilingüe', d: 'Soporte completo para 8 idiomas.' },
      { icon: '📊', t: 'Panel público', d: 'Estadísticas en vivo y exportación de datos abiertos.' },
    ],
    pipeline: 'Ciclo de vida del problema',
    steps: ['Enviado', 'En revisión', 'En progreso', 'Resuelto'],
  },
  zh: {
    badge: '市民基础设施平台',
    title: '你的城市。你的声音。\n你的影响。',
    subtitle: '报告本地基础设施问题，跟踪政府响应，并实时追责当局。',
    cta: '报告问题', secondary: '探索地图',
    nav: { map: '实时地图', dash: '仪表板', report: '报告', signin: '登录' },
    stats: [{ v: '12,400+', l: '已报告问题' }, { v: '68%', l: '已解决' }, { v: '< 4天', l: '平均响应' }, { v: '24', l: '活跃城市' }],
    features: '您的城市所需的一切',
    items: [
      { icon: '📍', t: '地理标记报告', d: '直接在地图上标记问题并附上照片。' },
      { icon: '🗳️', t: '社区投票', d: '对最紧迫的问题进行投票。' },
      { icon: '🤖', t: 'AI分类', d: 'Claude AI自动标记每份报告的类别和严重程度。' },
      { icon: '🔔', t: '实时通知', d: '关注问题更新时立即收到提醒。' },
      { icon: '🌍', t: '多语言', d: '支持包括中文在内的8种语言。' },
      { icon: '📊', t: '公共仪表板', d: '实时统计、图表和开放数据导出。' },
    ],
    pipeline: '问题生命周期',
    steps: ['已提交', '审核中', '处理中', '已解决'],
  },
  tr: {
    badge: 'Vatandaş Altyapı Platformu',
    title: 'Şehrin. Sesin.\nEtkin.',
    subtitle: 'Yerel altyapı sorunlarını bildirin, hükümet yanıtlarını takip edin ve yetkilileri gerçek zamanlı olarak hesap verebilir kılın.',
    cta: 'Sorun Bildir', secondary: 'Haritayı Keşfet',
    nav: { map: 'Canlı Harita', dash: 'Kontrol Paneli', report: 'Bildir', signin: 'Giriş Yap' },
    stats: [{ v: '12.400+', l: 'Bildirilen Sorun' }, { v: '%68', l: 'Çözüldü' }, { v: '< 4 gün', l: 'Ort. Yanıt' }, { v: '24', l: 'Aktif Şehir' }],
    features: 'Şehrinizin ihtiyacı olan her şey',
    items: [
      { icon: '📍', t: 'Coğrafi Etiketli Raporlar', d: 'Sorunları fotoğraflarla haritada işaretleyin.' },
      { icon: '🗳️', t: 'Topluluk Oylaması', d: 'En acil sorunlara oy verin.' },
      { icon: '🤖', t: 'Yapay Zeka Sınıflandırma', d: 'Claude AI her raporu otomatik etiketler.' },
      { icon: '🔔', t: 'Canlı Bildirimler', d: 'Takip ettiğiniz sorunlarda anında uyarı alın.' },
      { icon: '🌍', t: 'Çok Dilli', d: '8 dil desteği mevcuttur.' },
      { icon: '📊', t: 'Genel Kontrol Paneli', d: 'Canlı istatistikler ve açık veri dışa aktarımı.' },
    ],
    pipeline: 'Sorun Yaşam Döngüsü',
    steps: ['Gönderildi', 'İnceleniyor', 'İşlemde', 'Çözüldü'],
  },
  pt: {
    badge: 'Plataforma de Infraestrutura Cívica',
    title: 'Sua cidade. Sua voz.\nSeu impacto.',
    subtitle: 'Reporte problemas de infraestrutura local, acompanhe respostas do governo e responsabilize as autoridades em tempo real.',
    cta: 'Reportar um problema', secondary: 'Explorar o mapa',
    nav: { map: 'Mapa ao vivo', dash: 'Painel', report: 'Reportar', signin: 'Entrar' },
    stats: [{ v: '12.400+', l: 'Problemas reportados' }, { v: '68%', l: 'Resolvidos' }, { v: '< 4 dias', l: 'Resp. média' }, { v: '24', l: 'Cidades ativas' }],
    features: 'Tudo o que sua cidade precisa',
    items: [
      { icon: '📍', t: 'Relatórios geomarcados', d: 'Marque problemas diretamente no mapa com fotos.' },
      { icon: '🗳️', t: 'Votação comunitária', d: 'Vote nos problemas mais urgentes.' },
      { icon: '🤖', t: 'Categorização por IA', d: 'Claude IA categoriza automaticamente cada relatório.' },
      { icon: '🔔', t: 'Notificações ao vivo', d: 'Receba alertas instantâneos sobre atualizações.' },
      { icon: '🌍', t: 'Multilíngue', d: 'Suporte completo para 8 idiomas.' },
      { icon: '📊', t: 'Painel público', d: 'Estatísticas ao vivo e exportação de dados abertos.' },
    ],
    pipeline: 'Ciclo de vida do problema',
    steps: ['Enviado', 'Em análise', 'Em andamento', 'Resolvido'],
  },
};

type LangCode = 'en' | 'ar' | 'fr' | 'de' | 'es' | 'zh' | 'tr' | 'pt';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lang, setLang] = useState<LangCode>('en');
  const [langOpen, setLangOpen] = useState(false);
  const tx = t[lang] || t['en'];
  const currentLang = languages.find(l => l.code === lang)!;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; z: number; vx: number; vy: number; vz: number }[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, z: Math.random() * 1000, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, vz: -Math.random() * 1.5 - 0.3 });
    }
    let animId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(4,6,20,0.18)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2, cy = canvas.height / 2;
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.z += p.vz;
        if (p.z <= 0) { p.x = Math.random() * canvas.width; p.y = Math.random() * canvas.height; p.z = 1000; }
        const scale = 1000 / p.z;
        const sx = (p.x - cx) * scale + cx, sy = (p.y - cy) * scale + cy;
        const r = Math.max(0.15, scale * 0.7);
        const alpha = Math.min(1, (1000 - p.z) / 1000);
        ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100,180,255,${alpha * 0.75})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const sA = 1000 / a.z, sB = 1000 / b.z;
          const ax = (a.x - cx) * sA + cx, ay = (a.y - cy) * sA + cy;
          const bx = (b.x - cx) * sB + cx, by = (b.y - cy) * sB + cy;
          const dist = Math.hypot(ax - bx, ay - by);
          if (dist < 70) { ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.strokeStyle = `rgba(100,180,255,${(1 - dist / 70) * 0.12})`; ctx.lineWidth = 0.4; ctx.stroke(); }
        }
      }
      animId = requestAnimationFrame(animate);
    };
    animate();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const pipelineColors = ['#6B7280', '#F59E0B', '#3B82F6', '#10B981'];

  return (
    <div dir={currentLang.dir} style={{ fontFamily: "'Syne','DM Sans',sans-serif", background: '#040614', color: '#fff', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        .card-glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(10px); border-radius: 14px; transition: all 0.3s ease; }
        .card-glass:hover { background: rgba(255,255,255,0.065); border-color: rgba(100,180,255,0.18); transform: translateY(-2px); }
        .btn-primary { background: linear-gradient(135deg,#1d6fca,#0ea5e9); color:#fff; padding:11px 26px; border-radius:50px; font-weight:600; font-size:14px; text-decoration:none; display:inline-block; transition:all 0.3s; border:none; cursor:pointer; }
        .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(14,165,233,0.32); }
        .btn-ghost { background:transparent; color:rgba(255,255,255,0.65); padding:11px 26px; border-radius:50px; font-weight:500; font-size:14px; text-decoration:none; display:inline-block; border:1px solid rgba(255,255,255,0.14); transition:all 0.3s; }
        .btn-ghost:hover { background:rgba(255,255,255,0.06); color:#fff; }
        .nav-link { color:rgba(255,255,255,0.55); text-decoration:none; font-size:13px; font-weight:500; transition:color 0.2s; }
        .nav-link:hover { color:#fff; }
        .lang-dropdown { position:absolute; top:calc(100% + 8px); right:0; background:rgba(8,15,36,0.98); border:1px solid rgba(255,255,255,0.1); border-radius:12px; padding:6px; min-width:160px; z-index:200; backdrop-filter:blur(20px); }
        .lang-option { display:flex; align-items:center; gap:10px; padding:8px 12px; border-radius:8px; cursor:pointer; transition:background 0.15s; font-size:13px; color:rgba(255,255,255,0.7); border:none; background:transparent; font-family:inherit; width:100%; text-align:left; }
        .lang-option:hover { background:rgba(255,255,255,0.06); color:#fff; }
        .lang-option.active { background:rgba(14,165,233,0.12); color:#0ea5e9; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .fu { animation:fadeUp 0.7s ease forwards; }
        .fu2 { animation:fadeUp 0.7s 0.15s ease both; }
        .fu3 { animation:fadeUp 0.7s 0.3s ease both; }
        .fu4 { animation:fadeUp 0.7s 0.45s ease both; }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:2px}
      `}</style>

      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, opacity: 0.65 }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse at 30% 20%,rgba(14,100,200,0.1) 0%,transparent 55%),radial-gradient(ellipse at 70% 80%,rgba(16,185,129,0.05) 0%,transparent 55%)' }} />

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 36px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(4,6,20,0.82)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#1d6fca,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>⚡</div>
          <span style={{ fontWeight: 700, fontSize: 17, fontFamily: 'Syne' }}>CivicPulse</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link href="/map" className="nav-link">{tx.nav.map}</Link>
          <Link href="/dashboard" className="nav-link">{tx.nav.dash}</Link>
          <Link href="/submit" className="nav-link">{tx.nav.report}</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Language Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', padding: '6px 12px', borderRadius: 20, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.2s' }}
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.label}</span>
              <span style={{ fontSize: 10, opacity: 0.5, transform: langOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
            </button>
            {langOpen && (
              <div className="lang-dropdown">
                {languages.map(l => (
                  <button
                    key={l.code}
                    className={`lang-option ${lang === l.code ? 'active' : ''}`}
                    onClick={() => { setLang(l.code as LangCode); setLangOpen(false); }}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === l.code && <span style={{ marginLeft: 'auto', fontSize: 10 }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/auth/signin" className="btn-primary" style={{ padding: '7px 18px', fontSize: 13 }}>{tx.nav.signin}</Link>
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {langOpen && <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setLangOpen(false)} />}

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '90px 36px 50px' }}>
        <div className="fu" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(14,165,233,0.09)', border: '1px solid rgba(14,165,233,0.22)', borderRadius: 50, padding: '5px 14px', marginBottom: 28 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#0ea5e9', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: '#0ea5e9', fontWeight: 500, letterSpacing: '0.05em' }}>{tx.badge}</span>
        </div>

        <h1 className="fu2" style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.08, fontFamily: 'Syne', letterSpacing: '-0.02em', marginBottom: 22, whiteSpace: 'pre-line', textShadow: '0 0 40px rgba(100,180,255,0.3)' }}>
          {tx.title}
        </h1>

        <p className="fu3" style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: 'rgba(255,255,255,0.5)', maxWidth: 520, lineHeight: 1.75, marginBottom: 40, fontWeight: 300 }}>
          {tx.subtitle}
        </p>

        <div className="fu4" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/submit" className="btn-primary">{tx.cta}</Link>
          <Link href="/map" className="btn-ghost">{tx.secondary}</Link>
        </div>

        {/* Stats */}
        <div className="fu4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 64, width: '100%', maxWidth: 720 }}>
          {tx.stats.map((s: any, i: number) => (
            <div key={i} className="card-glass" style={{ padding: '18px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(18px, 2.5vw, 26px)', fontWeight: 700, fontFamily: 'Syne', color: '#fff', marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)', fontWeight: 400 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 36px', maxWidth: 1000, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 700, fontFamily: 'Syne', marginBottom: 48 }}>{tx.features}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: 16 }}>
          {tx.items.map((f: any, i: number) => (
            <div key={i} className="card-glass" style={{ padding: '24px 22px' }}>
              <div style={{ fontSize: 26, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Syne', marginBottom: 8 }}>{f.t}</h3>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 36px 100px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: 700, fontFamily: 'Syne', marginBottom: 44 }}>{tx.pipeline}</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', maxWidth: 800, margin: '0 auto' }}>
          {tx.steps.map((step: string, i: number) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: pipelineColors[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#fff' }}>{i + 1}</div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{step}</span>
              </div>
              {i < tx.steps.length - 1 && <div style={{ width: 60, height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 10px', marginBottom: 22 }} />}
            </div>
          ))}
        </div>
      </section>

      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© 2026 CivicPulse Global</span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Arab Academy for Science & Technology</span>
      </footer>
    </div>
  );
}
