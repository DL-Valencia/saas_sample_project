/**
 * ──────────────────────────────────────────────────────────────
 *  SaaS Dashboard – Load / Stress Test  (10 000 requests)
 * ──────────────────────────────────────────────────────────────
 *
 *  Usage:
 *    node src/loadtest.js
 *
 *  What it does:
 *    1. Logs in as the seeded admin account to get a JWT token.
 *    2. Fires 10 000 concurrent GET requests in batches to
 *       multiple API endpoints (dashboard stats, applications,
 *       users, root health-check).
 *    3. Reports success / failure counts and overall timing.
 *
 *  ⚠  Make sure the backend is running (`npm run dev`) before
 *     executing this script.
 * ──────────────────────────────────────────────────────────────
 */

const http = require('http');

const BASE = 'http://localhost:5000';
const TOTAL_REQUESTS = 10_000;
const BATCH_SIZE = 200;           // concurrent requests per batch

// ── helpers ─────────────────────────────────────────────────────
function httpRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

function parseUrl(urlStr) {
  const url = new URL(urlStr);
  return { hostname: url.hostname, port: url.port, path: url.pathname };
}

// ── login ───────────────────────────────────────────────────────
async function login() {
  const { hostname, port, path } = parseUrl(`${BASE}/api/auth/login`);
  const body = JSON.stringify({ email: 'admin@example.com', password: 'admin123' });

  const res = await httpRequest(
    { hostname, port, path, method: 'POST', headers: { 'Content-Type': 'application/json' } },
    body
  );

  const parsed = JSON.parse(res.data);
  if (!parsed.token) throw new Error('Login failed – no token received');
  return parsed.token;
}

// ── fire a single request ───────────────────────────────────────
function fireRequest(path, token) {
  const { hostname, port, path: urlPath } = parseUrl(`${BASE}${path}`);
  return httpRequest({
    hostname,
    port,
    path: urlPath,
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ── main ────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   SaaS Dashboard – Load Test (10 000 reqs)  ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  // 1. Authenticate
  console.log('🔐 Logging in as admin@example.com …');
  const token = await login();
  console.log('✅ Token acquired.\n');

  // 2. Build the request queue – rotate across endpoints
  const endpoints = [
    '/api/applications/stats',
    '/api/applications',
    '/api/users',
    '/',
  ];

  let success = 0;
  let fail = 0;
  let rateLimited = 0;
  const statusCodes = {};

  console.log(`🚀 Sending ${TOTAL_REQUESTS.toLocaleString()} requests in batches of ${BATCH_SIZE}…\n`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_REQUESTS; i += BATCH_SIZE) {
    const batchEnd = Math.min(i + BATCH_SIZE, TOTAL_REQUESTS);
    const batch = [];

    for (let j = i; j < batchEnd; j++) {
      const ep = endpoints[j % endpoints.length];
      batch.push(
        fireRequest(ep, token)
          .then((res) => {
            statusCodes[res.status] = (statusCodes[res.status] || 0) + 1;
            if (res.status === 429) rateLimited++;
            if (res.status >= 200 && res.status < 400) success++;
            else fail++;
          })
          .catch(() => {
            fail++;
          })
      );
    }

    await Promise.all(batch);

    // Progress indicator every 1 000 requests
    if (batchEnd % 1000 === 0 || batchEnd === TOTAL_REQUESTS) {
      const pct = ((batchEnd / TOTAL_REQUESTS) * 100).toFixed(0);
      process.stdout.write(`  ⏳  ${batchEnd.toLocaleString().padStart(6)} / ${TOTAL_REQUESTS.toLocaleString()}  [${pct}%]\r`);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  const rps = (TOTAL_REQUESTS / elapsed).toFixed(0);

  console.log('\n');
  console.log('═══════════════════  RESULTS  ═══════════════════');
  console.log(`  Total Requests   : ${TOTAL_REQUESTS.toLocaleString()}`);
  console.log(`  ✅ Success (2xx) : ${success.toLocaleString()}`);
  console.log(`  ❌ Failed        : ${fail.toLocaleString()}`);
  console.log(`  🚧 Rate-Limited  : ${rateLimited.toLocaleString()}`);
  console.log(`  ⏱  Elapsed       : ${elapsed}s`);
  console.log(`  ⚡ Throughput    : ~${rps} req/s`);
  console.log('');
  console.log('  Status Code Breakdown:');
  Object.entries(statusCodes)
    .sort(([a], [b]) => a - b)
    .forEach(([code, count]) => {
      console.log(`    HTTP ${code} → ${count.toLocaleString()}`);
    });
  console.log('═════════════════════════════════════════════════');
}

main().catch((err) => {
  console.error('❌ Load test failed:', err.message);
  process.exit(1);
});
