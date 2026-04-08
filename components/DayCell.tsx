"use client";

import { motion } from "framer-motion";
import {
  formatDateKey,
  isToday,
  isWeekend,
  sameDay
} from "@/utils/dateHelpers";

type DayCellProps = {
  date: Date;
  currentMonth: boolean;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  previewStart?: Date | null;
  previewEnd?: Date | null;
  hasNotes: boolean;
  holidayLabel?: string;
  onClick: (date: Date) => void;
  onHover: (date: Date | null) => void;
};

const inRange = (date: Date, start?: Date | null, end?: Date | null) => {
  if (!start || !end) return false;
  const value = formatDateKey(date);
  return value >= formatDateKey(start) && value <= formatDateKey(end);
};

export default function DayCell({
  date,
  currentMonth,
  rangeStart,
  rangeEnd,
  previewStart,
  previewEnd,
  hasNotes,
  holidayLabel,
  onClick,
  onHover
}: DayCellProps) {
  const selectedStart = sameDay(date, rangeStart);
  const selectedEnd = sameDay(date, rangeEnd);
  const selectedSingle =
    selectedStart && selectedEnd && sameDay(rangeStart, rangeEnd);
  const isPreviewRange =
    !selectedStart &&
    !selectedEnd &&
    inRange(date, previewStart, previewEnd) &&
    !inRange(date, rangeStart, rangeEnd);
  const selectedRange =
    !selectedSingle &&
    !selectedStart &&
    !selectedEnd &&
    inRange(date, rangeStart, rangeEnd);
  const today = isToday(date);
  const weekend = isWeekend(date);

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(date)}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
      className={[
        "group relative flex aspect-square flex-col rounded-[1.6rem] border p-3 text-left transition duration-200",
        currentMonth
          ? "border-stone-200/90 bg-white/80 dark:border-stone-800 dark:bg-stone-900/90"
          : "border-transparent bg-stone-200/30 text-stone-400 dark:bg-stone-900/40 dark:text-stone-600",
        weekend && currentMonth
          ? "shadow-[inset_0_0_0_1px_rgba(212,181,125,0.18)]"
          : "",
        selectedStart || selectedEnd
          ? "border-paper-400 bg-paper-300/90 text-stone-950 shadow-card dark:border-paper-300 dark:bg-paper-200"
          : "",
        selectedRange
          ? "border-paper-200 bg-paper-100/90 text-stone-900 dark:bg-paper-500/20 dark:text-stone-100"
          : "",
        isPreviewRange
          ? "border-dashed border-paper-300 bg-paper-50 dark:bg-paper-500/10"
          : "",
        today && !(selectedStart || selectedEnd)
          ? "ring-2 ring-stone-900/70 dark:ring-paper-200/70"
          : "",
        "hover:-translate-y-0.5 hover:border-paper-300 hover:shadow-page"
      ].join(" ")}
      aria-label={`${date.toDateString()}${holidayLabel ? ` ${holidayLabel}` : ""}`}
    >
      <div className="flex items-start justify-between gap-1.5">
        {today ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-1 backdrop-blur-sm dark:bg-stone-900/70">
            <span className="h-1.5 w-1.5 rounded-full bg-paper-400 dark:bg-paper-200" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-600 dark:text-stone-300">
              Today
            </span>
          </div>
        ) : (
          <span />
        )}
        {holidayLabel ? (
          <span className="line-clamp-1 text-right text-[9px] font-semibold uppercase tracking-[0.16em] text-rose-600 dark:text-rose-300">
            Holiday
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <span
            className={[
              "font-display text-4xl leading-none sm:text-[2.65rem]",
              currentMonth
                ? "text-ink-900 dark:text-stone-100"
                : "text-stone-400 dark:text-stone-600",
              today && !(selectedStart || selectedEnd)
                ? "drop-shadow-[0_2px_10px_rgba(198,157,88,0.2)]"
                : ""
            ].join(" ")}
          >
            {date.getDate()}
          </span>
          {weekend && currentMonth ? (
            <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
              Weekend
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-0.5 text-center">
        {hasNotes ? (
          <div className="flex items-center justify-center gap-1">
            <span className="h-2 w-2 rounded-full bg-stone-900 dark:bg-paper-200" />
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              Note saved
            </span>
          </div>
        ) : null}
      </div>
    </motion.button>
  );
}
