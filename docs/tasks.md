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

- [ ] Create repository
- [ ] Add README
- [ ] Add architecture.md
- [ ] Add tasks.md
- [ ] Add AGENTS.md
- [ ] Add `.gitignore`
- [ ] Add `.editorconfig`
- [ ] Add `Makefile`
- [ ] Configure container registry

## Milestone 1: Backend Bootstrap

- [ ] Create Spring Boot Kotlin project
- [ ] Configure Gradle Kotlin DSL
- [ ] Add health endpoint
- [ ] Add Dockerfile
- [ ] Create package structure

## Milestone 2: Frontend Bootstrap

- [ ] Create Angular project
- [ ] Add routing
- [ ] Add owner/public modules
- [ ] Add API client layer
- [ ] Add nginx config
- [ ] Add Dockerfile

## Milestone 3: Database

- [ ] Set up PostgreSQL
- [ ] Add Flyway
- [ ] Create initial schema

Tables:

- [ ] `users`
- [ ] `tags`
- [ ] `scan_events`
- [ ] `sighting_messages`
- [ ] `magic_link_tokens`

## Milestone 4: Authentication

- [ ] Request magic link endpoint
- [ ] Consume magic link endpoint
- [ ] Token hashing
- [ ] Session auth
- [ ] Auth check endpoint
- [ ] Logout endpoint

## Milestone 5: Tag Management

- [ ] Tag list endpoint
- [ ] Create tag
- [ ] Update tag
- [ ] Tag state handling
- [ ] Owner UI

## Milestone 6: Public Scan Flow

- [ ] Public tag lookup
- [ ] Scan event logging
- [ ] Public page UI
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
- [ ] Container builds
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
- [ ] Health probes
- [ ] Error handling
- [ ] Real device testing
