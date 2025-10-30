# ---------- Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copia solo manifiestos para cache de dependencias
COPY package*.json ./
RUN npm ci

# Copia el resto del código
COPY . .

# Build de producción (genera .next/standalone)
RUN npm run build

# ---------- Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copiamos la salida standalone de Next + public + package.json
COPY --from=builder /app/.next/standalone ./        
COPY --from=builder /app/public ./public            
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
