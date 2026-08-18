# Versioning and Release Process

## Branch Structure

```
main ──── Stable release line (latest tag)
  │
  ├─ dev ──── Integration branch, target for all code PRs
  │     │
  │     └─→ next ──── Prerelease test line (next tag)
  │
  └─→ next (counter increment, base fixed)
```

| Branch | Purpose | Version | Triggers release? |
|--------|---------|---------|-------------------|
| `dev` | Integration branch | Fixed 1.0.1 (not a release branch) | No |
| `next` | Prerelease test line | `X.Y.Z-next.N`, counter only | Yes, N+1 |
| `main` | Stable release line | `X.Y.Z`, default patch+1, can override | Yes, patch+1 or manual |

## Version Number Rules

### next (prerelease)

```
1.0.2-next.4 → 1.0.2-next.5 → 1.0.2-next.6 → ...
     ↑              ↑
  base locked    counter +1
```

- **base never changes**, regardless of feat/fix commit type
- **counter increments by 1** on each release
- npm dist-tag: `next`

### main (stable)

```
1.0.1 → 1.0.2 → 1.0.3 → ...
    (patch +1)
```

- **Default: patch increment** (1.0.1 → 1.0.2)
- **Override**: place `.version-override` file with exact version, or use `Release-As: X.Y.Z` in a commit footer
- npm dist-tag: `latest`

## Prerelease (next) Flow

```
Code PR merged to dev
      │
      ▼ CI (lint + test + pack + security) → green
      │
      ▼ Open PR: dev → next (code only, no version files)
      │
      ▼ Merge (after CI green)
      │
      ▼ push to next → triggers Release workflow
      │
      ▼ Release workflow runs:
      │   ① Tag: already exists → skip
      │   ② Compute: 1.0.2-next.N (counter +1)
      │   ③ Create release PR (version bump + CHANGELOG + 4 plugins)
      │
      ▼ Review release PR → merge
      │
      ▼ push → Release workflow → Tag step: creates vX.Y.Z-next.N
      │
      ▼ Manual: Actions → Publish npm → select tag → dispatch
      │
      ▼ verify (gates) + npm-publish environment approval
      │
      ▼ npm publish --tag next
```

## Stable (main) Flow

```
Place .version-override (optional) or Release-As commit
      │
      ▼ push to main → triggers Release workflow
      │
      ▼ Release workflow:
      │   ① Tag: skip
      │   ② Compute: override → X.Y.Z, else patch+1
      │   ③ Create release PR
      │
      ▼ Review release PR → merge
      │
      ▼ Tag step: creates vX.Y.Z
      │
      ▼ Manual: Actions → Publish npm → select tag → dispatch
      │
      ▼ verify + npm-publish environment approval
      │
      ▼ npm publish --tag latest
```

## Workflow Files

| File | Purpose | Trigger |
|------|---------|---------|
| `release.yml` | Version computation + release PR + tagging | push to main / next |
| `npm-publish.yml` | Gate verification + npm publish | manual dispatch (from tag) |
| `ci.yml` | lint + test + pack + security | PR to main / dev / next |

## Scripts

| File | Purpose |
|------|---------|
| `scripts/bump-version.mjs` | Compute next version from manifest |
| `scripts/create-release-pr.mjs` | Create version bump PR (package, manifests, CHANGELOG) |
| `scripts/pack-verify.mjs` | Tarball file list check + real install verification |
| `scripts/sync-version.mjs` | Sync package.json version to 4 plugin manifests |
| `scripts/validate-package.mjs` | Structural validation |

## Approval Gates

| Gate | Where | When |
|------|-------|------|
| CI gates | `ci.yml` branch protection | All PRs (lint / pack / security / 6×test) |
| Publish approval | `npm-publish` environment | After dispatch, before npm publish |
| Branch protection | Ruleset + classic | main (PR + 1 review + CI), dev/next (PR + CI) |

## Rules

1. dev's version **never changes** (1.0.1)
2. next version: **counter only, base locked**
3. main version: **default patch+1, override via `.version-override` or `Release-As`**
4. The only npm publish path is `npm-publish.yml`
5. All four plugin manifests always in sync
6. Every publish must pass CI gates (lint + test + pack + security)
7. dev→next syncs **exclude version files**