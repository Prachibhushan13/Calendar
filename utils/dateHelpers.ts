export type CalendarDay = {
  date: Date;
  currentMonth: boolean;
};

export const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const sameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && formatDateKey(a) === formatDateKey(b);

export const isToday = (date: Date) => sameDay(date, new Date());

export const isWeekend = (date: Date) => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

export const compareDates = (a: Date, b: Date) =>
  new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime() -
  new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();

export const getRangeBounds = (start?: Date | null, end?: Date | null) => {
  if (!start && !end) {
    return { start: null, end: null };
  }

  if (start && end) {
    return compareDates(start, end) <= 0
      ? { start, end }
      : { start: end, end: start };
  }

  return { start: start ?? end ?? null, end: end ?? start ?? null };
};

export const isBetween = (date: Date, start?: Date | null, end?: Date | null) => {
  if (!start || !end) return false;
  const time = compareDates(date, start);
  const endTime = compareDates(date, end);
  return time > 0 && endTime < 0;
};

export const getMonthLabel = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(date);

export const getDaysForMonthGrid = (activeMonth: Date): CalendarDay[] => {
  const year = activeMonth.getFullYear();
  const month = activeMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstVisibleDay = new Date(firstDay);
  firstVisibleDay.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstVisibleDay);
    date.setDate(firstVisibleDay.getDate() + index);
    return {
      date,
      currentMonth: date.getMonth() === month
    };
  });
};

export const shiftMonth = (date: Date, amount: number) =>
  new Date(date.getFullYear(), date.getMonth() + amount, 1);

export const toRangeLabel = (start?: Date | null, end?: Date | null) => {
  if (!start && !end) return "No range selected";
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  });
  const safeStart = start ?? end;
  const safeEnd = end ?? start;

  if (!safeStart || !safeEnd) return "No range selected";
  if (sameDay(safeStart, safeEnd)) return formatter.format(safeStart);
  return `${formatter.format(safeStart)} - ${formatter.format(safeEnd)}`;
};
