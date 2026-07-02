import { a as __toESM } from "../_runtime.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { n as require_react, r as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Sparkles, m as ArrowRight, n as Upload, o as ShieldCheck, r as Target, s as Plus, t as X, u as FileText } from "../_libs/lucide-react.mjs";
import { n as clearAnalysisState, r as cn, s as setPendingFile, t as Navbar } from "./analysis-store-B-hjLvY-.mjs";
import { t as Footer } from "./Footer-CDqmtkaf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ALzb3KPM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_BYTES = 5 * 1024 * 1024;
function UploadZone({ onFile, disabled }) {
	const [drag, setDrag] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [staged, setStaged] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	const validate = (f) => {
		if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return "Only PDF resumes are supported.";
		if (f.size > MAX_BYTES) return "File is larger than 5MB.";
		return null;
	};
	const handle = (0, import_react.useCallback)((f) => {
		const err = validate(f);
		if (err) {
			setError(err);
			return;
		}
		setError(null);
		setStaged(f);
		onFile(f);
	}, [onFile]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			htmlFor: "resume-file",
			onDragOver: (e) => {
				e.preventDefault();
				if (!disabled) setDrag(true);
			},
			onDragLeave: () => setDrag(false),
			onDrop: (e) => {
				e.preventDefault();
				setDrag(false);
				if (disabled) return;
				const f = e.dataTransfer.files?.[0];
				if (f) handle(f);
			},
			className: cn("group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background px-6 py-12 text-center transition-all", "hover:border-foreground/30 hover:bg-surface", drag && "border-foreground/40 bg-surface", disabled && "pointer-events-none opacity-60"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				id: "resume-file",
				type: "file",
				accept: "application/pdf,.pdf",
				className: "sr-only",
				onChange: (e) => {
					const f = e.target.files?.[0];
					if (f) handle(f);
				}
			}), !staged ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex size-12 items-center justify-center rounded-full border border-border bg-surface transition-transform group-hover:scale-105",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
						className: "size-4 text-foreground",
						strokeWidth: 2
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Drop your resume (PDF only)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "or click to browse · max 5MB"
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full max-w-md items-center justify-between gap-4 rounded-xl border border-border bg-surface px-4 py-3 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-5 shrink-0 text-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: staged.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono-tabular text-xs text-muted-foreground",
							children: [(staged.size / 1024).toFixed(0), " KB · PDF"]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: (e) => {
						e.preventDefault();
						setStaged(null);
						if (inputRef.current) inputRef.current.value = "";
					},
					"aria-label": "Remove file",
					className: "rounded-md p-1 text-muted-foreground hover:bg-background hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
				})]
			})]
		}), error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "mt-3 text-center text-xs font-medium text-destructive",
			children: error
		})]
	});
}
function FAQAccordion({ items }) {
	const [open, setOpen] = (0, import_react.useState)(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "divide-y divide-border border-y border-border",
		children: items.map((item, i) => {
			const isOpen = open === i;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setOpen(isOpen ? null : i),
				"aria-expanded": isOpen,
				className: "flex w-full items-center justify-between gap-6 py-5 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: item.q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: cn("size-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-45") })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
				initial: false,
				children: isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
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
						duration: .22,
						ease: [
							.16,
							1,
							.3,
							1
						]
					},
					className: "overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pb-5 pr-10 text-sm leading-relaxed text-muted-foreground",
						children: item.a
					})
				})
			})] }, i);
		})
	});
}
function Landing() {
	const navigate = useNavigate();
	const handleFile = (f) => {
		clearAnalysisState();
		setPendingFile(f);
		navigate({ to: "/analyzing" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "pt-32 pb-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mx-auto max-w-3xl px-6 text-center",
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
								duration: .5,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono-tabular mb-5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
									children: "CareerLens · v1.0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-balance text-5xl font-semibold tracking-tight md:text-6xl",
									children: "The professional bridge between talent and role."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground",
									children: "A deterministic matching engine built for modern hiring. No gimmicks — just precise skill alignment, transparent scoring, and supportive guidance."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							id: "upload",
							initial: {
								opacity: 0,
								y: 12
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: {
								duration: .5,
								delay: .1,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							className: "mt-12 scroll-mt-24",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadZone, { onFile: handleFile }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs text-muted-foreground",
								children: "Your file is processed in memory and never shared with third parties."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "methodology",
						className: "mx-auto mt-32 max-w-5xl px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-12 max-w-2xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono-tabular mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
									children: "How recommendations work"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl font-semibold tracking-tight",
									children: "Rankings are deterministic. Explanations are transparent."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-muted-foreground",
									children: "The same resume produces the same ranking, every time. Each match includes a clear explanation of why it scored where it did and what would move it higher."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustCard, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "size-4" }),
									title: "Deterministic matching",
									body: "Sentence-transformer embeddings + FAISS retrieval produce stable, reproducible rankings — not probabilistic guesses."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustCard, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
									title: "Privacy first",
									body: "Resumes are processed ephemerally. We don't sell data, build profiles, or share with recruiters without consent."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustCard, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
									title: "Explainable, with fallbacks",
									body: "LLM-generated explanations are cached and degrade gracefully to deterministic summaries if the model is unavailable."
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "how",
						className: "mx-auto mt-32 max-w-5xl px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-12 flex items-end justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono-tabular mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: "Process"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-semibold tracking-tight",
								children: "Four steps. One upload."
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "grid gap-6 md:grid-cols-4",
							children: [
								{
									n: "01",
									t: "Upload",
									d: "Drop a PDF resume. We parse structure and content client-side."
								},
								{
									n: "02",
									t: "Match",
									d: "Skills and experience are embedded and matched against open roles."
								},
								{
									n: "03",
									t: "Rank",
									d: "Roles are ranked deterministically by skill alignment."
								},
								{
									n: "04",
									t: "Explain",
									d: "Each match comes with reasons and concrete suggestions."
								}
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl border border-border bg-card p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono-tabular text-xs font-semibold text-muted-foreground",
										children: s.n
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-3 text-base font-semibold",
										children: s.t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm leading-relaxed text-muted-foreground",
										children: s.d
									})
								]
							}, s.n))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mx-auto mt-32 max-w-5xl px-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-10 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
									title: "Resume matching",
									body: "Semantic embeddings capture the meaning of your experience, not just keywords — so 'React' and 'modern frontend' aren't treated as strangers."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
									title: "Skill gap analysis",
									body: "Each role surfaces the specific skills that would meaningfully strengthen your application, framed supportively."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
									title: "LLM explanations",
									body: "A short, human-readable rationale accompanies every match — what aligned, what didn't, and what to do next."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Feature, {
									title: "Improvement recommendations",
									body: "Practical, action-oriented suggestions you can apply to your next revision, not generic advice."
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						id: "faq",
						className: "mx-auto mt-32 max-w-3xl px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono-tabular mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground",
								children: "FAQ"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mb-10 text-3xl font-semibold tracking-tight",
								children: "Common questions"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQAccordion, { items: [
								{
									q: "Is my resume stored?",
									a: "No. Files are parsed in memory for matching and discarded once your session ends. We never sell or share resume contents."
								},
								{
									q: "How are match scores calculated?",
									a: "A sentence-transformer model embeds your skills and experience; FAISS retrieves the closest roles; a deterministic ranking layer normalises scores between 0 and 100."
								},
								{
									q: "Will I get the same recommendations next time?",
									a: "Yes. The matching engine is deterministic — the same resume produces the same ranked list, even if explanations are regenerated."
								},
								{
									q: "What happens if the explanation model is unavailable?",
									a: "Explanations gracefully fall back to a deterministic summary built from matched and missing skills. The ranking itself is unaffected."
								},
								{
									q: "Do you only support PDF resumes?",
									a: "For now, yes. PDF is the most reliable format for accurate parsing. DOCX support is on the roadmap."
								}
							] })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mx-auto mt-32 max-w-3xl px-6 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-surface px-8 py-12",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto mb-4 size-5 text-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl font-semibold tracking-tight",
									children: "Ready when you are."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mx-auto mt-2 max-w-sm text-sm text-muted-foreground",
									children: "Upload a PDF and receive ranked recommendations in under a minute."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: "#upload",
									className: "mt-6 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90",
									children: ["Analyze resume ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function TrustCard({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex size-8 items-center justify-center rounded-md border border-border bg-surface text-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted-foreground",
				children: body
			})
		]
	});
}
function Feature({ title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-l border-border pl-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-semibold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted-foreground",
			children: body
		})]
	});
}
//#endregion
export { Landing as component };
