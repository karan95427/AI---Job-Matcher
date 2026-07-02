from __future__ import annotations

import logging
from threading import Event, Thread
from time import perf_counter

from fastapi import HTTPException

from ..db import init_database
from ..runtime_state import backend_runtime_state
from .faiss_service import ensure_faiss_index
from .recommendation_service import load_jobs


logger = logging.getLogger(__name__)


def _flush_logs() -> None:
    for handler in logger.handlers:
        try:
            handler.flush()
        except Exception:
            pass

    root_logger = logging.getLogger()
    if root_logger is logger:
        return

    for handler in root_logger.handlers:
        try:
            handler.flush()
        except Exception:
            pass


def _emit(message: str, *args: object) -> None:
    formatted = message % args if args else message
    print(formatted, flush=True)
    logger.info(message, *args)
    _flush_logs()


def _emit_exception(message: str, *args: object) -> None:
    formatted = message % args if args else message
    print(formatted, flush=True)
    logger.exception(message, *args)
    _flush_logs()


class _StageHeartbeat:
    def __init__(self, stage: str, started_at: float) -> None:
        self._stage = stage
        self._started_at = started_at
        self._stop_event = Event()
        self._thread = Thread(target=self._run, daemon=True)

    def start(self) -> None:
        self._thread.start()

    def stop(self) -> None:
        self._stop_event.set()
        self._thread.join(timeout=0.1)

    def _run(self) -> None:
        while not self._stop_event.wait(timeout=5):
            elapsed = perf_counter() - self._started_at
            _emit(
                "Warmup stage still running. stage=%s elapsed=%.2fs",
                self._stage,
                elapsed,
            )


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
    _emit("\n".join(lines))


def warmup_backend_dependencies() -> None:
    warmup_started_at = perf_counter()
    database_ready = False
    jobs_loaded = 0
    faiss_ready = False

    _emit("Warmup thread started. stage=warmup")

    database_started_at = perf_counter()
    database_heartbeat = _StageHeartbeat("database", database_started_at)
    _emit("Before init_database(). stage=database")
    _emit("Starting database initialization... stage=database")
    database_heartbeat.start()
    try:
        init_database()
        _emit("After init_database(). stage=database")
        database_elapsed = perf_counter() - database_started_at
        backend_runtime_state.mark_database_ready()
        database_ready = True
        _emit(
            "Database initialized successfully. stage=database elapsed=%.2fs",
            database_elapsed,
        )
    except Exception as exc:
        database_elapsed = perf_counter() - database_started_at
        _emit_exception(
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
    finally:
        database_heartbeat.stop()

    jobs_started_at = perf_counter()
    jobs_heartbeat = _StageHeartbeat("jobs", jobs_started_at)
    _emit("Before load_jobs(). stage=jobs")
    _emit("Loading jobs... stage=jobs")
    jobs_heartbeat.start()
    try:
        jobs = load_jobs()
        _emit("After load_jobs(). stage=jobs")
        jobs_elapsed = perf_counter() - jobs_started_at
        jobs_loaded = len(jobs)
        if jobs_loaded == 0:
            raise RuntimeError("No jobs found in database. Backend cannot become ready.")
        _emit(
            "Jobs loaded successfully. stage=jobs count=%s elapsed=%.2fs",
            jobs_loaded,
            jobs_elapsed,
        )
    except Exception as exc:
        jobs_elapsed = perf_counter() - jobs_started_at
        _emit_exception(
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
    finally:
        jobs_heartbeat.stop()

    faiss_started_at = perf_counter()
    faiss_heartbeat = _StageHeartbeat("faiss", faiss_started_at)
    _emit("Before ensure_faiss_index(). stage=faiss")
    _emit("Building FAISS index... stage=faiss")
    faiss_heartbeat.start()
    try:
        ensure_faiss_index(jobs)
        _emit("After ensure_faiss_index(). stage=faiss")
        faiss_elapsed = perf_counter() - faiss_started_at
        backend_runtime_state.mark_index_ready(len(jobs))
        faiss_ready = True
        _emit(
            "FAISS index built successfully. stage=faiss elapsed=%.2fs",
            faiss_elapsed,
        )

        if not database_ready:
            raise RuntimeError("Database initialization did not complete. Backend cannot become ready.")
        if jobs_loaded <= 0:
            raise RuntimeError("No jobs found in database. Backend cannot become ready.")
        if not faiss_ready:
            raise RuntimeError("FAISS index validation did not complete. Backend cannot become ready.")

        _emit("Before mark_ready(). stage=warmup")
        backend_runtime_state.mark_ready()
        _emit("After mark_ready(). stage=warmup")
        warmup_elapsed = perf_counter() - warmup_started_at
        _emit(
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
        _emit_exception(
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
    finally:
        faiss_heartbeat.stop()


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