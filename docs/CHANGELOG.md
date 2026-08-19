# Changelog

## 1.0.2 (2026-08-19)

- feat(release): sync release workflow to main, seed manifest with 1.0.1
- fix(release): retire the live Publish Dev workflow on main
- fix(release): restore full publish flow with quoted step names
- fix(release): probe publish job with environment only
- fix(release): probe without job outputs and needs.outputs wiring
- fix(release): restore full tag-gated publish logic
- fix(release): reduce npm-publish workflow to minimal probe
- fix(release): drop workflow_dispatch inputs, derive dist-tag from the tag version
- fix(release): rename publish workflow to npm-publish to recover a fresh workflow_dispatch index
- fix(release): add pack-verify script to main
- fix(release): sync ci.yml with pack verification to main
- fix(release): add tag-gated Publish workflow to main so workflow_dispatch works from tags
- docs: fix README Node.js requirement, discussions badge link, and repo URL

Release notes are generated from GitHub Releases. See https://github.com/huaweicloud/HuaweiCloud-Devkit/releases
