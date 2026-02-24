"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";
import ThemeToggle from "@/components/ThemeToggle";

const GOAL_COLORS = ["#7A8E7C", "#C4A882", "#8B9DC7", "#C4916A", "#9E8AB4"];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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

interface DotRatingProps {
  rating: number | null;
  onRate: (n: number) => void;
  color: string;
}

function DotRating({ rating, onRate, color }: DotRatingProps) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n}
          whileTap={{ scale: 0.85 }}
          whileHover={{ scale: 1.15 }}
          onClick={() => onRate(n)}
          className="cursor-pointer transition-transform"
          aria-label={`Rate ${n} out of 5`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <circle
              cx="9" cy="9" r="6.5"
              fill={rating !== null && rating >= n ? color : "none"}
              stroke={color}
              strokeWidth="1.8"
            />
          </svg>
        </motion.button>
      ))}
      <span className="ml-1 text-xs text-monk-muted w-8">
        {rating !== null ? `${rating}/5` : "—"}
      </span>
    </div>
  );
}

interface TrendChartProps {
  goals: { id: string; name: string }[];
  last14: string[];
  getRatingsForGoal: (id: string) => { date: string; rating: number }[];
}

function TrendChart({ goals, last14, getRatingsForGoal }: TrendChartProps) {
  const padL = 22, padB = 22, padT = 8, padR = 8;
  const W = 340, H = 120;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xScale = (i: number) => padL + (i / (last14.length - 1)) * chartW;
  const yScale = (v: number) => padT + chartH - ((v - 1) / 4) * chartH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible">
      {/* Grid lines */}
      {[1, 2, 3, 4, 5].map((r) => (
        <g key={r}>
          <line x1={padL} y1={yScale(r)} x2={W - padR} y2={yScale(r)}
            stroke="var(--monk-border)" strokeWidth="0.5" opacity="0.7" />
          <text x={padL - 4} y={yScale(r) + 3.5} fontSize="8"
            fill="var(--monk-muted)" textAnchor="end" opacity="0.7">{r}</text>
        </g>
      ))}

      {/* X-axis labels every other day */}
      {last14.map((dateStr, i) => {
        if (i % 2 !== 0) return null;
        const d = new Date(dateStr + "T12:00:00");
        return (
          <text key={dateStr} x={xScale(i)} y={H - 4} fontSize="8"
            fill="var(--monk-muted)" textAnchor="middle" opacity="0.7">
            {DAY_LABELS[d.getDay()]}
          </text>
        );
      })}

      {/* Goal lines */}
      {goals.slice(0, 5).map((goal, gi) => {
        const color = GOAL_COLORS[gi % GOAL_COLORS.length];
        const ratingMap = new Map(getRatingsForGoal(goal.id).map((r) => [r.date, r.rating]));
        const points: { x: number; y: number }[] = [];
        last14.forEach((date, i) => {
          const r = ratingMap.get(date);
          if (r !== undefined) points.push({ x: xScale(i), y: yScale(r) });
        });
        if (points.length < 1) return null;

        let pathD = `M ${points[0].x} ${points[0].y}`;
        for (let j = 1; j < points.length; j++) {
          const p0 = points[j - 1], p1 = points[j];
          const mx = (p0.x + p1.x) / 2;
          pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
        }

        return (
          <g key={goal.id}>
            {points.length > 1 && (
              <path d={pathD} stroke={color} strokeWidth="1.8" fill="none"
                strokeLinecap="round" opacity="0.85" />
            )}
            {points.map((pt, pi) => (
              <circle key={pi} cx={pt.x} cy={pt.y} r="3" fill={color} opacity="0.9" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function RatePage() {
  const { goals, setRating, getRatingForDate, getRatingsForGoal } = useGoals();
  const today = formatDateKey(new Date());
  const last14 = getLast14Days();

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col bg-monk-bg text-monk-text">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-monk-border bg-monk-surface/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 text-monk-muted hover:text-monk-text transition-colors text-sm cursor-pointer"
            >
              <svg viewBox="0 0 16 16" width="14" height="14">
                <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              monk
            </motion.button>
          </Link>
          <span className="text-monk-border">|</span>
          <h1 className="text-base font-light tracking-widest text-monk-text lowercase">rate today</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-10 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <p className="text-xs text-monk-muted opacity-70 mb-6">{todayFormatted}</p>

          {/* Goal ratings */}
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-monk-muted italic opacity-60 mb-4">
                No goals yet — add some first
              </p>
              <Link href="/goals">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="text-sm text-monk-accent hover:underline cursor-pointer"
                >
                  + Add goals
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3 mb-10">
              {goals.map((goal, gi) => {
                const color = GOAL_COLORS[gi % GOAL_COLORS.length];
                const todayRating = getRatingForDate(goal.id, today);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: gi * 0.06 }}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-monk-border bg-monk-surface"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: color }}
                    />
                    <span className="flex-1 text-sm text-monk-text truncate">{goal.name}</span>
                    <DotRating
                      rating={todayRating}
                      onRate={(r) => setRating(goal.id, today, r)}
                      color={color}
                    />
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* 14-day chart */}
          {goals.length > 0 && (
            <div className="border-t border-monk-border pt-6">
              <p className="text-xs text-monk-muted uppercase tracking-widest mb-4 opacity-70">
                14-day trend
              </p>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
                {goals.slice(0, 5).map((goal, gi) => (
                  <div key={goal.id} className="flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: GOAL_COLORS[gi % GOAL_COLORS.length] }}
                    />
                    <span className="text-xs text-monk-muted">{goal.name}</span>
                  </div>
                ))}
              </div>

              <TrendChart
                goals={goals}
                last14={last14}
                getRatingsForGoal={getRatingsForGoal}
              />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
