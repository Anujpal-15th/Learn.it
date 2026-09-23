// scripts/test-concurrency.mjs — demonstrates that two concurrent
// "tabs" (or devices) updating progress at the same time do not silently
// destroy each other's changes.
//
// This is a black-box test against the REAL running app + REAL database —
// it signs up a disposable test user, simulates Tab A and Tab B both
// reading progress and then writing based on that stale read, and asserts
// both changes survive (instead of the second write silently overwriting
// the first, which was the behavior before optimistic locking was added to
// app/api/progress/route.js).
//
// Requires a running app instance (npm run dev, or a deployed one) with a
// real database behind it. It does NOT read DATABASE_URL directly — it only
// talks to the app over HTTP, exactly like a real browser tab would.
//
// Usage:
//   BASE_URL=http://localhost:3000 node scripts/test-concurrency.mjs
// (BASE_URL defaults to http://localhost:3000)

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

function extractCookie(res) {
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) throw new Error('No Set-Cookie header on response — is the app running at ' + BASE_URL + '?');
  return setCookie.split(';')[0];
}

async function main() {
  const email = `concurrency-test-${Date.now()}@example.com`;
  const password = 'ConcurrencyTest123!';

  console.log(`Signing up disposable test user ${email} at ${BASE_URL} ...`);
  const signupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Concurrency Test', email, password }),
  });
  if (!signupRes.ok) {
    const body = await signupRes.json().catch(() => ({}));
    throw new Error(`Signup failed (${signupRes.status}): ${body.error || 'unknown error'}`);
  }
  const cookie = extractCookie(signupRes);
  const headers = { 'Content-Type': 'application/json', Cookie: cookie };

  async function getProgress() {
    const res = await fetch(`${BASE_URL}/api/progress`, { headers });
    if (!res.ok) throw new Error(`GET /api/progress failed (${res.status})`);
    return res.json();
  }
  async function postProgress(body) {
    const res = await fetch(`${BASE_URL}/api/progress`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    return { status: res.status, body: await res.json() };
  }

  console.log('Tab A and Tab B both load progress (same starting version) ...');
  const tabABase = await getProgress();
  const tabBBase = await getProgress();
  if (tabABase.version !== tabBBase.version) {
    throw new Error('Test setup invalid: Tab A and Tab B did not read the same version.');
  }

  console.log('Tab A writes its own change (based on the shared base version) ...');
  const tabAWrite = await postProgress({
    progress: { ...tabABase.progress, 'concurrency-test::tabA': true },
    growth: tabABase.growth,
    meta: tabABase.meta,
    version: tabABase.version,
  });
  if (tabAWrite.status !== 200) {
    throw new Error(`Tab A's write should have succeeded (got ${tabAWrite.status}).`);
  }
  console.log(`  Tab A write: ${tabAWrite.status}, new version ${tabAWrite.body.version}`);

  console.log("Tab B writes its own change, unaware Tab A already wrote (stale version) ...");
  const tabBWrite = await postProgress({
    progress: { ...tabBBase.progress, 'concurrency-test::tabB': true },
    growth: tabBBase.growth,
    meta: tabBBase.meta,
    version: tabBBase.version, // deliberately stale
  });
  console.log(`  Tab B write (stale): ${tabBWrite.status}`);

  if (tabBWrite.status !== 409) {
    throw new Error(
      `FAIL: expected Tab B's stale write to be rejected with 409, got ${tabBWrite.status}. ` +
      `This means a stale write can silently overwrite another tab's change (lost update).`
    );
  }

  console.log('Tab B retries: re-applies its OWN change on top of the fresh server state ...');
  const fresh = tabBWrite.body.current;
  const tabBRetry = await postProgress({
    progress: { ...fresh.progress, 'concurrency-test::tabB': true },
    growth: fresh.growth,
    meta: fresh.meta,
    version: fresh.version,
  });
  if (tabBRetry.status !== 200) {
    throw new Error(`FAIL: Tab B's retry (with fresh version) should have succeeded, got ${tabBRetry.status}.`);
  }
  console.log(`  Tab B retry: ${tabBRetry.status}, new version ${tabBRetry.body.version}`);

  console.log('Verifying both changes survived ...');
  const finalState = await getProgress();
  const hasA = finalState.progress['concurrency-test::tabA'] === true;
  const hasB = finalState.progress['concurrency-test::tabB'] === true;

  if (!hasA || !hasB) {
    throw new Error(
      `FAIL: lost update detected. tabA present=${hasA}, tabB present=${hasB}. ` +
      'Expected both to survive after Tab B correctly retried on the fresh version.'
    );
  }

  console.log('\nPASS: both Tab A\'s and Tab B\'s changes survived the concurrent write — no lost update.');
  console.log(`(Disposable test user ${email} was created for this run; it is harmless to leave or delete manually.)`);
}

main().catch((err) => {
  console.error('\nFAIL:', err.message);
  process.exit(1);
});
