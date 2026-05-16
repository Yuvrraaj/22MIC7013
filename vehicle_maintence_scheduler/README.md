# Vehicle Maintenance Scheduler

REST API for managing vehicles and their maintenance schedules.

## Setup

```bash
bun install
cp .env.example .env
# Edit .env with your credentials
bun dev
```

## API Endpoints

### Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /vehicles | List all vehicles |
| GET | /vehicles/:id | Get vehicle by ID |
| POST | /vehicles | Create vehicle |
| PUT | /vehicles/:id | Update vehicle |
| DELETE | /vehicles/:id | Delete vehicle |
| GET | /vehicles/:id/maintenance | Get maintenance for vehicle |

### Maintenance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /maintenance | List all records |
| GET | /maintenance/upcoming?days=7 | Get upcoming maintenance |
| GET | /maintenance/:id | Get record by ID |
| POST | /maintenance | Create maintenance record |
| PUT | /maintenance/:id | Update record |
| DELETE | /maintenance/:id | Delete record |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Server health status |

## Request/Response Examples

### Create Vehicle
```json
POST /vehicles
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "plate": "ABC123",
  "ownerId": "user-001"
}
```

### Create Maintenance
```json
POST /maintenance
{
  "vehicleId": "uuid",
  "type": "oil_change",
  "desc": "Regular oil change",
  "scheduledAt": "2026-05-20T10:00:00Z",
  "notes": "Use synthetic oil"
}
```

### Maintenance Types
- `oil_change`
- `tire_rotation`
- `brake_inspection`
- `engine_tune`
- `transmission`
- `battery`
- `other`

### Maintenance Status
- `scheduled`
- `in_progress`
- `completed`
- `cancelled`

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
