const {
  validateEvent,
  validateEdge,
} = require("../../../../packages/contracts/src");

async function ingestEvent(graphStore, payload) {
  const event = validateEvent(payload);
  await graphStore.upsertEvent(event);
  return { accepted: true, event_id: event.event_id };
}

async function ingestEdge(graphStore, payload) {
  const edge = validateEdge(payload);
  await graphStore.upsertEdge(edge);
  return { accepted: true, edge_id: edge.edge_id };
}

module.exports = {
  ingestEvent,
  ingestEdge,
};
