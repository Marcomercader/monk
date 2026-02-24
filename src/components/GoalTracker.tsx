"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGoals } from "@/hooks/useGoals";

const GOAL_COLORS = ["#7A8E7C", "#C4A882", "#8B9DC7", "#C4916A", "#9E8AB4"];

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

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface StarRatingProps {
  goalId: string;
  date: string;
  rating: number | null;
  onRate: (rating: number) => void;
  color: string;
}

function StarRating({ rating, onRate, color }: StarRatingProps) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={() => onRate(n)}
          className="transition-transform hover:scale-110 cursor-pointer"
          aria-label={`Rate ${n}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14">
            <circle
              cx="7"
              cy="7"
              r="5"
              fill={rating !== null && rating >= n ? color : "none"}
              stroke={color}
              strokeWidth="1.5"
            />
          </svg>
        </button>
      ))}
    </div>
  );
}

interface ChartProps {
  goals: { id: string; name: string }[];
  last14: string[];
  getRatingsForGoal: (id: string) => { date: string; rating: number }[];
}

function TrendChart({ goals, last14, getRatingsForGoal }: ChartProps) {
  const padL = 22;
  const padB = 22;
  const padT = 8;
  const padR = 8;
  const W = 260;
  const H = 110;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;

  const xScale = (i: number) => padL + (i / (last14.length - 1)) * chartW;
  const yScale = (v: number) => padT + chartH - ((v - 1) / 4) * chartH;

  const gridRatings = [1, 2, 3, 4, 5];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible">
      {/* Grid lines */}
      {gridRatings.map((r) => (
        <g key={r}>
          <line
            x1={padL}
            y1={yScale(r)}
            x2={W - padR}
            y2={yScale(r)}
            stroke="var(--monk-border)"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <text
            x={padL - 4}
            y={yScale(r) + 3.5}
            fontSize="7"
            fill="var(--monk-muted)"
            textAnchor="end"
            opacity="0.7"
          >
            {r}
          </text>
        </g>
      ))}

      {/* X-axis day labels every other day */}
      {last14.map((dateStr, i) => {
        if (i % 2 !== 0) return null;
        const d = new Date(dateStr + "T12:00:00");
        return (
          <text
            key={dateStr}
            x={xScale(i)}
            y={H - 4}
            fontSize="7"
            fill="var(--monk-muted)"
            textAnchor="middle"
            opacity="0.7"
          >
            {DAY_LABELS[d.getDay()]}
          </text>
        );
      })}

      {/* Goal lines */}
      {goals.slice(0, 5).map((goal, gi) => {
        const color = GOAL_COLORS[gi % GOAL_COLORS.length];
        const goalRatings = getRatingsForGoal(goal.id);
        const ratingMap = new Map(goalRatings.map((r) => [r.date, r.rating]));

        const points: { x: number; y: number }[] = [];
        last14.forEach((date, i) => {
          const r = ratingMap.get(date);
          if (r !== undefined) {
            points.push({ x: xScale(i), y: yScale(r) });
          }
        });

        if (points.length < 1) return null;

        let pathD = "";
        if (points.length === 1) {
          pathD = `M ${points[0].x} ${points[0].y}`;
        } else {
          pathD = `M ${points[0].x} ${points[0].y}`;
          for (let j = 1; j < points.length; j++) {
            const p0 = points[j - 1];
            const p1 = points[j];
            const mx = (p0.x + p1.x) / 2;
            pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
          }
        }

        return (
          <g key={goal.id}>
            {points.length > 1 && (
              <path
                d={pathD}
                stroke={color}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
              />
            )}
            {points.map((pt, pi) => (
              <circle key={pi} cx={pt.x} cy={pt.y} r="2.5" fill={color} opacity="0.9" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

export default function GoalTracker() {
  const { goals, addGoal, removeGoal, setRating, getRatingForDate, getRatingsForGoal } =
    useGoals();
  const [newGoalName, setNewGoalName] = useState("");
  const today = formatDateKey(new Date());
  const last14 = getLast14Days();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalName.trim()) {
      addGoal(newGoalName);
      setNewGoalName("");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col h-full gap-4"
    >
      {/* Header */}
      <div>
        <h2 className="text-xs font-semibold tracking-widest uppercase text-monk-muted mb-1">
          Goals
        </h2>
      </div>

      {/* Add goal */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          placeholder="Add a goal…"
          maxLength={60}
          className="flex-1 bg-monk-surface text-monk-text placeholder-monk-muted text-xs px-3 py-2 rounded-lg border border-monk-border focus:outline-none focus:border-monk-accent transition-colors"
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="submit"
          disabled={!newGoalName.trim()}
          className="px-3 py-2 bg-monk-accent text-white rounded-lg text-xs disabled:opacity-40 transition-opacity cursor-pointer"
        >
          +
        </motion.button>
      </form>

      {/* Goal list with today's ratings */}
      <div className="space-y-2">
        {goals.length === 0 && (
          <p className="text-xs text-monk-muted italic opacity-60 py-2">
            No goals yet — add one above
          </p>
        )}
        {goals.slice(0, 5).map((goal, gi) => {
          const color = GOAL_COLORS[gi % GOAL_COLORS.length];
          const todayRating = getRatingForDate(goal.id, today);
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="group flex items-center gap-2"
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: color }}
              />
              <span className="flex-1 text-xs text-monk-text truncate">{goal.name}</span>
              <StarRating
                goalId={goal.id}
                date={today}
                rating={todayRating}
                onRate={(r) => setRating(goal.id, today, r)}
                color={color}
              />
              <span className="text-xs text-monk-muted w-6 text-right">
                {todayRating !== null ? `${todayRating}/5` : "—"}
              </span>
              <button
                onClick={() => removeGoal(goal.id)}
                className="opacity-0 group-hover:opacity-100 text-monk-muted hover:text-red-400 text-base leading-none transition-all cursor-pointer ml-1"
                aria-label="Remove goal"
              >
                ×
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Divider + chart */}
      <div className="border-t border-monk-border pt-3">
        <p className="text-xs text-monk-muted uppercase tracking-widest mb-2 opacity-70">
          14-day trend
        </p>
        <TrendChart
          goals={goals}
          last14={last14}
          getRatingsForGoal={getRatingsForGoal}
        />
      </div>
    </motion.div>
  );
}
