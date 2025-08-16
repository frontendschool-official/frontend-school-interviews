import { problemSchema } from '@workspace/schemas';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const BASE_URL = process.env.HEALTH_BASE_URL ?? 'http://localhost:3000';

const fetchJson = async (path: string, init?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${path}`, init);
  return { status: res.status, json: await res.json().catch(() => ({})) };
};

const ping = async (path = '/', attempts = 20, ms = 500): Promise<number> => {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(`${BASE_URL}${path}`);
      if (res.status) return res.status;
    } catch {}
    await delay(ms);
  }
  return 0;
};

const ensureServer = async (): Promise<() => void> => {
  const status = await ping('/');
  if (status > 0) return () => {};
  const child = spawn('npx', ['next', 'start', '-p', '3000'], {
    stdio: 'ignore',
    env: process.env,
  });
  const ready = await ping('/');
  if (!ready) throw new Error('Server failed to start for health-check');
  return () => {
    try {
      child.kill('SIGTERM');
    } catch {}
  };
};

const run = async () => {
  const stop = await ensureServer();
  const results: Array<{ name: string; ok: boolean; info?: string }> = [];
  const pageResp = await fetch(`${BASE_URL}/`).catch(() => ({ status: 0 } as any));
  results.push({
    name: 'GET /',
    ok: (pageResp as any).status && (pageResp as any).status < 500,
    info: `status=${(pageResp as any).status}`,
  });

  const hasAdminEnv = Boolean(process.env.FIREBASE_ADMIN_PRIVATE_KEY);
  const listPublic = await fetchJson('/api/problems?visibility=public');
  const okList = listPublic.status === 200 && Array.isArray(listPublic.json);
  results.push({
    name: 'GET /api/problems (public)',
    ok: hasAdminEnv ? okList : true,
    info: hasAdminEnv ? `status=${listPublic.status}` : 'skipped (no admin env)',
  });

  const protectedResp = await fetchJson('/api/problems?mine=true');
  results.push({
    name: 'GET /api/problems/mine (unauth)',
    ok: protectedResp.status ? protectedResp.status === 401 : true,
    info: protectedResp.status ? undefined : 'skipped (server unavailable)',
  });

  // Example body validation if a sample problem is returned
  if (okList && listPublic.json.length > 0) {
    try {
      problemSchema.parse(listPublic.json[0]);
      results.push({
        name: 'problemSchema validate first public problem',
        ok: true,
      });
    } catch (e) {
      results.push({
        name: 'problemSchema validate first public problem',
        ok: false,
        info: String(e),
      });
    }
  }

  const failed = results.filter(r => !r.ok);
  for (const r of results) {
    console.log(
      `${r.ok ? 'PASS' : 'FAIL'} - ${r.name}${r.info ? ` (${r.info})` : ''}`
    );
  }
  if (failed.length > 0) {
    stop();
    process.exit(1);
  }
  stop();
};

run().catch(e => {
  console.error(e);
  process.exit(1);
});
