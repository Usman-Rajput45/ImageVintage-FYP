# Functional Requirements — ImageAI Tagger

> Source: CS619 Design Document v1.1 (Use Case Diagram + Sequence Diagrams). Business/functional rules only — no styling.

---

## 1. Auth & Access Rules

- **Guest access allowed for:** Upload & Analyze Image only (UC-01/UC-06).
- **Everything else requires login:** History, Edit Tags, Search/Filter History, Delete Entry, Download/Export, Update Profile, Logout.
- Guest analysis results are **not saved** — no history entry is created if the user isn't logged in.
- On login, store JWT client-side; send it as `Authorization: Bearer <token>` on every protected request.
- On any `401` response, clear the stored token and redirect to Login.
- Logout must clear the JWT client-side and invalidate the session server-side (`POST /api/auth/logout`), then redirect to Home.

## 2. UC-01 / UC-06 — Upload & Analyze Image

- Accept only **JPG/PNG**, max **10MB** — validate on the client before upload.
- On submit: `POST /api/images/analyze` (multipart).
- Response contains: `tags[]` (label + confidence), `caption`, `confidenceAvg`.
- If user is logged in → result is auto-saved to history.
- If user is a guest → result is shown but not persisted; no "Save" happens automatically.
- If logged in and result wasn't auto-saved for some reason, allow explicit "Save Result" action.

## 3. UC-02 — User Registration

- Fields: Full Name, Email, Password.
- Email must be unique (server enforces; surface the server's duplicate-email error to the user).

## 4. UC-03 — User Login

- Fields: Email, Password.
- On success, receive and store JWT; redirect to History (or wherever the user was headed).

## 5. UC-04 — View Analysis History

- Logged-in only.
- Fetch and list all of the user's past analyses, most recent first.
- Each entry shows enough to identify it (thumbnail/caption/tags/date) — exact display already exists in your UI.

## 6. UC-05 — Delete History Entry

- Logged-in only, and only for entries owned by that user.
- Confirm before delete (avoid accidental deletion) — optional but recommended.
- `DELETE /api/history/:id` → remove from list on success.

## 7. UC-07 — Edit / Add Tags

- Logged-in only, and only on the user's own analysis.
- User can edit an existing tag's label, add a new tag, or remove a tag.
- On save: `PUT /api/analyses/:id/tags` with the full updated tags array.
- After a manual edit, the entry must be flagged as **user-edited** (`editedByUser: true`) so it's distinguishable from AI-generated tags going forward.

## 8. UC-08 — Search / Filter History by Tag

- Logged-in only.
- Search input filters the user's history by tag keyword (partial/substring match expected).
- `GET /api/history?tag=<keyword>`.
- Empty search = show full history.
- No matches → show an empty/no-results state.

## 9. UC-09 — Logout

- Clear JWT from client storage.
- Call `POST /api/auth/logout` to invalidate the session server-side.
- Redirect to Home/Login.

## 10. UC-10 — Forgot / Reset Password

- **Forgot Password:** user submits email → `POST /api/auth/forgot-password`. Always show a generic success message (don't reveal whether the email exists, for security).
- Reset link/token is emailed to the user (backend concern) and expires after **1 hour**.
- **Reset Password:** user opens link with token → submits new password → `POST /api/auth/reset-password` with `{ token, newPassword }`.
- After successful reset, redirect to Login.
- Handle expired/invalid token with a clear error state.

## 11. UC-11 — Update Profile

- Logged-in only.
- Editable: Full Name, Email, Password (password field optional — only send if the user is changing it).
- If email is changed, note it may require re-verification (server-driven — just surface whatever message the API returns).
- Validate "Confirm New Password" matches "New Password" client-side before submitting.

## 12. UC-12 — Download / Export Result

- Logged-in only, and only for the user's own analysis (also allowed for a guest's own unsaved result directly from the Results page, per the diagram — confirm with backend whether guest export is supported).
- `GET /api/analyses/:id/export` → triggers a file download (PDF/JSON).

---

## 13. Cross-cutting Rules

- **Ownership checks:** Edit Tags, Delete Entry, and Download must only work on analyses belonging to the logged-in user — assume the backend enforces this, but don't expose these actions in the UI for entries that aren't the user's own (shouldn't happen anyway since history is scoped to the logged-in user).
- **Session expiry:** if a protected call fails with 401 mid-session, don't just fail silently — bounce to Login so the user knows why.
- **Distinguish AI-generated vs user-edited tags** wherever tags are displayed, per UC-07.
