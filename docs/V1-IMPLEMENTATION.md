# Implementation Notes (Day 1)

## Event Flow

Current system:

index.js → Logger.emit() → eventStore.push()

---

## Logger Design

Responsibilities:

- Accept structured events
- Forward events to storage
- Provide access to stored events

Non-responsibilities:

- No analysis
- No transformation
- No business logic

---

## Event Store Design

Simple in-memory storage:

- events stored in array
- supports filtering by traceId

Limitation:

- No ordering guarantee
- No indexing
- No persistence

---

## Current Limitation

System captures events but does NOT:

- connect them into a graph
- model transitions
- detect failures

---

## Key Insight

Events alone are not useful.

System must evolve into:

Event → Graph → Transition → Diff → Failure → RCA

---

## Next Implementation Goal

Introduce:

1. Single trace execution
2. Parent-child span relationships
3. Transition extraction

Example:

[s1, s2, s3, s4] → [(s1→s2), (s2→s3), (s3→s4)]

This becomes the foundation for:

- context diff
- failure detection
