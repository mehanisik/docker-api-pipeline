ARG BUN_VERSION=1

# --- install deps (cached layer) ---
FROM oven/bun:${BUN_VERSION} AS install
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production --ignore-scripts

# --- release ---
FROM oven/bun:${BUN_VERSION}-slim AS release
WORKDIR /app

COPY --from=install --chown=bun:bun /app/node_modules ./node_modules
COPY --chown=bun:bun src ./src
COPY --chown=bun:bun package.json ./
RUN mkdir -p /app/logs && chown bun:bun /app/logs

USER bun
EXPOSE 8000/tcp

ENV NODE_ENV=production \
    PORT=8000

LABEL org.opencontainers.image.source="https://github.com/mehanisik/docker-api-pipeline" \
      org.opencontainers.image.description="DevOps Task 1 - Express HTTP Server"

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --eval "fetch('http://localhost:8000/health-check').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

ENTRYPOINT ["bun", "run", "src/index.ts"]
