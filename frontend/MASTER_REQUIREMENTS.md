# Master Requirements List — ImageAI Tagger (Image Analysis and Tagging Web Application)

> Source: SRS v1.0 (original FR/NFR + UC-01–UC-06) + Design Document v1.1 (expanded UC-07–UC-12). This is the complete, merged list — build backend/frontend against this so nothing is missed.

---

## 1. Functional Requirements (Complete List)

### Original SRS Functional Requirements (FR-01 to FR-10)

| ID | Feature | Description |
|---|---|---|
| FR-01 | User Registration & Login | Users can create an account, log in, and manage their profile securely using email and password. |
| FR-02 | Image Upload | Users can upload JPG/PNG images (max 10MB) via drag-and-drop or file browser button. |
| FR-03 | Image Validation | System validates file type, size, and format before processing. Invalid files rejected with clear error messages. |
| FR-04 | AI Image Analysis | System sends the uploaded image to Azure Cognitive Services Computer Vision API for analysis. |
| FR-05 | Display Tags | System displays auto-generated descriptive tags with confidence scores (e.g., "Car – 98.5%"). |
| FR-06 | Display Caption | System shows an AI-generated natural language caption describing the image content. |
| FR-07 | Error Handling | System shows meaningful error messages for API failures, invalid uploads, timeout errors, or network issues. |
| FR-08 | Analysis History | Logged-in users can view their past uploaded images along with generated tags, captions, and timestamps. |
| FR-09 | Delete History | Users can delete individual history entries or clear their entire history from their account dashboard. |
| FR-10 | Guest Mode | Guests can analyze images without registration. Results displayed but NOT saved to any database. |

### Added per Design Document v1.1 (FR-11 to FR-16 — supervisor-requested expansion)

| ID | Feature | Description |
|---|---|---|
| FR-11 | Edit / Add Tags | Logged-in users can edit an existing tag's label, add a new tag, or remove a tag from their own analysis entries. Entry must be flagged as user-edited afterward. |
| FR-12 | Search / Filter History by Tag | Logged-in users can search/filter their history by tag keyword (partial match). |
| FR-13 | Logout | Users can log out; JWT/session is invalidated client- and server-side. |
| FR-14 | Forgot / Reset Password | Users can request a password reset link via email; link expires after 1 hour. Users can set a new password using a valid token. |
| FR-15 | Update Profile | Logged-in users can update their full name, email, and/or password. |
| FR-16 | Download / Export Result | Logged-in users can download/export an analysis result (PDF or JSON). |

**Total: 16 functional requirements (FR-01 to FR-16).**

---

## 2. Non-Functional Requirements (Complete List, NFR-01 to NFR-08)

| ID | Category | Requirement |
|---|---|---|
| NFR-01 | Performance | System returns analysis results within 3–5 seconds under normal network load and standard image sizes. |
| NFR-02 | Scalability | Application is hosted on Microsoft Azure cloud infrastructure to handle growing numbers of concurrent users. |
| NFR-03 | Security | All data transmission uses HTTPS (SSL/TLS). Azure API keys are stored as server-side environment variables only — never exposed to the frontend. |
| NFR-04 | Usability | UI/UX is simple and intuitive. Non-technical users can upload and analyze images without training or documentation. |
| NFR-05 | Reliability | System maintains 99% uptime. All errors are automatically logged and monitored server-side. |
| NFR-06 | Maintainability | Codebase follows modular MVC architecture. Each module is independently maintainable and testable. |
| NFR-07 | Compatibility | Application is fully functional on all modern browsers: Chrome, Firefox, Microsoft Edge, and Safari. |
| NFR-08 | Availability | Application is accessible 24/7 (subject to planned maintenance windows). |

---

## 3. Use Cases → Actors → API Endpoints (Backend Build Checklist)

**Actors:** Registered User, Guest User

| UC | Name | Actor(s) | Auth Required | Endpoint(s) |
|---|---|---|---|---|
| UC-01 | Upload & Analyze Image | Registered User | Optional | `POST /api/images/analyze` |
| UC-02 | User Registration | Registered User (new) | No | `POST /api/auth/register` |
| UC-03 | User Login | Registered User | No | `POST /api/auth/login` |
| UC-04 | View Analysis History | Registered User | Yes | `GET /api/history` |
| UC-05 | Delete History Entry | Registered User | Yes | `DELETE /api/history/:id` |
| UC-06 | Guest Image Analysis | Guest User | No | `POST /api/images/analyze` (no save) |
| UC-07 | Edit / Add Tags | Registered User | Yes | `PUT /api/analyses/:id/tags` |
| UC-08 | Search / Filter History by Tag | Registered User | Yes | `GET /api/history?tag=` |
| UC-09 | Logout | Registered User | Yes | `POST /api/auth/logout` |
| UC-10 | Forgot / Reset Password | Registered User | No | `POST /api/auth/forgot-password`, `POST /api/auth/reset-password` |
| UC-11 | Update Profile | Registered User | Yes | `GET /api/users/profile`, `PUT /api/users/profile` |
| UC-12 | Download / Export Result | Registered User | Yes | `GET /api/analyses/:id/export` |

