![BagTag logo](apps/web/public/BagTag-Logo-Large.png)

# BagTag

BagTag is a self-hosted luggage tag system built around QR codes. A scanned tag should open a privacy-preserving public page where someone can report a bag's location without seeing the owner's identity, while the owner manages tags and scan history through an authenticated app.

The repository is currently in the bootstrap stage. The core repo structure, docs, Angular app, Spring Boot app, Helm chart, and CI/deployment placeholders exist, but the product flows described in the architecture are not implemented yet.

## Current State

- `apps/web` is an Angular 21 app with the default starter screen and no feature routes yet.
- `apps/api` is a Spring Boot 4 bootstrap app that starts successfully but does not expose BagTag-specific endpoints yet.
- `deploy/` contains Helm and environment scaffolding, but the workflow and deployment scripts are still placeholders.
- `docs/architecture.md` describes the intended product and system design.
- `docs/tasks.md` tracks the MVP backlog.

## Repository Layout

```text
apps/
  api/      Spring Boot backend bootstrap
  web/      Angular frontend bootstrap
deploy/     Helm chart, env values, deploy script placeholders
docs/       Architecture, tasks, and ADRs
```

## Local Development

### Frontend

Requirements:

- Node.js
- npm

Run:

```bash
cd apps/web
npm install
npm start
```

The Angular dev server runs at `http://localhost:4200`.

### Backend

Requirements:

- Java 25

Run:

```bash
cd apps/api
./gradlew bootRun
```

Run tests:

```bash
cd apps/api
./gradlew test
```

## Containers

Each app now has its own Dockerfile:

- `apps/web/Dockerfile` builds the Angular app and serves it from Nginx.
- `apps/api/Dockerfile` builds a Spring Boot jar and runs it on Java 25.

Run the full local stack with Docker Compose from the repo root:

```bash
docker compose up --build
```

Services:

- Web UI: `http://localhost:8080`
- API: `http://localhost:8081`
- Postgres: `localhost:5432`

The web container proxies `/api/*` to the API container, which keeps the browser-side shape close to a future ingress setup in Kubernetes.

Optional email and magic-link configuration:

```bash
export RESEND_API_KEY=...
export RESEND_FROM_EMAIL=hello@your-domain.example
export RESEND_FROM_NAME=BagTag
export RESEND_REPLY_TO=support@your-domain.example
docker compose up --build
```

## Documentation Map

Use the code for the current truth of the project and the docs for target shape and backlog:

- [`docs/architecture.md`](docs/architecture.md) explains the planned system, privacy model, flows, and deployment approach.
- [`docs/tasks.md`](docs/tasks.md) is the working MVP backlog.

The docs are intentionally ahead of implementation right now.

## Versioning

BagTag uses repo-wide SemVer with a single canonical version in [`VERSION`](VERSION).

Update it with:

```bash
./scripts/version.sh bump patch
./scripts/version.sh bump minor
./scripts/version.sh bump major
./scripts/version.sh set 0.2.0
```

The script syncs version metadata across the backend, frontend, and Helm chart. GitHub Actions can also run the same tool through the `Version Bump` workflow.
