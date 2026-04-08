const { parseJsonBody, sendJson } = require("../adapters/http");
const { runRootCauseAnalysis } = require("../services/incidents");

async function handleIncidentRoutes(req, res, deps) {
  if (req.method === "POST" && req.url === "/v1/incidents/root-cause") {
    const body = await parseJsonBody(req);
    const result = await runRootCauseAnalysis(deps.rootCauseEngine, body);
    sendJson(res, 200, result);
    return true;
  }

  return false;
}

module.exports = {
  handleIncidentRoutes,
};
