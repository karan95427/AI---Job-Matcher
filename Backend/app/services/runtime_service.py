from __future__ import annotations

import logging
from time import perf_counter

from fastapi import HTTPException

from ..db import init_database
from ..runtime_state import backend_runtime_state
from .faiss_service import ensure_faiss_index
from .recommendation_service import load_jobs


logger = logging.getLogger(__name__)


def _log_startup_summary(
    *,
    database_ready: bool,
    jobs_loaded: int,
    faiss_ready: bool,
    backend_ready: bool,
    reason: str | None = None,
) -> None:
    lines = [
        "Startup Summary",
        "---------------",
        f"Database: {'PASS' if database_ready else 'FAIL'}",
        f"Jobs Loaded: {jobs_loaded}",
        f"FAISS: {'PASS' if faiss_ready else 'FAIL'}",
        f"Backend Ready: {'TRUE' if backend_ready else 'FALSE'}",
    ]
    if reason:
        lines.append(f"Reason: {reason}")
    logger.info("\n".join(lines))


def warmup_backend_dependencies() -> None:
    warmup_started_at = perf_counter()
    database_ready = False
    jobs_loaded = 0
    faiss_ready = False

    logger.info("Starting database initialization... stage=database")
    database_started_at = perf_counter()
    try:
        init_database()
        database_elapsed = perf_counter() - database_started_at
        backend_runtime_state.mark_database_ready()
        database_ready = True
        logger.info(
            "Database initialized successfully. stage=database elapsed=%.2fs",
            database_elapsed,
        )
    except Exception as exc:
        database_elapsed = perf_counter() - database_started_at
        logger.exception(
            "Warmup stage failed. stage=database elapsed=%.2fs",
            database_elapsed,
        )
        backend_runtime_state.mark_failure(
            stage="database",
            message=str(exc) or exc.__class__.__name__,
        )
        _log_startup_summary(
            database_ready=database_ready,
            jobs_loaded=jobs_loaded,
            faiss_ready=faiss_ready,
            backend_ready=False,
            reason=str(exc) or exc.__class__.__name__,
        )
        return

    logger.info("Loading jobs... stage=jobs")
    jobs_started_at = perf_counter()
    try:
        jobs = load_jobs()
        jobs_elapsed = perf_counter() - jobs_started_at
        jobs_loaded = len(jobs)
        if jobs_loaded == 0:
            raise RuntimeError("No jobs found in database. Backend cannot become ready.")
        logger.info(
            "Jobs loaded successfully. stage=jobs count=%s elapsed=%.2fs",
            jobs_loaded,
            jobs_elapsed,
        )
    except Exception as exc:
        jobs_elapsed = perf_counter() - jobs_started_at
        logger.exception(
            "Warmup stage failed. stage=jobs elapsed=%.2fs",
            jobs_elapsed,
        )
        backend_runtime_state.mark_failure(
            stage="index",
            message=str(exc) or exc.__class__.__name__,
            preserve_database=True,
        )
        _log_startup_summary(
            database_ready=database_ready,
            jobs_loaded=jobs_loaded,
            faiss_ready=faiss_ready,
            backend_ready=False,
            reason=str(exc) or exc.__class__.__name__,
        )
        return

    logger.info("Building FAISS index... stage=faiss")
    faiss_started_at = perf_counter()
    try:
        ensure_faiss_index(jobs)
        faiss_elapsed = perf_counter() - faiss_started_at
        backend_runtime_state.mark_index_ready(len(jobs))
        faiss_ready = True
        logger.info(
            "FAISS index built successfully. stage=faiss elapsed=%.2fs",
            faiss_elapsed,
        )

        if not database_ready:
            raise RuntimeError("Database initialization did not complete. Backend cannot become ready.")
        if jobs_loaded <= 0:
            raise RuntimeError("No jobs found in database. Backend cannot become ready.")
        if not faiss_ready:
            raise RuntimeError("FAISS index validation did not complete. Backend cannot become ready.")

        backend_runtime_state.mark_ready()
        warmup_elapsed = perf_counter() - warmup_started_at
        logger.info(
            "Backend marked READY. stage=warmup elapsed=%.2fs",
            warmup_elapsed,
        )
        _log_startup_summary(
            database_ready=database_ready,
            jobs_loaded=jobs_loaded,
            faiss_ready=faiss_ready,
            backend_ready=True,
        )
    except Exception as exc:
        faiss_elapsed = perf_counter() - faiss_started_at
        logger.exception(
            "Warmup stage failed. stage=faiss elapsed=%.2fs",
            faiss_elapsed,
        )
        backend_runtime_state.mark_failure(
            stage="index",
            message=str(exc) or exc.__class__.__name__,
            preserve_database=True,
        )
        _log_startup_summary(
            database_ready=database_ready,
            jobs_loaded=jobs_loaded,
            faiss_ready=faiss_ready,
            backend_ready=False,
            reason=str(exc) or exc.__class__.__name__,
        )


def trigger_backend_warmup() -> None:
    backend_runtime_state.start_warmup(warmup_backend_dependencies)


def get_backend_status() -> dict:
    return backend_runtime_state.snapshot()


def ensure_backend_ready() -> None:
    trigger_backend_warmup()

    if backend_runtime_state.is_ready():
        return

    snapshot = backend_runtime_state.snapshot()
    raise HTTPException(
        status_code=503,
        detail=snapshot["message"],
    )
