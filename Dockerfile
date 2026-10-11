# Stage 1: Base Image
FROM node:20-alpine AS base

# Stage 2: Install Dependensi Bersih
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 3: Builder Kompilasi Aplikasi
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Matikan telemetri Next.js saat build untuk mempercepat kompilasi
ENV NEXT_TELEMETRY_DISABLED=1

# Variabel Lingkungan Build-Time Default untuk validasi Zod (lib/env.ts)
ENV NEST_API_URL=http://backend:3001
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV JWT_ACCESS_SECRET=min-32-characters-secret-key-farhancoders
ENV NODE_ENV=production

# Jalankan build standalone
RUN npm run build

# Stage 4: Production Runner (Image Ramping & Aman)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DOCKER_CONTAINER=true

# Standar Keamanan Enterprise: Buat Akun Non-Root User
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Salin aset publik dan standalone bundle dari stage builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Aktifkan non-root user
USER nextjs

EXPOSE 3000

# Jalankan server minimalis Next.js
CMD ["node", "server.js"]
