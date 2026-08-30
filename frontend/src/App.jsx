import AnalyseThreat from "./AnalyseThreat";
import { useEffect, useState } from 'react'
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
} from 'lucide-react'

const API_URL = 'http://127.0.0.1:8080'

function App() {
  const [incidents, setIncidents] = useState([])
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeView, setActiveView] = useState('Overview')

  const loadIncidents = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await fetch(`${API_URL}/incidents`)

      if (!response.ok) {
        throw new Error('Failed to fetch incidents')
      }

      const data = await response.json()
      setIncidents(data.incidents || [])
    } catch (err) {
      setError(
        'Backend unavailable. Start the ShieldGent API on port 8080.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIncidents()
  }, [])

  const highRisk = incidents.filter(
    (incident) => incident.risk_level === 'HIGH_RISK'
  ).length

  const suspicious = incidents.filter(
    (incident) => incident.risk_level === 'SUSPICIOUS'
  ).length

  const safe = incidents.filter(
    (incident) => incident.risk_level === 'SAFE'
  ).length

  return (
    <div className="min-h-screen text-slate-100">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/5 bg-black/20 px-5 py-6 lg:block">

          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
              <Shield size={21} />
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
              active={activeView === 'Overview'}
              onClick={() => setActiveView('Overview')}
            />

            <NavItem
              icon={<AlertTriangle size={17} />}
              label="Incidents"
              active={activeView === 'Incidents'}
              onClick={() => setActiveView('Incidents')}
            />

            <NavItem
              icon={<ShieldAlert size={17} />}
              label="Analyze Threat"
              active={activeView === 'Analyze Threat'}
              onClick={() => setActiveView('Analyze Threat')}
            />

            <NavItem
              icon={<Activity size={17} />}
              label="Analytics"
              active={activeView === 'Analytics'}
              onClick={() => setActiveView('Analytics')}
            />

            <NavItem
              icon={<Settings size={17} />}
              label="Settings"
              active={activeView === 'Settings'}
              onClick={() => setActiveView('Settings')}
            />

          </nav>

          <div className="mt-auto pt-20">
            <div className="glass rounded-2xl p-4">

              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-medium">
                  SYSTEM ONLINE
                </span>
              </div>

              <p className="text-[11px] leading-5 text-slate-500">
                ShieldGent AI monitoring and incident analysis are operational.
              </p>

            </div>
          </div>

        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10">

          {activeView === 'Analyze Threat' ? (

            <AnalyseThreat />

          ) : (

            <>

              {/* Top bar */}
              <header className="mb-10 flex items-center justify-between gap-4">

                <div>
                  <p className="mb-1 text-xs uppercase tracking-[0.25em] text-slate-500">
                    AI SECURITY OPERATIONS
                  </p>

                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Security Overview
                  </h2>
                </div>

                <div className="flex items-center gap-3">

                  <button className="glass rounded-xl p-2.5 text-slate-400 transition hover:text-white">
                    <Search size={18} />
                  </button>

                  <button className="glass relative rounded-xl p-2.5 text-slate-400 transition hover:text-white">

                    <Bell size={18} />

                    {highRisk > 0 && (
                      <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-400" />
                    )}

                  </button>

                  <div className="hidden items-center gap-2 border-l border-white/10 pl-4 sm:flex">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold">
                      SG
                    </div>

                    <div>
                      <p className="text-xs font-medium">
                        Operator
                      </p>

                      <p className="text-[10px] text-slate-500">
                        SECURITY TEAM
                      </p>
                    </div>

                  </div>

                </div>

              </header>

              {/* Error */}
              {error && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
                  <AlertTriangle size={17} />
                  {error}
                </div>
              )}

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

              {/* Incidents */}
              <section className="glass rounded-3xl p-5 sm:p-7">

                <div className="mb-7 flex items-center justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      LIVE DATA
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Recent Incidents
                    </h3>
                  </div>

                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-slate-500">
                    {incidents.length} recorded
                  </span>

                </div>

                {loading ? (

                  <div className="flex h-40 items-center justify-center text-sm text-slate-500">
                    Loading security incidents...
                  </div>

                ) : incidents.length === 0 ? (

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

                ) : (

                  <div className="space-y-3">

                    {incidents.map((incident) => (

                      <IncidentRow
                        key={incident.id}
                        incident={incident}
                        onClick={() => setSelectedIncident(incident)}
                      />

                    ))}

                  </div>

                )}

              </section>

              {/* Footer */}
              <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/5 pt-5 text-[10px] uppercase tracking-wider text-slate-600 sm:flex-row">

                <span>
                  ShieldGent AI • Security Intelligence Platform
                </span>

                <span>
                  Gemini + ADK + Firestore
                </span>

              </footer>

            </>

          )}

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
  )
}

