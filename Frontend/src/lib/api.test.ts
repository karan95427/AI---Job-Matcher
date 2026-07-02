import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const readinessPayload = {
  status: "ready",
  ready: true,
  db_ready: true,
  index_ready: true,
  jobs_loaded: 3,
  warmup_in_progress: false,
  warmup_attempts: 1,
  warmup_started_at: "2026-07-02T00:00:00+00:00",
  warmup_completed_at: "2026-07-02T00:00:01+00:00",
  last_error: null,
  message: "Backend is ready.",
};

function installWindow() {
  vi.stubGlobal("window", {
    setTimeout,
    clearTimeout,
  });
}

describe("frontend API configuration", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    installWindow();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("uses the configured production API URL", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://api.example.com/");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => readinessPayload,
    });
    vi.stubGlobal("fetch", fetchMock);

    const api = await import("./api");
    await api.getBackendReadiness();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://api.example.com/ready");
  });

  it("uses localhost during development when no explicit API URL is configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => readinessPayload,
    });
    vi.stubGlobal("fetch", fetchMock);

    const api = await import("./api");
    await api.getBackendReadiness();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("http://127.0.0.1:8000/ready");
  });

  it("shows the configured backend URL when readiness fails", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "https://backend.example.com");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network failed")));

    const api = await import("./api");

    await expect(api.getBackendReadiness()).rejects.toThrow(
      "The frontend could not reach the backend readiness endpoint at https://backend.example.com. Check that VITE_API_BASE_URL is correct and the API is reachable.",
    );
  });
});