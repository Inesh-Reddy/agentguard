const http = require("node:http");
const { createGraphStore } = require("../../../packages/graph-store/src");
const { createRootCauseEngine } = require("../../../packages/root-cause-engine/src");
const { handleIngestRoutes } = require("./routes/ingest");
const { handleGraphRoutes } = require("./routes/graph");
const { handleIncidentRoutes } = require("./routes/incidents");

const PORT = process.env.PORT || 3001;
const graphStore = createGraphStore();
const rootCauseEngine = createRootCauseEngine({ graphStore });

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/health" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "agentguard-api-v1" }));
      return;
    }

    if (await handleIngestRoutes(req, res, { graphStore })) return;
    if (await handleGraphRoutes(req, res, { graphStore })) return;
    if (await handleIncidentRoutes(req, res, { rootCauseEngine })) return;

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not Found" }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message || "Internal Server Error" }));
  }
});

server.listen(PORT, () => {
  console.log(`AgentGuard API listening on http://localhost:${PORT}`);
});
