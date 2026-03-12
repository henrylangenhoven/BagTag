# BagTag Architecture

## Purpose

BagTag is a self-hosted web application for creating and managing luggage tags that contain QR codes. When a QR code is scanned, the scanner lands on a public BagTag page where they can report the whereabouts of the luggage without seeing the owner's personal contact details.

Owners sign in using magic-link authentication to manage tags, view scan activity, and read incoming sighting messages.

The goal is a fast, privacy-conscious MVP that is easy to deploy on a personal k3s cluster.

## Product Goals

- Fast MVP with minimal engineering overhead
- Self-hosted deployment on a personal k3s cluster
- Public QR scan flow that protects owner privacy
- Owner dashboard for tag management
- Privacy-conscious event logging and abuse prevention
- Production plus ephemeral preview environments per pull request
- Simple architecture that can scale modestly without a rewrite

## Non-Goals for v1

- Native mobile apps
- Social login or enterprise SSO
- Microservices
- Complex moderation tooling
- Real-time updates with WebSockets
- Precise geolocation tracking without consent
- Multi-tenant organisation support

## High-Level Architecture

BagTag is a monorepo containing:

- Angular frontend served from nginx
- Kotlin Spring Boot backend
- PostgreSQL database
- Helm-based deployment manifests
- GitHub Actions pipelines

### Runtime Components

#### Web App

Angular SPA providing:

- owner dashboard
- public tag pages

Served by an nginx container.

#### API

Kotlin Spring Boot application responsible for:

- authentication
- owner tag management
- public scan flow
- message submission
- abuse protection
- retention cleanup

Session-based authentication is used after magic-link login.

#### Database

PostgreSQL stores:

- users
- tags
- scan events
- sighting messages
- magic-link tokens

Schema changes are managed using Flyway.

#### Networking

k3s ingress handles routing and TLS termination.

Example domains:

- `bagtag.example.com`
- `pr-42.bagtag.example.com`

#### CI/CD

GitHub Actions workflows:

- `ci.yml`
- `preview.yml`
- `preview-cleanup.yml`
- `prod.yml`

## Core User Flows

### Owner Login

1. Owner enters email.
2. Backend generates a one-time token.
3. Magic-link email is sent.
4. Owner clicks the link.
5. Backend validates the token.
6. A session is created.
7. Owner is redirected to the dashboard.

### Owner Tag Management

Owners can:

- create tags
- rename tags
- enable or disable tags
- archive tags
- view scan history
- view messages

### Public Scan Flow

1. QR code is scanned.
2. Browser opens the BagTag URL.
3. Backend logs the scan event.
4. Public page is displayed.
5. Scanner can optionally send a message.
6. Owner receives the message.

### Owner Scans Own Tag

If the authenticated owner scans their own tag:

- the system detects ownership
- the user is redirected to the manage flow

## Repository Structure

```text
bagtag/
├─ apps/
│  ├─ web/
│  └─ api/
├─ deploy/
│  ├─ helm/
│  ├─ environments/
│  └─ scripts/
├─ docs/
│  ├─ architecture.md
│  ├─ tasks.md
│  └─ adr/
├─ .github/
│  └─ workflows/
├─ AGENTS.md
├─ README.md
└─ Makefile
```

## Backend Structure

Feature-oriented structure under `apps/api/src/main/kotlin/com/bagtag/`:

```text
common/
auth/
users/
tags/
publicscan/
abuse/
retention/
notifications/
```

## Frontend Structure

Planned structure under `apps/web/src/app`:

```text
core/
features/auth/
features/owner/
features/public-tag/
shared/
```

## Domain Model

### User

- `id`
- `email`
- `created_at`
- `last_login_at`

### Tag

- `id`
- `public_id`
- `owner_user_id`
- `display_name`
- `status`
- `created_at`
- `updated_at`

### ScanEvent

- `id`
- `tag_id`
- `scanned_at`
- `ownership_context`
- `ip_hash`
- `user_agent`
- `accept_language`
- `referrer`
- `country_code`
- `region_code`
- `city_approx`
- `message_started_at`
- `message_submitted_at`

### SightingMessage

- `id`
- `tag_id`
- `scan_event_id`
- `message`
- `sender_contact_optional`
- `created_at`

### MagicLinkToken

- `id`
- `user_id`
- `token_hash`
- `expires_at`
- `consumed_at`
- `created_at`

## Security and Privacy

QR codes must contain only a public tag URL, for example:

```text
https://bagtag.example.com/t/bt_randomId
```

Never include:

- email
- phone
- internal database IDs

Authentication uses magic-link login.

Tokens must:

- be short-lived
- be hashed in the database
- be single-use

Session cookies are HTTP-only.

## Abuse Prevention

MVP controls:

- rate limiting
- message length limits
- per-tag cooldown
- spam filtering
- captcha only for suspicious behaviour

## API Overview

### Public

- `GET /api/public/tags/{publicId}`
- `POST /api/public/tags/{publicId}/scan`
- `POST /api/public/tags/{publicId}/messages`

### Auth

- `POST /api/auth/magic-link/request`
- `POST /api/auth/magic-link/consume`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Owner

- `GET /api/me/tags`
- `POST /api/me/tags`
- `PATCH /api/me/tags/{id}`
- `GET /api/me/tags/{id}/scans`
- `GET /api/me/tags/{id}/messages`

## Environments

### Production

- Namespace: `bagtag-prod`

### Preview Environments

- Namespace pattern: `bagtag-pr-123`
