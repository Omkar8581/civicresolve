# CivicResolve Full-Stack Production Container
FROM oven/bun:1.2-slim AS builder

WORKDIR /app

# 1. Build Frontend
COPY frontend/package.json frontend/bun.lock* ./frontend/
RUN cd frontend && bun install --frozen-lockfile || bun install

COPY frontend/ ./frontend/
RUN cd frontend && bun run build

# 2. Production Runner
FROM oven/bun:1.2-slim AS runner

WORKDIR /app

# Install Python for AI Microservice
RUN apt-get update && apt-get install -y python3 python3-pip curl && rm -rf /var/lib/apt/lists/*

# Copy backend dependencies and source
COPY backend/package.json backend/bun.lock* ./backend/
RUN cd backend && bun install --production

COPY backend/ ./backend/
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY ai-service/ ./ai-service/

# Install Python requirements
RUN cd ai-service && pip3 install -r requirements.txt --break-system-packages

ENV NODE_ENV=production
ENV PORT=5001
ENV AI_SERVICE_URL=http://localhost:8000

EXPOSE 5001

# Start both AI Service and Backend API
CMD python3 -m uvicorn ai-service.main:app --host 0.0.0.0 --port 8000 & bun backend/server.js
