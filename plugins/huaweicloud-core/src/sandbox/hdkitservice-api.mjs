import { getCredentials } from './hwlink-api.mjs';

const HDKIT_BASE_URL =
  process.env.HDKITSERVICE_ENDPOINT ||
  'http://devkit.topxtopx.com/rest/developer/server/hdkitservice/';

async function hdkitRequest(method, path, body, timeoutMs = 300000) {
  const { ak, sk, securitytoken } = getCredentials();

  const headers = {
    'Content-Type': 'application/json',
    'X-HW-AK': ak,
    'X-HW-SK': sk,
  };
  if (securitytoken) {
    headers['X-HW-Security-Token'] = securitytoken;
  }

  const url = `${HDKIT_BASE_URL}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let resp;
  try {
    resp = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`hdkitservice returned non-JSON (status ${resp.status}): ${text.slice(0, 200)}`);
  }

  if (!resp.ok) {
    const err = new Error(
      data.message || `hdkitservice error: ${data.code || resp.status}`
    );
    err.code = data.code;
    err.status = resp.status;
    err.traceId = data.trace_id;
    throw err;
  }

  return data;
}

export async function hdkitCheckUser() {
  return await hdkitRequest('GET', 'check-user', undefined, 30000);
}

export async function hdkitSignAgreement() {
  return await hdkitRequest('POST', 'sign-agreement', {});
}

export async function hdkitConnect(options = {}) {
  const body = {};
  if (options.source) body.source = options.source;
  if (options.env) body.env = options.env;
  if (options.git) body.git = options.git;
  if (options.template_id) body.template_id = options.template_id;
  if (options.flavor_id) body.flavor_id = options.flavor_id;

  return await hdkitRequest('POST', 'connect', body);
}

export async function hdkitCredentials(sessionId, devStageId, enableSts = true) {
  const body = { enable_sts: enableSts };
  if (sessionId) body.session_id = sessionId;
  if (devStageId) body.dev_stage_id = devStageId;

  if (!sessionId && !devStageId) {
    throw new Error('session_id or dev_stage_id is required');
  }

  return await hdkitRequest('POST', 'credentials', body);
}
