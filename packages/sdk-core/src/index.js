async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed ${response.status}: ${body}`);
  }
}

function createClient(config) {
  const endpoint = config.endpoint;
  const batchSize = config.batchSize || 20;
  const flushIntervalMs = config.flushIntervalMs || 2000;
  const queue = [];
  let timer = null;

  async function flush() {
    if (queue.length === 0) return;
    const batch = queue.splice(0, batchSize);
    for (const event of batch) {
      await postJson(`${endpoint}/v1/ingest/events`, event);
    }
  }

  async function capture(event) {
    queue.push(event);
    if (queue.length >= batchSize) {
      await flush();
      return;
    }

    if (!timer) {
      timer = setTimeout(async () => {
        timer = null;
        try {
          await flush();
        } catch {
          // keep v1 behavior simple; retries are added in the next iteration
        }
      }, flushIntervalMs);
    }
  }

  function shutdown() {
    if (timer) clearTimeout(timer);
    timer = null;
  }

  return {
    capture,
    flush,
    shutdown,
  };
}

module.exports = {
  createClient,
};
