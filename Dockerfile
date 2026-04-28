# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# IMS Frontend container build
#
# Vite bakes env vars into the bundle at build time, so VITE_API_URL must be
# passed as a build arg — it cannot be overridden at container start. If you
# need different builds per environment, build separate images.
# ---------------------------------------------------------------------------

# ----- build stage ---------------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Manifest first → cache npm install across source changes.
COPY package.json package-lock.json* bun.lockb* ./

# Prefer npm ci when a lockfile exists for reproducible installs; fall back
# to npm install if only package.json was copied.
RUN if [ -f package-lock.json ]; then \
        npm ci --no-audit --no-fund; \
    else \
        npm install --no-audit --no-fund; \
    fi

# Build args feed Vite (`import.meta.env.*`). Anything you want at runtime in
# the SPA must be declared here AND consumed via `import.meta.env.VITE_...`.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY . .
RUN npm run build

# ----- runtime stage -------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Replace the default site with one that knows about SPA history-mode routing.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets only — nginx serves them directly. No node, no Vite, no source.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck deliberately omitted — define it in docker-compose.yml or your
# k8s probe so the runtime owns the policy (interval, retries, command tool).
