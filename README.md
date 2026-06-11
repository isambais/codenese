# CodeSense â€” Kod Analiz Platformu

Kaynak kodu analiz eden, dil tespiti, kalite skoru, bug riski, karmaÅŸÄ±klÄ±k Ã¶lÃ§Ã¼mÃ¼ ve XAI (SHAP/LIME) aÃ§Ä±klamasÄ± yapan web uygulamasÄ±.

## Ã–zellikler

- **Dil Tespiti** â€” Python, JS, TS, Java, C++, C, Go, Rust, Ruby, PHP, Swift, Kotlin
- **Kalite Skoru** â€” 0â€“100 arasÄ± heuristik skor
- **Bug Riski** â€” Low / Medium / High + risk skoru (0â€“1)
- **Cyclomatic Complexity** â€” `radon` kÃ¼tÃ¼phanesi ile gerÃ§ek CC hesabÄ±
- **SHAP GÃ¶rselleÅŸtirmesi** â€” hangi Ã¶zelliÄŸin skoru nasÄ±l etkilediÄŸi
- **Kod Tamamlama** â€” CodeBERT [MASK] token tahmini (HuggingFace API)
- **PDF Rapor** â€” analiz sonucunu PDF olarak indirme
- **Model KarÅŸÄ±laÅŸtÄ±rmasÄ±** â€” CodeBERT / BiLSTM / Random Forest / SVM / Naive Bayes metrikleri
- **REST API** â€” Swagger uyumlu 7 endpoint

## Teknoloji Stack

| Katman | Teknoloji |
|---|---|
| Backend | Python 3.10, Flask 3, radon, pygments, fpdf2 |
| Frontend | React 19, Vite, Monaco Editor, react-router-dom |
| XAI | SHAP (heuristic), LIME gÃ¶rselleÅŸtirme |
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

# Sanal ortam oluÅŸtur
python -m venv venv

# AktifleÅŸtir (Windows)
.\venv\Scripts\activate

# AktifleÅŸtir (Mac/Linux)
source venv/bin/activate

# BaÄŸÄ±mlÄ±lÄ±klarÄ± yÃ¼kle
pip install -r requirements.txt

# .env dosyasÄ±nÄ± oluÅŸtur
cp .env.example .env
# (Ä°steÄŸe baÄŸlÄ±: HF_API_KEY ekle)

# Sunucuyu baÅŸlat
python run.py
```

Backend `http://localhost:5000` adresinde Ã§alÄ±ÅŸÄ±r.

### Frontend

```bash
cd frontend

# BaÄŸÄ±mlÄ±lÄ±klarÄ± yÃ¼kle
npm install

# GeliÅŸtirme sunucusunu baÅŸlat
npm run dev
```

Frontend `http://localhost:5173` adresinde aÃ§Ä±lÄ±r.

## API Endpointleri

| Method | Endpoint | AÃ§Ä±klama |
|---|---|---|
| POST | `/api/v1/analyze` | Tam analiz (dil + kalite + CC + SHAP) |
| POST | `/api/v1/predict/language` | Sadece dil tespiti |
| POST | `/api/v1/predict/quality` | Kalite + risk + SHAP |
| POST | `/api/v1/complete` | [MASK] token tamamlama |
| POST | `/api/v1/report` | PDF rapor indir |
| GET  | `/api/v1/models` | Model metrikleri |
| GET  | `/api/v1/health` | SaÄŸlÄ±k kontrolÃ¼ |

### Ã–rnek Ä°stek

```bash
curl -X POST http://localhost:5000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{"code": "def fib(n):\n  return n if n<=1 else fib(n-1)+fib(n-2)"}'
```

### Ã–rnek YanÄ±t

```json
{
  "language": { "language": "Python", "confidence": 0.75 },
  "quality":  { "quality_score": 80, "bug_risk": "Low", "risk_score": 0.15 },
  "features": { "cyclomatic_complexity": 2, "line_count": 1 },
  "shap":     { "shap_values": { "Girinti derinliÄŸi": 0.4, ... } }
}
```

## HuggingFace API Key (Ä°steÄŸe BaÄŸlÄ±)

[MASK] token tamamlama iÃ§in gerÃ§ek CodeBERT modeli kullanmak istersen:

1. `https://huggingface.co/settings/tokens` adresinden Ã¼cretsiz token al
2. `backend/.env` dosyasÄ±na ekle: `HF_API_KEY=hf_xxx...`

API key olmadan uygulama yine Ã§alÄ±ÅŸÄ±r â€” tamamlama iÃ§in yerel fallback Ã¶neriler dÃ¶ner.

## Proje YapÄ±sÄ±

```
codesense/
â”œâ”€â”€ backend/
â”‚   â”œâ”€â”€ analysis/         # Dil tespiti, Ã¶zellik Ã§Ä±karÄ±mÄ±, explainability
â”‚   â”œâ”€â”€ models/           # ML/DL model wrapperlarÄ±, kod tamamlama
â”‚   â”œâ”€â”€ reports/          # PDF rapor Ã¼retimi
â”‚   â”œâ”€â”€ app/              # Flask uygulama ve API blueprint
â”‚   â”œâ”€â”€ tests/            # Pytest testleri
â”‚   â”œâ”€â”€ requirements.txt
â”‚   â””â”€â”€ run.py
â”œâ”€â”€ frontend/
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ pages/        # Analiz, Dashboard, Modeller, Tamamlama, API
â”‚   â”‚   â”œâ”€â”€ components/   # Navbar, CodeEditor, ResultPanel, ScoreCard
â”‚   â”‚   â””â”€â”€ services/     # axios API client
â”‚   â””â”€â”€ package.json
â”œâ”€â”€ notebooks/            # EDA Jupyter notebooklarÄ±
â”œâ”€â”€ docs/
â”œâ”€â”€ docker-compose.yml
â””â”€â”€ .github/workflows/ci.yml
```

## Testler

```bash
cd backend
python -m pytest tests/ -v
```

