# AgentGuard

## Goal

Build a reliability engine for AI agents that explains failures across multi-step executions.

## Core Idea

Model agent executions as graphs and track:

- Data lineage
- Context propagation
- Step transitions

Then detect failures and generate structured root-cause explanations (RCA).

## Current Stage

Day 1 — Event Ingestion + Basic Logging

## What is Built

- Structured event schema (traceId, spanId, parentSpanId, etc.)
- Logger abstraction (emit, getAll)
- In-memory event store
- Basic event ingestion working

## What is NOT Built Yet

- Execution graph
- Context diff engine
- Failure classification
- RCA engine

## Mental Model

Failure is NOT at a step.

Failure happens in:

> transition between steps

System focus:

Event → Transition → Diff → Failure → RCA

## Tech Decisions

- JavaScript first → TypeScript during refactor phases
- No external libraries (build from first principles)
- In-memory storage initially
- Turborepo for modular growth

## Constraints

- No premature optimization
- No infra (DB, Kafka, etc.) until needed
