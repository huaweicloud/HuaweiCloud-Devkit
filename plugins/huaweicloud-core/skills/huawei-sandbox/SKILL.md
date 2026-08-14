---
name: huawei-sandbox
description: "Use when creating, connecting, or managing Huawei Cloud Sandbox instances and workspace terminals, or when a task needs a temporary runtime to deploy, run, or preview a web application. Covers sandbox lifecycle (check-user, sign-agreement, connect, release), session-based terminal execution, and credential injection. Triggers on: sandbox, workspace, terminal, web app deployment, deploy web app, preview app, hwlink, devstation, hdkitservice, remote exec. NOT for: ECS instances (use huawei-ecs), CCE clusters (use huawei-cce)."
version: 1
---

# Huawei Cloud Sandbox

**STOP - Do not answer from general knowledge.** Follow the procedure below.

## Overview

Domain expertise for Huawei Cloud Sandbox (DevStation) instances and workspace terminal execution. Covers sandbox lifecycle via hdkitservice API and remote terminal command execution via hwlink protocol.

## Activation

- **Proactive offering**: when the developer's task needs a temporary runtime (e.g. "deploy this web app", "run this app and preview it"), offer the sandbox proactively — the developer never has to say "use sandbox". Prompt: "This task can be satisfied by a sandbox — use it?"
- **Do not intercept a specified target**: if the task already names a deployment target (ECS, CCE, an existing server), follow that target instead of offering the sandbox. Offer the sandbox only when the task needs a temporary runtime or no target is specified.
- The developer never needs to name or understand the sandbox as a separate service. Detect the "web application deployment / needs a runtime environment" intent and propose the sandbox.

## MCP Tools

### User Verification (Prerequisites)

| Tool | Purpose |
|------|---------|
| `huaweicloud_sandbox_check_user` | Check real-name verification and agreement signing status |
| `huaweicloud_sandbox_sign_agreement` | Sign unsigned/outdated agreements (required before connect) |

### Sandbox Lifecycle

| Tool | Purpose |
|------|---------|
| `huaweicloud_sandbox_connect` | Connect to sandbox (one user one instance, reuses existing if available) |
| `huaweicloud_sandbox_credentials` | Inject temporary AK/SK into a running sandbox |
| `huaweicloud_sandbox_release` | Shut down and delete a sandbox (idempotent) |

### Terminal Execution

| Tool | Purpose |
|------|---------|
| `huaweicloud_sandbox_exec_with_session` | Session-based execution (state persists) |
| `huaweicloud_sandbox_close_session` | Close a persistent terminal session |

## Workflow

Setup is a **plugin-side preflight** — the developer should be asked a question only once, when the agreement actually needs signing:

1. **Check user** (transparent): `huaweicloud_sandbox_check_user` — verify `realname_verified` and `agreement_signed`
2. **Real-name verification** (only if `realname_verified=false`): tell the developer once, "Huawei Cloud requires real-name verification before using the sandbox." and stop — do not retry `connect` in a loop
3. **Sign agreement** (only if `agreement_signed=false`): ask the developer once as the plugin — "Huawei Cloud sandbox requires signing its service agreement. May I sign it on your behalf?" — then call `huaweicloud_sandbox_sign_agreement`. Do not expose the underlying sandbox/DevBridge service as a separate entity the developer must understand or sign up for
4. **Connect**: `huaweicloud_sandbox_connect` — returns `session_id`, `dev_stage_id`, `connection_id`, `connection_address`
5. **Inject credentials** (optional): `huaweicloud_sandbox_credentials` — enables cloud API access from sandbox
6. **Execute commands**: `huaweicloud_sandbox_exec_with_session` for interactive work
7. **Release**: `huaweicloud_sandbox_release` — cleans up sandbox and session

## Critical Warnings

| Trap | Why |
|------|-----|
| Agreement required first | `sandbox_connect` fails if the agreement isn't signed; the `sandbox_check_user` preflight detects this, so surface it to the developer only when signing is needed |
| Real-name required | `sandbox_connect` fails if `realname_verified=false`; tell the developer once and stop, don't loop on connect |
| Session state persists | `exec_with_session` preserves `cd`, env vars, aliases between calls |
| Destructive commands blocked | `rm -rf /`, `mkfs`, `dd if=`, fork bombs are denied by safety policy |
| Workspace ID = dev_stage_id | Use `dev_stage_id` from `sandbox_connect` as `workspace_id` for terminal exec |
| Node.js >= 22 required | Sandbox terminal uses built-in WebSocket (globalThis.WebSocket); if Node.js is missing, install it from the Huawei Cloud mirror (see "Node.js in the sandbox") |

## Node.js in the sandbox

If the sandbox has no Node.js, download it from the Huawei Cloud mirror. Pick the tarball matching the sandbox arch (`uname -m`: `aarch64` -> arm64, `x86_64` -> x64):

```bash
# aarch64 sandbox:
curl -fsSL https://mirrors.huaweicloud.com/nodejs/v24.19.0/node-v24.19.0-linux-arm64.tar.gz -o node.tar.gz
# x86_64 sandbox:
curl -fsSL https://mirrors.huaweicloud.com/nodejs/v24.19.0/node-v24.19.0-linux-x64.tar.gz -o node.tar.gz
sudo tar -xzf node.tar.gz -C /usr/local --strip-components=1
node --version
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HW_ACCESS_KEY` | Yes | Huawei Cloud AK |
| `HW_SECRET_KEY` | Yes | Huawei Cloud SK |
| `HW_SECURITY_TOKEN` | No | STS security token |
| `HW_WORKSPACE_ID` | No | Default workspace ID |
| `HDKITSERVICE_ENDPOINT` | No | hdkitservice API endpoint |
| `HWLINK_ENDPOINT` | No | DevStation API endpoint |
