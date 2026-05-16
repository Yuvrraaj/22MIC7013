# Notification System Design

## Overview

A scalable, multi-channel notification system designed for high throughput and reliability. Supports real-time, scheduled, and bulk notifications across email, SMS, push, and in-app channels.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────▶│  API Gateway │────▶│ Auth Service│
│  (Web/App)  │     │  (Load Bal.) │     │   (JWT)     │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │Notification│ │   User    │ │ Preference│
       │  Service   │ │  Service  │ │  Service  │
       └─────┬─────┘ └───────────┘ └───────────┘
             │
             ▼
       ┌───────────┐     ┌───────────┐
       │  Message  │────▶│   Redis   │
       │   Queue   │     │  (Cache)  │
       └─────┬─────┘     └───────────┘
             │
    ┌────────┼────────┬────────┐
    ▼        ▼        ▼        ▼
┌───────┐┌───────┐┌───────┐┌───────┐
│ Email ││  SMS  ││ Push  ││In-App │
│Worker ││Worker ││Worker ││Worker │
└───┬───┘└───┬───┘└───┬───┘└───┬───┘
    │        │        │        │
    ▼        ▼        ▼        ▼
┌───────┐┌───────┐┌───────┐┌───────┐
│SendGrid│Twilio ││ FCM/  ││WebSocket│
│  API  ││  API  ││ APNs  ││ Server │
└───────┘└───────┘└───────┘└───────┘
```

## Components

### 1. API Gateway
- Load balancing (nginx/HAProxy)
- Rate limiting per user/IP
- Request validation
- SSL termination
- API versioning (/v1/notifications)

### 2. Auth Service
- JWT token validation
- API key authentication
- OAuth2 for third-party integrations
- Rate limit enforcement

### 3. Notification Service
- Receives notification requests
- Validates payload and user permissions
- Checks user preferences
- Enqueues to appropriate channel queue
- Handles scheduling for delayed notifications

### 4. Message Queue (Redis/RabbitMQ/Kafka)
- Separate queues per channel: `email_queue`, `sms_queue`, `push_queue`, `in_app_queue`
- Priority queues: `high_priority`, `normal`, `low_priority`
- Dead letter queue for failed messages
- Retry queue with exponential backoff

### 5. Channel Workers
Each worker:
- Polls its respective queue
- Respects rate limits of external providers
- Handles retries with backoff
- Reports delivery status back to DB

### 6. Cache Layer (Redis)
- User preferences cache (TTL: 5 min)
- Device token cache
- Rate limit counters
- Recent notification deduplication

## Data Model

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  priority VARCHAR(10) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'pending',
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_notifications_user_status ON notifications(user_id, status);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_at) WHERE status = 'pending';
```

### Preferences Table
```sql
CREATE TABLE preferences (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  channel VARCHAR(20) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  types TEXT[] DEFAULT '{}',
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  UNIQUE(user_id, channel)
);
```

### Delivery Logs Table
```sql
CREATE TABLE delivery_logs (
  id UUID PRIMARY KEY,
  notification_id UUID REFERENCES notifications(id),
  channel VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  provider_response JSONB,
  attempt_count INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## API Design

### Create Notification
```
POST /v1/notifications
Authorization: Bearer <token>

{
  "userId": "uuid",
  "type": "alert",
  "title": "Security Alert",
  "body": "New login detected from unknown device",
  "priority": "high",
  "channels": ["email", "push"],
  "scheduledAt": "2026-05-17T10:00:00Z"
}
```

### Bulk Notifications
```
POST /v1/notifications/bulk

{
  "userIds": ["uuid1", "uuid2", "..."],
  "template": "welcome_email",
  "variables": { "discount": "20%" },
  "channels": ["email"]
}
```

### Get User Notifications
```
GET /v1/users/:userId/notifications?status=unread&limit=50&cursor=<cursor>
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers behind load balancer
- Multiple worker instances per channel
- Database read replicas for queries

### Queue Partitioning
- Partition by user_id hash for ordering guarantees
- Separate queues for priority levels
- Channel-specific queues for independent scaling

### Caching Strategy
- User preferences: 5-minute TTL
- Template content: 1-hour TTL
- Rate limit counters: sliding window in Redis

### Database Optimization
- Partition notifications table by created_at (monthly)
- Archive old notifications to cold storage
- Use JSONB for flexible metadata

## Reliability

### Retry Strategy
```
Attempt 1: Immediate
Attempt 2: 30 seconds
Attempt 3: 2 minutes
Attempt 4: 10 minutes
Attempt 5: 1 hour
→ Move to dead letter queue
```

### Circuit Breaker
- Per-provider circuit breakers
- Open after 5 consecutive failures
- Half-open after 30 seconds
- Close after 3 successful requests

### Idempotency
- Client-provided idempotency key
- Deduplication window: 24 hours
- Hash of (userId + type + title + body) as fallback

## Monitoring & Observability

### Metrics (Prometheus)
- `notifications_sent_total{channel, priority, status}`
- `notification_delivery_latency_seconds`
- `queue_depth{channel}`
- `provider_errors_total{provider, error_type}`

### Alerts
- Queue depth > 10000 for > 5 minutes
- Delivery success rate < 95%
- Provider error rate > 5%
- Worker lag > 60 seconds

### Logging (ELK Stack)
- Structured JSON logs
- Correlation IDs across services
- Request/response logging (PII redacted)

## Security

### Data Protection
- Encrypt PII at rest (AES-256)
- TLS 1.3 for all connections
- Mask sensitive data in logs

### Access Control
- API key scopes (read, write, admin)
- Rate limiting per key
- IP allowlisting for webhooks

### Compliance
- GDPR: Right to deletion, data export
- Audit logs for all admin actions
- Consent tracking for marketing notifications

## Tech Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| API | Node.js/Express or Go | High throughput, async I/O |
| Queue | Redis Streams or Kafka | Durability, ordering |
| Cache | Redis | Low latency, TTL support |
| Database | PostgreSQL | ACID, JSONB, partitioning |
| Email | SendGrid/SES | Deliverability, analytics |
| SMS | Twilio | Global reach, reliability |
| Push | FCM/APNs | Native platform support |
| Monitoring | Prometheus + Grafana | Industry standard |
| Logging | ELK Stack | Full-text search, visualization |

## Future Enhancements

1. **Template Engine**: Support for dynamic templates with variables
2. **A/B Testing**: Test notification copy effectiveness
3. **Smart Scheduling**: ML-based optimal send time per user
4. **Digest Mode**: Batch low-priority notifications
5. **Rich Media**: Support for images, buttons in push/email
6. **Webhooks**: Notify external systems of delivery events
7. **Analytics Dashboard**: Open rates, click rates, engagement metrics
