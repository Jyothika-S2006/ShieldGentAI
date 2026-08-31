import AnalyseThreat from "./AnalyseThreat";
import { useEffect, useMemo, useState } from "react";
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  Activity,
  Settings,
  ChevronRight,
  Search,
  Bell,
  CheckCircle2,
  ShieldAlert,
  X,
  RefreshCw,
  BarChart3,
  Database,
  UserCheck,
  Clock3,
  Zap,
  LockKeyhole,
} from "lucide-react";

const API_URL = "http://127.0.0.1:8080";

function App() {
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState("Overview");
  const [searchTerm, setSearchTerm] = useState("");

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/incidents`);

      if (!response.ok) {
        throw new Error("Failed to fetch incidents");
      }

      const data = await response.json();
      setIncidents(data.incidents || []);
    } catch (err) {
      setError(
        "Backend unavailable. Start the ShieldGent API on port 8080."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const highRisk = incidents.filter(
    (incident) => incident.risk_level === "HIGH_RISK"
  ).length;

  const suspicious = incidents.filter(
    (incident) => incident.risk_level === "SUSPICIOUS"
  ).length;

  const safe = incidents.filter(
    (incident) => incident.risk_level === "SAFE"
  ).length;

  const approved = incidents.filter(
    (incident) => incident.approval_status === "APPROVED"
  ).length;

  const pending = incidents.filter(
    (incident) =>
      incident.approval_status !== "APPROVED" &&
      incident.approval_status !== "REJECTED"
  ).length;

  const filteredIncidents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return incidents;

    return incidents.filter((incident) => {
      return (
        incident.message?.toLowerCase().includes(query) ||
        incident.risk_level?.toLowerCase().includes(query) ||
        incident.recommended_action?.toLowerCase().includes(query) ||
        incident.id?.toLowerCase().includes(query)
      );
    });
  }, [incidents, searchTerm]);

  const renderContent = () => {
    if (activeView === "Analyze Threat") {
      return <AnalyseThreat />;
    }

    if (activeView === "Incidents") {
      return (
        <IncidentsPage
          incidents={filteredIncidents}
          loading={loading}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={loadIncidents}
          onSelect={setSelectedIncident}
        />
      );
    }

    if (activeView === "Analytics") {
      return (
        <AnalyticsPage
          incidents={incidents}
          highRisk={highRisk}
          suspicious={suspicious}
          safe={safe}
          approved={approved}
          pending={pending}
        />
      );
    }

    if (activeView === "Settings") {
      return <SettingsPage />;
    }

    return (
      <OverviewPage
        incidents={incidents}
        loading={loading}
        error={error}
        highRisk={highRisk}
        suspicious={suspicious}
        safe={safe}
        approved={approved}
        pending={pending}
        onSelect={setSelectedIncident}
        onAnalyze={() => setActiveView("Analyze Threat")}
        onRefresh={loadIncidents}
      />
    );
  };

  return (
    <div className="min-h-screen text-slate-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-black/20 px-5 py-6 lg:flex lg:flex-col">
          <div className="mb-10 flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
              <Shield size={21} />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            </div>

            <div>
              <h1 className="text-sm font-semibold tracking-[0.18em]">
                SHIELDGENT
              </h1>
              <p className="text-[10px] tracking-[0.18em] text-slate-500">
                SECURITY CONSOLE
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <NavItem
              icon={<LayoutDashboard size={17} />}
              label="Overview"
              active={activeView === "Overview"}
              onClick={() => setActiveView("Overview")}
            />

            <NavItem
              icon={<AlertTriangle size={17} />}
              label="Incidents"
              active={activeView === "Incidents"}
              onClick={() => setActiveView("Incidents")}
            />

            <NavItem
              icon={<ShieldAlert size={17} />}
              label="Analyze Threat"
              active={activeView === "Analyze Threat"}
              onClick={() => setActiveView("Analyze Threat")}
            />

            <NavItem
              icon={<Activity size={17} />}
              label="Analytics"
              active={activeView === "Analytics"}
              onClick={() => setActiveView("Analytics")}
            />

            <NavItem
              icon={<Settings size={17} />}
              label="Settings"
              active={activeView === "Settings"}
              onClick={() => setActiveView("Settings")}
            />
          </nav>

          <div className="mt-auto">
            <div className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-medium">
                  SYSTEM ONLINE
                </span>
              </div>

              <p className="text-[11px] leading-5 text-slate-500">
                Gemini analysis, Firestore persistence and human review
                controls are operational.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">

          {/* Mobile header */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <Shield size={18} />
              </div>

              <div>
                <p className="text-xs font-semibold tracking-[0.18em]">
                  SHIELDGENT
                </p>
                <p className="text-[9px] tracking-[0.18em] text-slate-600">
                  SECURITY CONSOLE
                </p>
              </div>
            </div>

            <div className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>

          {/* Top bar */}
          <header className="mb-10 flex items-center justify-between gap-4">
            <div>
              <p className="mb-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                AI SECURITY OPERATIONS
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {activeView}
              </h2>

              <p className="mt-2 max-w-xl text-xs text-slate-600">
                Intelligent threat detection with evidence-backed analysis
                and human-controlled response.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={loadIncidents}
                className="glass rounded-xl p-2.5 text-slate-400 transition hover:text-white"
                title="Refresh incidents"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
              </button>

              <button
                className="glass relative rounded-xl p-2.5 text-slate-400 transition hover:text-white"
                title="Security alerts"
              >
                <Bell size={18} />

                {highRisk > 0 && (
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                )}
              </button>

              <div className="hidden items-center gap-2 border-l border-white/10 pl-4 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                  SG
                </div>

                <div>
                  <p className="text-xs font-medium">Operator</p>
                  <p className="text-[10px] text-slate-500">
                    SECURITY TEAM
                  </p>
                </div>
              </div>
            </div>
          </header>

          {error && activeView !== "Analyze Threat" && (
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
              <AlertTriangle size={17} />
              <span>{error}</span>
            </div>
          )}

          {renderContent()}

          <footer className="mt-10 flex flex-col justify-between gap-2 border-t border-white/5 pt-5 text-[10px] uppercase tracking-wider text-slate-600 sm:flex-row">
            <span>ShieldGent AI • Security Intelligence Platform</span>
            <span>Gemini + ADK + Firestore</span>
          </footer>
        </main>
      </div>

      {/* Incident modal */}
      {selectedIncident && (
        <IncidentModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdated={loadIncidents}
        />
      )}
    </div>
  );
}

/* =========================================================
   OVERVIEW
========================================================= */

function OverviewPage({
  incidents,
  loading,
  highRisk,
  suspicious,
  safe,
  approved,
  pending,
  onSelect,
  onAnalyze,
  onRefresh,
}) {
  return (
    <div>
      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-6 shadow-2xl sm:p-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
              <Zap size={12} />
              Agent operational
            </div>

            <h3 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Detect. Explain.
              <span className="text-slate-500"> Escalate.</span>
            </h3>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
              ShieldGent analyzes suspicious messages, identifies threat
              signals, stores the incident and prepares a recommended response
              while keeping the final decision with a human.
            </p>

            <button
              onClick={onAnalyze}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              <ShieldAlert size={17} />
              Analyze a message
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[430px]">
            <MiniMetric
              label="Incidents"
              value={incidents.length}
              icon={<Database size={15} />}
            />

            <MiniMetric
              label="High risk"
              value={highRisk}
              icon={<ShieldAlert size={15} />}
            />

            <MiniMetric
              label="Pending"
              value={pending}
              icon={<Clock3 size={15} />}
            />

            <MiniMetric
              label="Approved"
              value={approved}
              icon={<UserCheck size={15} />}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<ShieldAlert size={19} />}
          label="HIGH RISK"
          value={highRisk}
          description="Requires review"
          danger
        />

        <StatCard
          icon={<AlertTriangle size={19} />}
          label="SUSPICIOUS"
          value={suspicious}
          description="Needs attention"
        />

        <StatCard
          icon={<CheckCircle2 size={19} />}
          label="SAFE"
          value={safe}
          description="No immediate threat"
        />
      </section>

      {/* Recent incidents */}
      <section className="glass rounded-3xl p-5 sm:p-7">
        <div className="mb-7 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              LIVE DATA
            </p>

            <h3 className="mt-1 text-lg font-semibold">
              Recent Incidents
            </h3>
          </div>

          <button
            onClick={onRefresh}
            className="rounded-xl border border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <LoadingState />
        ) : incidents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {incidents.slice(0, 8).map((incident) => (
              <IncidentRow
                key={incident.id}
                incident={incident}
                onClick={() => onSelect(incident)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   INCIDENTS
========================================================= */

function IncidentsPage({
  incidents,
  loading,
  searchTerm,
  setSearchTerm,
  onRefresh,
  onSelect,
}) {
  return (
    <div>
      <section className="mb-6 glass rounded-3xl p-5 sm:p-7">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            INCIDENT MANAGEMENT
          </p>

          <h3 className="mt-1 text-xl font-semibold">
            Security Incidents
          </h3>

          <p className="mt-2 text-xs text-slate-600">
            Review stored threat analyses and human-approval decisions.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages, risk levels or incident IDs..."
              className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-slate-200 outline-none placeholder:text-slate-700 focus:border-white/20"
            />
          </div>

          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <RefreshCw size={15} />
            Refresh
          </button>
        </div>
      </section>

      <section className="glass rounded-3xl p-5 sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              FIRESTORE
            </p>

            <h3 className="mt-1 text-lg font-semibold">
              Stored Incidents
            </h3>
          </div>

          <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-slate-500">
            {incidents.length} shown
          </span>
        </div>

        {loading ? (
          <LoadingState />
        ) : incidents.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {incidents.map((incident) => (
              <IncidentRow
                key={incident.id}
                incident={incident}
                onClick={() => onSelect(incident)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   ANALYTICS
========================================================= */

function AnalyticsPage({
  incidents,
  highRisk,
  suspicious,
  safe,
  approved,
  pending,
}) {
  const total = incidents.length || 1;

  const highPct = Math.round((highRisk / total) * 100);
  const suspiciousPct = Math.round((suspicious / total) * 100);
  const safePct = Math.round((safe / total) * 100);

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          SECURITY TELEMETRY
        </p>

        <h3 className="mt-1 text-xl font-semibold">
          Threat Analytics
        </h3>

        <p className="mt-2 text-xs text-slate-600">
          A lightweight view of ShieldGent's current detection activity.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <AnalyticsCard
          label="Total incidents"
          value={incidents.length}
          icon={<Database size={18} />}
        />

        <AnalyticsCard
          label="High risk"
          value={highRisk}
          icon={<ShieldAlert size={18} />}
          danger
        />

        <AnalyticsCard
          label="Approved"
          value={approved}
          icon={<UserCheck size={18} />}
        />

        <AnalyticsCard
          label="Pending review"
          value={pending}
          icon={<Clock3 size={18} />}
        />
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              RISK DISTRIBUTION
            </p>

            <h4 className="mt-1 font-semibold">
              Classification breakdown
            </h4>
          </div>

          <RiskBar
            label="High risk"
            value={highRisk}
            percentage={highPct}
            danger
          />

          <RiskBar
            label="Suspicious"
            value={suspicious}
            percentage={suspiciousPct}
          />

          <RiskBar
            label="Safe"
            value={safe}
            percentage={safePct}
            safe
          />
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              HUMAN IN THE LOOP
            </p>

            <h4 className="mt-1 font-semibold">
              Review pipeline
            </h4>
          </div>

          <PipelineStep
            number="01"
            title="AI analysis"
            description="Gemini evaluates the submitted content."
            icon={<ShieldAlert size={16} />}
          />

          <PipelineStep
            number="02"
            title="Incident persistence"
            description="The analysis is stored in Firestore for review."
            icon={<Database size={16} />}
          />

          <PipelineStep
            number="03"
            title="Human decision"
            description="Operator approves or rejects the recommended action."
            icon={<UserCheck size={16} />}
          />
        </div>
      </section>
    </div>
  );
}
/* =========================================================
   SETTINGS
========================================================= */

function SettingsPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          PLATFORM CONFIGURATION
        </p>

        <h3 className="mt-1 text-xl font-semibold">
          Settings
        </h3>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingCard
          icon={<Shield size={18} />}
          title="Detection Engine"
          description="AI-powered threat classification and evidence extraction."
          status="ACTIVE"
        />

        <SettingCard
          icon={<Database size={18} />}
          title="Firestore Persistence"
          description="Incidents are stored for dashboard review and auditability."
          status="CONNECTED"
        />

        <SettingCard
          icon={<UserCheck size={18} />}
          title="Human Approval"
          description="Recommended actions remain pending until an operator decides."
          status="ENABLED"
        />

        <SettingCard
          icon={<LockKeyhole size={18} />}
          title="Safety Controls"
          description="ShieldGent prepares actions but does not independently execute external actions."
          status="ENFORCED"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
          DEMO ENVIRONMENT
        </p>

        <p className="mt-2 text-sm text-slate-400">
          Local FastAPI backend • Gemini + Google ADK • Firestore
        </p>
      </div>
    </div>
  );
}
/*=========================================================
   COMPONENTS
========================================================= */

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/10 text-white ring-1 ring-white/10"
          : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MiniMetric({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <div className="mb-3 text-slate-600">{icon}</div>
      <p className="text-xl font-semibold">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-slate-600">
        {label}
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  danger,
}) {
  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div className="mb-6 flex items-center justify-between">
        <div
          className={
            danger ? "text-red-300" : "text-slate-400"
          }
        >
          {icon}
        </div>

        <span
          className={`text-[10px] font-medium tracking-wider ${
            danger ? "text-red-300" : "text-slate-500"
          }`}
        >
          {description}
        </span>
      </div>

      <p className="text-xs font-medium tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-4xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function AnalyticsCard({
  icon,
  label,
  value,
  danger,
}) {
  return (
    <div className="glass glass-hover rounded-2xl p-5">
      <div
        className={`mb-5 ${
          danger ? "text-red-300" : "text-slate-400"
        }`}
      >
        {icon}
      </div>

      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 text-3xl font-semibold">
        {value}
      </p>
    </div>
  );
}

function RiskBar({
  label,
  value,
  percentage,
  danger,
  safe,
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs text-slate-400">
          {label}
        </span>

        <span className="text-xs text-slate-500">
          {value} • {percentage}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all ${
            danger
              ? "bg-red-400"
              : safe
                ? "bg-emerald-400"
                : "bg-amber-400"
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function PipelineStep({
  number,
  title,
  description,
  icon,
}) {
  return (
    <div className="mb-5 flex gap-4 last:mb-0">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-400">
        {icon}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-wider text-slate-600">
            {number}
          </span>

          <p className="text-sm font-medium text-slate-300">
            {title}
          </p>
        </div>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

function SettingCard({
  icon,
  title,
  description,
  status,
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400">
          {icon}
        </div>

        <span className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-2.5 py-1 text-[9px] font-medium tracking-wider text-emerald-300">
          {status}
        </span>
      </div>

      <h4 className="text-sm font-semibold">
        {title}
      </h4>

      <p className="mt-2 text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function IncidentRow({ incident, onClick }) {
  const isHigh = incident.risk_level === "HIGH_RISK";
  const isSuspicious = incident.risk_level === "SUSPICIOUS";

  const approval =
    incident.approval_status === "APPROVED"
      ? "APPROVED"
      : incident.approval_status === "REJECTED"
        ? "REJECTED"
        : "PENDING";

  return (
    <button
      onClick={onClick}
      className="glass-hover group flex w-full items-center gap-4 rounded-2xl p-4 text-left"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isHigh
            ? "bg-red-400/10 text-red-300"
            : isSuspicious
              ? "bg-amber-400/10 text-amber-300"
              : "bg-emerald-400/10 text-emerald-300"
        }`}
      >
        {isHigh ? (
          <ShieldAlert size={18} />
        ) : isSuspicious ? (
          <AlertTriangle size={18} />
        ) : (
          <CheckCircle2 size={18} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <span
            className={`text-[10px] font-semibold tracking-[0.15em] ${
              isHigh
                ? "text-red-300"
                : isSuspicious
                  ? "text-amber-300"
                  : "text-emerald-300"
            }`}
          >
            {incident.risk_level}
          </span>

          <span className="text-[10px] text-slate-600">
            #{incident.id?.slice(0, 8)}
          </span>
        </div>

        <p className="truncate text-sm text-slate-200">
          {incident.message || "Security incident"}
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[9px] text-slate-600">
            {incident.recommended_action || "NO ACTION"}
          </span>

          <span
            className={`rounded-full border px-2 py-0.5 text-[9px] ${
              approval === "APPROVED"
                ? "border-emerald-400/10 text-emerald-300"
                : approval === "REJECTED"
                  ? "border-red-400/10 text-red-300"
                  : "border-amber-400/10 text-amber-300"
            }`}
          >
            {approval}
          </span>
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-xs font-semibold">
          {incident.risk_score ?? "--"}
        </p>

        <p className="text-[9px] uppercase tracking-wider text-slate-600">
          risk score
        </p>
      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-300"
      />
    </button>
  );
}

