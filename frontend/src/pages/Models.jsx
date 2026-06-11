import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import API    from '../services/api';

const HEADS = ['Model', 'Tür', 'Accuracy', 'F1', 'Precision', 'Recall', 'Eğitim Süresi'];

export default function Models() {
  const [models,  setModels]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/models')
      .then(r => setModels(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right,#0f172a,#111827,#1e1b4b)' }}>
      <Navbar />
      <div style={{ padding: 24 }}>
        <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>ML vs DL Karşılaştırma</h3>
          {loading ? (
            <p style={{ color: '#9ca3af', fontSize: 12 }}>Yükleniyor…</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #374151' }}>
                    {HEADS.map(h => (
                      <th key={h} style={{ textAlign: 'left', color: '#6b7280', fontWeight: 500, paddingBottom: 8, paddingRight: 16, fontSize: 11 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {models.map((m, i) => {
                    const best = i === 0;
                    const c    = best ? '#a78bfa' : '#d1d5db';
                    const nc   = best ? '#34d399'  : '#d1d5db';
                    return (
                      <tr key={m.name} style={{ borderBottom: i < models.length - 1 ? '1px solid #1f2937' : 'none' }}>
                        <td style={{ padding: '9px 16px 9px 0', color: c, fontWeight: best ? 600 : 400 }}>{m.name}</td>
                        <td style={{ padding: '9px 16px 9px 0', color: '#9ca3af' }}>{m.type}</td>
                        <td style={{ padding: '9px 16px 9px 0', color: nc, fontWeight: best ? 600 : 400 }}>{m.accuracy}%</td>
                        <td style={{ padding: '9px 16px 9px 0', color: nc }}>{m.f1}</td>
                        <td style={{ padding: '9px 16px 9px 0', color: nc }}>{m.precision}</td>
                        <td style={{ padding: '9px 16px 9px 0', color: nc }}>{m.recall}</td>
                        <td style={{ padding: '9px 16px 9px 0', color: '#9ca3af' }}>{m.train_time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Özet Yorum</h3>
          <p style={{ color: '#9ca3af', fontSize: 12, lineHeight: 1.8 }}>
            CodeBERT en yüksek doğruluğu sunarken eğitim süresi uzun.
            Hızlı sonuç için Gradient Boosting iyi bir denge sağlar.
            Üretim ortamı için CodeBERT + REST API önerilir.
          </p>
        </div>
      </div>
    </div>
  );
}
