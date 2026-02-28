import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.core.config import settings
from app.db.database import Base, engine, SessionLocal
from app.db.seed import seed_database
from app.api import auth, wilayah, input_data, kalkulasi, skor, peta, dashboard, admin

# Lokasi frontend build (override via env var FRONTEND_DIST di production)
FRONTEND_DIST = Path(
    os.getenv("FRONTEND_DIST", str(Path(__file__).parent.parent / "frontend" / "dist"))
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="IKSP Early Warning System API",
    description="Sistem Pemantauan Indeks Kerawanan Sosial-Politik Indonesia",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — baca dari settings (bisa di-override via env var CORS_ORIGINS)
cors_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router)
app.include_router(wilayah.router)
app.include_router(input_data.router)
app.include_router(kalkulasi.router)
app.include_router(skor.router)
app.include_router(peta.router)
app.include_router(dashboard.router)
app.include_router(admin.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}


# ── Serve React frontend build (production) ──────────────────────────────────
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

    @app.get("/", include_in_schema=False)
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str = ""):
        static_file = FRONTEND_DIST / full_path
        if static_file.is_file():
            return FileResponse(static_file)
        return FileResponse(FRONTEND_DIST / "index.html")

else:
    @app.get("/")
    def root():
        return {
            "message": "IKSP Early Warning System API",
            "docs": "/docs",
            "note": "Frontend belum di-build. Jalankan: cd frontend && npm run build"
        }
