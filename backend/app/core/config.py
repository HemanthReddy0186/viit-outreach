from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "VIIT Outreach API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # SQLite default for zero-cost local dev, compatible with PostgreSQL
    DATABASE_URL: str = "sqlite+aiosqlite:///./viit_outreach.db"
    
    # CORS: Allow frontend dev servers and Vercel production domains
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://viit-outreach.vercel.app"
    ]
    
    # Telephony configuration (Prerecorded Telugu IVR mode by default)
    TELEPHONY_MODE: str = "PRERECORDED_TELUGU"  # "PRERECORDED_TELUGU" or "AI_AGENT"
    
    model_config = SettingsConfigDict(case_sensitive=True)

settings = Settings()
