# Notification App Backend

REST API for managing notifications, users, and preferences.

## Setup

```bash
bun install
cp .env.example .env
# Edit .env with your credentials
bun dev
```

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List all users |
| GET | /users/:id | Get user by ID |
| POST | /users | Create user |
| DELETE | /users/:id | Delete user |
| GET | /users/:userId/notifications | Get user's notifications |
| GET | /users/:userId/notifications/unread | Get unread notifications |
| POST | /users/:userId/notifications/read-all | Mark all as read |
| GET | /users/:userId/preferences | Get user's preferences |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /notifications | List all notifications |
| GET | /notifications/:id | Get notification by ID |
| POST | /notifications | Create notification |
| POST | /notifications/bulk | Bulk create notifications |
| PUT | /notifications/:id | Update notification |
| POST | /notifications/:id/read | Mark as read |
| DELETE | /notifications/:id | Delete notification |

### Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /preferences | Create preference |
| PUT | /preferences/:id | Update preference |
| DELETE | /preferences/:id | Delete preference |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Server health status |

## Request/Response Examples

### Create User
```json
POST /users
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Create Notification
```json
POST /notifications
{
  "userId": "uuid",
  "type": "info",
  "title": "Welcome!",
  "body": "Thanks for signing up",
  "priority": "medium"
}
```

### Bulk Notifications
```json
POST /notifications/bulk
{
  "userIds": ["uuid1", "uuid2"],
  "type": "promo",
  "title": "Sale!",
  "body": "50% off today",
  "priority": "high"
}
```

### Create Preference
```json
POST /preferences
{
  "userId": "uuid",
  "channel": "email",
  "enabled": true,
  "types": ["info", "alert"]
}
```

## Enum Values

### Notification Type
- `info`
- `warning`
- `alert`
- `promo`
- `system`

### Priority
- `low`
- `medium`
- `high`
- `urgent`

### Status
- `pending`
- `sent`
- `delivered`
- `read`
- `failed`

### Channel
- `email`
- `sms`
- `push`
- `in_app`

## Architecture

```
src/
├── config/         # Environment configuration
├── controllers/    # Request handlers
├── middleware/     # Express middleware
├── repository/     # Data access (in-memory)
├── routes/         # Route definitions
├── services/       # Business logic
├── types/          # TypeScript types
└── utils/          # Utilities (logging)
```
