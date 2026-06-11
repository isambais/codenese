# CodeSense — Kod Analiz Platformu

Kaynak kodu analiz eden, dil tespiti, kalite skoru, bug riski, karmaşıklık ölçümü ve XAI (SHAP/LIME) açıklaması yapan web uygulaması.

## Özellikler

- **Dil Tespiti** — Python, JS, TS, Java, C++, C, Go, Rust, Ruby, PHP, Swift, Kotlin
- **Kalite Skoru** — 0–100 arası heuristik skor
- **Bug Riski** — Low / Medium / High + risk skoru (0–1)
- **Cyclomatic Complexity** — `radon` kütüphanesi ile gerçek CC hesabı
- **SHAP Görselleştirmesi** — hangi özelliğin skoru nasıl etkilediği
- **Kod Tamamlama** — CodeBERT [MASK] token tahmini (HuggingFace API)
- **PDF Rapor** — analiz sonucunu PDF olarak indirme
- **Model Karşılaştırması** — CodeBERT / BiLSTM / Random Forest / SVM / Naive Bayes metrikleri
- **REST API** — Swagger uyumlu 7 endpoint

## Teknoloji Stack

| Katman | Teknoloji |
|---|---|
| Backend | Python 3.10, Flask 3, radon, pygments, fpdf2 |
| Frontend | React 19, Vite, Monaco Editor, react-router-dom |
| XAI | SHAP (heuristic), LIME görselleştirme |
| DL Modeli | Microsoft CodeBERT (HuggingFace) |
| CI/CD | GitHub Actions |
| Container | Docker Compose |

## Kurulum

### Gereksinimler

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate        # Windows
source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
python run.py
```

Backend `http://localhost:5000` adresinde çalışır.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend `http://localhost:5173` adresinde açılır.

## API Endpointleri

| Method | Endpoint | Açıklama |
|---|---|---|
| POST | `/api/v1/analyze` | Tam analiz (dil + kalite + CC + SHAP) |
| POST | `/api/v1/predict/language` | Sadece dil tespiti |
| POST | `/api/v1/predict/quality` | Kalite + risk + SHAP |
| POST | `/api/v1/complete` | [MASK] token tamamlama |
| POST | `/api/v1/report` | PDF rapor indir |
| GET  | `/api/v1/models` | Model metrikleri |
| GET  | `/api/v1/health` | Sağlık kontrolü |

### Örnek İstek

```bash
curl -X POST http://localhost:5000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "def fib(n):\n  return n if n<=1 else fib(n-1)+fib(n-2)"}'
```

### Örnek Yanıt

```json
{
  "language": { "language": "Python", "confidence": 0.75 },
  "quality":  { "quality_score": 80, "bug_risk": "Low", "risk_score": 0.15 },
  "features": { "cyclomatic_complexity": 2, "line_count": 1 },
  "shap":     { "shap_values": { "Girinti derinligi": 0.4 } }
}
```

## HuggingFace API Key (Isteğe Bağlı)

[MASK] token tamamlama için gerçek CodeBERT modeli kullanmak istersen:

1. `https://huggingface.co/settings/tokens` adresinden ücretsiz token al
2. `backend/.env` dosyasına ekle: `HF_API_KEY=hf_xxx...`

API key olmadan uygulama yine çalışır — tamamlama için yerel fallback öneriler döner.

## Proje Yapısı

```
codesense/
├── backend/
│   ├── analysis/         # Dil tespiti, ozellik cikarimi, explainability
│   ├── models/           # ML/DL model wrappers, kod tamamlama
│   ├── reports/          # PDF rapor uretimi
│   ├── app/              # Flask uygulama ve API blueprint
│   ├── tests/            # Pytest testleri
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── pages/        # Analiz, Dashboard, Modeller, Tamamlama, API
│   │   ├── components/   # Navbar, CodeEditor, ResultPanel, ScoreCard
│   │   └── services/     # axios API client
│   └── package.json
├── notebooks/
├── docker-compose.yml
└── .github/workflows/ci.yml
```

## Testler

```bash
cd backend
python -m pytest tests/ -v
```
