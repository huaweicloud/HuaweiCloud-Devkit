# 版本管理与发布流程

## 分支结构

```
main ──── 稳定版（latest）发布线
  │
  ├─ dev ──── 集成分支，所有代码 PR 的目标
  │     │
  │     └─→ next ──── 预发布（next）测试线
  │
  └─→ next（计数器递增，base 不变）
```

| 分支 | 用途 | 版本号 | 触发发布？ |
|------|------|--------|-----------|
| `dev` | 集成分支，所有功能/修复 PR 的合入目标 | 固定 1.0.1（不发版） | ❌ |
| `next` | 预发布测试线 | `X.Y.Z-next.N`，只递增 N | ✅ counter +1 |
| `main` | 稳定版发布线 | `X.Y.Z`，默认 patch +1，可手动覆盖 | ✅ patch +1 或手动指定 |

## 版本号规则

### next（预发布）

```
1.0.2-next.4  →  1.0.2-next.5  →  1.0.2-next.6  →  ...
       ↑              ↑
   base 不变      counter +1
```

- **base（X.Y.Z）永不改变**，不管合入的代码是 feat 还是 fix
- **counter（N）每次发布自动 +1**
- 对应 npm dist-tag：`next`

### main（正式版）

```
1.0.1  →  1.0.2  →  1.0.3  →  ...
        (patch +1)
```

- **默认小版本号递增**（patch +1）
- **可手动覆盖**：放 `.version-override` 文件指定版本号，或提交时加 `Release-As: X.Y.Z` 脚注
- 对应 npm dist-tag：`latest`

## 预发布（next）完整流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        预发布流程                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  开发者提 PR 到 dev                                                  │
│        │                                                            │
│        ▼ CI（lint + test + pack + security）                        │
│        │                                                            │
│        ▼ 合并到 dev                                                  │
│        │                                                            │
│        ▼ 开 PR：dev → next（选择性同步，不碰版本文件）                 │
│        │                                                            │
│        ▼ 合并（CI 全绿后）                                           │
│        │                                                            │
│        ▼ push 到 next → 触发 Release 工作流                          │
│        │                                                            │
│        ▼ ┌──────────────────────────────────────┐                   │
│        │ │ Release 工作流自动执行：               │                   │
│        │ │  ① Tag release：已有 tag → 跳过       │                   │
│        │ │  ② Compute next version：1.0.2-next.N │                   │
│        │ │  ③ Create release PR：开版本 bump PR   │                   │
│        │ └──────────────────────────────────────┘                   │
│        │                                                            │
│        ▼ 检查发布 PR 内容（版本号、CHANGELOG、4 个 plugin.json）       │
│        │                                                            │
│        ▼ 合并发布 PR                                                 │
│        │                                                            │
│        ▼ push → 触发 Release 工作流                                  │
│        │                                                            │
│        ▼ Tag release 步骤：package.json 已 bump → 创建 vX.Y.Z-next.N │
│        │                                                            │
│        ▼ 手动操作：Actions → Publish npm → 选该 tag → Run workflow   │
│        │                                                            │
│        ▼ ┌──────────────────────────────────────┐                   │
│        │ │ Publish npm 工作流：                  │                   │
│        │ │  verify：tag 校验 + test + validate   │                   │
│        │ │         + pack 验证                   │                   │
│        │ │  publish：npm-publish env 审批        │                   │
│        │ │  → npm publish --tag next            │                   │
│        │ └──────────────────────────────────────┘                   │
│        │                                                            │
│        ▼ npm view huaweicloud-devkit dist-tags                      │
│          next: X.Y.Z-next.N                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 手动操作清单（next）

| 步骤 | 操作 | 谁 |
|------|------|----|
| 1 | 开 PR：dev → next（或让维护者建干净同步） | 开发者 |
| 2 | 合并同步 PR | 开发者/维护者 |
| 3 | 检查自动生成的发布 PR | 维护者 |
| 4 | 合并发布 PR | 维护者 |
| 5 | Actions → Publish npm → 选 tag → dispatch | 维护者 |
| 6 | 审批 npm-publish environment | 审批人 |
| 7 | `npm view` 验证 | 任何 |

