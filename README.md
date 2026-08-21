# HuaweiCloud DevKit

[![Discussions](https://img.shields.io/badge/Discussions-Join%20the%20discussion-blue)](https://github.com/huaweicloud/huaweicloud-devkit/discussions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![CI](https://github.com/huaweicloud/huaweicloud-devkit/actions/workflows/ci.yml/badge.svg)](https://github.com/huaweicloud/huaweicloud-devkit/actions/workflows/ci.yml)

<div align="center">
  <h3>🌟 分享你的 DevKit 使用场景，赢取华为云代金券！</h3>
  <p>
    📢 分享你的真实案例，每月评选最佳实践 🥇
    <br>
    👉 <a href="https://github.com/huaweicloud/huaweicloud-devkit/discussions/218"><strong>立即参与 →</strong></a>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    ⭐ <a href="https://github.com/huaweicloud/huaweicloud-devkit"><strong>给 DevKit 点 Star</strong></a>
  </p>
  <hr>
</div>

**[中文](README.zh-CN.md) | English**

Help AI coding agents use Huawei Cloud safely and accurately — a single integration that gives agents cloud knowledge, CLI tooling, and safety guardrails.

Supports OpenCode, Codex, CodeArts Agent, and WorkBuddy.

## Prerequisites

- Node.js >= 20

## Quick Start

### OpenCode

```bash
npx --yes huaweicloud-devkit install
```

Installs the DevKit into OpenCode automatically. **Restart the session** after installation.

```bash
npx --yes huaweicloud-devkit doctor    # self-check
npx --yes huaweicloud-devkit status    # show status
npx --yes huaweicloud-devkit update    # update
npx --yes huaweicloud-devkit uninstall # uninstall
```

### Codex

```bash
npx --yes huaweicloud-devkit install --target codex
```

> The Codex CLI must be installed first.

```bash
npx --yes huaweicloud-devkit doctor                        # self-check
npx --yes huaweicloud-devkit status --target codex
npx --yes huaweicloud-devkit update --target codex         # update
npx --yes huaweicloud-devkit uninstall --target codex
```

> **Codex Desktop** (Windows): use `--target codex-desktop` with the same commands.

### CodeArts Agent

```bash
npx --yes huaweicloud-devkit install --target codearts
```

**Restart the session** after installation.

```bash
npx --yes huaweicloud-devkit install-hcloud   # install KooCLI
npx --yes huaweicloud-devkit doctor           # self-check
npx --yes huaweicloud-devkit status --target codearts
npx --yes huaweicloud-devkit update --target codearts
npx --yes huaweicloud-devkit uninstall --target codearts
```

> **Sandbox mode**: CodeArts defaults to sandbox mode which blocks KooCLI. `install-hcloud` detects this and shows how to resolve it — install KooCLI outside the sandbox terminal, or disable sandbox mode in CodeArts settings (Settings → Permissions → Bash mode).
>
> **Authentication**: Run `npx huaweicloud-devkit auth init` to configure unified AK/SK credentials for KooCLI, OBS, and sandbox APIs.

### WorkBuddy

```bash
npx --yes huaweicloud-devkit install --target workbuddy
```

**Restart the session** after installation.

```bash
npx --yes huaweicloud-devkit doctor
npx --yes huaweicloud-devkit status --target workbuddy
npx --yes huaweicloud-devkit update --target workbuddy   # update
npx --yes huaweicloud-devkit uninstall --target workbuddy
```

> **Updating**: `update` is incremental per agent — it refreshes only the installed files and leaves your config untouched. Use `update --target all` to update every installed agent at once.

### Other Agents

For agents that support the Model Context Protocol (MCP):

```json
{
  "mcp": {
    "huaweicloud-devkit": {
      "type": "local",
      "command": ["node", "<path>/plugins/huaweicloud-core/src/mcp-server.mjs"],
      "enabled": true
    }
  }
}
```

Then install:

```bash
npx --yes huaweicloud-devkit install
```

> **Prerequisite:** Node.js >= 20. Run `npx huaweicloud-devkit auth init` for unified credentials.

## What It Does

- **Guided cloud operations** — agents get step-by-step guidance for 20+ Huawei Cloud services (ECS, OBS, VPC, RDS, GaussDB, FunctionGraph, APIG, CCE, and more)
- **Safety-first execution** — all write operations require explicit user approval; credentials and secrets are automatically redacted from output
- **Pre-execution risk checks** — public exposure, credential leaks, and destructive operations are caught before they run
- **Regional awareness** — auto-discovers available regions and checks service availability before creating resources

## Supported Services

ECS, OBS, VPC, IAM, RDS, GaussDB, FunctionGraph, APIG, CCE, SMN/DMS, ModelArts, Cloud Eye, CTS, DEW, Billing, CBR, WAF/AAD, DDS/DCS, Deployment, and Getting Started guides.

## Documentation

- [Architecture](docs/architecture.md)
- [Safety Model](docs/safety-model.md)
- [Hook Rule Model](docs/hook-rule-model.md)
- [Changelog](docs/CHANGELOG.md)
- [KooCLI official docs](https://support.huaweicloud.com/qs-hcli/hcli_02_003.html)

## Contributors

<a href="https://github.com/huaweicloud/huaweicloud-devkit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=huaweicloud/huaweicloud-devkit" />
</a>

## License

This project is licensed under the Apache-2.0 License. See [LICENSE](LICENSE).
