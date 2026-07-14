# ---------- Dependencies ----------
from oven/bun:1.2-alpine AS deps

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile


# ---------- Builder ----------
from oven/bun:1.2-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bun run build

#---------- Runner ----------
from oven/bun:1.2-alpine 

WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=7272

COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock* ./
EXPOSE 7272
CMD ["bun", "./dist/server/entry.mjs"]
