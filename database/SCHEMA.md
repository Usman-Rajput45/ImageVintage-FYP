# VisionTag — Database (MongoDB)

Database name: `visiontag` (local: `mongodb://127.0.0.1:27017/visiontag`). Managed with Mongoose; collections and indexes are created automatically the first time the backend runs, so an empty database is a valid starting point.

## Collections

### `users`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `fullName` | String | required, max 100 |
| `email` | String | required, **unique**, lowercase |
| `passwordHash` | String | bcrypt hash, `select:false` (never returned by queries) |
| `resetToken` | String / null | hashed reset token, `select:false` |
| `resetTokenExpiry` | Date / null | reset link valid for 1 hour |
| `createdAt`, `updatedAt` | Date | automatic timestamps |

### `analyses`
| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | primary key |
| `userId` | ObjectId → `users._id` | owner; indexed. Guest analyses are never saved (FR-10) |
| `fileName` | String | original file name |
| `imageUrl` | String | URL of the stored image (`/uploads/...`) |
| `tags` | Array of `{ label: String, confidence: Number 0–100 }` | |
| `caption` | String | AI generated caption |
| `confidenceAvg` | Number | average tag confidence (0–100) |
| `editedByUser` | Boolean | `true` after tags are edited (FR-11) |
| `createdAt`, `updatedAt` | Date | automatic timestamps |

Indexes: `{ userId: 1, createdAt: -1 }` (history listing), text index on `tags.label`.

### `blacklistedtokens`
| Field | Type | Notes |
|---|---|---|
| `token` | String | JWT invalidated by logout (FR-13), **unique** |
| `expiresAt` | Date | TTL index (`expireAfterSeconds: 0`) removes the document automatically when the JWT would have expired |

## Relationships
`users` 1 — N `analyses` (via `analyses.userId`). `blacklistedtokens` is standalone.

## Backup / restore (for submission)
```bash
# export your current data (run on the machine that has your MongoDB data)
./database/export-db.sh          # creates database/dump/visiontag/*.bson

# restore on another machine
./database/import-db.sh
```
Requires the MongoDB Database Tools (`mongodump` / `mongorestore`).
