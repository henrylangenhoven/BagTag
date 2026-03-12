# BagTag

BagTag is a self-hosted luggage tag system built around QR codes. A scanned tag should open a privacy-preserving public page where someone can report a bag's location without seeing the owner's identity, while the owner manages tags and scan history through an authenticated app.

This repository is currently in the bootstrap stage. The repo structure, core docs, Angular app, Spring Boot app, Helm chart, and CI/deployment placeholders are present, but the product flows described in the architecture are not implemented yet.

## Current State

- `apps/web` is an Angular 21 app with the default starter screen and no feature routes yet.
- `apps/api` is a Spring Boot 4 bootstrap app that currently starts successfully but does not expose BagTag-specific endpoints yet.
- `deploy/` contains Helm and environment scaffolding, but the workflow and deployment scripts are still empty placeholders.
- `docs/architecture.md` describes the intended system shape and product boundaries.
- `docs/tasks.md` is the practical backlog for moving from scaffold to MVP.

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

- Node.js with npm

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

## How To Read This Repo

Start with the code if you want the current truth of the project. Use the docs for intent:

- [`docs/architecture.md`](docs/architecture.md) explains the planned product flows, privacy rules, and target deployment model.
- [`docs/tasks.md`](docs/tasks.md) shows the staged MVP backlog and is a better indicator of what still needs to be built than the folder structure alone.

In practice, the docs are ahead of the implementation right now. The README reflects the codebase as it exists today and uses the docs as the reference for where the project is heading.
