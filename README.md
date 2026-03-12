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

## Documentation Map

Use the code for the current truth of the project and the docs for target shape and backlog:

- [`docs/architecture.md`](docs/architecture.md) explains the planned system, privacy model, flows, and deployment approach.
- [`docs/tasks.md`](docs/tasks.md) is the working MVP backlog.

The docs are intentionally ahead of implementation right now.
