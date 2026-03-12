# AGENTS.md

This document explains the BagTag project to AI coding agents.

---

## Project Summary

BagTag is a self-hosted luggage tag system.

Each luggage tag has a QR code.

When scanned:

1. the scanner lands on a BagTag page
2. they can send a message about the bag location
3. the owner identity is never exposed

Owners log in via magic-link authentication to manage tags and view scan history and messages.

The project prioritizes fast MVP delivery and privacy-conscious design.

---

## Technology Stack

Frontend
Angular SPA

Backend
Kotlin Spring Boot

Auth
Magic-link login

Database
PostgreSQL

Deployment
k3s Kubernetes

CI/CD
GitHub Actions

---

## Repository Structure

apps/web
apps/api
deploy/
docs/
.github/
AGENTS.md

---

## Core Product Rules

1. QR codes contain only a random public tag ID.
2. Public pages must never reveal owner contact info.
3. Owners scanning their own tag should see the manage view.
4. Non-owners should see the public reporting flow.
5. Scan events should be logged early but respect privacy.
6. Exact location collected only with user consent.
7. Magic-link tokens must be hashed and short-lived.

---

## Engineering Philosophy

Prefer:

- simple solutions
- fast MVP delivery
- maintainable code

Avoid:

- microservices
- complex auth
- premature abstractions

---

## Backend Structure

Feature-oriented:

common/
auth/
users/
tags/
publicscan/
abuse/
retention/
notifications/

Controllers remain thin.

Business logic goes in services.

Repositories handle persistence.

---

## Frontend Structure

core/
features/auth/
features/owner/
features/public-tag/
shared/

Owner and public flows should remain clearly separated.

---

## CI/CD

Workflows:

ci.yml
preview.yml
preview-cleanup.yml
prod.yml

Preview environments

Namespace:

bagtag-pr-<number>

URL:

pr-<number>.bagtag.example.com

Destroyed automatically when PR closes.

---

## Privacy Constraints

Never expose owner identity publicly.

Avoid storing raw IP addresses long term.

Prefer coarse location.

Exact location must be user-initiated.

---

## MVP Definition

The MVP is complete when:

- owner can login via magic link
- owner can create tags
- tags have QR URLs
- scanners can send messages
- scan events are recorded
- owner can view scans and messages
- system deploys to k3s
- PR preview environments work

---

## Development Approach

Work in small PRs.

Focus on vertical slices.

Prefer working features over perfect abstractions.

Ship the MVP first.
