# AgentGuard Architecture (Early Stage)

## Current Architecture

Logger → Event Store

## Components

### 1. Logger

Responsible for:

- Emitting structured events
- Acting as ingestion layer

Methods:

- emit(event)
- getAll()

---

### 2. Event Store (In-Memory)

Responsible for:

- Storing events
- Querying events by traceId

Methods:

- push(event)
- getByTraceId(traceId)

---

## Data Model (Event)

Each event represents a step in execution:

- traceId → execution
- spanId → step
- parentSpanId → relationship
- input/output/context → state snapshot

---

## Missing Components (Next Phase)

### 1. Execution Graph

- Build graph from events
- Connect spans via parentSpanId

### 2. Transition Layer

- Model step-to-step relationships
- Extract transitions:
  - (s1 → s2)
  - (s2 → s3)

### 3. Context Diff Engine

- Compare context between steps
- Detect:
  - missing keys
  - added keys
  - modified values

### 4. Failure Classifier

- context_loss
- tool_error
- hallucination (later)

### 5. RCA Engine

- Identify root cause span
- Provide structured explanation
