"use client";

import { motion } from "framer-motion";
import { getMonthLabel } from "@/utils/dateHelpers";

type HeaderProps = {
  month: Date;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function Header({
  month,
  isDarkMode,
  onToggleTheme,
  onPrevious,
  onNext,
  onToday
}: HeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200/80 px-5 py-5 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500 dark:text-stone-400">
          Wall Planner
        </p>
        <motion.h1
          key={getMonthLabel(month)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-4xl font-semibold text-stone-900 dark:text-stone-100"
        >
          {getMonthLabel(month)}
        </motion.h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={onToday}
          className="rounded-full border border-stone-300 bg-white/80 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-paper-300 hover:text-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        >
          Today
        </button>
        <button
          onClick={onPrevious}
          aria-label="Previous month"
          className="rounded-full border border-stone-300 bg-white/80 px-3 py-2 text-stone-700 transition hover:border-paper-300 hover:text-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        >
          ←
        </button>
        <button
          onClick={onNext}
          aria-label="Next month"
          className="rounded-full border border-stone-300 bg-white/80 px-3 py-2 text-stone-700 transition hover:border-paper-300 hover:text-stone-950 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        >
          →
        </button>
        <button
          onClick={onToggleTheme}
          className="rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-stone-50 transition hover:bg-stone-700 dark:bg-paper-200 dark:text-stone-950 dark:hover:bg-paper-100"
        >
          {isDarkMode ? "Light" : "Dark"}
        </button>
      </div>
    </div>
  );
}
