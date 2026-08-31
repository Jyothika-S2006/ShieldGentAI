import { useState } from "react";
import {
  ShieldAlert,
  Loader2,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  Copy,
  RotateCcw,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8080";

export default function AnalyseThreat() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (!text.trim() || loading) return;

    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed");
      }

      setResult(data.analysis);
    } catch (err) {
      setError(
        err.message || "Could not reach ShieldGent backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setText("");
    setResult(null);
    setError("");
  };

  const copyResult = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      // Clipboard permission may be unavailable.
    }
  };

  return (
    <div className="mx-auto max-w-6xl">

      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-red-400/10 text-red-300 ring-1 ring-red-400/10">
            <ShieldAlert size={23} />

            <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              AI SECURITY ANALYSIS
            </p>

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Analyze Threat
            </h2>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Submit a suspicious SMS, email, payment alert or chat message.
          ShieldGent analyzes the content, identifies evidence, assigns a
          risk score and prepares a recommended response.
        </p>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">

        {/* Input */}
        <section className="glass rounded-3xl p-5 shadow-2xl sm:p-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-wide text-slate-300">
                MESSAGE ANALYZER
              </p>

              <p className="mt-1 text-[11px] text-slate-600">
                SMS • Email • Chat • Payment alert
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
              <Sparkles size={17} className="text-slate-500" />
            </div>
          </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a suspicious message here..."
              className="h-64 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-7 text-slate-200 outline-none transition placeholder:text-slate-700 focus:border-red-400/30 focus:bg-black/30"
            />

            <div className="pointer-events-none absolute bottom-4 right-4 rounded-lg border border-white/5 bg-black/30 px-2 py-1 text-[9px] text-slate-600">
              {text.length} chars
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={clearAll}
              disabled={!text && !result}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/5 px-4 py-3 text-xs text-slate-600 transition hover:bg-white/5 hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <RotateCcw size={14} />
              Clear
            </button>

            <button
              onClick={analyze}
              disabled={!text.trim() || loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Analyze Threat
                </>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-white/5 pt-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <p className="text-[10px] text-slate-600">
              Gemini + Google ADK agent • Human approval enforced
            </p>
          </div>
        </section>

        {/* Result */}
        <section className="glass rounded-3xl p-5 shadow-2xl sm:p-7">
          {!result && !loading && !error && (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/5">
                <ShieldAlert
                  size={28}
                  className="text-slate-600"
                />
              </div>

              <p className="text-sm font-medium text-slate-400">
                Awaiting threat analysis
              </p>

              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
                Submit a message and ShieldGent will return an evidence-backed
                threat assessment.
              </p>
            </div>
          )}

          {loading && (
            <div className="flex h-full min-h-[380px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400/5 ring-1 ring-red-400/10">
                <Loader2
                  size={28}
                  className="animate-spin text-red-300"
                />
              </div>

              <p className="text-sm font-medium text-slate-300">
                ShieldGent is analyzing...
              </p>

              <p className="mt-2 max-w-xs text-xs leading-5 text-slate-600">
                Gemini is evaluating threat signals, evidence and the
                recommended response.
              </p>

              <div className="mt-6 flex gap-1">
                <span className="h-1 w-6 animate-pulse rounded-full bg-white/20" />
                <span className="h-1 w-6 animate-pulse rounded-full bg-white/10 [animation-delay:150ms]" />
                <span className="h-1 w-6 animate-pulse rounded-full bg-white/5 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-400/5 ring-1 ring-red-400/10">
                <AlertTriangle
                  size={28}
                  className="text-red-300"
                />
              </div>

              <p className="text-sm font-medium text-red-300">
                Analysis failed
              </p>

              <p className="mt-2 max-w-md text-xs leading-5 text-slate-600">
                {error}
              </p>
            </div>
          )}

          {result && !loading && (
            <div>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                      SHIELDGENT ANALYSIS
                    </p>

                    <p className="text-sm font-medium text-slate-300">
                      Threat assessment complete
                    </p>
                  </div>
                </div>

                <button
                  onClick={copyResult}
                  className="rounded-xl border border-white/5 p-2 text-slate-600 transition hover:bg-white/5 hover:text-slate-300"
                  title="Copy analysis"
                >
                  <Copy size={15} />
                </button>
              </div>

              {copied && (
                <div className="mb-4 rounded-xl border border-emerald-400/10 bg-emerald-400/5 px-3 py-2 text-[10px] text-emerald-300">
                  Analysis copied.
                </div>
              )}

              <div className="mb-4 rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert
                    size={17}
                    className="mt-0.5 text-emerald-300"
                  />

                  <div>
                    <p className="text-xs font-medium text-slate-300">
                      Evidence-backed assessment
                    </p>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      The result below was generated by the ShieldGent agent
                      and persisted as a security incident.
                    </p>
                  </div>
                </div>
              </div>

              <div className="max-h-[470px] overflow-y-auto rounded-2xl border border-white/5 bg-black/20 p-5">
                <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {result}
                </pre>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}