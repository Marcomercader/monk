"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";

const GOAL_COLORS = ["#7EC8A0", "#F0C870", "#88B0E8", "#F09880", "#C0A0E8"];
const CAL_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function formatDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getLast14Days(): string[] {
  const days: string[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(formatDateKey(d));
  }
  return days;
}

export default function GoalPanel() {
  const { goals, ratings, getLongTermProgress, getRatingsForGoal } = useGoals();
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const today = new Date();
  const todayKey = formatDateKey(today);
  const last14 = getLast14Days();

  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const datesWithData = useMemo(
    () => new Set(ratings.map((r) => r.date)),
    [ratings]
  );

  const firstDay = new Date(calYear, calMonth, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const prevCal = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextCal = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  const padL = 14, padB = 14, padT = 4, padR = 4;
  const W = 210, H = 70;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const xScale = (i: number) => padL + (i / (last14.length - 1)) * chartW;
  const yScale = (v: number) => padT + chartH - ((v - 1) / 4) * chartH;

  return (
    <div className="w-60 rounded-2xl bg-monk-surface border border-monk-border shadow-md flex flex-col gap-3 p-4 max-h-[82vh] overflow-y-auto">

      {/* Goals link */}
      <Link href="/goals" className="block">
        <motion.div
          whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.04)" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-monk-bg border border-monk-border transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🎯</span>
            <span className="text-sm font-medium text-monk-text tracking-wide">Goals</span>
          </div>
          <svg viewBox="0 0 14 14" width="11" height="11" fill="none">
            <path d="M5 3.5l3.5 3.5L5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-monk-muted" />
          </svg>
        </motion.div>
      </Link>

      {/* Progress bars */}
      {goals.length > 0 ? (
        <div className="space-y-2.5">
          {goals.slice(0, 5).map((goal, gi) => {
            const color = GOAL_COLORS[gi % GOAL_COLORS.length];
            const pct = getLongTermProgress(goal.id);
            const habits = goal.habits ?? [];
            const isExpanded = expandedGoal === goal.id;
            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[11px] text-monk-text truncate">{goal.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-[10px] text-monk-muted">{pct}%</span>
                    {habits.length > 0 && (
                      <button
                        onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                        className="text-[9px] text-monk-muted hover:text-monk-text transition-colors cursor-pointer leading-none"
                      >
                        <motion.span
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.15 }}
                          className="inline-block"
                        >
                          ›
                        </motion.span>
                      </button>
                    )}
                  </div>
                </div>
                <div className="h-1 bg-monk-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
                {/* Habit sub-list */}
                <AnimatePresence initial={false}>
                  {isExpanded && habits.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden mt-1.5 pl-3 flex flex-col gap-1"
                    >
                      {habits.map((habit) => (
                        <div key={habit.id} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: color, opacity: 0.5 }} />
                          <span className="text-[10px] text-monk-muted truncate">{habit.name}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[11px] text-monk-muted italic text-center py-1">
          No goals yet
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-monk-border" />

      {/* Mini calendar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={prevCal}
            className="text-monk-muted hover:text-monk-text transition-colors cursor-pointer w-5 h-5 flex items-center justify-center text-sm"
          >
            ‹
          </button>
          <span className="text-[10px] text-monk-muted tracking-wide">
            {CAL_MONTHS[calMonth]} {calYear}
          </span>
          <button
            onClick={nextCal}
            className="text-monk-muted hover:text-monk-text transition-colors cursor-pointer w-5 h-5 flex items-center justify-center text-sm"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 mb-1">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="text-center text-[8px] text-monk-muted py-0.5">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-0.5">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isToday = dateKey === todayKey;
            const hasData = datesWithData.has(dateKey);
            return (
              <div
                key={day}
                className={`relative aspect-square flex items-center justify-center rounded text-[9px] transition-colors ${
                  isToday
                    ? "bg-monk-warm/50 text-monk-text font-semibold"
                    : "text-monk-muted"
                }`}
              >
                {day}
                {hasData && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500 opacity-75" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 14-day chart */}
      {goals.length > 0 && (
        <>
          <div className="border-t border-monk-border" />
          <div>
            <p className="text-[8px] text-monk-muted uppercase tracking-widest mb-1.5">
              14-day trend
            </p>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible">
              {[1, 3, 5].map((r) => (
                <line
                  key={r}
                  x1={padL} y1={yScale(r)} x2={W - padR} y2={yScale(r)}
                  stroke="#c8b088" strokeWidth="0.4" opacity="0.6"
                />
              ))}
              {last14.map((dateStr, i) => {
                if (i % 4 !== 0) return null;
                const d = new Date(dateStr + "T12:00:00");
                return (
                  <text key={dateStr} x={xScale(i)} y={H} fontSize="7"
                    fill="#8a7f74" textAnchor="middle">
                    {DAY_LABELS[d.getDay()]}
                  </text>
                );
              })}
              {goals.slice(0, 5).map((goal, gi) => {
                const color = GOAL_COLORS[gi % GOAL_COLORS.length];
                const rMap = new Map(getRatingsForGoal(goal.id).map((r) => [r.date, r.rating]));
                const pts: { x: number; y: number }[] = [];
                last14.forEach((date, i) => {
                  const r = rMap.get(date);
                  if (r !== undefined) pts.push({ x: xScale(i), y: yScale(r) });
                });
                if (pts.length < 1) return null;
                let d = `M ${pts[0].x} ${pts[0].y}`;
                for (let j = 1; j < pts.length; j++) {
                  const p0 = pts[j - 1], p1 = pts[j];
                  const mx = (p0.x + p1.x) / 2;
                  d += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
                }
                return (
                  <g key={goal.id}>
                    {pts.length > 1 && (
                      <path d={d} stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.9" />
                    )}
                    {pts.map((pt, pi) => (
                      <circle key={pi} cx={pt.x} cy={pt.y} r="2" fill={color} opacity="0.95" />
                    ))}
                  </g>
                );
              })}
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
