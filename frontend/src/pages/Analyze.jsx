import { useState } from 'react';
import Navbar      from '../components/Navbar';
import CodeEditor  from '../components/CodeEditor';
import ResultPanel from '../components/ResultPanel';
import API         from '../services/api';

const DEFAULT_CODE = `def fibonacci(n):
    # Özyinelemeli Fibonacci
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

for i in range(10):
    print(fibonacci(i))`;

export default function Analyze() {
  const [code,    setCode]    = useState(DEFAULT_CODE);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const { data } = await API.post('/analyze', { code });
      setResult(data);
    } catch {
      setError('Backend bağlantı hatası — Flask sunucusu çalışıyor mu?');
    } finally {
      setLoading(false);
    }
  };

  const handlePdf = async () => {
    setError('');
    try {
      const resp = await API.post('/report', { code }, { responseType: 'blob' });
      const url  = URL.createObjectURL(new Blob([resp.data], { type: 'application/pdf' }));
      const a    = document.createElement('a');
      a.href = url; a.download = 'codesense_report.pdf'; a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('PDF oluşturulamadı.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right,#0f172a,#111827,#1e1b4b)' }}>
      <Navbar />
      {error && (
        <div style={{ margin: '12px 24px 0', padding: '10px 14px', background: 'rgba(248,113,113,0.12)', border: '1px solid #f87171', borderRadius: 8, color: '#f87171', fontSize: 12 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, padding: 24 }}>
        <CodeEditor code={code} setCode={setCode} onAnalyze={handleAnalyze} onPdf={handlePdf} loading={loading} />
        <ResultPanel result={result} loading={loading} />
      </div>
    </div>
  );
}
