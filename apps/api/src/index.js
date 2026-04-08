const nodes = {};
const edges = [];

function createNode(id, type, data) {
  nodes[id] = { id, type, data };
}

function link(from, to) {
  edges.push({ from, to });
}

function trace(nodeId, path = []) {
  path.push(nodeId);

  const parents = edges.filter((e) => e.to === nodeId).map((e) => e.from);

  if (parents.length === 0) return path;

  return trace(parents[0], path);
}

createNode("api_fail", "event", "User API returned empty");

createNode("tool_output", "data", "[] (no users)");
link("api_fail", "tool_output");

createNode("llm_decision", "step", "All users inactive");
link("tool_output", "llm_decision");

createNode("worker", "step", "Deleting users");
link("llm_decision", "worker");

createNode("db_delete", "action", "DELETE", "FROM users");
link("worker", "db_delete");

const result = trace("db_delete");

console.log(`\n 🔎 Root Cause Trace: \n`);

result.reverse().forEach((id) => {
  const node = nodes[id];
  console.log(`-> [${node.type}] ${node.data}`);
});
