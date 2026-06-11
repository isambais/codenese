const scoreColor = s => s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : '#f87171';
const riskColor  = r => r === 'Low' ? '#34d399' : r === 'Medium' ? '#fbbf24' : '#f87171';

function Row({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #1f2937', fontSize: 12 }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ color: color || '#e2e8f0', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function ResultPanel({ result, loading }) {
  return (
    <div style={{ background: '#111827', padding: 20, borderRadius: 16, border: '1px solid #374151', color: 'white' }}>
      <h2 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>Analiz Sonuçları</h2>

      {loading && (
        <div style={{ color: '#9ca3af', fontSize: 12, textAlign: 'center', padding: '30px 0' }}>
          Analiz ediliyor…
        </div>
      )}

      {!result && !loading && (
        <p style={{ color: '#6b7280', fontSize: 12 }}>Henüz analiz yapılmadı.</p>
      )}

      {result && !loading && (
        <>
          {/* Score ring */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #1f2937' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
              border: `3px solid ${scoreColor(result.quality?.quality_score ?? 0)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700,
              color: scoreColor(result.quality?.quality_score ?? 0),
            }}>
              {result.quality?.quality_score ?? '—'}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>Kod Skoru</div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Genel değerlendirme</div>
            </div>
          </div>

          {/* Metrics */}
          <Row label="Dil"          value={`${result.language?.language ?? '?'} · ${((result.language?.confidence ?? 0) * 100).toFixed(1)}%`} />
          <Row label="Kalite"       value={`${result.quality?.quality_score} / 100`} color={scoreColor(result.quality?.quality_score)} />
          <Row label="Bug Riski"    value={result.quality?.bug_risk} color={riskColor(result.quality?.bug_risk)} />
          <Row label="Risk Skoru"   value={result.quality?.risk_score} />
          <Row label="Cyclomatic"   value={`CC = ${result.features?.cyclomatic_complexity}`} />
          <Row label="Satır sayısı" value={`${result.features?.line_count} satır`} />

          {/* SHAP bars */}
          {result.shap?.shap_values && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 10, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SHAP Özellik Önemleri</div>
              {Object.entries(result.shap.shap_values).map(([feat, val]) => (
                <div key={feat} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{ color: '#9ca3af', width: 112, flexShrink: 0, fontSize: 10 }}>{feat}</span>
                  <div style={{ flex: 1, background: '#1f2937', borderRadius: 99, height: 5 }}>
                    <div style={{ width: `${val * 100}%`, height: 5, borderRadius: 99, background: '#6366f1', transition: 'width .4s' }} />
                  </div>
                  <span style={{ color: '#d1d5db', minWidth: 30, textAlign: 'right', fontSize: 11 }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
