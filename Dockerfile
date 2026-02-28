# ─────────────────────────────────────────────────────────────────
# Stage 1: Build React frontend
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci --prefer-offline

COPY frontend/ ./
RUN npm run build
# Output: /frontend/dist/


# ─────────────────────────────────────────────────────────────────
# Stage 2: Python backend + serve frontend
# ─────────────────────────────────────────────────────────────────
FROM python:3.12-slim

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source
COPY backend/ ./

# Copy frontend build dari stage 1
COPY --from=frontend-builder /frontend/dist /app/frontend_dist/

# Direktori untuk database SQLite (di-mount sebagai volume)
RUN mkdir -p /data

# Environment variables default
ENV FRONTEND_DIST=/app/frontend_dist
ENV DATABASE_URL=sqlite:////data/iksp.db
ENV SECRET_KEY=GANTI_DENGAN_SECRET_KEY_YANG_KUAT
ENV CORS_ORIGINS=*

EXPOSE 8000

# Gunakan gunicorn + uvicorn worker untuk production
# Pakai sh -c agar $PORT dari Railway bisa di-expand
CMD ["sh", "-c", "gunicorn main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --bind 0.0.0.0:${PORT:-8000} --timeout 120"]
