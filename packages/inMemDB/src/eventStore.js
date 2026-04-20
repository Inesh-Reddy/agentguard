export const eventStore = {
  events: [],

  push(event) {
    this.events.push(event);
  },

  getByTraceId(traceId) {
    return this.events
      .filter((e) => e.traceId === traceId)
      .sort((a, b) => a.timestamp - b.timestamp);
  },
};