function IncidentModal({
  incident,
  onClose,
  onUpdated,
}) {
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const approve = async () => {
    try {
      setActionLoading(true);
      setActionError("");

      const response = await fetch(
        `${API_URL}/incidents/${incident.id}/approve`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Approval failed");
      }

      await onUpdated();
      onClose();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    try {
      setActionLoading(true);
      setActionError("");

      const response = await fetch(
        `${API_URL}/incidents/${incident.id}/reject`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Rejection failed");
      }

      await onUpdated();
      onClose();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const isApproved =
    incident.approval_status === "APPROVED";

  const isRejected =
    incident.approval_status === "REJECTED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
      <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8">

        <div className="mb-7 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              INCIDENT ANALYSIS
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Threat Assessment
            </h3>

            <p className="mt-1 text-[10px] text-slate-600">
              #{incident.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Risk Level
            </p>

            <p className="mt-2 text-lg font-semibold text-red-300">
              {incident.risk_level}
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Risk Score
            </p>

            <p className="mt-2 text-lg font-semibold">
              {incident.risk_score}/100
            </p>
          </div>

          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Approval
            </p>

            <p
              className={`mt-2 text-sm font-semibold ${
                isApproved
                  ? "text-emerald-300"
                  : isRejected
                    ? "text-red-300"
                    : "text-amber-300"
              }`}
            >
              {incident.approval_status || "PENDING"}
            </p>
          </div>
        </div>

        <DetailBlock title="Original Message">
          <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
            <p className="text-sm leading-6 text-slate-300">
              {incident.message}
            </p>
          </div>
        </DetailBlock>

        <DetailBlock title="Threats Detected">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
              {incident.threats || "No threats recorded."}
            </p>
          </div>
        </DetailBlock>

        <DetailBlock title="Evidence">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
            <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
              {incident.evidence || "No evidence recorded."}
            </p>
          </div>
        </DetailBlock>

        <DetailBlock title="Recommended Action">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
            <p className="text-sm font-medium text-slate-200">
              {incident.recommended_action}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Human approval is required before the recommendation is
              considered final.
            </p>
          </div>
        </DetailBlock>

        {actionError && (
          <div className="mb-5 rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">
            {actionError}
          </div>
        )}

        {!isApproved && !isRejected && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={approve}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:opacity-50"
            >
              <CheckCircle2 size={17} />

              {actionLoading
                ? "Processing..."
                : "Approve recommendation"}
            </button>

            <button
              onClick={reject}
              disabled={actionLoading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
            >
              <X size={17} />

              Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailBlock({ title, children }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-600">
        {title}
      </p>

      {children}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-40 flex-col items-center justify-center">
      <RefreshCw
        size={20}
        className="mb-3 animate-spin text-slate-600"
      />

      <p className="text-sm text-slate-500">
        Loading security incidents...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-40 flex-col items-center justify-center text-center">
      <CheckCircle2
        size={25}
        className="mb-3 text-emerald-400"
      />

      <p className="text-sm font-medium">
        No incidents detected
      </p>

      <p className="mt-1 text-xs text-slate-500">
        ShieldGent has a clean inbox.
      </p>
    </div>
  );
}

export default App;