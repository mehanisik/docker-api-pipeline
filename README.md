# BuildBox API

Express HTTP server running on Bun, packaged as a Docker container with GitHub Actions CI/CD pipeline deploying to GCP Cloud Run.

Part of the [buildbox-lab](https://github.com/buildbox-lab) organization.

## Live Endpoints

| Environment | URL |
| ----------- | --- |
| Production  | https://buildbox-api-482567119401.europe-west1.run.app |
| Development | https://buildbox-api-dev-482567119401.europe-west1.run.app |

## API Routes

| Route               | Description          |
| ------------------- | -------------------- |
| `GET /health-check` | Returns `{"status": "ok"}` |
| `GET /api`          | Swagger API explorer |

## Quick Start

### Local Development

```bash
bun install
cp .env.example .env
bun run dev
```

### Docker

```bash
docker compose up --build -d
```

Server starts at `http://localhost:8000`.

```bash
docker compose down
```

## Environment Variables

| Variable       | Default       | Description                  |
| -------------- | ------------- | ---------------------------- |
| `PORT`         | `8000`        | Server port                  |
| `HOST`         | `localhost`   | Server host                  |
| `NODE_ENV`     | `development` | Environment mode             |
| `DATABASE_URL` | -             | PostgreSQL connection string |

## Scripts

| Command                | Description              |
| ---------------------- | ------------------------ |
| `bun run dev`          | Start development server |
| `bun run lint`         | Lint and fix with Biome  |
| `bun run lint:check`   | Lint check (CI)          |
| `bun run format`       | Format with Biome        |
| `bun run format:check` | Format check (CI)        |
| `bun test`             | Run tests                |

## CI/CD

### Code Quality (`code-quality.yml`)

Runs on pull requests to `main`:
- Biome lint check
- Biome format check

### Deploy (`deploy.yml`)

Runs on push to `main`:
1. Test (lint, format, unit tests)
2. Build Docker image and scan with Trivy
3. Push to GCP Artifact Registry
4. Deploy to Cloud Run (dev -> production)

## Tech Stack

- [Bun](https://bun.sh/) - Runtime
- [Express](https://expressjs.com/) - HTTP framework
- [Pino](https://getpino.io/) - Logging
- [Biome](https://biomejs.dev/) - Linting/formatting
- [Lefthook](https://github.com/evilmartians/lefthook) - Git hooks
- [PostgreSQL](https://www.postgresql.org/) - Database
- [GCP Cloud Run](https://cloud.google.com/run) - Hosting
