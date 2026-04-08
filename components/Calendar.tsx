"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import CalendarGrid from "@/components/CalendarGrid";
import Header from "@/components/Header";
import NotesPanel from "@/components/NotesPanel";
import { useCalendar, type StoredNote } from "@/hooks/useCalendar";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { formatDateKey, getMonthLabel, parseDateKey } from "@/utils/dateHelpers";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1200&q=80"
];

const HOLIDAY_MOCK: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-02-14": "Valentine's Day",
  "2026-03-17": "Spring Social",
  "2026-05-10": "Family Day",
  "2026-07-04": "Independence Day",
  "2026-10-31": "Halloween",
  "2026-12-25": "Christmas"
};

export default function Calendar() {
  const {
    activeMonth,
    days,
    selectionStart,
    selectionEnd,
    previewRange,
    setHoveredDate,
    handleDateClick,
    clearSelection,
    goToToday,
    nextMonth,
    previousMonth
  } = useCalendar();
  const { value: notes, setValue: setNotes, hydrated } =
    useLocalStorage<StoredNote[]>("wall-calendar-notes", []);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("wall-calendar-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = stored ? stored === "dark" : prefersDark;
    setIsDarkMode(enabled);
    document.documentElement.classList.toggle("dark", enabled);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    window.localStorage.setItem("wall-calendar-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const monthKey = `${activeMonth.getFullYear()}-${`${activeMonth.getMonth() + 1}`.padStart(2, "0")}`;
  const heroImage = HERO_IMAGES[activeMonth.getMonth()];

  const noteDateKeys = useMemo(() => {
    const keys = new Set<string>();

    notes.forEach((note) => {
      if (note.dateKey) keys.add(note.dateKey);
      if (note.rangeStart && note.rangeEnd) {
        const current = parseDateKey(note.rangeStart);
        const end = parseDateKey(note.rangeEnd);
        while (formatDateKey(current) <= formatDateKey(end)) {
          keys.add(formatDateKey(current));
          current.setDate(current.getDate() + 1);
        }
      }
    });

    return keys;
  }, [notes]);

  const visibleHolidays = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(HOLIDAY_MOCK).filter(([key]) => key.startsWith(monthKey))
      ),
    [monthKey]
  );

  const addNote = (
    payload: Pick<
      StoredNote,
      "title" | "content" | "scope" | "monthKey" | "dateKey" | "rangeStart" | "rangeEnd"
    >
  ) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}`;

    setNotes((current) => [
      ...current,
      {
        ...payload,
        id,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const deleteNote = (id: string) =>
    setNotes((current) => current.filter((note) => note.id !== id));

  const updateNote = (id: string, updates: Pick<StoredNote, "title" | "content">) =>
    setNotes((current) =>
      current.map((note) => (note.id === id ? { ...note, ...updates } : note))
    );

  return (
    <section>
      <div className="overflow-hidden rounded-[2.2rem] border border-stone-200/80 bg-white/70 shadow-card backdrop-blur dark:border-stone-800 dark:bg-stone-900/80">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            key={heroImage}
            initial={{ opacity: 0.4, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="relative min-h-[320px] overflow-hidden border-b border-stone-200/80 lg:min-h-[760px] lg:border-b-0 lg:border-r dark:border-stone-800"
          >
            <Image
              src={heroImage}
              alt={getMonthLabel(activeMonth)}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
            {selectionStart ? (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-x-4 top-4 z-20 flex items-start lg:inset-x-6 lg:top-6"
              >
                <div className="w-full">
                  <NotesPanel
                    activeMonth={activeMonth}
                    selectionStart={selectionStart}
                    selectionEnd={selectionEnd}
                    notes={notes}
                    overlay
                    compact
                    onClose={clearSelection}
                    onAddNote={addNote}
                    onUpdateNote={updateNote}
                    onDeleteNote={deleteNote}
                  />
                </div>
              </motion.div>
            ) : null}
            <div className="absolute inset-x-0 bottom-0 space-y-4 p-6 text-white sm:p-8">
              <div className="inline-flex rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] backdrop-blur">
                Keepsake Edition
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-white/70">
                  {getMonthLabel(activeMonth)}
                </p>
                <h2 className="max-w-md font-display text-5xl font-semibold leading-none sm:text-6xl">
                  Your wall calendar, reimagined for daily planning.
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/80 sm:text-base">
                Select a single day or drag your attention across a date range, then
                capture plans right beside the calendar like handwritten margin notes.
              </p>
            </div>
          </motion.div>

          <div className="bg-paper-50/55 bg-paper-grid bg-[size:24px_24px] dark:bg-stone-950/95">
            <Header
              month={activeMonth}
              isDarkMode={isDarkMode}
              onToggleTheme={() => setIsDarkMode((current) => !current)}
              onPrevious={previousMonth}
              onNext={nextMonth}
              onToday={goToToday}
            />

            <div className="space-y-4 px-5 pt-5">
              <div className="flex flex-col gap-3 rounded-[1.7rem] border border-stone-200/70 bg-white/75 p-4 dark:border-stone-800 dark:bg-stone-900/80 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                    Active Selection
                  </p>
                  <p className="mt-1 text-lg font-semibold text-stone-900 dark:text-stone-50">
                    {selectionStart
                      ? selectionEnd
                        ? `${selectionStart.toLocaleDateString()} - ${selectionEnd.toLocaleDateString()}`
                        : selectionStart.toDateString()
                      : "Choose a date or a range"}
                  </p>
                </div>
                <button
                  onClick={clearSelection}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 transition hover:border-paper-300 hover:text-stone-950 dark:border-stone-700 dark:text-stone-300"
                >
                  Reset
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-stone-200/70 bg-white/75 p-4 dark:border-stone-800 dark:bg-stone-900/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                    Today
                  </p>
                  <p className="mt-2 text-base font-semibold">{new Date().toDateString()}</p>
                </div>
                <div className="rounded-[1.5rem] border border-stone-200/70 bg-white/75 p-4 dark:border-stone-800 dark:bg-stone-900/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                    Notes Saved
                  </p>
                  <p className="mt-2 text-2xl font-semibold">{hydrated ? notes.length : "..."}</p>
                </div>
                <div className="rounded-[1.5rem] border border-stone-200/70 bg-white/75 p-4 dark:border-stone-800 dark:bg-stone-900/80">
                  <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                    Holidays
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {Object.keys(visibleHolidays).length}
                  </p>
                </div>
              </div>
            </div>

            <CalendarGrid
              monthKey={monthKey}
              days={days}
              rangeStart={selectionStart}
              rangeEnd={selectionEnd}
              previewStart={previewRange.start}
              previewEnd={previewRange.end}
              noteDateKeys={noteDateKeys}
              holidays={visibleHolidays}
              onDateClick={handleDateClick}
              onDateHover={setHoveredDate}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
