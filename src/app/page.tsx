"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HabitLogger from "@/components/HabitLogger";
import MonkAvatar from "@/components/MonkAvatar";
import GoalCalendar from "@/components/GoalCalendar";
import QuoteOfDay from "@/components/QuoteOfDay";
import OshoPanel from "@/components/OshoPanel";

export default function Home() {
  const [oshoOpen, setOshoOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-monk-bg text-monk-text">
      <Header onOshoOpen={() => setOshoOpen(true)} />

      {/* Main 3-column layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        {/* Left — Habit Logger */}
        <section className="p-6 border-b md:border-b-0 md:border-r border-monk-border overflow-y-auto">
          <HabitLogger />
        </section>

        {/* Centre — Monk Avatar */}
        <section className="p-6 flex items-center justify-center border-b md:border-b-0 md:border-r border-monk-border bg-monk-surface/30 min-h-[320px]">
          <MonkAvatar />
        </section>

        {/* Right — Goal Calendar */}
        <section className="p-6 overflow-y-auto">
          <GoalCalendar />
        </section>
      </main>

      {/* Footer quote */}
      <QuoteOfDay />

      {/* Osho slide-in drawer */}
      <OshoPanel isOpen={oshoOpen} onClose={() => setOshoOpen(false)} />
    </div>
  );
}
