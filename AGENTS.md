# AGENTS.md

**IMPORTANT:** Agent instructions pending - detailed instructions will be provided later.

## Commit Messages
- Max 13 words per commit message

## After Every Change
- ALL changes MUST be committed, including micro changes (typos, formatting, spacing)
- Commit and push immediately after completing a change
- Never accumulate uncommitted work across multiple changes
- Verify push succeeds before proceeding to next task

## Current Status
- Agent instructions pending
- Continue with milestone documentation as planned

## DO NOT KILL OR CONFLICT WITH THESE SERVICES

**Running Docker Containers:**
| Container | Ports | Project |
|-----------|-------|---------|
| yotop10_frontend | 3100 | /home/afam/yotop10 |
| yotop10_backend | 8100 | /home/afam/yotop10 |
| yotop10_redis | 6379 (internal) | /home/afam/yotop10 |
| yotop10_mongodb | 27017 (internal) | /home/afam/yotop10 |
| yotop10_elasticsearch | 9200/9300 (internal) | /home/afam/yotop10 |
| agentsdb-prod-caddy | 80, 443 | /srv/agentsdb-deploy |
| agentsdb-prod-app | 3000 (internal) | /srv/agentsdb-deploy |
| agentsdb-prod-db | 5432 (internal) | /srv/agentsdb-deploy |
| ceche-postgres | 5433 | separate |
| namesranker-postgres | 5432 | /root/nr |
| namesranker-app | - | /root/nr |

**Running Node Processes (DO NOT KILL):**
- freebuff: PIDs 281536, 541252
- Next.js servers: PIDs 286742, 322949, 602701
- dist/server.js: PID 604722

**Running Services (DO NOT KILL):**
- Elasticsearch (Java process)
- Cron daemon

**Ports in use (DO NOT BIND):** 80, 443, 5432, 5433, 6379, 8100, 3100, 27017, 9200, 9300

**Disk/Memory:**
- Do NOT run `docker system prune` or similar cleanup commands
- Do NOT attempt to free up memory by killing processes
- Do NOT stop any Docker containers without explicit user permission
