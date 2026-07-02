from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

import faiss
import numpy as np

from .embedding_service import generate_embedding
from .job_mapping_service import ensure_job_mapping


logger = logging.getLogger(__name__)

INDEX_FILE = Path(__file__).resolve().parents[2] / "data" / "jobs" / "jobs.index"
INDEX_META_FILE = INDEX_FILE.with_suffix(".index.meta.json")

_INDEX_CACHE: dict[str, Any] = {
    "signature": None,
    "index": None,
    "jobs": None,
    "embeddings": None,
}


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


def _normalize_embeddings(embeddings: np.ndarray) -> np.ndarray:
    if embeddings.size == 0:
        return embeddings

    normalized = np.array(embeddings, dtype="float32", copy=True)
    faiss.normalize_L2(normalized)
    return normalized


def _jobs_signature(jobs: list[dict]) -> tuple[tuple[Any, ...], ...]:
    return tuple(
        (
            job.get("id"),
            job.get("title", ""),
            job.get("description", ""),
        )
        for job in jobs
    )


def _build_embedding_matrix(jobs: list[dict]) -> np.ndarray:
    _emit("Generating embeddings for jobs. count=%s", len(jobs))
    embeddings = [
        generate_embedding(job.get("description", ""))
        for job in jobs
    ]

    if not embeddings:
        return np.empty((0, 0), dtype="float32")

    return np.asarray(embeddings, dtype="float32")


def _signature_to_serializable(signature: tuple[tuple[Any, ...], ...]) -> list[list[Any]]:
    return [list(item) for item in signature]


def _load_index_from_disk(
    jobs: list[dict],
    signature: tuple[tuple[Any, ...], ...],
) -> dict[str, Any] | None:
    if not INDEX_FILE.exists() or not INDEX_META_FILE.exists():
        _emit(
            "FAISS disk cache unavailable. index_exists=%s meta_exists=%s",
            INDEX_FILE.exists(),
            INDEX_META_FILE.exists(),
        )
        return None

    try:
        metadata = json.loads(INDEX_META_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        _emit("FAISS disk metadata could not be read. path=%s", INDEX_META_FILE)
        return None

    if metadata.get("metric") != "ip" or not metadata.get("normalized", False):
        _emit("FAISS disk metadata rejected. metric=%s normalized=%s", metadata.get("metric"), metadata.get("normalized", False))
        return None

    stored_signature = tuple(
        tuple(item) for item in metadata.get("signature", [])
    )

    if stored_signature != signature:
        _emit(
            "FAISS disk signature mismatch. stored=%s current=%s",
            len(stored_signature),
            len(signature),
        )
        return None

    try:
        index = faiss.read_index(str(INDEX_FILE))
    except RuntimeError:
        _emit("FAISS disk index could not be read. path=%s", INDEX_FILE)
        return None

    if index.ntotal != len(jobs):
        _emit(
            "FAISS disk vector count mismatch. index_ntotal=%s jobs=%s",
            index.ntotal,
            len(jobs),
        )
        return None

    _emit("FAISS disk index loaded successfully. vectors=%s", index.ntotal)
    _INDEX_CACHE["signature"] = signature
    _INDEX_CACHE["index"] = index
    _INDEX_CACHE["jobs"] = jobs
    _INDEX_CACHE["embeddings"] = None

    return {
        "index": index,
        "jobs": jobs,
        "embeddings": None,
    }


def _save_index_to_disk(
    index: faiss.Index | None,
    signature: tuple[tuple[Any, ...], ...],
) -> None:
    if index is None:
        return

    INDEX_FILE.parent.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(INDEX_FILE))
    INDEX_META_FILE.write_text(
        json.dumps(
            {
                "signature": _signature_to_serializable(signature),
                "metric": "ip",
                "normalized": True,
            },
            ensure_ascii=True,
            indent=2,
        ),
        encoding="utf-8",
    )
    _emit("FAISS disk index saved. vectors=%s path=%s", index.ntotal, INDEX_FILE)


