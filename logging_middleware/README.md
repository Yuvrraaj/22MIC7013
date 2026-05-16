# Logging Middleware

Reusable logging package for backend/frontend applications.

## Setup

1. Copy `.env.example` to `.env` and fill in credentials
2. Import and use `Log()` function

## Usage

```typescript
import { Log } from './logging_middleware';

// Async (recommended for critical logs)
await Log('backend', 'info', 'handler', 'GET /vehicles invoked — userId: u123');

// Fire-and-forget (won't block execution)
LogSync('backend', 'error', 'db', 'Connection timeout — retrying in 5s');
```

## Features

- Token caching (only refreshes on expiry)
- Input validation (rejects invalid stack/level/package)
- Retry logic (3 retries with backoff for 5xx errors)
- Timeout handling (5s default)
- Graceful failure (never crashes main app)

## Allowed Values

### stack
- `backend`
- `frontend`

### level
- `debug`, `info`, `warn`, `error`, `fatal`

### package (backend)
- `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`
- Plus shared: `auth`, `config`, `middleware`, `utils`

### package (frontend)
- `api`, `component`, `hook`, `page`, `state`, `style`
- Plus shared: `auth`, `config`, `middleware`, `utils`
