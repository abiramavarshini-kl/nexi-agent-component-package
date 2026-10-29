# syntax=docker/dockerfile:1

# ── 1. install the library's dependencies ────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts: `prepare` builds the library, but the sources aren't copied yet
RUN npm ci --ignore-scripts

# ── 2. build the library (dist/) ─────────────────────────────────────────
FROM deps AS build
COPY . .
RUN npm run build

# ── 3. test: `docker build --target test .` runs the smoke test ───────────
FROM build AS test
RUN node --import tsx test/smoke.test.tsx

# ── 4. dev: `docker compose up dev` — Vite dev server for the playground ──
FROM build AS dev
WORKDIR /app/playground
RUN npm install
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ── 5. build the playground (static site) ────────────────────────────────
FROM build AS playground
WORKDIR /app/playground
RUN npm install && npm run build

# ── 6. serve the playground with nginx (default target) ──────────────────
FROM nginx:1.27-alpine AS web
COPY --from=playground /app/playground/dist /usr/share/nginx/html
EXPOSE 80