**Total: 12 use cases.**

---

## 4. Backend Implementation Checklist (map every requirement to a build task)

### Auth module (FR-01, FR-13, FR-14, NFR-03)
- [ ] `POST /api/auth/register` — hash password (bcrypt), enforce unique email
- [ ] `POST /api/auth/login` — verify credentials, issue JWT
- [ ] `POST /api/auth/logout` — invalidate/blacklist token server-side
- [ ] `POST /api/auth/forgot-password` — generate reset token (1hr expiry), email it, always return generic success message
- [ ] `POST /api/auth/reset-password` — verify token + expiry, update passwordHash, clear token
- [ ] JWT middleware — verify `Authorization: Bearer <token>` on all protected routes; reject with 401 on invalid/expired

### Image analysis module (FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-10, NFR-01)
- [ ] `POST /api/images/analyze` — accept multipart upload
- [ ] Validate file type (JPG/PNG only) and size (max 10MB) before processing
- [ ] Call Azure Computer Vision API (server-side only — API key never sent to frontend)
- [ ] Parse response into `tags[]` (label + confidence), `caption`, `confidenceAvg`
- [ ] If JWT present → auto-save result to `analyses` collection; if guest (no JWT) → return result without saving
- [ ] Return clear error messages for: invalid file, oversized file, Azure API failure/timeout, network error
- [ ] Target 3–5 second response time (NFR-01) — consider async/queue if Azure calls are slow

### History module (FR-08, FR-09, FR-11, FR-12)
- [ ] `GET /api/history` — return logged-in user's analyses, most recent first
- [ ] `GET /api/history?tag=<keyword>` — filter by tag label (partial/substring match), empty query = full history
- [ ] `DELETE /api/history/:id` — delete only if entry belongs to the requesting user
- [ ] `PUT /api/analyses/:id/tags` — replace tags array; set `editedByUser: true`; enforce ownership check

### Profile module (FR-01, FR-15)
- [ ] `GET /api/users/profile` — return current user's fullName, email (never passwordHash)
- [ ] `PUT /api/users/profile` — update fullName/email/password (password field optional, only update if provided); re-hash new password

### Export module (FR-16)
- [ ] `GET /api/analyses/:id/export` — generate PDF or JSON of one analysis; enforce ownership check

### Cross-cutting (NFR-02, NFR-03, NFR-05, NFR-06, NFR-07, NFR-08)
- [ ] Deploy on Azure (App Service / VM) for scalability
- [ ] Enforce HTTPS everywhere; store secrets (Azure key, JWT secret, DB connection string) in environment variables / Azure Key Vault
- [ ] Global error handler + server-side logging (e.g., Winston/Morgan) for reliability monitoring
- [ ] Follow MVC folder structure: `controllers/`, `models/`, `routes/`, `middleware/`, `services/` (Azure Vision service isolated in its own module)
- [ ] Test on Chrome, Firefox, Edge, Safari before final delivery
- [ ] Ownership checks on every entry-specific action (edit tags, delete, export) — a user must only touch their own `analyses` documents

---

## 5. Data Model Fields Required (for Mongoose schemas / DB tables)

### User
```
_id, fullName, email (unique), passwordHash, resetToken (nullable),
resetTokenExpiry (nullable), createdAt, updatedAt
```

### Analysis
```
_id, userId (nullable — null for guest, not persisted anyway),
imageUrl, tags: [{ label, confidence }], caption, confidenceAvg,
editedByUser (boolean, default false), createdAt
```

---

## 6. Quick Reference — Nothing Missed Check

- ✅ 16 Functional Requirements (FR-01 to FR-16)
- ✅ 8 Non-Functional Requirements (NFR-01 to NFR-08)
- ✅ 12 Use Cases (UC-01 to UC-12)
- ✅ 2 Actors (Registered User, Guest User)
- ✅ 12 API endpoints
- ✅ 2 data models (User, Analysis)

Build against this list top to bottom — every checkbox in Section 4 corresponds to exactly one FR/NFR/UC above.
