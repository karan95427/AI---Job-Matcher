from __future__ import annotations

import importlib
import io
import sys
import threading
import time
import types
import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient


class RuntimeServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        fake_embedding_module = types.ModuleType(
            "Backend.app.services.embedding_service"
        )
        fake_embedding_module.generate_embedding = lambda text: [float(len(text) + 1), 2.0, 3.0]
        self._original_embedding_module = sys.modules.get(
            "Backend.app.services.embedding_service"
        )
        sys.modules["Backend.app.services.embedding_service"] = fake_embedding_module

        for module_name in [
            "Backend.app.runtime_state",
            "Backend.app.services.faiss_service",
            "Backend.app.services.recommendation_service",
            "Backend.app.services.runtime_service",
            "Backend.app.services.matching_engine",
            "Backend.app.services.similarity_service",
            "Backend.app.services.explanation_service",
            "Backend.app.api.routes",
            "Backend.app.main",
        ]:
            sys.modules.pop(module_name, None)

        self.runtime_state_module = importlib.import_module("Backend.app.runtime_state")
        self.runtime_service = importlib.import_module("Backend.app.services.runtime_service")
        self.main_module = importlib.import_module("Backend.app.main")
        self.state = self.runtime_state_module.backend_runtime_state

    def tearDown(self) -> None:
        for module_name in [
            "Backend.app.main",
            "Backend.app.api.routes",
            "Backend.app.services.similarity_service",
            "Backend.app.services.matching_engine",
            "Backend.app.services.recommendation_service",
            "Backend.app.services.faiss_service",
            "Backend.app.services.explanation_service",
            "Backend.app.services.runtime_service",
            "Backend.app.runtime_state",
        ]:
            sys.modules.pop(module_name, None)

        if self._original_embedding_module is None:
            sys.modules.pop("Backend.app.services.embedding_service", None)
        else:
            sys.modules["Backend.app.services.embedding_service"] = (
                self._original_embedding_module
            )

    def test_successful_warmup_marks_backend_ready(self) -> None:
        jobs = [{"id": 1, "title": "Backend Engineer", "description": "FastAPI PostgreSQL"}]

        with patch.object(self.runtime_service, "init_database", return_value=None), patch.object(
            self.runtime_service,
            "load_jobs",
            return_value=jobs,
        ), patch.object(self.runtime_service, "ensure_faiss_index", return_value={"index": object()}):
            self.runtime_service.warmup_backend_dependencies()

        snapshot = self.state.snapshot()
        self.assertTrue(snapshot["ready"])
        self.assertTrue(snapshot["db_ready"])
        self.assertTrue(snapshot["index_ready"])
        self.assertEqual(snapshot["jobs_loaded"], 1)
        self.assertIsNone(snapshot["last_error"])

    def test_database_failure_marks_runtime_failed(self) -> None:
        with patch.object(
            self.runtime_service,
            "init_database",
            side_effect=RuntimeError("database unavailable"),
        ):
            self.runtime_service.warmup_backend_dependencies()

        snapshot = self.state.snapshot()
        self.assertFalse(snapshot["ready"])
        self.assertFalse(snapshot["db_ready"])
        self.assertFalse(snapshot["index_ready"])
        self.assertEqual(snapshot["last_error"]["stage"], "database")
        self.assertEqual(snapshot["message"], "database unavailable")

    def test_empty_jobs_marks_runtime_failed(self) -> None:
        with patch.object(self.runtime_service, "init_database", return_value=None), patch.object(
            self.runtime_service,
            "load_jobs",
            return_value=[],
        ):
            self.runtime_service.warmup_backend_dependencies()

        snapshot = self.state.snapshot()
        self.assertFalse(snapshot["ready"])
        self.assertTrue(snapshot["db_ready"])
        self.assertFalse(snapshot["index_ready"])
        self.assertEqual(snapshot["last_error"]["stage"], "index")
        self.assertEqual(
            snapshot["message"],
            "No jobs found in database. Backend cannot become ready.",
        )

    def test_faiss_failure_marks_runtime_failed(self) -> None:
        jobs = [{"id": 1, "title": "Backend Engineer", "description": "FastAPI PostgreSQL"}]

        with patch.object(self.runtime_service, "init_database", return_value=None), patch.object(
            self.runtime_service,
            "load_jobs",
            return_value=jobs,
        ), patch.object(
            self.runtime_service,
            "ensure_faiss_index",
            side_effect=RuntimeError("FAISS failed"),
        ):
            self.runtime_service.warmup_backend_dependencies()

        snapshot = self.state.snapshot()
        self.assertFalse(snapshot["ready"])
        self.assertTrue(snapshot["db_ready"])
        self.assertFalse(snapshot["index_ready"])
        self.assertEqual(snapshot["last_error"]["stage"], "index")
        self.assertEqual(snapshot["message"], "FAISS failed")

    def test_runtime_snapshot_reports_warming_and_degraded_states(self) -> None:
        warming_state = self.runtime_state_module.BackendRuntimeState()
        started = threading.Event()
        release = threading.Event()

        def worker() -> None:
            started.set()
            release.wait(timeout=2)

        self.assertTrue(warming_state.start_warmup(worker))
        self.assertTrue(started.wait(timeout=2))
        warming_snapshot = warming_state.snapshot()
        self.assertEqual(warming_snapshot["status"], "warming")
        self.assertTrue(warming_snapshot["warmup_in_progress"])
        release.set()

        degraded_state = self.runtime_state_module.BackendRuntimeState()
        degraded_state.mark_failure(stage="index", message="failed", preserve_database=True)
        degraded_snapshot = degraded_state.snapshot()
        self.assertEqual(degraded_snapshot["status"], "degraded")
        self.assertEqual(degraded_snapshot["message"], "failed")

    def test_only_one_warmup_thread_starts_while_worker_is_running(self) -> None:
        worker_calls: list[str] = []
        started = threading.Event()
        release = threading.Event()

        def worker() -> None:
            worker_calls.append("started")
            started.set()
            release.wait(timeout=2)

        state = self.runtime_state_module.BackendRuntimeState()
        self.assertTrue(state.start_warmup(worker))
        self.assertTrue(started.wait(timeout=2))
        self.assertFalse(state.start_warmup(worker))
        self.assertEqual(state.snapshot()["warmup_attempts"], 1)
        self.assertEqual(len(worker_calls), 1)
        release.set()

    def test_multiple_ready_requests_trigger_one_warmup_worker(self) -> None:
        worker_calls: list[str] = []
        worker_started = threading.Event()
        worker_release = threading.Event()

        def worker() -> None:
            worker_calls.append("started")
            worker_started.set()
            worker_release.wait(timeout=2)

        snapshot = {
            "status": "warming",
            "ready": False,
            "db_ready": False,
            "index_ready": False,
            "jobs_loaded": 0,
            "warmup_in_progress": True,
            "warmup_attempts": 1,
            "warmup_started_at": "2026-07-02T00:00:00+00:00",
            "warmup_completed_at": None,
            "last_error": None,
            "message": "Backend warmup is in progress.",
        }

        with patch("Backend.app.main.trigger_backend_warmup", return_value=None), patch.object(
            self.runtime_service,
            "warmup_backend_dependencies",
            side_effect=worker,
        ), patch("Backend.app.api.routes.get_backend_status", return_value=snapshot):
            with TestClient(self.main_module.app) as client:
                self.runtime_service.trigger_backend_warmup()
                self.assertTrue(worker_started.wait(timeout=2))
                first = client.get("/ready")
                second = client.get("/ready")

        self.assertEqual(first.status_code, 503)
        self.assertEqual(second.status_code, 503)
        self.assertEqual(len(worker_calls), 1)
        self.assertEqual(self.state.snapshot()["warmup_attempts"], 1)
        worker_release.set()
        time.sleep(0.05)


if __name__ == "__main__":
    unittest.main()