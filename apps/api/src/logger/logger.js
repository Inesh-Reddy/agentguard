import { eventStore } from "@repo/inmemdb";

export class Logger {
  emit(event) {
    if (!event.traceId || !event.spanId) {
      throw new Error("Invalid event: missing trace/span");
    }

    eventStore.push(event);
  }

  print(event) {
    console.log(JSON.stringify(event, null, 2));
  }

  getAll() {
    return eventStore.events;
  }
}
