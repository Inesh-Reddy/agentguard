const {
  validateIncidentRequest,
} = require("../../../../packages/contracts/src");

async function runRootCauseAnalysis(rootCauseEngine, payload) {
  const incident = validateIncidentRequest(payload);
  const hypotheses = await rootCauseEngine.analyze(incident);

  return {
    incident: {
      project_id: incident.project_id,
      target_node_id: incident.target_node_id,
      window_start: incident.window_start,
      window_end: incident.window_end,
    },
    hypotheses,
  };
}

module.exports = {
  runRootCauseAnalysis,
};
