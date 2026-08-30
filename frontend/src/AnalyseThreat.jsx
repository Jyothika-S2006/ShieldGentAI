import { useState } from "react";
import { ShieldAlert, Loader2, Sparkles } from "lucide-react";

const API_URL = "http://127.0.0.1:8080";

export default function AnalyzeThreat() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-300 ring-1 ring-red-400/10">
            <ShieldAlert size={22} />
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              AI SECURITY ANALYSIS
            </p>

            <h2 className="text-2xl font-semibold tracking-tight">
              Analyze Threat
            </h2>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Submit a suspicious message to ShieldGent for AI-powered threat
          analysis, risk scoring, and recommended action.
        </p>
      </div>

      {/* Input */}
      <div className="glass rounded-3xl p-5 sm:p-7">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-300">
              SECURITY MESSAGE
            </p>

            <p className="mt-1 text-[11px] text-slate-600">
              SMS • Email • Chat • Payment alert
            </p>
          </div>

          <Sparkles size={17} className="text-slate-600" />
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste a suspicious message here..."
          className="h-44 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-5 text-sm leading-6 text-slate-200 outline-none placeholder:text-slate-700 focus:border-white/20"
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <p className="text-[10px] text-slate-600">
            {text.length} characters
          </p>

          <button
            onClick={analyze}
            disabled={!text.trim() || loading}
            className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading && (
              <Loader2 size={16} className="animate-spin" />
            )}

            {loading ? "Analyzing..." : "Analyze Threat"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="glass mt-6 rounded-3xl p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5">
              <ShieldAlert size={17} />
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

          <pre className="whitespace-pre-wrap rounded-2xl border border-white/5 bg-black/20 p-5 text-sm leading-7 text-slate-300">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}