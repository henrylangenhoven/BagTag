# BagTag Tasks

This is the working backlog for the BagTag MVP.

## Status Legend

- `[ ]` Not started
- `[~]` In progress
- `[x]` Done
- `[-]` Deferred

## Planning

- [x] Choose stack
- [x] Choose monorepo
- [x] Choose GitHub Actions
- [x] Choose k3s deployment
- [x] Choose magic-link auth

## Milestone 0: Repo Bootstrap

- [x] Create repository
- [x] Add README
- [x] Add architecture.md
- [x] Add tasks.md
- [x] Add AGENTS.md
- [x] Add `.gitignore`
- [x] Add `.editorconfig`
- [x] Add `Makefile`
- [~] Configure container registry

## Milestone 1: Backend Bootstrap

- [x] Create Spring Boot Kotlin project
- [x] Configure Gradle Kotlin DSL
- [x] Add health endpoint
- [x] Add Dockerfile
- [x] Create package structure
- [x] Expose OpenAPI docs

## Milestone 2: Frontend Bootstrap

- [x] Create Angular project
- [x] Add routing
- [x] Add owner/public modules
- [x] Add API client layer
- [x] Add nginx config
- [x] Add Dockerfile
- [x] Add checked-in OpenAPI spec
- [x] Add `ng-openapi-gen` client generation
- [x] Add About/status page

## Milestone 3: Database

- [x] Set up PostgreSQL
- [x] Add Flyway
- [x] Create initial schema

Tables:

- [x] `users`
- [x] `tags`
- [x] `scan_events`
- [x] `sighting_messages`
- [x] `magic_link_tokens`

## Milestone 4: Authentication

- [x] Request magic link endpoint
- [x] Consume magic link endpoint
- [x] Token hashing
- [~] Session auth
- [x] Auth check endpoint
- [x] Logout endpoint
- [x] Owner profile display name

## Milestone 5: Tag Management

- [ ] Tag list endpoint
- [ ] Create tag
- [ ] Update tag
- [ ] Tag state handling
- [ ] Owner UI

## Milestone 6: Public Scan Flow

- [ ] Public tag lookup
- [ ] Scan event logging
- [~] Public page UI
- [ ] Owner redirect logic

## Milestone 7: Messages

- [ ] Message submission endpoint
- [ ] Public message form
- [ ] Owner messages list

## Milestone 8: Abuse Protection

- [ ] Rate limiting
- [ ] Message length limits
- [ ] Spam filtering
- [ ] IP hashing
- [ ] Data retention

## Milestone 9: CI

- [x] Backend build workflow
- [x] Frontend build workflow
- [x] Container builds
- [x] Push images to registry
- [ ] Configure GHCR package visibility and pull credentials
- [ ] Verify preview image retention keeps only 3 `pr-<number>-sha-*` versions per app

## Milestone 10: Preview Environments

- [x] Helm chart
- [x] Preview deploy workflow
- [x] Preview cleanup workflow
- [ ] PR preview URL comment
- [ ] Add repo/org variables and secrets for preview deploys:
  - `PREVIEW_BASE_DOMAIN`
  - `KUBE_CONFIG`
  - `GHCR_PULL_USERNAME`
  - `GHCR_PULL_TOKEN`
  - optional Resend and ingress settings
- [ ] Create a dedicated k3s deploy identity and generate a non-local kubeconfig
- [ ] Replace `127.0.0.1` kubeconfig server with the externally reachable k3s API endpoint
- [ ] Verify the k3s API is reachable from GitHub Actions on port `6443`
- [ ] Run the first PR end-to-end and confirm:
  - namespace `bagtag-pr-<number>` is created
  - Helm release deploys successfully
  - GHCR images pull successfully inside the cluster
  - preview namespace is deleted on PR close
  - preview image packages are deleted on PR close

## Milestone 11: Production Deployment

- [ ] Prod Helm values
- [ ] Prod deploy workflow
- [ ] Production secrets
- [ ] Database backups

## Milestone 12: Hardening

- [ ] Structured logging
- [~] Health probes
- [ ] Error handling
- [ ] Real device testing
