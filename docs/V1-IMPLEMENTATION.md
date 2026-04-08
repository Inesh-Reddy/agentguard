# AgentGuard V1 Implementation Guide

This guide documents the V1 scaffold:

- Main server (`apps/api`)
- SDK core (`packages/sdk-core`)
- Graph store (`packages/graph-store`)
- Root cause engine (`packages/root-cause-engine`)
- Shared contracts (`packages/contracts`)

## Run API locally

From repo root:

```sh
pnpm --filter api dev
```

Default server URL: `http://localhost:3001`

Health check:

```sh
curl -s http://localhost:3001/health | jq
```

## One-command demo seed

With API running, seed demo data and print a root-cause response:

```sh
pnpm --filter api seed-demo
```

Optional custom API URL:

```sh
AGENTGUARD_API_URL="http://localhost:3001" pnpm --filter api seed-demo
```

## API contracts (current V1)

### POST `/v1/ingest/events`

Request body:

```json
{
  "event_id": "evt_1",
  "project_id": "default",
  "timestamp": "2026-04-08T10:00:00.000Z",
  "source": "api_fail",
  "kind": "error",
  "payload": { "message": "User API returned empty" },
  "schema_version": "1.0.0",
  "idempotency_key": "idem_evt_1"
}
```

Response:

```json
{
  "accepted": true,
  "event_id": "evt_1"
}
```

### POST `/v1/ingest/edges`

Request body:

```json
{
  "edge_id": "edge_1",
  "project_id": "default",
  "from": "api_fail",
  "to": "worker",
  "relation": "causes",
  "timestamp": "2026-04-08T10:00:01.000Z",
  "idempotency_key": "idem_edge_1"
}
```

Response:

```json
{
  "accepted": true,
  "edge_id": "edge_1"
}
```

### GET `/v1/graph/neighbors/:nodeId`

Example:

```sh
curl -s "http://localhost:3001/v1/graph/neighbors/api_fail" | jq
```

Response:

```json
{
  "node_id": "api_fail",
  "neighbors": ["worker"]
}
```

### POST `/v1/incidents/root-cause`

Request body:

```json
{
  "project_id": "default",
  "target_node_id": "worker",
  "window_start": "2026-04-08T09:55:00.000Z",
  "window_end": "2026-04-08T10:05:00.000Z"
}
```

Response shape:

```json
{
  "incident": {
    "project_id": "default",
    "target_node_id": "worker",
    "window_start": "2026-04-08T09:55:00.000Z",
    "window_end": "2026-04-08T10:05:00.000Z"
  },
  "hypotheses": [
    {
      "hypothesis_id": "upstream-1",
      "title": "Upstream dependency issue at api_fail",
      "confidence": 0.9,
      "because": [
        "Dependency path exists from candidate node to incident node",
        "Candidate appears in latest upstream traversal"
      ],
      "evidence_path": ["api_fail", "worker"],
      "signals": [
        {
          "event_id": "evt_1",
          "kind": "error",
          "timestamp": "2026-04-08T10:00:00.000Z"
        }
      ]
    }
  ]
}
```

## End-to-end curl flow

Run these in order:

```sh
curl -s -X POST "http://localhost:3001/v1/ingest/events" \
  -H "Content-Type: application/json" \
  -d '{
    "event_id":"evt_1",
    "project_id":"default",
    "timestamp":"2026-04-08T10:00:00.000Z",
    "source":"api_fail",
    "kind":"error",
    "payload":{"message":"User API returned empty"},
    "schema_version":"1.0.0",
    "idempotency_key":"idem_evt_1"
  }' | jq

curl -s -X POST "http://localhost:3001/v1/ingest/edges" \
  -H "Content-Type: application/json" \
  -d '{
    "edge_id":"edge_1",
    "project_id":"default",
    "from":"api_fail",
    "to":"worker",
    "relation":"causes",
    "timestamp":"2026-04-08T10:00:01.000Z",
    "idempotency_key":"idem_edge_1"
  }' | jq

curl -s "http://localhost:3001/v1/graph/neighbors/api_fail" | jq

curl -s -X POST "http://localhost:3001/v1/incidents/root-cause" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id":"default",
    "target_node_id":"worker",
    "window_start":"2026-04-08T09:55:00.000Z",
    "window_end":"2026-04-08T10:05:00.000Z"
  }' | jq
```

## Ticket checklist (V1)

### Ticket 1: Shared contracts

- [x] Create validators in `packages/contracts/src/index.js`
- [x] Validate event payload required fields
- [x] Validate edge payload required fields
- [x] Validate incident request required fields
- [ ] Add schema version migration strategy for future versions

### Ticket 2: Main server (modular API)

- [x] Refactor into routes/services/adapters under `apps/api/src`
- [x] Add health route
- [x] Add ingest events route
- [x] Add ingest edges route
- [x] Add root cause route
- [x] Add graph neighbors route
- [ ] Add auth and project-level authorization

### Ticket 3: SDK core

- [x] Add `createClient` in `packages/sdk-core/src/index.js`
- [x] Add in-memory queue
- [x] Add batch flush on size/interval
- [ ] Add retry with exponential backoff
- [ ] Add graceful flush on process shutdown hooks

### Ticket 4: Graph store

- [x] Add in-memory event and edge upsert
- [x] Add idempotency key dedupe
- [x] Add neighbors query
- [x] Add upstream trace query
- [x] Add event window query
- [ ] Swap storage backend to Postgres/SQLite

### Ticket 5: Root cause engine

- [x] Add deterministic upstream-based analysis
- [x] Return top hypotheses with confidence
- [x] Return explainability fields (`because`, `evidence_path`, `signals`)
- [ ] Add richer scoring features (temporal weighting, fan-out impact)
- [ ] Add benchmark tests for ranking quality

## File map

- `apps/api/src/index.js`: server bootstrap and routing entrypoint
- `apps/api/src/routes`: API route handlers
- `apps/api/src/services`: business logic for ingestion/incidents
- `apps/api/src/adapters/http.js`: HTTP utility helpers
- `packages/contracts/src/index.js`: shared payload validation
- `packages/graph-store/src/index.js`: in-memory graph/event store
- `packages/root-cause-engine/src/index.js`: root-cause analysis logic
- `packages/sdk-core/src/index.js`: SDK capture/flush transport client

