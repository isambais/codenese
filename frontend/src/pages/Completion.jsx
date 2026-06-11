import { useState } from 'react';
import Navbar from '../components/Navbar';
import API    from '../services/api';

const EXAMPLE = `def calculate(x, y):
  result = x [MASK] y
  return result`;

export default function Completion() {
  const [code,        setCode]        = useState(EXAMPLE);
  const [suggestions, setSuggestions] = useState([]);
  const [source,      setSource]      = useState('');
  const [loading,     setLoading]     = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      const { data } = await API.post('/complete', { code, top_k: 6 });
      setSuggestions(data.suggestions || []);
      setSource(data.source || '');
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right,#0f172a,#111827,#1e1b4b)' }}>
      <Navbar />
      <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>CodeBERT Mask Doldurma</h3>
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            spellCheck={false}
            style={{
              width: '100%', minHeight: 130, background: '#1f2937', border: '1px solid #374151',
              borderRadius: 8, padding: 12, color: '#e2e8f0', fontFamily: 'monospace',
              fontSize: 12, resize: 'vertical', outline: 'none',
            }}
          />
          <p style={{ fontSize: 11, color: '#6b7280', margin: '6px 0 12px' }}>
            Tahmin ettirmek istediğiniz yere{' '}
            <code style={{ color: '#a78bfa', background: 'rgba(167,139,250,.12)', padding: '1px 5px', borderRadius: 4 }}>[MASK]</code>{' '}
            yazın.
          </p>
          <button
            onClick={handleComplete}
            disabled={loading}
            style={{
              width: '100%', padding: 11, borderRadius: 9, border: 'none',
              background: loading ? '#374151' : 'linear-gradient(90deg,#6366f1,#8b5cf6)',
              color: 'white', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13,
            }}
          >
            {loading ? 'Tahmin ediliyor…' : 'Tamamla'}
          </button>
        </div>

        <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>Öneriler</h3>
            {source && (
              <span style={{ fontSize: 10, color: '#6b7280', background: '#1f2937', padding: '2px 8px', borderRadius: 99, border: '1px solid #374151' }}>
                {source}
              </span>
            )}
          </div>

          {suggestions.length === 0 && !loading && (
            <p style={{ color: '#6b7280', fontSize: 12 }}>Henüz tahmin yapılmadı.</p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {suggestions.map((s, i) => (
              <div
                key={i}
                onClick={() => setCode(code.replace('[MASK]', s.token))}
                style={{
                  background: '#1f2937', border: '1px solid #374151', borderRadius: 8,
                  padding: '7px 16px', fontSize: 13, cursor: 'pointer',
                }}
              >
                <span style={{ color: '#a78bfa', fontFamily: 'monospace', fontWeight: 600 }}>{s.token}</span>
                <span style={{ color: '#6b7280', marginLeft: 8, fontSize: 11 }}>{(s.score * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>

          {suggestions.length > 0 && (
            <p style={{ fontSize: 11, color: '#4b5563', marginTop: 14 }}>
              Token'e tıklayarak [MASK] yerine otomatik ekleyebilirsiniz.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
