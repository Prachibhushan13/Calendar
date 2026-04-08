"use client";

import { useMemo, useState } from "react";
import {
  CalendarDay,
  formatDateKey,
  getDaysForMonthGrid,
  getRangeBounds,
  shiftMonth
} from "@/utils/dateHelpers";

export type StoredNote = {
  id: string;
  title: string;
  content: string;
  scope: "month" | "date" | "range";
  monthKey: string;
  dateKey?: string;
  rangeStart?: string;
  rangeEnd?: string;
  createdAt: string;
};

export function useCalendar() {
  const [activeMonth, setActiveMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectionStart, setSelectionStart] = useState<Date | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<Date | null>(null);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const days = useMemo<CalendarDay[]>(
    () => getDaysForMonthGrid(activeMonth),
    [activeMonth]
  );

  const normalizedRange = useMemo(
    () => getRangeBounds(selectionStart, selectionEnd),
    [selectionStart, selectionEnd]
  );

  const previewRange = useMemo(() => {
    if (!selectionStart || selectionEnd || !hoveredDate) return normalizedRange;
    return getRangeBounds(selectionStart, hoveredDate);
  }, [hoveredDate, normalizedRange, selectionEnd, selectionStart]);

  const handleDateClick = (date: Date) => {
    if (!selectionStart || (selectionStart && selectionEnd)) {
      setSelectionStart(date);
      setSelectionEnd(null);
      return;
    }

    if (formatDateKey(selectionStart) === formatDateKey(date)) {
      setSelectionEnd(date);
      return;
    }

    const { start, end } = getRangeBounds(selectionStart, date);
    setSelectionStart(start);
    setSelectionEnd(end);
  };

  return {
    activeMonth,
    days,
    selectionStart,
    selectionEnd,
    previewRange,
    setHoveredDate,
    handleDateClick,
    clearSelection: () => {
      setSelectionStart(null);
      setSelectionEnd(null);
      setHoveredDate(null);
    },
    goToToday: () => {
      const today = new Date();
      setActiveMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    },
    nextMonth: () => setActiveMonth((current) => shiftMonth(current, 1)),
    previousMonth: () => setActiveMonth((current) => shiftMonth(current, -1))
  };
}
