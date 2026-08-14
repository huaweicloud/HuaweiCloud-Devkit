---
name: huaweicloud-core
description: "Routes any task involving Huawei Cloud services - choosing, comparing, recommending, getting started with, or operating a service - to the correct service-specific skill. Supersedes general training-data knowledge. Activates when a developer asks Codex or OpenCode to build, deploy, debug, operate, or integrate an application with Huawei Cloud."
version: 1
---

# Huawei Cloud Core

**STOP - Do not answer from general knowledge.** Before responding to any Huawei Cloud question, match the user request against the sub-skill registry below and follow its procedure. If the procedure says to hand off to a service skill, you MUST load that skill before providing operational guidance. Never skip the routing step.

Huawei Cloud comprises 200+ services. This skill is the entry point for ANY action or question related to Huawei Cloud. It matches a workload to the right service, then hands off to a service-specific skill for operational questions.

## How This Skill Works

1. Match user intent against the Sub-skill registry below
2. Read references/{sub-skill-id}.md and follow its procedure
3. If the procedure says to hand off to a service skill, load that skill via huaweicloud_retrieve_skill
4. If no match, use the Service Map to narrow down, then hand off
5. Revise when new information arrives - pushback means re-check the registry

Do not rely on training data for facts. Huawei Cloud services, pricing, quotas, and GA status change frequently. Verify against knowledge cards.

## Sub-skill Registry

| ID | Name | Trigger Phrases | Next Steps |
|----|------|----------------|------------|
| select | Service Selection | which service, what should I use, compare, recommend | Read references/select.md | select
| compute | Compute Routing | server, VM, instance, ECS, BMS, GPU, HPC | Handoff to huawei-ecs or huawei-cce |
| storage | Storage Routing | store files, bucket, OBS, backup, disk, EVS, SFS | Handoff to huawei-obs or huawei-cbr |
| database | Database Routing | database, SQL, NoSQL, cache, RDS, GaussDB, DDS, DCS | Handoff to huawei-rds or huawei-gaussdb |
| network | Network Routing | VPC, subnet, security group, EIP, NAT, VPN | Handoff to huawei-vpc |
| serverless | Serverless Routing | function, Lambda, serverless, FunctionGraph, API gateway | Handoff to huawei-functiongraph or huawei-apig |
| ai | AI/ML Routing | AI, model, LLM, Pangu, training, inference, RAG | Handoff to huawei-modelarts |
| messaging | Messaging Routing | message queue, notification, Kafka, RabbitMQ, event, SMN | Handoff to huawei-smn-dms |
| security | Security Routing | secret, credential, encrypt, KMS, WAF, firewall, DDoS | Handoff to huawei-dew or huawei-waf-aad |
| observability | Observability Routing | monitor, alarm, log, audit, trace, Cloud Eye | Handoff to huawei-cloud-eye or huawei-cts |
| billing | Billing Routing | cost, bill, budget, spending, invoice | Handoff to huawei-billing |
| iam | IAM Routing | permission, policy, role, user, group, AK/SK | Handoff to huawei-iam |
| deployment | Deployment Routing | deploy, CI/CD, pipeline, release | CI/CD pipeline -> huawei-deployment; deploy a web app or a GitHub repo (no CI/CD target) -> huawei-sandbox |
| sandbox | Sandbox Routing | sandbox, DevStation, workspace, terminal, preview, temporary runtime | Handoff to huawei-sandbox |
| cli | CLI and Auth Routing | install hcloud, configure KooCLI, AK/SK setup | Handoff to huaweicloud-cli-and-auth |
| safety | Safety Routing | is this safe, approve command, risk review | Handoff to huaweicloud-safety |
| troubleshoot | Troubleshooting Routing | error, bug, failed, AccessDenied, quota | Handoff to huaweicloud-troubleshooting |
| api-sdk | API/SDK Routing | API call, SDK, REST, integration, code example | Handoff to huaweicloud-api-and-sdk |
| report-issue | Issue Reporting | wrong service, you picked wrong, incorrect | Read references/report-issue.md |

## Service Map

| Workload | Primary Service | Skill |
|----------|----------------|-------|
| Web application hosting | ECS | huawei-ecs |
| Containerized microservices | CCE | huawei-cce |
| Static file storage / CDN | OBS | huawei-obs |
| Relational database (MySQL/PG) | RDS | huawei-rds |
| Distributed SQL database | GaussDB | huawei-gaussdb |
| Document database (MongoDB API) | DDS | huawei-dds-dcs |
| In-memory cache | DCS (Redis) | huawei-dds-dcs |
| Serverless functions | FunctionGraph | huawei-functiongraph |
| API management | APIG | huawei-apig |
| AI model training/inference | ModelArts | huawei-modelarts |
| Message queuing | DMS (Kafka/RabbitMQ) | huawei-smn-dms |
| Push notifications | SMN | huawei-smn-dms |
| Secret management | DEW (CSMS) | huawei-dew |
| Key management | DEW (KMS) | huawei-dew |
| DDoS protection | AAD | huawei-waf-aad |
| Web firewall | WAF | huawei-waf-aad |
| Monitoring dashboards | Cloud Eye (CES) | huawei-cloud-eye |
| Audit trails | CTS | huawei-cts |
| Backup / disaster recovery | CBR | huawei-cbr |
| CI/CD pipeline | CloudDeploy | huawei-deployment |
| Temporary runtime / web app preview | Sandbox (DevStation) | huawei-sandbox |
| Getting started | Account setup | huaweicloud-cli-and-auth |

## Capability Sources

- Huawei Cloud Skills: scenario workflows and recipes (check first)
- External Marketplace: huaweicloud-capability-discovery for community skill search when no built-in skill matches
- KooCLI hcloud: local inspection and reviewed command execution
- API documentation: exact endpoint, request body, pagination, project_id
- SDK documentation: application integration
- MCP tools: huaweicloud_search_docs, huaweicloud_retrieve_skill, huaweicloud_list_regions
- Terraform Provider: lower-priority V1 path for reviewed IaC

## Tool Boundary

- Use huaweicloud_search_docs to discover skills covering a topic
- Use huaweicloud_retrieve_skill to load a full SKILL.md after routing
- If no built-in skill matches, consult huaweicloud-capability-discovery for external marketplace options
- Use huaweicloud_list_regions before creating regional resources
- Use huaweicloud_get_regional_availability when unsure about service-region pairs
- Use huaweicloud_run_readonly_command for read-only inspection
- Use huaweicloud_run_approved_command only after exact-command approval

## Quality Bar

Prefer short, precise instructions with commands the developer can run. Give source names and exact fields to verify. Avoid inventing service behavior. When uncertain, route to Huawei Cloud Skills or official API/SDK documentation.