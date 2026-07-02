import { a as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as EmptyState } from "./EmptyState-5zEtvNaK.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Sparkles, f as ChevronDown, l as Lightbulb, n as Upload, u as FileText } from "../_libs/lucide-react.mjs";
import { i as getAnalysis, n as clearAnalysisState, o as setAnalysis, r as cn, s as setPendingFile, t as Navbar } from "./analysis-store-B-hjLvY-.mjs";
import { t as Footer } from "./Footer-CDqmtkaf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/results-dK-FaeTY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SkillBadge({ children, variant = "neutral", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium", variant === "neutral" && "border-border bg-surface text-foreground", variant === "gap" && "border-amber-200/70 bg-amber-50 text-amber-800", className),
		children
	});
}
var labelStyles = {
	"Strong Match": "bg-emerald-50 text-emerald-700",
	"Good Match": "bg-sky-50 text-sky-700",
	"Fair Match": "bg-zinc-100 text-zinc-700",
	Stretch: "bg-amber-50 text-amber-700"
};
function MatchScore({ score, label, dimmed }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-right",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("font-mono-tabular text-2xl font-semibold tracking-tighter", dimmed && "text-muted-foreground"),
			children: [score, "%"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("mt-1 inline-block rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider", labelStyles[label]),
			children: label
		})]
	});
}
function RecommendationCard({ rec, index }) {
	const [open, setOpen] = (0, import_react.useState)(index === 0);
	const dim = rec.matchPercentage < 80;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.article, {
		initial: {
			opacity: 0,
			y: 8
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: {
			duration: .35,
			delay: index * .05,
			ease: [
				.16,
				1,
				.3,
				1
			]
		},
		className: cn("overflow-hidden rounded-xl border border-border bg-card transition-shadow", "hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]", dim && "opacity-90"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-start justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-lg font-semibold tracking-tight",
							children: rec.jobTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: [
								rec.company,
								" · ",
								rec.location
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MatchScore, {
						score: rec.matchPercentage,
						label: rec.matchLabel,
						dimmed: dim
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mb-3 font-mono-tabular text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Matching skills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: rec.matchedSkills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBadge, { children: s }, s))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mb-3 font-mono-tabular text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Areas to strengthen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: rec.missingSkills.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "No notable gaps."
						}) : rec.missingSkills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBadge, {
							variant: "gap",
							children: s
						}, s))
					})] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setOpen((o) => !o),
				"aria-expanded": open,
				className: "flex w-full items-center justify-between border-t border-border bg-surface px-6 py-3 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-surface/60 hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: open ? "Hide analysis" : "Show analysis & suggestions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 transition-transform", open && "rotate-180") })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				initial: false,
				children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						height: 0,
						opacity: 0
					},
					animate: {
						height: "auto",
						opacity: 1
					},
					exit: {
						height: 0,
						opacity: 0
					},
					transition: {
						duration: .25,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 border-t border-border bg-surface/40 px-6 py-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Why this match" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: rec.explanation
						})] }), rec.suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 flex items-center gap-2 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-3.5 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "How to strengthen your application" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: rec.suggestions.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 text-sm leading-relaxed text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-1 shrink-0 rounded-full bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s })]
							}, i))
						})] })]
					})
				}, "content")
			})
		]
	});
}
function Results() {
	const navigate = useNavigate();
	const [result, setResult] = (0, import_react.useState)(() => getAnalysis());
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setResult(getAnalysis());
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (hydrated && !result) {
			const t = setTimeout(() => navigate({ to: "/" }), 50);
			return () => clearTimeout(t);
		}
	}, [
		hydrated,
		result,
		navigate
	]);
	if (!result) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "flex min-h-[80vh] items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 text-foreground" }),
				title: "No analysis yet",
				description: "Upload a resume to see your recommendations.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background",
					children: "Upload resume"
				})
			})
		})]
	});
	const avgScore = result.recommendations.length === 0 ? 0 : Math.round(result.recommendations.reduce((a, r) => a + r.matchPercentage, 0) / result.recommendations.length);
	const top = result.recommendations[0];
	const reset = () => {
		clearAnalysisState();
		setAnalysis(null);
		setPendingFile(null);
		navigate({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "pt-28 pb-20",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-10 lg:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "w-full shrink-0 lg:w-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:sticky lg:top-24 space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-xl border border-border bg-card p-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono-tabular mb-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
												children: "Resume"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mt-0.5 flex size-9 items-center justify-center rounded-lg border border-border bg-surface",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "truncate text-sm font-medium",
														children: result.summary.fileName
													}), result.summary.headline && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-0.5 text-xs text-muted-foreground",
														children: result.summary.headline
													})]
												})]
											}),
											result.summary.topSkills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
													children: "Top skills"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex flex-wrap gap-1.5",
													children: result.summary.topSkills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillBadge, { children: s }, s))
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
										className: "rounded-xl border border-border bg-card p-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono-tabular mb-4 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
											children: "Match overview"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
											className: "grid grid-cols-2 gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-[11px] text-muted-foreground",
													children: "Matches"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
													className: "font-mono-tabular mt-1 text-2xl font-semibold tracking-tighter",
													children: result.recommendations.length
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
													className: "text-[11px] text-muted-foreground",
													children: "Avg. score"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
													className: "font-mono-tabular mt-1 text-2xl font-semibold tracking-tighter",
													children: [avgScore, "%"]
												})] }),
												top && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2 border-t border-border pt-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
															className: "text-[11px] text-muted-foreground",
															children: "Top match"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
															className: "mt-1 text-sm font-medium",
															children: top.jobTitle
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
															className: "text-xs text-muted-foreground",
															children: top.company
														})
													]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: reset,
										className: "flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card py-2.5 text-sm font-medium transition-colors hover:bg-surface",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-4" }), "Upload a different resume"]
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 6
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: { duration: .35 },
								className: "mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono-tabular mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
									children: "Top recommendations"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
									className: "text-2xl font-semibold tracking-tight",
									children: [result.recommendations.length, " roles aligned to your profile"]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: result.explainable ? "Explanations included" : "Deterministic summaries" })]
								})]
							}), result.recommendations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5" }),
								title: "No matching roles found",
								description: "We couldn't find a strong match for your current profile. Try uploading a more detailed resume.",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: reset,
									className: "rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background",
									children: "Upload again"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-5",
								children: result.recommendations.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecommendationCard, {
									rec: r,
									index: i
								}, r.id))
							})]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
//#endregion
export { Results as component };
