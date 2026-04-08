"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { StoredNote } from "@/hooks/useCalendar";
import {
  formatDateKey,
  getMonthLabel,
  parseDateKey,
  toRangeLabel
} from "@/utils/dateHelpers";

type NotesPanelProps = {
  activeMonth: Date;
  selectionStart?: Date | null;
  selectionEnd?: Date | null;
  notes: StoredNote[];
  overlay?: boolean;
  compact?: boolean;
  onClose?: () => void;
  onAddNote: (
    payload: Pick<
      StoredNote,
      "title" | "content" | "scope" | "monthKey" | "dateKey" | "rangeStart" | "rangeEnd"
    >
  ) => void;
  onUpdateNote: (id: string, updates: Pick<StoredNote, "title" | "content">) => void;
  onDeleteNote: (id: string) => void;
};

type NoteScope = "month" | "date" | "range";

export default function NotesPanel({
  activeMonth,
  selectionStart,
  selectionEnd,
  notes,
  overlay = false,
  compact = false,
  onClose,
  onAddNote,
  onUpdateNote,
  onDeleteNote
}: NotesPanelProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scope, setScope] = useState<NoteScope>("month");
  const [editingId, setEditingId] = useState<string | null>(null);

  const monthKey = `${activeMonth.getFullYear()}-${`${activeMonth.getMonth() + 1}`.padStart(2, "0")}`;
  const normalizedDate = selectionStart ? formatDateKey(selectionStart) : undefined;
  const normalizedRangeStart = selectionStart ? formatDateKey(selectionStart) : undefined;
  const normalizedRangeEnd = selectionEnd ? formatDateKey(selectionEnd) : normalizedRangeStart;

  useEffect(() => {
    if (scope === "range" && !selectionEnd) {
      setScope(selectionStart ? "date" : "month");
      return;
    }

    if (scope === "date" && !selectionStart) {
      setScope("month");
    }
  }, [scope, selectionEnd, selectionStart]);

  const visibleNotes = useMemo(
    () =>
      notes.filter((note) => {
        if (note.monthKey !== monthKey) return false;
        return true;
      }),
    [monthKey, notes]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      onUpdateNote(editingId, {
        title: title.trim(),
        content: content.trim()
      });
      setEditingId(null);
      setTitle("");
      setContent("");
      return;
    }

    onAddNote({
      title: title.trim(),
      content: content.trim(),
      scope,
      monthKey,
      dateKey: scope === "date" ? normalizedDate : undefined,
      rangeStart: scope === "range" ? normalizedRangeStart : undefined,
      rangeEnd: scope === "range" ? normalizedRangeEnd : undefined
    });

    setTitle("");
    setContent("");
  };

  const scopeDescription =
    scope === "month"
      ? `Pinned to ${getMonthLabel(activeMonth)}`
      : scope === "date"
        ? `Attached to ${selectionStart?.toDateString()}`
        : `Attached to ${toRangeLabel(selectionStart, selectionEnd)}`;

  const canSave =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    (scope === "month" ||
      (scope === "date" && !!selectionStart) ||
      (scope === "range" && !!selectionStart && !!selectionEnd));

  const targetCards: Array<{
    id: NoteScope;
    label: string;
    description: string;
    disabled: boolean;
  }> = [
    {
      id: "month",
      label: "Monthly",
      description: getMonthLabel(activeMonth),
      disabled: false
    },
    {
      id: "date",
      label: "Specific day",
      description: selectionStart ? selectionStart.toDateString() : "Select a date first",
      disabled: !selectionStart
    },
    {
      id: "range",
      label: "Date range",
      description:
        selectionStart && selectionEnd
          ? toRangeLabel(selectionStart, selectionEnd)
          : "Select a start and end date",
      disabled: !selectionStart || !selectionEnd
    }
  ];

  const beginEdit = (note: StoredNote) => {
    setEditingId(note.id);
    setScope(note.scope);
    setTitle(note.title);
    setContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
  };

  return (
    <aside
      className={[
        "flex w-full flex-col overflow-hidden rounded-[2rem] border border-white/30 bg-white/88 shadow-page backdrop-blur-xl dark:border-stone-700/80 dark:bg-stone-950/88",
        overlay ? "max-w-xl" : ""
      ].join(" ")}
    >
      <div
        className={[
          "border-b border-stone-200/80 px-5 py-5 dark:border-stone-800",
          overlay ? "px-4 py-3 sm:px-5" : ""
        ].join(" ")}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-stone-500 dark:text-stone-400">
          Notes
        </p>
        <h2
          className={[
            "break-words font-display font-semibold",
            overlay ? "text-xl sm:text-2xl" : "text-3xl sm:text-[2rem]"
          ].join(" ")}
        >
          Planner Journal
        </h2>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
          Opened for your selected date. Save a note for this day or extend it across the selected range.
        </p>
      </div>

      <div
        className={[
          "flex flex-col gap-5 p-5",
          overlay ? "gap-4 px-4 py-3 sm:px-5" : ""
        ].join(" ")}
      >
        <form
          onSubmit={handleSubmit}
          className={[
            "rounded-[1.7rem] border border-stone-200/80 bg-stone-50/80 shadow-sm dark:border-stone-800 dark:bg-stone-950/70",
            overlay ? "space-y-3 p-3.5" : "space-y-4 p-4"
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                {editingId ? "Editing note" : "New note"}
              </p>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                {editingId
                  ? "Update the text below and save your changes."
                  : "Pick where the note belongs, then write it once."}
              </p>
            </div>
            {editingId ? (
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-stone-400 dark:border-stone-700 dark:text-stone-300"
              >
                Cancel
              </button>
            ) : overlay ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-stone-300 px-3 py-1.5 text-xs font-semibold text-stone-600 transition hover:border-stone-400 dark:border-stone-700 dark:text-stone-300"
              >
                Close
              </button>
            ) : null}
          </div>

          <div className={compact ? "grid grid-cols-1 gap-2 sm:grid-cols-3" : "grid gap-2"}>
            {targetCards.map((card) => (
              <button
                key={card.id}
                type="button"
                disabled={card.disabled || !!editingId}
                onClick={() => setScope(card.id)}
                className={[
                  "flex items-start justify-between rounded-[1.25rem] border text-left transition",
                  compact ? "px-3 py-2.5" : "px-4 py-3",
                  scope === card.id
                    ? "border-paper-300 bg-paper-50 text-stone-950 dark:border-paper-400/40 dark:bg-paper-500/10 dark:text-stone-50"
                    : "border-stone-200 bg-white/85 text-stone-700 dark:border-stone-800 dark:bg-stone-900/80 dark:text-stone-200",
                  card.disabled || editingId
                    ? "cursor-not-allowed opacity-50"
                    : "hover:border-paper-300 hover:shadow-sm"
                ].join(" ")}
              >
                <div>
                  <p className="text-sm font-semibold">{card.label}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-stone-500 dark:text-stone-400">
                    {card.description}
                  </p>
                </div>
                <span className="mt-1 shrink-0 text-xs uppercase tracking-[0.25em] text-stone-400">
                  {scope === card.id ? "Active" : "Use"}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-dashed border-paper-300 bg-paper-50/80 px-4 py-3 text-sm text-stone-700 dark:border-paper-500/30 dark:bg-paper-500/10 dark:text-paper-100">
            {scopeDescription}
          </div>

          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title, like 'Trip prep' or 'Team reminder'"
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none ring-0 transition placeholder:text-stone-400 focus:border-paper-300 dark:border-stone-700 dark:bg-stone-950"
          />
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write the actual note here..."
            rows={compact ? 3 : 5}
            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-paper-300 dark:border-stone-700 dark:bg-stone-950"
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <button
              type="submit"
              disabled={!canSave}
              className="min-w-0 rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-paper-200 dark:text-stone-950 dark:hover:bg-paper-100"
            >
              {editingId ? "Update note" : "Add note"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
              }}
              className="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-semibold text-stone-600 transition hover:border-stone-400 dark:border-stone-700 dark:text-stone-300 sm:px-5"
            >
              Clear
            </button>
          </div>
        </form>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                {compact ? "Saved notes" : "This month"}
              </p>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
                {visibleNotes.length} saved {visibleNotes.length === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>
          {visibleNotes.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-stone-300 p-5 text-sm text-stone-500 dark:border-stone-700 dark:text-stone-400">
              No notes yet for this month. Select a day or range to anchor something meaningful.
            </div>
          ) : (
            visibleNotes
              .slice()
              .reverse()
              .slice(0, compact ? 3 : visibleNotes.length)
              .map((note) => {
                const subtitle =
                  note.scope === "month"
                    ? getMonthLabel(activeMonth)
                    : note.scope === "date" && note.dateKey
                      ? parseDateKey(note.dateKey).toDateString()
                      : toRangeLabel(
                          note.rangeStart ? parseDateKey(note.rangeStart) : null,
                          note.rangeEnd ? parseDateKey(note.rangeEnd) : null
                        );

                return (
                  <article
                    key={note.id}
                    className={[
                      "rounded-[1.5rem] border border-stone-200 bg-stone-50/80 shadow-sm dark:border-stone-800 dark:bg-stone-950/80",
                      compact ? "p-3" : "p-4"
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">
                          {note.scope}
                        </p>
                        <h3 className={compact ? "mt-1 text-sm font-semibold" : "mt-1 text-base font-semibold"}>{note.title}</h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{subtitle}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => beginEdit(note)}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 transition hover:border-paper-300 hover:text-stone-950 dark:border-stone-700 dark:text-stone-300"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteNote(note.id)}
                          className="rounded-full border border-stone-300 px-3 py-1 text-xs font-medium text-stone-600 transition hover:border-rose-300 hover:text-rose-600 dark:border-stone-700 dark:text-stone-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p
                      className={[
                        "mt-3 whitespace-pre-wrap text-stone-700 dark:text-stone-300",
                        compact ? "line-clamp-2 text-xs leading-5" : "text-sm leading-6"
                      ].join(" ")}
                    >
                      {note.content}
                    </p>
                  </article>
                );
              })
          )}
        </div>
      </div>
    </aside>
  );
}
