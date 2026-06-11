import Navbar from '../components/Navbar';

const ENDPOINTS = [
  { method: 'POST', path: '/api/v1/analyze',          desc: 'Tam analiz — dil, kalite, bug, risk, CC, SHAP' },
  { method: 'POST', path: '/api/v1/predict/language', desc: 'Yalnızca dil tespiti' },
  { method: 'POST', path: '/api/v1/predict/quality',  desc: 'Kalite + risk skoru + SHAP' },
  { method: 'POST', path: '/api/v1/complete',         desc: 'Kod tamamlama (CodeBERT + HF API)' },
  { method: 'POST', path: '/api/v1/report',           desc: 'PDF rapor üret ve indir' },
  { method: 'GET',  path: '/api/v1/models',           desc: 'Model listesi ve metrikler' },
  { method: 'GET',  path: '/api/v1/health',           desc: 'Servis sağlık kontrolü' },
];

const MC = { POST: '#a78bfa', GET: '#34d399' };
const MB = { POST: 'rgba(167,139,250,.13)', GET: 'rgba(52,211,153,.12)' };

export default function ApiDocs() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right,#0f172a,#111827,#1e1b4b)' }}>
      <Navbar />
      <div style={{ padding: 24 }}>
        <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>REST API Endpointleri</h3>
          {ENDPOINTS.map((e, i) => (
            <div key={e.path} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < ENDPOINTS.length - 1 ? '1px solid #1f2937' : 'none' }}>
              <span style={{ background: MB[e.method], color: MC[e.method], borderRadius: 4, padding: '2px 9px', fontSize: 11, fontWeight: 700, minWidth: 44, textAlign: 'center', flexShrink: 0 }}>
                {e.method}
              </span>
              <div>
                <div style={{ fontFamily: 'monospace', color: '#e2e8f0', fontSize: 12 }}>{e.path}</div>
                <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 2 }}>{e.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Örnek İstek</h3>
          <pre style={{ background: '#0f172a', borderRadius: 8, padding: 14, color: '#a78bfa', fontSize: 12, overflowX: 'auto', margin: 0, lineHeight: 1.7 }}>
{`curl -X POST http://localhost:5000/api/v1/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"code":"def fib(n): return n if n<=1 else fib(n-1)+fib(n-2)"}'`}
          </pre>
          <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, margin: '16px 0 10px' }}>Örnek Yanıt</h3>
          <pre style={{ background: '#0f172a', borderRadius: 8, padding: 14, color: '#34d399', fontSize: 12, overflowX: 'auto', margin: 0, lineHeight: 1.7 }}>
{`{
  "language": { "language": "Python", "confidence": 0.857 },
  "quality":  { "quality_score": 84, "bug_risk": "Low", "risk_score": 0.13 },
  "features": { "line_count": 1, "cyclomatic_complexity": 3 },
  "shap":     { "shap_values": { "Girinti derinliği": 0.0, ... } }
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
