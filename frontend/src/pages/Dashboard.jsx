import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API    from '../services/api';

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: '#1f2937', borderRadius: 12, padding: '16px 20px', border: '1px solid #374151' }}>
      <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: 'white' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

const RECENT = [
  { name: 'main.py',   lang: 'Python',     badge: '94 puan',   color: '#34d399' },
  { name: 'index.js',  lang: 'JavaScript', badge: 'Bug riski', color: '#fbbf24' },
  { name: 'App.java',  lang: 'Java',       badge: '87 puan',   color: '#5eead4' },
  { name: 'utils.cpp', lang: 'C++',        badge: 'Yüksek CC', color: '#f87171' },
  { name: 'api.go',    lang: 'Go',         badge: '91 puan',   color: '#c4b5fd' },
];

const BAR_COLORS = ['#6366f1','#34d399','#fbbf24','#f97316','#9ca3af'];

export default function Dashboard() {
  const [models, setModels] = useState([]);

  useEffect(() => {
    API.get('/models').then(r => setModels(r.data)).catch(() => {});
  }, []);

  const top = models[0] || { name: 'CodeBERT', accuracy: 96.4 };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right,#0f172a,#111827,#1e1b4b)' }}>
      <Navbar />
      <div style={{ padding: 24 }}>
        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
          <StatCard label="Toplam analiz"    value="1,248"          sub="+12 bugün"       />
          <StatCard label="En iyi doğruluk"  value={`${top.accuracy}%`} sub={top.name}    />
          <StatCard label="Bug tespiti"      value="342"            sub="son 30 gün"      />
          <StatCard label="Desteklenen dil"  value="12"             sub="Python, JS…"     />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Model bars */}
          <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Model Performansı</h3>
            {models.slice(0, 5).map((m, i) => (
              <div key={m.name} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 3 }}>
                  <span>{m.name}</span><span>{m.accuracy}%</span>
                </div>
                <div style={{ background: '#1f2937', borderRadius: 99, height: 6 }}>
                  <div style={{ width: `${m.accuracy}%`, height: 6, borderRadius: 99, background: BAR_COLORS[i] }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent */}
          <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20 }}>
            <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Son Analizler</h3>
            {RECENT.map(a => (
              <div key={a.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid #1f2937', fontSize: 12 }}>
                <span style={{ color: '#d1d5db' }}>{a.name}</span>
                <span style={{ background: 'rgba(255,255,255,0.06)', color: a.color, borderRadius: 99, padding: '2px 10px', fontSize: 11 }}>
                  {a.lang} · {a.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