## 正式版（main）发布流程

```
┌─────────────────────────────────────────────────────────────────────┐
│                        正式版流程                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  （前置：next 线已充分测试，决定发布 stable）                         │
│                                                                     │
│  可选：放 .version-override 文件指定版本号                            │
│       或提交 Release-As: X.Y.Z 脚注                                  │
│        │                                                            │
│        ▼ main 上 push（或合并 PR）→ 触发 Release 工作流              │
│        │                                                            │
│        ▼ ┌──────────────────────────────────────┐                   │
│        │ │ ① Tag release：已有 tag → 跳过       │                   │
│        │ │ ② Compute next version：             │                   │
│        │ │    有 override → 用指定版本           │                   │
│        │ │    无 override → patch +1             │                   │
│        │ │ ③ Create release PR                  │                   │
│        │ └──────────────────────────────────────┘                   │
│        │                                                            │
│        ▼ 检查发布 PR → 合并                                          │
│        │                                                            │
│        ▼ Tag release：创建 vX.Y.Z                                    │
│        │                                                            │
│        ▼ Actions → Publish npm → 选 tag → dispatch                  │
│        │                                                            │
│        ▼ verify（全部门禁）→ npm-publish env 审批                   │
│        │                                                            │
│        ▼ npm publish --tag latest                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 手动操作清单（main）

| 步骤 | 操作 | 谁 |
|------|------|----|
| 1 | 如需自定义版本号，放 `.version-override` 或提交 `Release-As` | 维护者 |
| 2 | push 到 main（或合并 PR） | 维护者 |
| 3 | 检查发布 PR → 合并 | 维护者 |
| 4 | Actions → Publish npm → 选 tag → dispatch | 维护者 |
| 5 | 审批 npm-publish environment | 审批人 |
| 6 | `npm view` 验证 | 任何 |

## 工作流文件清单

| 文件 | 用途 | 触发条件 |
|------|------|---------|
| `release.yml` | 版本计算 + 开发布 PR + 打 tag | push 到 main / next |
| `npm-publish.yml` | 门禁校验 + npm 发布 | 手动 dispatch（从 tag） |
| `ci.yml` | lint + test + pack 验证 + security | PR 到 main / dev / next |
| `publish-dev.yml` | 已退役（stub） | 手动 dispatch（无害） |

## 脚本

| 文件 | 用途 |
|------|------|
| `scripts/bump-version.mjs` | 从 manifest 计算下一个版本号 |
| `scripts/create-release-pr.mjs` | 创建版本 bump PR（package.json + 4 插件 + CHANGELOG + manifest） |
| `scripts/pack-verify.mjs` | tarball 文件清单校验 + 真实安装验证 |
| `scripts/sync-version.mjs` | 将 package.json 版本同步到 4 个插件清单 |
| `scripts/validate-package.mjs` | 结构性校验（manifest 存在、版本一致性等） |

## 审批门

| 层级 | 位置 | 触发 |
|------|------|------|
| CI 门禁 | `ci.yml` 分支保护规则 | 所有 PR（lint / pack / security / 6×test） |
| 发布审批 | `npm-publish.yml` 的 `npm-publish` environment | dispatch 后、npm publish 前 |
| 分支保护 | 规则集 + 经典保护 | main（PR + 1 review + CI）、dev/next（PR + CI） |

## 铁律

1. **dev 的版本号永远不变**（1.0.1），它不是发布分支
2. **next 的版本号只 counter +1**，base 永远不变
3. **main 的版本号默认 patch +1**，可手动覆盖
4. **npm 发布唯一入口是 `npm-publish.yml`**，必须从 v* tag 手动 dispatch
5. **四个插件清单始终同步**（codex / claude / cursor / workbuddy）
6. **每次发布前必须通过 CI 门禁**（lint + test + pack + security）
7. **dev → next 同步只带代码/脚本，不碰版本文件**