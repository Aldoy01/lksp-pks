from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SECRET_KEY: str = "iksp-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    DATABASE_URL: str = "sqlite:///./iksp.db"

    # CORS: comma-separated list of allowed origins
    # Contoh: "https://iksp.railway.app,https://iksp.vercel.app"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173"

    class Config:
        env_file = ".env"


settings = Settings()
