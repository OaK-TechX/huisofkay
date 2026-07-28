# syntax=docker/dockerfile:1
# Multi-stage build for the Next.js 16 standalone server (homelab/Coolify host).
# The primary host is Netlify; this image is the alternate/fallback deploy.

FROM node:20-alpine AS base
RUN corepack enable
WORKDIR /app

# ---- deps: install with a frozen lockfile ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack prepare pnpm@10.30.3 --activate \
 && pnpm install --frozen-lockfile

# ---- builder: compile the standalone server ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV BUILD_STANDALONE=true
# No DB/secrets at build: pages use ISR and converge to the DB at runtime.
RUN corepack prepare pnpm@10.30.3 --activate \
 && pnpm build

# ---- runner: minimal runtime image ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# Simple healthcheck against the home route.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch(\"http://127.0.0.1:3000/\").then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "server.js"]
