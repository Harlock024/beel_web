from oven/bun:1.2-alpine AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

EXPOSE 4321

CMD ["bun", "run", "index.ts"]
