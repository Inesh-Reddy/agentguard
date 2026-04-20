import { eventStore } from "@repo/inmemdb";
import { Logger } from "./logger/logger.js";

const logger = new Logger();

const TraceId = `traceId-event-${crypto.randomUUID()}`;
const event1 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: TraceId,
  spanId: `spanId-event1-${crypto.randomUUID()}`,
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "retrieve_docs",
  status: "success",
  input: { user: "bob" },
  output: { docs: ["doc1", "doc2"] },
  context: {},
  error: null,
};
const event2 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: TraceId,
  spanId: `spanId-event2-${crypto.randomUUID()}`,
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "store_memory",
  status: "success",
  input: { docs: ["doc1", "doc2"] },
  output: { memoryStored: true },
  context: {},
  error: null,
};
const event3 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: TraceId,
  spanId: `spanId-event3-${crypto.randomUUID()}`,
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "tool_call",
  status: "success",
  input: { userQuery: "Where are docs?", docs: ["doc1", "doc2"] },
  output: {},
  context: {},
  error: null,
};
const event4 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: TraceId,
  spanId: `spanId-event4-${crypto.randomUUID()}`,
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "generate_answer",
  status: "success",
  input: { userQuery: "Where are docs?" },
  output: {},
  context: {},
  error: null,
};

logger.emit(event1);
logger.emit(event2);
logger.emit(event3);
logger.emit(event4);

// console.log(logger.getAll());
console.log("traceId: ");

console.log(eventStore.getByTraceId(TraceId));
