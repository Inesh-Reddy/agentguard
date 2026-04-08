function createGraphStore() {
  const events = [];
  const edges = [];
  const idempotencyKeys = new Set();

  async function upsertEvent(event) {
    if (event.idempotency_key && idempotencyKeys.has(event.idempotency_key)) return;
    if (event.idempotency_key) idempotencyKeys.add(event.idempotency_key);
    const existing = events.find((item) => item.event_id === event.event_id);
    if (existing) return;
    events.push(event);
  }

  async function upsertEdge(edge) {
    if (edge.idempotency_key && idempotencyKeys.has(edge.idempotency_key)) return;
    if (edge.idempotency_key) idempotencyKeys.add(edge.idempotency_key);
    const existing = edges.find((item) => item.edge_id === edge.edge_id);
    if (existing) return;
    edges.push(edge);
  }

  async function getNeighbors(projectId, nodeId) {
    return edges
      .filter((edge) => edge.project_id === projectId && edge.from === nodeId)
      .map((edge) => edge.to);
  }

  async function traceUpstream(projectId, nodeId, maxDepth = 10) {
    const trail = [];
    let current = nodeId;
    let depth = 0;

    while (depth < maxDepth) {
      const parent = edges.find(
        (edge) => edge.project_id === projectId && edge.to === current,
      );
      if (!parent) break;
      trail.push(parent.from);
      current = parent.from;
      depth += 1;
    }

    return trail;
  }

  async function getEventsInWindow(projectId, startIso, endIso) {
    const startMs = Date.parse(startIso);
    const endMs = Date.parse(endIso);
    return events.filter((event) => {
      if (event.project_id !== projectId) return false;
      const ts = Date.parse(event.timestamp);
      return ts >= startMs && ts <= endMs;
    });
  }

  return {
    upsertEvent,
    upsertEdge,
    getNeighbors,
    traceUpstream,
    getEventsInWindow,
  };
}

module.exports = {
  createGraphStore,
};
