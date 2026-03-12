bootstrap:
\tbash scripts/bootstrap.sh

dev-backend:
\tcd apps/api && ./gradlew bootRun

dev-frontend:
\tcd apps/web && npm start
