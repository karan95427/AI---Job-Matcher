import { a as __toESM } from "../_runtime.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as EmptyState } from "./EmptyState-5zEtvNaK.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as CircleAlert, p as Check } from "../_libs/lucide-react.mjs";
import { a as getPendingFile, i as getAnalysis, n as clearAnalysisState, o as setAnalysis, r as cn, s as setPendingFile, t as Navbar } from "./analysis-store-B-hjLvY-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyzing-DZs3EjGE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoadingSteps({ steps, activeStep, completedSteps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto w-full max-w-xl rounded-xl border border-border bg-surface p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-5",
			children: steps.map((label, i) => {
				const done = i < completedSteps;
				const current = activeStep === i;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("flex items-center justify-between transition-opacity", !done && !current && "opacity-40"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: cn("flex size-5 items-center justify-center rounded-full border transition-colors", done && "border-success bg-success text-background", current && "border-foreground/30 bg-background", !done && !current && "border-border bg-background"),
							"aria-hidden": true,
							children: [done && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								className: "size-3",
								strokeWidth: 3
							}), current && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 animate-pulse rounded-full bg-foreground" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: label
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono-tabular text-[10px] uppercase tracking-wider text-muted-foreground",
						children: done ? "Done" : current ? "Running" : "Pending"
					})]
				}, label);
			})
		})
	});
}
var DEFAULT_UPLOAD_TIMEOUT_MS = 9e4;
var DEFAULT_READINESS_TIMEOUT_MS = 6e4;
var READINESS_REQUEST_TIMEOUT_MS = 3e4;
var READINESS_POLL_INTERVAL_MS = 1500;
function normalizeApiBase(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.replace(/\/$/, "") : void 0;
}
function resolveApiBase() {
	const configuredApiBase = normalizeApiBase("https://ai-job-matcher-backend.onrender.com");
	if (configuredApiBase) return configuredApiBase;
	throw new Error("VITE_API_BASE_URL must be set for production builds. Localhost fallback is disabled outside development.");
}
var API_BASE = resolveApiBase();
function isAbortError(error) {
	return error instanceof DOMException && error.name === "AbortError";
}
async function parseErrorMessage(res) {
	const text = await res.text().catch(() => "");
	if (!text) return `Request failed (${res.status})`;
	try {
		const payload = JSON.parse(text);
		return payload.detail || payload.message || text;
	} catch {
		return text;
	}
}
function delay(ms) {
	return new Promise((resolve) => window.setTimeout(resolve, ms));
}
async function getBackendReadiness(opts = {}) {
	const controller = new AbortController();
	const timeout = window.setTimeout(() => controller.abort(), READINESS_REQUEST_TIMEOUT_MS);
	const abortFromCaller = () => controller.abort();
	opts.signal?.addEventListener("abort", abortFromCaller, { once: true });
	let res;
	try {
		res = await fetch(`${API_BASE}/ready`, { signal: controller.signal });
	} catch (error) {
		if (isAbortError(error)) throw new Error(`The readiness check timed out while contacting ${API_BASE}. The backend may be unreachable even if it appears to be running.`);
		throw new Error(`The frontend could not reach the backend readiness endpoint at ${API_BASE}. Check that VITE_API_BASE_URL is correct and the API is reachable.`);
	} finally {
		window.clearTimeout(timeout);
		opts.signal?.removeEventListener("abort", abortFromCaller);
	}
	const payload = await res.json();
	if (!res.ok && res.status !== 503) throw new Error(payload.message || `Readiness check failed (${res.status})`);
	return payload;
}
async function waitForBackendReady(opts = {}) {
	const timeoutMs = opts.timeoutMs ?? DEFAULT_READINESS_TIMEOUT_MS;
	const startedAt = Date.now();
	let lastSnapshot = null;
	while (Date.now() - startedAt < timeoutMs) {
		if (opts.signal?.aborted) throw new DOMException("Aborted", "AbortError");
		lastSnapshot = await getBackendReadiness({ signal: opts.signal });
		if (lastSnapshot.ready) return lastSnapshot;
		await delay(READINESS_POLL_INTERVAL_MS);
	}
	throw new Error(lastSnapshot?.message || "The backend is still warming up. Please wait a moment and try again.");
}
async function uploadResume(file, opts = {}) {
	const explain = opts.explain ?? true;
	const timeoutMs = opts.timeoutMs ?? DEFAULT_UPLOAD_TIMEOUT_MS;
	const form = new FormData();
	form.append("file", file);
	form.append("top_k", "5");
	form.append("explain", String(explain));
	const controller = new AbortController();
	const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
	const abortFromCaller = () => controller.abort();
	opts.signal?.addEventListener("abort", abortFromCaller, { once: true });
	let res;
	try {
		res = await fetch(`${API_BASE}/job-recommendations`, {
			method: "POST",
			body: form,
			signal: controller.signal
		});
	} catch (error) {
		if (isAbortError(error)) throw new Error("The backend took too long to respond. It may still be starting up. Please try again in a few seconds.");
		throw error;
	} finally {
		window.clearTimeout(timeout);
		opts.signal?.removeEventListener("abort", abortFromCaller);
	}
	if (!res.ok) throw new Error(await parseErrorMessage(res));
	return mapBackendResult(await res.json());
}
function labelFor(score) {
	if (score >= 90) return "Strong Match";
	if (score >= 80) return "Good Match";
	if (score >= 70) return "Fair Match";
	return "Stretch";
}
function normalizeLabel(label, score) {
	if (label === "Strong Match" || label === "Good Match" || label === "Fair Match" || label === "Stretch") return label;
	return labelFor(score);
}
function fallbackExplanation(rec) {
	const matched = rec.matched_skills.length ? `Matched skills: ${rec.matched_skills.join(", ")}.` : "No explicit matched skills were returned.";
	const missing = rec.missing_skills.length ? ` Areas to strengthen: ${rec.missing_skills.join(", ")}.` : " No major skill gaps were detected.";
	return `${rec.title} scored ${Math.round(rec.match_score)}%. ${matched}${missing}`;
}
function mapBackendResult(payload) {
	const topSkills = Array.from(new Set(payload.recommendations.flatMap((rec) => rec.matched_skills))).slice(0, 8);
	return {
		summary: {
			headline: `${payload.total_jobs_compared} jobs compared`,
			topSkills,
			fileName: payload.filename
		},
		recommendations: payload.recommendations.map((rec) => ({
			id: String(rec.id),
			jobTitle: rec.title,
			company: rec.company?.trim() || "Job dataset",
			location: rec.location?.trim() || "Location not specified",
			matchPercentage: Math.round(rec.match_score),
			matchLabel: normalizeLabel(rec.match_label, rec.match_score),
			matchedSkills: rec.matched_skills,
			missingSkills: rec.missing_skills,
			explanation: rec.explanation?.summary || fallbackExplanation(rec),
			suggestions: rec.explanation?.improvement_suggestions ?? []
		})),
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		explainable: payload.recommendations.some((rec) => Boolean(rec.explanation))
	};
}
var ANALYSIS_STEPS = [
	"Checking backend readiness",
	"Uploading resume",
	"Extracting resume content",
	"Matching opportunities",
	"Preparing results"
];
function Analyzing() {
	const navigate = useNavigate();
	const [error, setError] = (0, import_react.useState)(null);
	const [activeStep, setActiveStep] = (0, import_react.useState)(0);
	const [completedSteps, setCompletedSteps] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const file = getPendingFile();
		if (!file) {
			if (getAnalysis()) {
				navigate({
					to: "/results",
					replace: true
				});
				return;
			}
			navigate({ to: "/" });
			return;
		}
		let disposed = false;
		const controller = new AbortController();
		const run = async () => {
			let processingTimer = null;
			try {
				setActiveStep(0);
				setCompletedSteps(0);
				await waitForBackendReady({ signal: controller.signal });
				if (disposed) return;
				setCompletedSteps(1);
				setActiveStep(1);
				const uploadPromise = uploadResume(file, {
					explain: true,
					signal: controller.signal
				});
				setCompletedSteps(2);
				setActiveStep(2);
				processingTimer = window.setTimeout(() => {
					if (disposed) return;
					setCompletedSteps(3);
					setActiveStep(3);
				}, 1200);
				const result = await uploadPromise;
				if (processingTimer !== null) window.clearTimeout(processingTimer);
				if (disposed) return;
				setCompletedSteps(ANALYSIS_STEPS.length);
				setActiveStep(null);
				setAnalysis(result);
				setPendingFile(null);
				navigate({
					to: "/results",
					replace: true
				});
			} catch (e) {
				if (processingTimer !== null) window.clearTimeout(processingTimer);
				if (disposed) return;
				setError(e instanceof Error ? e.message : "Something went wrong.");
			}
		};
		run();
		return () => {
			disposed = true;
			controller.abort();
		};
	}, [navigate]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-[80vh] items-center justify-center px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-5 text-destructive" }),
				title: "We couldn't analyze this resume",
				description: error,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						clearAnalysisState();
						navigate({ to: "/" });
					},
					className: "rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background",
					children: "Try a different file"
				})
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex min-h-[80vh] flex-col items-center justify-center px-6 pb-16 pt-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				className: "mx-auto mb-10 max-w-md text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono-tabular mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
						children: "Working"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold tracking-tight",
						children: "Analyzing your resume"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "We verify backend readiness first, then process your resume and route you to the results page as soon as the recommendations are ready."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingSteps, {
				steps: ANALYSIS_STEPS,
				activeStep,
				completedSteps
			})]
		})]
	});
}
//#endregion
export { Analyzing as component };
