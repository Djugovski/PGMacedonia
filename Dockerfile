# ---- 1. build stage ------------------------------------------------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps (cached layer).
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Copy the source needed to build the server bundle.
COPY tsconfig*.json ./
COPY scripts ./scripts
COPY server ./server

RUN npm run build:server

# ---- 2. runtime stage ---------------------------------------------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Only runtime deps — the bundle leaves third-party packages external.
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

COPY --from=build /app/dist-server ./dist-server

# Calendar state lives here by default — mount a volume at /app/data in prod
# (Render disk, Fly volume, Docker volume) to persist it across restarts.
ENV CALENDAR_DATA_FILE=/app/data/calendar.json
RUN mkdir -p /app/data && chown -R node:node /app
USER node

EXPOSE 8787
CMD ["node", "dist-server/index.cjs"]
