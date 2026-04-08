const { parseJsonBody, sendJson } = require("../adapters/http");
const { ingestEvent, ingestEdge } = require("../services/ingestion");

async function handleIngestRoutes(req, res, deps) {
  if (req.method === "POST" && req.url === "/v1/ingest/events") {
    const body = await parseJsonBody(req);
    const result = await ingestEvent(deps.graphStore, body);
    sendJson(res, 202, result);
    return true;
  }

  if (req.method === "POST" && req.url === "/v1/ingest/edges") {
    const body = await parseJsonBody(req);
    const result = await ingestEdge(deps.graphStore, body);
    sendJson(res, 202, result);
    return true;
  }

  return false;
}

module.exports = {
  handleIngestRoutes,
};