def build_faiss_index(jobs: list[dict]) -> dict[str, Any]:
    signature = _jobs_signature(jobs)

    if _INDEX_CACHE["signature"] == signature:
        _emit("FAISS in-memory cache hit. jobs=%s", len(jobs))
        return {
            "index": _INDEX_CACHE["index"],
            "jobs": _INDEX_CACHE["jobs"],
            "embeddings": _INDEX_CACHE["embeddings"],
        }

    disk_bundle = _load_index_from_disk(jobs=jobs, signature=signature)
    if disk_bundle is not None:
        return disk_bundle

    _emit("FAISS rebuild starting. jobs=%s", len(jobs))
    embedding_matrix = _build_embedding_matrix(jobs)

    if embedding_matrix.size == 0:
        _emit("FAISS rebuild produced empty embedding matrix.")
        index = None
    else:
        embedding_matrix = _normalize_embeddings(embedding_matrix)
        dimension = embedding_matrix.shape[1]
        _emit(
            "FAISS normalized embeddings ready. rows=%s dimension=%s",
            embedding_matrix.shape[0],
            dimension,
        )
        index = faiss.IndexFlatIP(dimension)
        index.add(embedding_matrix)
        _emit("FAISS index populated. vectors=%s", index.ntotal)
        _save_index_to_disk(index=index, signature=signature)

    _INDEX_CACHE["signature"] = signature
    _INDEX_CACHE["index"] = index
    _INDEX_CACHE["jobs"] = jobs
    _INDEX_CACHE["embeddings"] = embedding_matrix

    return {
        "index": index,
        "jobs": jobs,
        "embeddings": embedding_matrix,
    }


def _validate_faiss_bundle(bundle: dict[str, Any], jobs: list[dict]) -> None:
    if not jobs:
        raise RuntimeError("No jobs found in database. Backend cannot become ready.")

    embeddings = bundle.get("embeddings")
    if embeddings is not None and getattr(embeddings, "size", 0) == 0:
        raise RuntimeError("FAISS embeddings are empty. Backend cannot become ready.")
    if embeddings is not None and getattr(embeddings, "shape", (0,))[0] == 0:
        raise RuntimeError("FAISS embeddings are empty. Backend cannot become ready.")

    index = bundle.get("index")
    if index is None:
        raise RuntimeError("FAISS index was not built. Backend cannot become ready.")
    if getattr(index, "ntotal", 0) <= 0:
        raise RuntimeError("FAISS index has no vectors. Backend cannot become ready.")


def search_similar_jobs(
    resume_embedding: list[float],
    jobs: list[dict],
    top_k: int = 3,
) -> list[dict]:
    bundle = build_faiss_index(jobs)
    index = bundle["index"]
    embeddings = bundle["embeddings"]
    job_mapping = ensure_job_mapping(jobs)

    if index is None or top_k <= 0:
        return []

    normalized_top_k = min(top_k, len(jobs))
    query_vector = np.asarray([resume_embedding], dtype="float32")
    faiss.normalize_L2(query_vector)

    distances, indices = index.search(query_vector, normalized_top_k)

    results = []
    should_reconstruct = embeddings is None
    jobs_by_id = {
        job.get("id"): job
        for job in jobs
    }
    for distance, index_position in zip(distances[0], indices[0]):
        if index_position < 0:
            continue

        mapped_job_id = job_mapping.get(str(int(index_position)))
        job = jobs_by_id.get(mapped_job_id)
        if job is None:
            if index_position >= len(jobs):
                continue
            job = jobs[index_position]
        if should_reconstruct:
            job_embedding = index.reconstruct(int(index_position)).tolist()
        else:
            job_embedding = embeddings[index_position].tolist()
        results.append(
            {
                "job": job,
                "distance": float(distance),
                "index_position": int(index_position),
                "embedding": job_embedding,
            }
        )

    return results


def retrieve_top_job_ids(
    resume_text: str,
    jobs: list[dict],
    top_k: int = 3,
) -> list[int]:
    resume_embedding = generate_embedding(resume_text)
    search_results = search_similar_jobs(
        resume_embedding=resume_embedding,
        jobs=jobs,
        top_k=top_k,
    )

    return [item["job"]["id"] for item in search_results]


def ensure_faiss_index(jobs: list[dict]) -> dict[str, Any]:
    bundle = build_faiss_index(jobs)
    _validate_faiss_bundle(bundle, jobs)
    return bundle