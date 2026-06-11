import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, setCode, onAnalyze, onPdf, loading }) {
  return (
    <div style={{ background: '#111827', padding: 20, borderRadius: 16, border: '1px solid #374151' }}>
      <h2 style={{ color: 'white', marginBottom: 14, fontSize: 14, fontWeight: 600 }}>Kod Editörü</h2>

      <Editor
        height="420px"
        defaultLanguage="python"
        theme="vs-dark"
        value={code}
        onChange={v => setCode(v || '')}
        options={{ fontSize: 13, minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />

      <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center' }}>
        <button
          onClick={onAnalyze}
          disabled={loading}
          style={{
            flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
            background: loading ? '#374151' : 'linear-gradient(90deg,#6366f1,#8b5cf6)',
            color: 'white', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13,
          }}
        >
          {loading ? 'Analiz ediliyor…' : '▶  Analiz Et'}
        </button>

        <button
          onClick={onPdf}
          style={{
            padding: '11px 16px', borderRadius: 10, border: '1px solid #374151',
            background: 'transparent', color: '#9ca3af', cursor: 'pointer', fontSize: 12,
          }}
        >
          PDF Rapor
        </button>
      </div>
    </div>
  );
}
