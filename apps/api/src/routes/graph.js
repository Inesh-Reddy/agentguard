const { sendJson } = require("../adapters/http");

async function handleGraphRoutes(req, res, deps) {
  if (req.method === "GET" && req.url.startsWith("/v1/graph/neighbors/")) {
    const nodeId = req.url.replace("/v1/graph/neighbors/", "");
    const projectId = "default";
    const neighbors = await deps.graphStore.getNeighbors(projectId, nodeId);
    sendJson(res, 200, { node_id: nodeId, neighbors });
    return true;
  }

  return false;
}

module.exports = {
  handleGraphRoutes,
};
