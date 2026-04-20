# Current Tasks (Day 2 Focus)

## MUST DO

### 1. Build a Real Execution Trace

- Same traceId for all steps
- Create 4-step flow:
  - retrieve_docs
  - memory_store
  - tool_call
  - generate_answer

---

### 2. Add Parent-Child Relationships

- s1 → s2 → s3 → s4

---

### 3. Improve Test Data

- Replace dummy data with realistic flow
- Simulate missing context (failure case)

---

### 4. Improve Event Store

- Ensure ordered retrieval (sort by timestamp or sequence)

---

### 5. Add Event Validation

- Validate traceId, spanId
- Prevent invalid events

---

## SHOULD DO

- Add sequence number to events
- Add stepType variations (llm_call, tool_call, memory)

---

## DO NOT DO YET

- No database
- No Kafka
- No frontend
- No TypeScript (until refactor day)
