import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createConnection, getCredentials } from './hwlink-api.mjs';
import { getWebSocketImpl } from '../proxy/proxy-agent.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const WS_EXEC_INDEX_URL = pathToFileURL(join(__dirname, '..', 'ws-exec', 'index.js')).href;

const DEFAULT_WORKSPACE_ID = process.env.HW_WORKSPACE_ID || '0107bd9997aa4287bd2b4890b49af07d';

function resolveEnv() {
  const env = { ...process.env };
  env.PATH = `${env.HOME || '/root'}/.huawei/bin:${env.PATH || ''}`;
  return env;
}

async function runNodeExec(args, timeoutMs = 30000) {
  const env = resolveEnv();
  return new Promise((resolve) => {
    const proc = spawn('node', args, { env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    const timer = setTimeout(() => {
      proc.kill();
      resolve({ error: 'timed out', exitCode: 124 });
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(timer);
      const out = stdout.trim();
      if (out) {
        try {
          resolve({ ...JSON.parse(out), exitCode: code || 0 });
          return;
        } catch {}
      }
      if (code && code !== 0 && !out) {
        resolve({ error: stderr.trim() || `exit code ${code}`, exitCode: code });
        return;
      }
      resolve({ data: out, exitCode: code || 0 });
    });
  });
}

const sessions = new Map();

async function getSession(workspaceId, username, timeoutMs) {
  const key = `${workspaceId}:${username}`;
  if (sessions.has(key)) return sessions.get(key);

  const { ak, sk, securitytoken } = getCredentials();
  const { wsUrl, source } = await createConnection(workspaceId, ak, sk, securitytoken);

  const WebSocketImpl = getWebSocketImpl(wsUrl);

  const { connectHwlinkTerminalSession } = await import(WS_EXEC_INDEX_URL);
  const session = await connectHwlinkTerminalSession({
    url: wsUrl,
    source,
    username,
    timeoutMs,
    WebSocketImpl,
  });

  sessions.set(key, session);
  return session;
}

export async function execOneShot(workspaceId, command, username, timeoutMs) {
  const { ak, sk, securitytoken } = getCredentials();
  const { wsUrl, source } = await createConnection(workspaceId, ak, sk, securitytoken);

  const WebSocketImpl = getWebSocketImpl(wsUrl);

  const { executeHwlinkCommand } = await import(WS_EXEC_INDEX_URL);
  return await executeHwlinkCommand({
    url: wsUrl,
    source,
    username,
    command,
    timeoutMs,
    WebSocketImpl,
  });
}

export async function execWithSession(workspaceId, command, username, timeoutMs) {
  const session = await getSession(workspaceId, username, timeoutMs);
  return await session.exec(command, { timeoutMs });
}

export const UPLOAD_CHUNK_SIZE = 3072;

export function splitBase64Chunks(base64, chunkSize = UPLOAD_CHUNK_SIZE) {
  const chunks = [];
  for (let offset = 0; offset < base64.length; offset += chunkSize) {
    chunks.push(base64.slice(offset, offset + chunkSize));
  }
  return chunks;
}

export async function uploadFileWithSession(workspaceId, localPath, remotePath, username = 'root', timeoutMs = 30000) {
  const content = readFileSync(localPath);
  const base64 = content.toString('base64');
  const expectedMd5 = createHash('md5').update(content).digest('hex');
  const chunks = splitBase64Chunks(base64);
  const tmp = `${remotePath}.b64tmp`;

  const reset = await execWithSession(workspaceId, `rm -f "${tmp}"`, username, timeoutMs);
  if (reset.exitCode !== 0) {
    throw new Error(`sandbox upload: failed to reset temp file: ${reset.stdout || reset.error || reset.exitCode}`);
  }

  for (const [i, chunk] of chunks.entries()) {
    const res = await execWithSession(workspaceId, `printf '%s' '${chunk}' >> "${tmp}"`, username, timeoutMs);
    if (res.exitCode !== 0) {
      throw new Error(`sandbox upload: failed writing chunk ${i + 1}/${chunks.length}: ${res.stdout || res.error || res.exitCode}`);
    }
  }

  const decode = await execWithSession(workspaceId, `base64 -d "${tmp}" > "${remotePath}" && rm -f "${tmp}"`, username, timeoutMs);
  if (decode.exitCode !== 0) {
    throw new Error(`sandbox upload: failed decoding to ${remotePath}: ${decode.stdout || decode.error || decode.exitCode}`);
  }

  const verify = await execWithSession(workspaceId, `md5sum "${remotePath}"`, username, timeoutMs);
  let md5Verified = false;
  if (verify.exitCode === 0) {
    const remoteMd5 = String(verify.stdout || '').trim().split(/\s+/)[0];
    md5Verified = remoteMd5 === expectedMd5;
    if (!md5Verified) {
      throw new Error(`sandbox upload: md5 mismatch for ${remotePath} (expected ${expectedMd5}, got ${remoteMd5 || 'none'})`);
    }
  }

  return {
    ok: true,
    localPath,
    remotePath,
    bytes: content.length,
    chunks: chunks.length,
    md5: expectedMd5,
    md5Verified,
  };
}

export async function closeSession(workspaceId, username) {
  const key = `${workspaceId}:${username}`;
  const session = sessions.get(key);
  if (!session) return false;
  sessions.delete(key);
  try { session.close(); } catch {}
  return true;
}

export async function closeAllSessions() {
  for (const [key, session] of sessions) {
    sessions.delete(key);
    try { session.close(); } catch {}
  }
}

export { DEFAULT_WORKSPACE_ID, runNodeExec };
