function createRootCauseEngine({ graphStore }) {
  async function analyze(incident) {
    const upstream = await graphStore.traceUpstream(
      incident.project_id,
      incident.target_node_id,
      10,
    );
    const events = await graphStore.getEventsInWindow(
      incident.project_id,
      incident.window_start,
      incident.window_end,
    );

    const topUpstream = upstream.slice(0, 3).map((nodeId, index) => ({
      hypothesis_id: `upstream-${index + 1}`,
      title: `Upstream dependency issue at ${nodeId}`,
      confidence: Math.max(0.5, 0.9 - index * 0.15),
      because: [
        "Dependency path exists from candidate node to incident node",
        "Candidate appears in latest upstream traversal",
      ],
      evidence_path: [nodeId, incident.target_node_id],
      signals: events
        .filter((event) => event.source === nodeId || event.kind.toLowerCase().includes("error"))
        .slice(0, 3)
        .map((event) => ({
          event_id: event.event_id,
          kind: event.kind,
          timestamp: event.timestamp,
        })),
    }));

    if (topUpstream.length > 0) return topUpstream;

    return [
      {
        hypothesis_id: "fallback-1",
        title: "No deterministic upstream candidate found",
        confidence: 0.2,
        because: ["No upstream edges matched within the current graph snapshot"],
        evidence_path: [incident.target_node_id],
        signals: [],
      },
    ];
  }

  return { analyze };
}

module.exports = {
  createRootCauseEngine,
};
