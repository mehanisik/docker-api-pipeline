# DevOps Task 1

Simple Express HTTP server running on Bun, packaged as a Docker container with GitHub Actions CI/CD.

## Endpoints

| Route | Description |
|---|---|
| `GET /health-check` | Returns `{"status": "ok"}` |
| `GET /hello-world` | Returns the `SERVER_HELLO` env variable |
| `GET /home` | Optional dashboard UI |

## Quick Start

### Local development

```bash
bun install
cp .env.example .env
bun run dev
```

### Docker

Build and run with a single command:

```bash
docker compose up --build -d
```

The server starts at `http://localhost:8000`.

Stop everything:

```bash
docker compose down
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `8000` | Server port |
| `HOST` | `localhost` | Server host |
| `NODE_ENV` | `development` | Environment mode |
| `SERVER_HELLO` | `Hello World!` | Message for `/hello-world` |
| `DATABASE_URL` | - | PostgreSQL connection string |

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start development server |
| `bun run lint` | Lint and fix with Biome |
| `bun run lint:check` | Lint without fixing (CI) |
| `bun run format` | Format and fix with Biome |
| `bun run format:check` | Format check without fixing (CI) |

## CI/CD Pipelines

### Build Pipeline (`build.yml`)

Triggers on push to `main` when `src/**`, `Dockerfile`, `package.json`, or `bun.lock` change.

Steps:
1. Checks out the code
2. Logs in to GitHub Container Registry (GHCR)
3. Builds the Docker image
4. Pushes with `latest` and git SHA tags

### Code Quality Pipeline (`code-quality.yml`)

Triggers on pull requests to `main`.

Steps:
1. Installs Bun and dependencies
2. Runs Biome lint check
3. Runs Biome format check

## Docker Details

The Dockerfile uses a multi-stage build:

- **base** - Sets up Bun with the working directory
- **install** - Installs production dependencies only
- **release** - Slim image with non-root `bun` user, health check, and OCI labels

The container runs as a non-root user and includes a built-in health check that pings `/health-check` every 30 seconds.

## Tech Stack

- [Bun](https://bun.sh/) - Runtime
- [Express](https://expressjs.com/) - HTTP framework
- [Helmet](https://helmetjs.github.io/) - Security headers
- [Pino](https://getpino.io/) - Logging
- [Biome](https://biomejs.dev/) - Linting and formatting
- [PostgreSQL](https://www.postgresql.org/) - Database (via [Neon](https://neon.tech/))
