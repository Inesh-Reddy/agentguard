# Day 0

- Setup Turborepo
- Created base folder structure
- Added docs system (context, progress, architecture, tasks)
- Defined project direction

---

# Day 1

## What I Built

- Logger class with:
  - emit(event)
  - getAll()
- Event schema:
  - traceId
  - spanId
  - parentSpanId
  - stepType
  - stepName
  - status
  - input/output/context
- In-memory event store:
  - push()
  - getByTraceId()

## Improvements Made

- Refactored logger (separation of concerns)
- Added structured event metadata (timestamp, eventId)
- Introduced trace-based querying

## Problems Identified

- Events are not part of a single execution (wrong trace usage)
- No parent-child chain yet
- No transition modeling
- Test data too trivial (not realistic)

## Key Learnings

- Logging ≠ system understanding
- Need to think in execution graphs, not events
- Trace consistency is critical

## Next Focus

- Build a single trace with multiple steps
- Add parent-child relationships
- Simulate real agent flow
- Start thinking in transitions (step → step)
