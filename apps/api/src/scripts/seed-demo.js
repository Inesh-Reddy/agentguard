const BASE_URL = process.env.AGENTGUARD_API_URL || "http://localhost:3001";

async function post(path, payload) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let data = text;
  try {
    data = JSON.parse(text);
  } catch {
    // Keep raw text if non-JSON response is returned.
  }

  if (!response.ok) {
    throw new Error(`POST ${path} failed (${response.status}): ${text}`);
  }

  return data;
}

async function main() {
  const now = new Date();
  const nowIso = now.toISOString();
  const startIso = new Date(now.getTime() - 5 * 60 * 1000).toISOString();
  const endIso = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

  console.log(`Seeding demo data into ${BASE_URL}`);

  await post("/v1/ingest/events", {
    event_id: "evt_demo_1",
    project_id: "default",
    timestamp: nowIso,
    source: "api_fail",
    kind: "error",
    payload: { message: "User API returned empty" },
    schema_version: "1.0.0",
    idempotency_key: "idem_evt_demo_1",
  });

  await post("/v1/ingest/edges", {
    edge_id: "edge_demo_1",
    project_id: "default",
    from: "api_fail",
    to: "worker",
    relation: "causes",
    timestamp: nowIso,
    idempotency_key: "idem_edge_demo_1",
  });

  const result = await post("/v1/incidents/root-cause", {
    project_id: "default",
    target_node_id: "worker",
    window_start: startIso,
    window_end: endIso,
  });

  console.log("\nRoot cause result:\n");
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
