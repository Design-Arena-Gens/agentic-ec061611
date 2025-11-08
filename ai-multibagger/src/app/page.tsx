"use client";

import { useMemo, useState } from "react";
import { runAgent, type AgentInput, type AgentResponse, type MacroSignals } from "@/lib/agent";

const defaultInput: AgentInput = {
  riskTolerance: "Balanced",
  horizonYears: 7,
  deployableCapital: 25,
  macro: {
    gdpGrowth: 6.8,
    inflation: 5.1,
    interestRate: 6.25,
    policySupport: "Strong",
  },
  focusMegatrends: ["Vehicle electrification", "Sustainable chemistry"],
  avoidSectors: [],
  catalystBias: "Balanced",
};

const megatrendOptions = [
  "Vehicle electrification",
  "Software-defined mobility",
  "Sustainable chemistry",
  "Digital infrastructure",
  "Green hydrogen",
  "Make in India",
  "Creator economy",
  "Healthcare digitisation",
];

const sectorOptions = [
  "Technology",
  "Manufacturing",
  "Chemicals",
  "Consumer",
  "Capital Goods",
  "Digital",
];

const formatScore = (score: number) => `${score.toFixed(0)} / 100`;

export default function Home() {
  const [input, setInput] = useState(defaultInput);
  const [response, setResponse] = useState<AgentResponse>(() => runAgent(defaultInput));

  const macroSummary = useMemo(() => response.macroNarrative, [response]);

  const updateInput = <K extends keyof AgentInput>(key: K, value: AgentInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMegatrend = (trend: string) => {
    setInput((prev) => {
      const exists = prev.focusMegatrends.includes(trend);
      return {
        ...prev,
        focusMegatrends: exists
          ? prev.focusMegatrends.filter((item) => item !== trend)
          : [...prev.focusMegatrends, trend],
      };
    });
  };

  const toggleSector = (sector: string) => {
    setInput((prev) => {
      const exists = prev.avoidSectors.includes(sector);
      return {
        ...prev,
        avoidSectors: exists
          ? prev.avoidSectors.filter((item) => item !== sector)
          : [...prev.avoidSectors, sector],
      };
    });
  };

  const regenerate = () => {
    setResponse(runAgent(input));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12 md:py-16">
        <header className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl shadow-slate-900/50 backdrop-blur">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.5em] text-cyan-400">Agent Multibagger</p>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              AI agent curated to surface potential Indian multibagger opportunities
            </h1>
            <p className="max-w-3xl text-sm text-slate-300 md:text-base">
              Feed your macro assumptions and risk profile, and the agent triangulates fundamentals,
              growth vectors, innovation velocity, valuation sanity and catalysts to shortlist
              compounding candidates aligned with high-conviction megatrends.
            </p>
          </div>
        </header>

        <section className="grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Investor Blueprint</h2>
                <button
                  type="button"
                  onClick={regenerate}
                  className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:border-cyan-300 hover:bg-cyan-500/20"
                >
                  Run Agent
                </button>
              </div>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Risk tolerance
                  <select
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.riskTolerance}
                    onChange={(event) => updateInput("riskTolerance", event.target.value as AgentInput["riskTolerance"])}
                  >
                    <option value="Conservative">Conservative</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Aggressive">Aggressive</option>
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Horizon (years)
                  <input
                    type="number"
                    min={3}
                    max={12}
                    step={1}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.horizonYears}
                    onChange={(event) => updateInput("horizonYears", Number(event.target.value))}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Deployable capital (INR in lakhs)
                  <input
                    type="number"
                    min={5}
                    max={200}
                    step={1}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.deployableCapital}
                    onChange={(event) => updateInput("deployableCapital", Number(event.target.value))}
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Catalyst bias
                  <select
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.catalystBias}
                    onChange={(event) => updateInput("catalystBias", event.target.value as AgentInput["catalystBias"])}
                  >
                    <option value="Structural">Structural</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Cyclical">Cyclical</option>
                  </select>
                </label>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-3">
                  <div className="text-sm font-medium text-slate-200">Megatrends focus</div>
                  <div className="flex flex-wrap gap-2">
                    {megatrendOptions.map((trend) => {
                      const active = input.focusMegatrends.includes(trend);
                      return (
                        <button
                          type="button"
                          key={trend}
                          onClick={() => toggleMegatrend(trend)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            active
                              ? "border-cyan-300 bg-cyan-500/20 text-cyan-200"
                              : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                          }`}
                        >
                          {trend}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="text-sm font-medium text-slate-200">Avoid sectors</div>
                  <div className="flex flex-wrap gap-2">
                    {sectorOptions.map((sector) => {
                      const active = input.avoidSectors.includes(sector);
                      return (
                        <button
                          type="button"
                          key={sector}
                          onClick={() => toggleSector(sector)}
                          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                            active
                              ? "border-rose-300 bg-rose-500/20 text-rose-200"
                              : "border-slate-700 bg-slate-950/60 text-slate-400 hover:border-slate-500 hover:text-slate-200"
                          }`}
                        >
                          {sector}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="text-lg font-semibold text-white">Macro signals</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  GDP growth (%)
                  <input
                    type="number"
                    min={4}
                    max={9}
                    step={0.1}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.macro.gdpGrowth}
                    onChange={(event) =>
                      setInput((prev) => ({
                        ...prev,
                        macro: { ...prev.macro, gdpGrowth: Number(event.target.value) },
                      }))
                    }
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Inflation (%)
                  <input
                    type="number"
                    min={3}
                    max={9}
                    step={0.1}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.macro.inflation}
                    onChange={(event) =>
                      setInput((prev) => ({
                        ...prev,
                        macro: { ...prev.macro, inflation: Number(event.target.value) },
                      }))
                    }
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Repo rate (%)
                  <input
                    type="number"
                    min={4}
                    max={9}
                    step={0.1}
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.macro.interestRate}
                    onChange={(event) =>
                      setInput((prev) => ({
                        ...prev,
                        macro: { ...prev.macro, interestRate: Number(event.target.value) },
                      }))
                    }
                  />
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-300">
                  Policy support
                  <select
                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none"
                    value={input.macro.policySupport}
                    onChange={(event) =>
                      setInput((prev) => ({
                        ...prev,
                        macro: { ...prev.macro, policySupport: event.target.value as MacroSignals["policySupport"] },
                      }))
                    }
                  >
                    <option value="Weak">Weak</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Strong">Strong</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold text-white">Macro narrative</h2>
                <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
                  {response.timestamp.slice(11, 19)} IST
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">{macroSummary}</p>
              <p className="mt-4 text-sm text-slate-300">{response.strategySummary}</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-lg font-semibold text-white">Portfolio Blueprint</h2>
              <div className="mt-4 flex flex-col gap-4">
                {response.portfolioMix.length === 0 && (
                  <p className="text-sm text-slate-400">Agent did not find qualifying ideas under current constraints.</p>
                )}
                {response.portfolioMix.map((slot) => (
                  <div
                    key={slot.ticker}
                    className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
                  >
                    <div className="flex items-baseline justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                          {slot.ticker}
                        </p>
                        <p className="text-base font-medium text-white">{slot.name}</p>
                      </div>
                      <div className="text-2xl font-semibold text-white">{slot.allocation.toFixed(1)}%</div>
                    </div>
                    <p className="mt-3 text-xs text-slate-300">{slot.thesis}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-lg font-semibold text-white">Risk dashboard</h2>
              <div className="mt-3 grid gap-4 text-sm text-slate-200">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Systemic</p>
                  <p className="text-sm text-slate-100">{response.riskDashboard.systemic}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Company specific</p>
                  <p className="text-sm text-slate-100">{response.riskDashboard.companySpecific}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400">Mitigation stack</p>
                  <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-xs text-slate-300">
                    {response.riskDashboard.mitigationPlaybook.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-lg font-semibold text-white">Top ideas and diagnostics</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {response.topPicks.map((item) => (
              <article
                key={item.company.ticker}
                className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4"
              >
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">{item.company.ticker}</p>
                    <p className="text-lg font-semibold text-white">{item.company.name}</p>
                  </div>
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                    Score {item.scores.totalScore.toFixed(1)}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-300">{item.company.description}</p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-200">
                  <Metric label="Fundamentals" value={formatScore(item.scores.fundamentals)} />
                  <Metric label="Growth" value={formatScore(item.scores.growth)} />
                  <Metric label="Innovation" value={formatScore(item.scores.innovation)} />
                  <Metric label="Catalysts" value={formatScore(item.scores.catalysts)} />
                  <Metric label="Risk" value={formatScore(item.scores.riskAdjusted)} />
                  <Metric label="Valuation" value={formatScore(item.scores.valuation)} />
                  <Metric label="Megatrend" value={formatScore(item.scores.megatrendFit)} />
                </div>

                <div className="flex flex-wrap gap-2 text-[11px] text-cyan-200">
                  {item.company.megatrends.map((trend) => (
                    <span
                      key={trend}
                      className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-1"
                    >
                      {trend}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-1 text-[11px] text-slate-300">
                  {item.rationale.map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{line}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1 text-[11px] text-slate-400">
                  <p className="font-semibold text-slate-200">Catalysts watched</p>
                  {item.company.catalystNotes.map((note) => (
                    <p key={note}>• {note}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">Radar watchlist</h2>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-300">
            {response.watchlist.map((item) => (
              <span
                key={item.ticker}
                className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2"
              >
                {item.narrative}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <span className="text-[10px] uppercase tracking-widest text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
