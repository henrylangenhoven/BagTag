# BagTag Architecture

## Purpose

BagTag is a self-hosted web application for creating and managing luggage tags that contain QR codes. When a QR code is scanned, the scanner is taken to a public BagTag page where they can report the whereabouts of the luggage without seeing the owner's personal contact details.

Owners can sign in using magic-link authentication to manage their tags, view scan activity, and read incoming sighting messages.

The primary goal is to deliver a fast, minimal-effort MVP that is safe, privacy-conscious, and easy to deploy on a personal k3s cluster.

---

## Product Goals

- Fast MVP with minimal engineering overhead
- Self-hosted deployment in a personal k3s cluster
- Public QR scan flow that protects owner privacy
- Owner dashboard for tag management
- Privacy-conscious event logging and abuse prevention
- Production environment plus ephemeral preview environments per pull request
- Simple architecture that scales modestly without a rewrite

---

## Non-Goals for v1

- Native mobile apps
- Social login or enterprise SSO
- Microservices
- Complex moderation tooling
- Real-time updates with WebSockets
- Precise geolocation tracking without consent
- Multi-tenant organisation support

---

## High-Level Architecture

BagTag is a monorepo containing:

- Angular frontend served from nginx
- Kotlin Spring Boot backend
- PostgreSQL database
- Helm-based deployment manifests
- GitHub Actions pipelines

### Runtime Components

Web App
Angular SPA providing:

- owner dashboard
- public tag pages

Served by nginx container.

API
Kotlin Spring Boot application.

Responsibilities:

- authentication
- owner tag management
- public scan flow
- message submission
- abuse protection
- retention cleanup

Session-based authentication after magic-link login.

Database
PostgreSQL storing:

- users
- tags
- scan events
- sighting messages
- magic-link tokens

Schema managed using Flyway.

Networking

k3s ingress handles routing and TLS termination.

Example domains:

bagtag.example.com
pr-42.bagtag.example.com

CI/CD

GitHub Actions workflows:

ci.yml
preview.yml
preview-cleanup.yml
prod.yml

---

## Core User Flows

Owner Login

1. Owner enters email
2. Backend generates one-time token
3. Magic link email sent
4. Owner clicks link
5. Backend validates token
6. Session created
7. Owner redirected to dashboard

Owner Tag Management

Owners can:

- create tag
- rename tag
- enable/disable tag
- archive tag
- view scan history
- view messages

Public Scan Flow

1. QR code scanned
2. Browser opens BagTag URL
3. Backend logs scan event
4. Public page displayed
5. Scanner optionally sends message
6. Owner receives message

Owner Scans Own Tag

If authenticated owner scans their own tag:

- system detects ownership
- user redirected to manage flow

---

## Repository Structure

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

---

## Backend Structure

Feature-oriented structure.

apps/api/src/main/kotlin/com/bagtag/

common/
auth/
users/
tags/
publicscan/
abuse/
retention/
notifications/

---

## Frontend Structure

apps/web/src/app

core/
features/auth/
features/owner/
features/public-tag/
shared/

---

## Domain Model

User

id
email
created_at
last_login_at

Tag

id
public_id
owner_user_id
display_name
status
created_at
updated_at

ScanEvent

id
tag_id
scanned_at
ownership_context
ip_hash
user_agent
accept_language
referrer
country_code
region_code
city_approx
message_started_at
message_submitted_at

SightingMessage

id
tag_id
scan_event_id
message
sender_contact_optional
created_at

MagicLinkToken

id
user_id
token_hash
expires_at
consumed_at
created_at

---

## Security and Privacy

QR codes must contain only:

https://bagtag.example.com/t/bt_randomId

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

---

## Abuse Prevention

MVP controls:

- rate limiting
- message length limits
- per-tag cooldown
- spam filtering
- captcha only if suspicious behaviour

---

## API Overview

Public

GET /api/public/tags/{publicId}
POST /api/public/tags/{publicId}/scan
POST /api/public/tags/{publicId}/messages

Auth

POST /api/auth/magic-link/request
POST /api/auth/magic-link/consume
POST /api/auth/logout
GET /api/auth/me

Owner

GET /api/me/tags
POST /api/me/tags
PATCH /api/me/tags/{id}
GET /api/me/tags/{id}/scans
GET /api/me/tags/{id}/messages

---

## Environments

Production

Namespace: bagtag-prod

Preview environments

Namespace pattern:

bagtag-pr-123

Hostname pattern:

pr-123.bagtag.example.com

Destroyed automatically when PR closes.

---

## Recommended MVP Delivery Order

1. Repo bootstrap
2. Backend skeleton
3. Frontend skeleton
4. PostgreSQL + Flyway
5. Magic-link login
6. Tag CRUD
7. Public tag page
8. Scan logging
9. Message submission
10. Owner dashboard
11. Abuse protection
12. CI pipeline
13. Preview environments
14. Production deployment
