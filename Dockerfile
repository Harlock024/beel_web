# ---------- Dependencies ----------
from oven/bun:1.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile
# ---------- Builder ----------
from deps AS builder
WORKDIR /app
ARG PUBLIC_BEEL_API
ARG ALLOW_ORIGINS
ENV PUBLIC_BEEL_API=$PUBLIC_BEEL_API
ENV ALLOW_ORIGINS=$ALLOW_ORIGINS
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build
#---------- Runner ----------
from builder as runner
WORKDIR /app
ARG BUN_PORT
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=$BUN_PORT
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock* ./
EXPOSE $BUN_PORT
CMD ["bun", "dist/server/entry.mjs"]
