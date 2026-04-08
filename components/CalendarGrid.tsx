"use client";

import { AnimatePresence, motion } from "framer-motion";
import DayCell from "@/components/DayCell";
import { DAY_LABELS, formatDateKey } from "@/utils/dateHelpers";
import type { CalendarDay } from "@/utils/dateHelpers";

type CalendarGridProps = {
  monthKey: string;
  days: CalendarDay[];
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  previewStart?: Date | null;
  previewEnd?: Date | null;
  noteDateKeys: Set<string>;
  holidays: Record<string, string>;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
};

export default function CalendarGrid({
  monthKey,
  days,
  rangeStart,
  rangeEnd,
  previewStart,
  previewEnd,
  noteDateKeys,
  holidays,
  onDateClick,
  onDateHover
}: CalendarGridProps) {
  return (
    <div className="overflow-hidden px-3 pb-4 sm:px-5">
      <div className="grid grid-cols-7 gap-2 px-2 py-3">
        {DAY_LABELS.map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-semibold uppercase tracking-[0.28em] text-stone-500 dark:text-stone-400"
          >
            {day}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ rotateX: -10, opacity: 0, y: 12 }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 8, opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="grid grid-cols-7 gap-2 [transform-style:preserve-3d]"
        >
          {days.map(({ date, currentMonth }) => {
            const dateKey = formatDateKey(date);

            return (
              <DayCell
                key={dateKey}
                date={date}
                currentMonth={currentMonth}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                previewStart={previewStart}
                previewEnd={previewEnd}
                hasNotes={noteDateKeys.has(dateKey)}
                holidayLabel={holidays[dateKey]}
                onClick={onDateClick}
                onHover={onDateHover}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
