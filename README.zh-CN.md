# HuaweiCloud DevKit
[![Discussions](https://img.shields.io/badge/参与讨论-Join%20the%20discussion-blue)](https://github.com/huaweicloud/huaweicloud-devkit/discussions)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![CI](https://github.com/huaweicloud/HuaweiCloud-Devkit/actions/workflows/ci.yml/badge.svg)](https://github.com/huaweicloud/HuaweiCloud-Devkit/actions/workflows/ci.yml)

**中文 | [English](README.md)**

帮助 AI 编码助手安全、准确地使用华为云——一站式集成云知识、CLI 工具和安全护栏。

支持 OpenCode、Codex、码道（CodeArts Agent）、WorkBuddy。

## 前置条件

- Node.js >= 22

## 快速开始

### OpenCode

```bash
npx --yes huaweicloud-devkit install
```

自动安装 DevKit。安装后**重启会话**。

```bash
npx --yes huaweicloud-devkit doctor   # 自检
npx --yes huaweicloud-devkit status   # 查看状态
npx --yes huaweicloud-devkit update   # 更新
npx --yes huaweicloud-devkit uninstall # 卸载
```

### Codex

```bash
npx --yes huaweicloud-devkit install --target codex
```

> 需要先安装 Codex CLI。

```bash
npx --yes huaweicloud-devkit doctor                        # 自检
npx --yes huaweicloud-devkit status --target codex
npx --yes huaweicloud-devkit update --target codex         # 更新
npx --yes huaweicloud-devkit uninstall --target codex
```

> **Codex Desktop**（Windows）：将 `--target codex` 换成 `--target codex-desktop`，命令相同。

### CodeArts Agent（码道）

```bash
npx --yes huaweicloud-devkit install --target codearts
```

安装后**重启会话**。

```bash
npx --yes huaweicloud-devkit install-hcloud   # 安装 KooCLI
npx --yes huaweicloud-devkit doctor           # 自检
npx --yes huaweicloud-devkit status --target codearts
npx --yes huaweicloud-devkit update --target codearts
npx --yes huaweicloud-devkit uninstall --target codearts
```

> **沙箱模式**：码道默认沙箱模式会阻止 KooCLI 运行。`install-hcloud` 自动检测并给出指引——请在码道外终端安装使用 KooCLI，或在码道设置中关闭沙箱模式（设置 → 权限 → Bash 模式）。
>
> **认证**：执行 `npx huaweicloud-devkit auth init`，统一配置 KooCLI、OBS 和沙箱接口所需的 AK/SK。

### WorkBuddy

```bash
npx --yes huaweicloud-devkit install --target workbuddy
```

安装后**重启会话**。

```bash
npx --yes huaweicloud-devkit doctor
npx --yes huaweicloud-devkit status --target workbuddy
npx --yes huaweicloud-devkit update --target workbuddy   # 更新
npx --yes huaweicloud-devkit uninstall --target workbuddy
```

> **更新机制**：`update` 按 agent 增量更新，只刷新必要文件、不动你的配置文件。`update --target all` 可一次更新所有已安装的 agent。

### 其他 Agent

支持 MCP 协议的 Agent，手动配置：

```json
{
  "mcp": {
    "huaweicloud-devkit": {
      "type": "local",
      "command": ["node", "<路径>/plugins/huaweicloud-core/src/mcp-server.mjs"],
      "enabled": true
    }
  }
}
```

然后安装：

```bash
npx --yes huaweicloud-devkit install
```

> **前置条件：** Node.js >= 22。执行 `npx huaweicloud-devkit auth init` 完成统一认证。

## 功能特性

- **引导式云操作** — Agent 获得 20+ 华为云服务的分步操作指引（ECS、OBS、VPC、RDS、GaussDB、FunctionGraph、APIG、CCE 等）
- **安全优先执行** — 所有写操作需用户明确批准；凭证和密钥自动脱敏
- **执行前风险检查** — 公网暴露、凭证泄露、破坏性操作在执行前即被拦截
- **区域感知** — 自动发现可用区域，创建资源前检查服务可用性

## 支持的服务

ECS、OBS、VPC、IAM、RDS、GaussDB、FunctionGraph、APIG、CCE、SMN/DMS、ModelArts、Cloud Eye、CTS、DEW、Billing、CBR、WAF/AAD、DDS/DCS、Deployment，以及入门指南。

## 文档

- [架构](docs/architecture.md)
- [安全模型](docs/safety-model.md)
- [Hook 规则模型](docs/hook-rule-model.md)
- [变更记录](docs/CHANGELOG.md)
- [KooCLI 官方文档](https://support.huaweicloud.com/qs-hcli/hcli_02_003.html)

## 贡献者

<a href="https://github.com/huaweicloud/huaweicloud-devkit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=huaweicloud/huaweicloud-devkit" />
</a>

## 许可证

本项目基于 Apache-2.0 许可证发布。详见 [LICENSE](LICENSE)。
