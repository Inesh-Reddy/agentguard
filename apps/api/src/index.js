import { eventStore } from "@repo/inmemdb";
import { Logger } from "./logger/logger.js";

const logger = new Logger();

const event1 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: "t1",
  spanId: "s1",
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "generate_response",
  status: "success",
  input: { user: "bob" },
  output: { user: "bill" },
  context: {},
  error: null,
};
const event2 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: "t1",
  spanId: "s1",
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "generate_response",
  status: "success",
  input: { user: "bob" },
  output: { user: "bill" },
  context: {},
  error: null,
};
const event3 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: "t1",
  spanId: "s1",
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "generate_response",
  status: "success",
  input: { user: "bob" },
  output: { user: "bill" },
  context: {},
  error: null,
};
const event4 = {
  eventId: crypto.randomUUID(),
  timestamp: Date.now(),
  traceId: "t1",
  spanId: "s1",
  parentSpanId: null,
  stepType: "llm_call",
  stepName: "generate_response",
  status: "success",
  input: { user: "bob" },
  output: { user: "bill" },
  context: {},
  error: null,
};

logger.emit(event1);
logger.emit(event2);
logger.emit(event3);
logger.emit(event4);

console.log(logger.getAll());
