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
- [ ] Configure container registry

## Milestone 1: Backend Bootstrap

- [x] Create Spring Boot Kotlin project
- [x] Configure Gradle Kotlin DSL
- [x] Add health endpoint
- [x] Add Dockerfile
- [x] Create package structure

## Milestone 2: Frontend Bootstrap

- [x] Create Angular project
- [x] Add routing
- [x] Add owner/public modules
- [x] Add API client layer
- [x] Add nginx config
- [x] Add Dockerfile

## Milestone 3: Database

- [x] Set up PostgreSQL
- [ ] Add Flyway
- [ ] Create initial schema

Tables:

- [ ] `users`
- [ ] `tags`
- [ ] `scan_events`
- [ ] `sighting_messages`
- [ ] `magic_link_tokens`

## Milestone 4: Authentication

- [x] Request magic link endpoint
- [x] Consume magic link endpoint
- [ ] Token hashing
- [~] Session auth
- [x] Auth check endpoint
- [x] Logout endpoint

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

- [ ] Backend build workflow
- [ ] Frontend build workflow
- [~] Container builds
- [ ] Push images to registry

## Milestone 10: Preview Environments

- [ ] Helm chart
- [ ] Preview deploy workflow
- [ ] Preview cleanup workflow
- [ ] PR preview URL comment

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
