# VisionTag — Image Analysis & Tagging Web Application (CS619 Final Year Project)

Upload a JPG/PNG image and get AI-generated tags (with confidence scores) and a caption from **Azure Cognitive Services Computer Vision**. Registered users get a searchable history; guests can analyze images without an account.

**Stack:** React 18 + Vite + Tailwind + Redux Toolkit (frontend) · Node.js + Express + Mongoose (backend) · MongoDB · Azure Computer Vision.

## Folder structure
```
backend/    Express API (feature-based MVC: auth, user, image-analysis, history)
frontend/   React single-page app
database/   Schema documentation + export/import scripts
```

## Prerequisites
Node.js 18+, MongoDB running locally (or a MongoDB Atlas URI), an Azure Computer Vision key + endpoint, and (optional) an SMTP account for password-reset emails.

## Setup
```bash
# 1) Backend
cd backend
cp .env.example .env        # then fill in MONGO_URI, JWT_SECRET, AZURE_VISION_KEY, AZURE_VISION_ENDPOINT, SMTP_*
npm install
npm run dev                 # http://localhost:5000  (health check: /health)

# 2) Frontend (new terminal)
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000
npm install
npm run dev                 # http://localhost:5173
```
Optional: load the submitted data with `database/import-db.sh` (see `database/SCHEMA.md`).

## Features (all 16 functional requirements)
Registration/login/logout (JWT + server-side token blacklist) · image upload with validation (JPG/PNG, max 10 MB) · Azure analysis with tags, confidence and caption · guest mode (nothing saved) · history with tag search · edit/add/remove tags · delete one entry or clear all history · profile update · forgot/reset password by email link (1 h expiry) · export result as PDF/JSON.

## API summary
| Method & path | Auth | Purpose |
|---|---|---|
| POST `/api/auth/register`, `/login` | – | create account / log in |
| POST `/api/auth/logout` | ✔ | invalidate token |
| POST `/api/auth/forgot-password`, `/reset-password` | – | reset by email link |
| POST `/api/images/analyze` | optional | analyze image (saved only if logged in) |
| GET `/api/history?tag=` · DELETE `/api/history` · DELETE `/api/history/:id` | ✔ | list / filter / clear / delete |
| GET `/api/analyses/:id` · PUT `/api/analyses/:id/tags` · GET `/api/analyses/:id/export?format=pdf\|json` | ✔ | details / edit tags / export |
| GET/PUT `/api/users/profile` | ✔ | view / update profile |

## Tests
```bash
cd backend
npm test                                    # unit tests (no database needed); API tests are skipped
TEST_MONGO_URI=mongodb://127.0.0.1:27017/visiontag_test npm test   # also runs API integration tests
```
Never commit `.env` — it holds secrets. Use `.env.example` as the template.