function NavItem({ icon, label, active, onClick }) {

  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? 'bg-white/10 text-white ring-1 ring-white/10'
          : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
      }`}
    >

      {icon}

      {label}

    </button>
  )
}

function StatCard({ icon, label, value, description, danger }) {

  return (
    <div className="glass glass-hover rounded-2xl p-5">

      <div className="mb-6 flex items-center justify-between">

        <div className="text-slate-400">
          {icon}
        </div>

        <span
          className={`text-[10px] font-medium tracking-wider ${
            danger ? 'text-red-300' : 'text-slate-500'
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
  )
}

function IncidentRow({ incident, onClick }) {

  const isHigh = incident.risk_level === 'HIGH_RISK'
  const isSuspicious = incident.risk_level === 'SUSPICIOUS'

  return (
    <button
      onClick={onClick}
      className="glass-hover flex w-full items-center gap-4 rounded-2xl p-4 text-left"
    >

      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isHigh
            ? 'bg-red-400/10 text-red-300'
            : isSuspicious
              ? 'bg-amber-400/10 text-amber-300'
              : 'bg-emerald-400/10 text-emerald-300'
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
                ? 'text-red-300'
                : isSuspicious
                  ? 'text-amber-300'
                  : 'text-emerald-300'
            }`}
          >
            {incident.risk_level}
          </span>

          <span className="text-[10px] text-slate-600">
            #{incident.id?.slice(0, 8)}
          </span>

        </div>

        <p className="truncate text-sm text-slate-200">
          {incident.message || 'Security incident'}
        </p>

      </div>

      <div className="hidden text-right sm:block">

        <p className="text-xs font-semibold">
          {incident.risk_score ?? '--'}
        </p>

        <p className="text-[9px] uppercase tracking-wider text-slate-600">
          risk score
        </p>

      </div>

      <ChevronRight
        size={17}
        className="shrink-0 text-slate-600"
      />

    </button>
  )
}

function IncidentModal({ incident, onClose, onUpdated }) {

  const [actionLoading, setActionLoading] = useState(false)

  const approve = async () => {

    try {

      setActionLoading(true)

      await fetch(`${API_URL}/incidents/${incident.id}/approve`, {
        method: 'POST',
      })

      await onUpdated()
      onClose()

    } finally {

      setActionLoading(false)

    }
  }

  const reject = async () => {

    try {

      setActionLoading(true)

      await fetch(`${API_URL}/incidents/${incident.id}/reject`, {
        method: 'POST',
      })

      await onUpdated()
      onClose()

    } finally {

      setActionLoading(false)

    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">

      <div className="glass max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 shadow-2xl sm:p-8">

        <div className="mb-7 flex items-start justify-between gap-4">

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
              INCIDENT ANALYSIS
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              Threat Assessment
            </h3>

          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          >
            <X size={19} />
          </button>

        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">

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

        </div>

        <DetailBlock title="Original Message">

          <p className="text-sm leading-6 text-slate-300">
            {incident.message}
          </p>

        </DetailBlock>

        <DetailBlock title="Threats Detected">

          <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
            {incident.threats || 'No threats recorded.'}
          </p>

        </DetailBlock>

        <DetailBlock title="Evidence">

          <p className="whitespace-pre-line text-sm leading-6 text-slate-300">
            {incident.evidence || 'No evidence recorded.'}
          </p>

        </DetailBlock>

        <DetailBlock title="Recommended Action">

          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">

            <p className="text-sm font-medium text-slate-200">
              {incident.recommended_action}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Human approval is required before action is taken.
            </p>

          </div>

        </DetailBlock>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">

          <button
            onClick={approve}
            disabled={actionLoading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:opacity-50"
          >

            <CheckCircle2 size={17} />

            {actionLoading
              ? 'Processing...'
              : 'Approve'}

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

      </div>

    </div>
  )
}

function DetailBlock({ title, children }) {

  return (
    <div className="mb-5">

      <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-600">
        {title}
      </p>

      {children}

    </div>
  )
}

export default App