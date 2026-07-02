import { a as __toESM } from "../_runtime.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as MoonStar, i as SunMedium } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analysis-store-B-hjLvY-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function getPreferredTheme() {
	if (typeof window === "undefined") return "light";
	const stored = window.localStorage.getItem("signal.theme");
	if (stored === "light" || stored === "dark") return stored;
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function applyTheme(theme) {
	document.documentElement.classList.toggle("dark", theme === "dark");
	window.localStorage.setItem("signal.theme", theme);
}
function Navbar() {
	const [theme, setTheme] = (0, import_react.useState)("light");
	(0, import_react.useEffect)(() => {
		const preferred = getPreferredTheme();
		setTheme(preferred);
		applyTheme(preferred);
	}, []);
	const toggleTheme = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
		applyTheme(nextTheme);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-lg font-semibold tracking-tight",
					children: "SIGNAL"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden gap-6 text-sm font-medium text-muted-foreground md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#how",
							className: "transition-colors hover:text-foreground",
							children: "How it works"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#methodology",
							className: "transition-colors hover:text-foreground",
							children: "Methodology"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: "/#faq",
							className: "transition-colors hover:text-foreground",
							children: "FAQ"
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: toggleTheme,
					className: "inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
					"aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
					children: [theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SunMedium, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoonStar, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: theme === "dark" ? "Light mode" : "Dark mode"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/#upload",
					className: "rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90",
					children: "Analyze resume"
				})]
			})]
		})
	});
}
var current = null;
var pendingFile = null;
var ANALYSIS_STORAGE_KEY = "signal.analysis.result";
function canUseSessionStorage() {
	return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}
function readStoredAnalysis() {
	if (!canUseSessionStorage()) return null;
	try {
		const raw = window.sessionStorage.getItem(ANALYSIS_STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
function setAnalysis(result) {
	current = result;
	if (!canUseSessionStorage()) return;
	try {
		if (result) window.sessionStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(result));
		else window.sessionStorage.removeItem(ANALYSIS_STORAGE_KEY);
	} catch {}
}
function getAnalysis() {
	if (!current) current = readStoredAnalysis();
	return current;
}
function setPendingFile(f) {
	pendingFile = f;
}
function getPendingFile() {
	return pendingFile;
}
function clearAnalysisState() {
	current = null;
	pendingFile = null;
	if (!canUseSessionStorage()) return;
	try {
		window.sessionStorage.removeItem(ANALYSIS_STORAGE_KEY);
	} catch {}
}
//#endregion
export { getPendingFile as a, getAnalysis as i, clearAnalysisState as n, setAnalysis as o, cn as r, setPendingFile as s, Navbar as t };
