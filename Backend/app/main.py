import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router
from .services.runtime_service import trigger_backend_warmup


def _resolve_allowed_origins() -> list[str]:
    origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    }

    configured = os.getenv("CORS_ALLOW_ORIGINS", "")
    origins.update(
        origin.strip().rstrip("/")
        for origin in configured.split(",")
        if origin.strip()
    )
    return sorted(origins)


@asynccontextmanager
async def lifespan(_: FastAPI):
    trigger_backend_warmup()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_resolve_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
