# Interactive Wall Calendar

A modern, production-style interactive wall calendar built with Next.js, Tailwind CSS, and Framer Motion. The experience blends a physical wall-calendar aesthetic with practical digital behaviors like date-range selection, note-taking, theme switching, and local persistence.

## Features

- Responsive wall-calendar layout with a monthly hero image and paper-style grid
- Single-date and date-range selection with reverse-range handling and hover preview
- Notes panel supporting add, edit, and delete for month, date, and range notes
- Calendar indicators for today, weekends, holidays, and saved notes
- Previous/next navigation, jump-to-today, and dark mode toggle
- Local persistence for notes and theme using `localStorage`

## Tech Stack

- Next.js 14 App Router
- React 18
- Tailwind CSS
- Framer Motion
- TypeScript

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
components/
  Calendar.tsx
  CalendarGrid.tsx
  DayCell.tsx
  Header.tsx
  NotesPanel.tsx
hooks/
  useCalendar.ts
  useLocalStorage.ts
utils/
  dateHelpers.ts
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Design Decisions

- The split layout mirrors a real wall calendar: a visual hero plate paired with a structured monthly sheet.
- The calendar uses a 6-row grid for stable layout across months.
- Notes are intentionally local-first and backend-free to keep the component portable.
- Motion is used sparingly for polish: month transitions, subtle hero refresh, and button feedback.

## Demo Deliverables

- Repository content is included here.
- A video demo was not generated in this environment.
- A live deployment was not created in this environment.
