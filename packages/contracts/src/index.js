function assertRequired(input, fields, entityName) {
  for (const field of fields) {
    if (input[field] === undefined || input[field] === null || input[field] === "") {
      throw new Error(`${entityName}.${field} is required`);
    }
  }
}

function validateEvent(input) {
  assertRequired(
    input,
    ["event_id", "project_id", "timestamp", "source", "kind", "schema_version"],
    "event",
  );
  return {
    event_id: String(input.event_id),
    project_id: String(input.project_id),
    timestamp: String(input.timestamp),
    source: String(input.source),
    kind: String(input.kind),
    payload: input.payload || {},
    schema_version: String(input.schema_version),
    idempotency_key: input.idempotency_key ? String(input.idempotency_key) : null,
  };
}

function validateEdge(input) {
  assertRequired(
    input,
    ["edge_id", "project_id", "from", "to", "relation", "timestamp"],
    "edge",
  );
  return {
    edge_id: String(input.edge_id),
    project_id: String(input.project_id),
    from: String(input.from),
    to: String(input.to),
    relation: String(input.relation),
    timestamp: String(input.timestamp),
    idempotency_key: input.idempotency_key ? String(input.idempotency_key) : null,
  };
}

function validateIncidentRequest(input) {
  assertRequired(
    input,
    ["project_id", "target_node_id", "window_start", "window_end"],
    "incident",
  );
  return {
    project_id: String(input.project_id),
    target_node_id: String(input.target_node_id),
    window_start: String(input.window_start),
    window_end: String(input.window_end),
  };
}

module.exports = {
  validateEvent,
  validateEdge,
  validateIncidentRequest,
};
