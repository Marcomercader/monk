"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
  const startOffset = (firstDay.getDay() + 6) % 7; // Mon-first
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const prevCal = () => {
    if (calMonth === 0) { setCalYear((y) => y - 1); setCalMonth(11); }
    else setCalMonth((m) => m - 1);
  };
  const nextCal = () => {
    if (calMonth === 11) { setCalYear((y) => y + 1); setCalMonth(0); }
    else setCalMonth((m) => m + 1);
  };

  // Compact 14-day chart dims
  const padL = 14, padB = 14, padT = 4, padR = 4;
  const W = 210, H = 70;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const xScale = (i: number) => padL + (i / (last14.length - 1)) * chartW;
  const yScale = (v: number) => padT + chartH - ((v - 1) / 4) * chartH;

  return (
    <div className="w-60 rounded-2xl bg-white/8 backdrop-blur-lg border border-white/12 shadow-2xl flex flex-col gap-3 p-4 max-h-[82vh] overflow-y-auto">

      {/* Goals link */}
      <Link href="/goals" className="block">
        <motion.div
          whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/10 border border-white/15 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🎯</span>
            <span className="text-sm font-medium text-white/90 tracking-wide">Goals</span>
          </div>
          <svg viewBox="0 0 14 14" width="11" height="11" fill="none">
            <path d="M5 3.5l3.5 3.5L5 10.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </Link>

      {/* Progress bars */}
      {goals.length > 0 ? (
        <div className="space-y-2.5">
          {goals.slice(0, 5).map((goal, gi) => {
            const color = GOAL_COLORS[gi % GOAL_COLORS.length];
            const pct = getLongTermProgress(goal.id);
            return (
              <div key={goal.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-[11px] text-white/75 truncate">{goal.name}</span>
                  </div>
                  <span className="text-[10px] text-white/40 ml-2 flex-shrink-0">{pct}%</span>
                </div>
                <div className="h-1 bg-white/12 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[11px] text-white/35 italic text-center py-1">
          No goals yet
        </p>
      )}

      {/* Divider */}
      <div className="border-t border-white/8" />

      {/* Mini calendar */}
      <div>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={prevCal}
            className="text-white/40 hover:text-white/80 transition-colors cursor-pointer w-5 h-5 flex items-center justify-center text-sm"
          >
            ‹
          </button>
          <span className="text-[10px] text-white/55 tracking-wide">
            {CAL_MONTHS[calMonth]} {calYear}
          </span>
          <button
            onClick={nextCal}
            className="text-white/40 hover:text-white/80 transition-colors cursor-pointer w-5 h-5 flex items-center justify-center text-sm"
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} className="text-center text-[8px] text-white/25 py-0.5">{d}</div>
          ))}
        </div>

        {/* Grid */}
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
                    ? "bg-white/22 text-white font-semibold"
                    : "text-white/40"
                }`}
              >
                {day}
                {hasData && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400 opacity-75" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 14-day chart (only if goals exist) */}
      {goals.length > 0 && (
        <>
          <div className="border-t border-white/8" />
          <div>
            <p className="text-[8px] text-white/30 uppercase tracking-widest mb-1.5">
              14-day trend
            </p>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible">
              {/* Grid lines */}
              {[1, 3, 5].map((r) => (
                <line
                  key={r}
                  x1={padL} y1={yScale(r)} x2={W - padR} y2={yScale(r)}
                  stroke="white" strokeWidth="0.4" opacity="0.12"
                />
              ))}
              {/* Day labels every 3 */}
              {last14.map((dateStr, i) => {
                if (i % 4 !== 0) return null;
                const d = new Date(dateStr + "T12:00:00");
                return (
                  <text key={dateStr} x={xScale(i)} y={H} fontSize="7"
                    fill="rgba(255,255,255,0.3)" textAnchor="middle">
                    {DAY_LABELS[d.getDay()]}
                  </text>
                );
              })}
              {/* Goal lines */}
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
