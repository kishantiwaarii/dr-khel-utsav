
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import "./fixtures.css";

type Status = "Live" | "Upcoming" | "Completed";
type View = "schedule" | "courts";

type Match = {
  id: string;
  date: string;
  time: string;
  court: string;
  category: string;
  round: string;
  status: Status;
  a: string;
  b: string;
  scoreA?: number;
  scoreB?: number;
  winner?: string;
};

const initialMatches: Match[] = [
  {
    id: "DKU-101", date: "2026-10-22", time: "09:00",
    court: "Court 01", category: "Men's Singles", round: "Semi Final",
    status: "Live", a: "Aarav Patel", b: "Rohan Shah", scoreA: 18, scoreB: 15,
  },
  {
    id: "DKU-102", date: "2026-10-22", time: "09:30",
    court: "Court 02", category: "Women's Singles", round: "Quarter Final",
    status: "Upcoming", a: "Diya Mehta", b: "Anaya Desai",
  },
  {
    id: "DKU-103", date: "2026-10-22", time: "10:00",
    court: "Court 01", category: "Men's Doubles", round: "Quarter Final",
    status: "Upcoming", a: "Dev & Krish", b: "Jay & Neel",
  },
  {
    id: "DKU-104", date: "2026-10-22", time: "10:30",
    court: "Court 03", category: "Mixed Doubles", round: "Quarter Final",
    status: "Upcoming", a: "Team Falcons", b: "Team Aces",
  },
  {
    id: "DKU-105", date: "2026-10-22", time: "11:00",
    court: "Court 02", category: "Women's Doubles", round: "Semi Final",
    status: "Upcoming", a: "Team Phoenix", b: "Team Stars",
  },
  {
    id: "DKU-106", date: "2026-10-23", time: "09:00",
    court: "Court 01", category: "Men's Singles", round: "Quarter Final",
    status: "Upcoming", a: "Krish Patel", b: "Dev Joshi",
  },
  {
    id: "DKU-107", date: "2026-10-23", time: "10:00",
    court: "Court 02", category: "Women's Singles", round: "Semi Final",
    status: "Upcoming", a: "Ira Shah", b: "Mira Patel",
  },
  {
    id: "DKU-108", date: "2026-10-21", time: "12:00",
    court: "Court 01", category: "Mixed Doubles", round: "Final",
    status: "Completed", a: "Team Thunder", b: "Team Aces",
    scoreA: 21, scoreB: 18, winner: "Team Thunder",
  },
  {
    id: "DKU-109", date: "2026-10-21", time: "13:00",
    court: "Court 03", category: "Women's Doubles", round: "Semi Final",
    status: "Completed", a: "Team Phoenix", b: "Team Stars",
    scoreA: 17, scoreB: 21, winner: "Team Stars",
  },
];

const ALL = "All";
const categories = [
  "Men's Singles",
  "Women's Singles",
  "Men's Doubles",
  "Women's Doubles",
  "Mixed Doubles",
];
const statuses: Status[] = ["Live", "Upcoming", "Completed"];
const rounds = ["Quarter Final", "Semi Final", "Final"];
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function prettyDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  },
) {
  if (!value) return "";
  return parseDate(value).toLocaleDateString("en-IN", options);
}

type IconName =
  | "search" | "calendar" | "clock" | "grid" | "list"
  | "filter" | "close" | "trophy" | "court" | "chevron"
  | "left" | "right" | "check" | "pin" | "arrow" | "refresh";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const shapes: Record<IconName, ReactNode> = {
    search: <><circle cx="10.8" cy="10.8" r="6.6" /><path d="m16 16 4 4" /></>,
    calendar: <><rect x="3.5" y="5.5" width="17" height="15" rx="2.5" /><path d="M7.5 3.5v4m9-4v4M3.5 10h17" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    list: <><path d="M9 6h12M9 12h12M9 18h12" /><circle cx="4" cy="6" r=".7" /><circle cx="4" cy="12" r=".7" /><circle cx="4" cy="18" r=".7" /></>,
    filter: <path d="M4 6h16M7 12h10m-7 6h4" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    trophy: <><path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v2a4 4 0 0 0 4 4m9-6h3v2a4 4 0 0 1-4 4" /></>,
    court: <><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M12 3v18M3 12h18" /></>,
    chevron: <path d="m7 10 5 5 5-5" />,
    left: <path d="m15 18-6-6 6-6" />,
    right: <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    refresh: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M5.5 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.5-3" /></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {shapes[name]}
    </svg>
  );
}

function CalendarPicker({
  value,
  matches,
  onChange,
  onClose,
}: {
  value: string;
  matches: Match[];
  onChange: (value: string) => void;
  onClose: () => void;
}) {
  const selectedDate = value ? parseDate(value) : null;
  const todayKey = toDateKey(new Date());
  const [month, setMonth] = useState(() => {
    const initial = selectedDate ?? new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const matchDates = useMemo(
    () => new Set(matches.map((match) => match.date)),
    [matches],
  );
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previous?.focus?.();
    };
  }, [onClose]);

  function selectDate(next: string) {
    onChange(next);
    onClose();
  }

  return (
    <div
      className="fx2-calendar-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="fx2-calendar-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fx2-calendar-title"
        tabIndex={-1}
      >
        <div className="fx2-calendar-topline">
          <div>
            <span className="fx2-calendar-eyebrow">MATCH SCHEDULE</span>
            <h3 id="fx2-calendar-title">Choose a date</h3>
            <p>Select a day to see its fixtures.</p>
          </div>
          <button
            className="fx2-icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close calendar"
          >
            <Icon name="close" />
          </button>
        </div>

        <div className="fx2-calendar-month">
          <div>
            <strong>{months[monthIndex]}</strong>
            <span>{year}</span>
          </div>
          <div className="fx2-calendar-navigation">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}
            >
              <Icon name="left" size={17} />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}
            >
              <Icon name="right" size={17} />
            </button>
          </div>
        </div>

        <div className="fx2-calendar-weekdays" aria-hidden="true">
          {weekdays.map((day) => <span key={day}>{day}</span>)}
        </div>

        <div className="fx2-calendar-days">
          {cells.map((day, index) => {
            if (day === null) {
              return <span className="fx2-calendar-blank" key={`blank-${index}`} />;
            }

            const key = toDateKey(new Date(year, monthIndex, day));
            const isSelected = value === key;
            const isToday = todayKey === key;
            const hasMatches = matchDates.has(key);

            return (
              <button
                key={key}
                type="button"
                className={[
                  "fx2-calendar-day",
                  isSelected ? "is-selected" : "",
                  isToday ? "is-today" : "",
                  hasMatches ? "has-matches" : "",
                ].filter(Boolean).join(" ")}
                onClick={() => selectDate(key)}
                aria-pressed={isSelected}
                aria-label={`${day} ${months[monthIndex]} ${year}${hasMatches ? ", matches scheduled" : ""}${isToday ? ", today" : ""}`}
              >
                <span>{day}</span>
                {hasMatches && <i aria-hidden="true" />}
              </button>
            );
          })}
        </div>

        <div className="fx2-calendar-legend">
          <span><i className="fx2-legend-match" /> Fixtures scheduled</span>
          <span><i className="fx2-legend-today" /> Today</span>
        </div>

        <div className="fx2-calendar-actions">
          <button type="button" className="fx2-calendar-clear" onClick={() => selectDate("")}>
            Clear date
          </button>
          <button type="button" className="fx2-calendar-today" onClick={() => selectDate(todayKey)}>
            Go to today <Icon name="arrow" size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`fx2-status fx2-status-${status.toLowerCase()}`}>
      {status === "Live" && <i aria-hidden="true" />}
      {status}
    </span>
  );
}

function MatchCard({
  match,
  onDetails,
}: {
  match: Match;
  onDetails: (match: Match) => void;
}) {
  const players = [
    { name: match.a, score: match.scoreA },
    { name: match.b, score: match.scoreB },
  ];

  return (
    <article className={`fx2-match fx2-match-${match.status.toLowerCase()}`}>
      <div className="fx2-match-top">
        <span className="fx2-match-id">{match.id}</span>
        <StatusBadge status={match.status} />
      </div>

      <div className="fx2-match-contest">
        <div className="fx2-match-players">
          {players.map((player) => (
            <div className="fx2-player" key={player.name}>
              <span className="fx2-avatar" aria-hidden="true">
                {player.name.trim().charAt(0).toUpperCase()}
              </span>
              <span className={`fx2-player-name ${match.winner === player.name ? "fx2-winner" : ""}`}>
                {player.name}
                {match.winner === player.name && <small>WINNER</small>}
              </span>
              <strong className="fx2-score">{player.score ?? "–"}</strong>
            </div>
          ))}
        </div>
        <div className="fx2-match-category">
          <span>{match.category}</span>
          <span>{match.round}</span>
        </div>
      </div>

      <div className="fx2-match-bottom">
        <span><Icon name="clock" size={15} /> {match.time}</span>
        <span><Icon name="court" size={15} /> {match.court}</span>
        <button type="button" onClick={() => onDetails(match)}>
          Details <Icon name="arrow" size={14} />
        </button>
      </div>
    </article>
  );
}

export default function FixturesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);
  const [status, setStatus] = useState(ALL);
  const [round, setRound] = useState(ALL);
  const [court, setCourt] = useState(ALL);
  const [date, setDate] = useState("");
  const [view, setView] = useState<View>("schedule");
  const [details, setDetails] = useState<Match | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLElement>(null);

  const courts = useMemo(
    () => [...new Set(initialMatches.map((match) => match.court))].sort(),
    [],
  );
  const roundOptions = useMemo(
    () => [...new Set(initialMatches.map((match) => match.round))].sort(
      (a, b) => rounds.indexOf(a) - rounds.indexOf(b),
    ),
    [],
  );

  const liveMatches = initialMatches.filter((match) => match.status === "Live");
  const liveCount = liveMatches.length;
  const completedCount = initialMatches.filter((match) => match.status === "Completed").length;
  const upcomingCount = initialMatches.filter((match) => match.status === "Upcoming").length;

  const hasFilters = Boolean(query.trim() || date) ||
    [category, status, round, court].some((value) => value !== ALL);

  const activeFilterCount = [
    query.trim(),
    date,
    category !== ALL ? category : "",
    status !== ALL ? status : "",
    round !== ALL ? round : "",
    court !== ALL ? court : "",
  ].filter(Boolean).length;

  useEffect(() => {
    if (!mobileSearchOpen) return;
    const timer = window.setTimeout(() => searchRef.current?.focus(), 50);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileSearchOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (!details) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDetails(null);
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, [details]);

  const filtered = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();

    return initialMatches.filter((match) => {
      const haystack = [
        match.id, match.a, match.b, match.category, match.court,
        match.round, match.status, match.time, match.winner ?? "",
      ].join(" ").toLocaleLowerCase();

      return (!search || haystack.includes(search)) &&
        (category === ALL || match.category === category) &&
        (status === ALL || match.status === status) &&
        (round === ALL || match.round === round) &&
        (court === ALL || match.court === court) &&
        (!date || match.date === date);
    }).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [query, category, status, round, court, date]);

  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    filtered.forEach((match) => {
      map.set(match.date, [...(map.get(match.date) ?? []), match]);
    });
    return [...map.entries()];
  }, [filtered]);

  function resetFilters() {
    setQuery("");
    setCategory(ALL);
    setStatus(ALL);
    setRound(ALL);
    setCourt(ALL);
    setDate("");
    setCalendarOpen(false);
  }

  function openSearch() {
    setMobileSearchOpen(true);
  }

  return (
    <main className="fx2-page">
      <div className="fx2-container">
        <nav className="fx2-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Fixtures</span>
        </nav>

        <section className="fx2-hero">
          <div className="fx2-hero-copy">
            <div className="fx2-eyebrow"><span /> DR KHEL UTSAV <b>·</b> OFFICIAL FIXTURES</div>
            <h1>THE GAME.<br /><em>THE GLORY.</em></h1>
            <p>Every match matters. Follow the schedule, track live action and find your court in one place.</p>
            <div className="fx2-hero-details">
              <span><Icon name="calendar" size={16} /> 21–23 October 2026</span>
              <span><Icon name="pin" size={16} /> GMERS Valsad</span>
            </div>
          </div>

          <div className="fx2-scoreboard">
            <div className="fx2-scoreboard-head">
              <span>TOURNAMENT OVERVIEW</span>
              <span className="fx2-live-pill"><i /> LIVE TRACKING</span>
            </div>
            <div className="fx2-total-row">
              <div><strong>{String(initialMatches.length).padStart(2, "0")}</strong><span>Total fixtures</span></div>
              <div className="fx2-trophy-mark"><Icon name="trophy" size={32} /></div>
            </div>
            <div className="fx2-stat-grid">
              <div><span className="fx2-stat-indicator is-live" /><strong>{liveCount}</strong><span>Live now</span></div>
              <div><span className="fx2-stat-indicator is-upcoming" /><strong>{upcomingCount}</strong><span>Upcoming</span></div>
              <div><span className="fx2-stat-indicator is-complete" /><strong>{completedCount}</strong><span>Completed</span></div>
            </div>
          </div>
          <div className="fx2-hero-watermark" aria-hidden="true">DKU</div>
        </section>

        <section className="fx2-live-section" aria-label="Live match updates">
          <div className="fx2-live-heading">
            <span className="fx2-live-pulse" />
            <div><strong>LIVE NOW</strong><span>ON COURT</span></div>
          </div>
          {liveMatches.length ? liveMatches.map((match) => (
            <div className="fx2-live-match" key={match.id}>
              <div className="fx2-live-match-meta">
                <span>{match.category}</span>
                <small>{match.id} · {match.round}</small>
              </div>
              <div className="fx2-live-teams">
                <span>{match.a}</span>
                <strong>{match.scoreA ?? "–"} <i>:</i> {match.scoreB ?? "–"}</strong>
                <span>{match.b}</span>
              </div>
              <span className="fx2-live-court">{match.court}</span>
            </div>
          )) : <p className="fx2-no-live">No matches are live right now.</p>}
        </section>

        <section className="fx2-explorer">
          <div className="fx2-section-heading">
            <div>
              <span className="fx2-section-label">THE MATCH CENTRE</span>
              <h2>Fixtures <span>&amp; schedule</span></h2>
              <p>Find a player, check a court or explore the tournament by date.</p>
            </div>
            <div className="fx2-view-switch" aria-label="Fixture view">
              <button type="button" className={view === "schedule" ? "active" : ""} onClick={() => setView("schedule")} aria-pressed={view === "schedule"}>
                <Icon name="list" size={16} /> Schedule
              </button>
              <button type="button" className={view === "courts" ? "active" : ""} onClick={() => setView("courts")} aria-pressed={view === "courts"}>
                <Icon name="grid" size={16} /> Courts
              </button>
            </div>
          </div>

          <div className="fx2-search-toolbar">
            <label className="fx2-desktop-search">
              <Icon name="search" size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search players, teams, match ID or court"
                aria-label="Search fixtures"
              />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close" size={16} /></button>}
              <span className="fx2-search-shortcut">SEARCH</span>
            </label>

            <button className="fx2-mobile-search-trigger" type="button" onClick={openSearch}>
              <Icon name="search" size={19} />
              <span>{query || "Search matches, players..."}</span>
              {query && <span className="fx2-search-has-query">Active</span>}
            </button>

            <button
              type="button"
              className={`fx2-filter-trigger ${filtersOpen || hasFilters ? "is-active" : ""}`}
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="fx2-advanced-filters"
            >
              <Icon name="filter" size={18} />
              <span>Filters</span>
              {activeFilterCount > 0 && <b>{activeFilterCount}</b>}
              <Icon name="chevron" size={16} />
            </button>
          </div>

          {mobileSearchOpen && (
            <div className="fx2-mobile-search-panel" role="dialog" aria-modal="true" aria-label="Search fixtures">
              <div className="fx2-mobile-search-head">
                <div><span>FIND A FIXTURE</span><strong>Search matches</strong></div>
                <button type="button" className="fx2-icon-button" onClick={() => setMobileSearchOpen(false)} aria-label="Close search"><Icon name="close" /></button>
              </div>
              <label className="fx2-mobile-search-input">
                <Icon name="search" size={19} />
                <input
                  ref={searchRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Player, team, match ID, court..."
                  aria-label="Search players, teams, match ID or court"
                />
                {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close" size={16} /></button>}
              </label>
              <p>Search by player name, team, match ID, category or court number.</p>
              <button className="fx2-search-done" type="button" onClick={() => setMobileSearchOpen(false)}>Show {filtered.length} {filtered.length === 1 ? "match" : "matches"} <Icon name="arrow" size={16} /></button>
            </div>
          )}

          <div className="fx2-category-filter" aria-label="Filter by category">
            <button type="button" className={category === ALL ? "active" : ""} onClick={() => setCategory(ALL)} aria-pressed={category === ALL}>All categories</button>
            {categories.map((item) => (
              <button type="button" key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>
            ))}
          </div>

          {filtersOpen && (
            <div className="fx2-filter-panel" id="fx2-advanced-filters">
              <div className="fx2-filter-panel-heading">
                <div><span>REFINE RESULTS</span><strong>Advanced filters</strong></div>
                {hasFilters && <button type="button" onClick={resetFilters}><Icon name="refresh" size={14} /> Reset all</button>}
              </div>

              <label className="fx2-filter-field">
                <span>Match status</span>
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value={ALL}>All statuses</option>
                  {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="fx2-filter-field">
                <span>Round</span>
                <select value={round} onChange={(event) => setRound(event.target.value)}>
                  <option value={ALL}>All rounds</option>
                  {roundOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <label className="fx2-filter-field">
                <span>Court</span>
                <select value={court} onChange={(event) => setCourt(event.target.value)}>
                  <option value={ALL}>All courts</option>
                  {courts.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>

              <div className="fx2-filter-field">
                <span>Match date</span>
                <button
                  type="button"
                  className={`fx2-filter-date-button ${date ? "has-value" : ""}`}
                  onClick={() => setCalendarOpen(true)}
                  aria-haspopup="dialog"
                >
                  <Icon name="calendar" size={17} />
                  <span>{date ? prettyDate(date, { day: "numeric", month: "short", year: "numeric" }) : "Choose date"}</span>
                  <Icon name="arrow" size={15} />
                </button>
              </div>
            </div>
          )}

          <div className="fx2-results-bar">
            <div className="fx2-results-summary" aria-live="polite">
              <strong>{filtered.length} {filtered.length === 1 ? "match" : "matches"}</strong>
              <span>{hasFilters ? "Based on your selected filters" : "Across the tournament schedule"}</span>
            </div>
            <button
              type="button"
              className={`fx2-date-chip ${date ? "has-value" : ""}`}
              onClick={() => setCalendarOpen(true)}
              aria-haspopup="dialog"
            >
              <Icon name="calendar" size={17} />
              <span>{date ? prettyDate(date, { day: "numeric", month: "short", year: "numeric" }) : "All dates"}</span>
              <Icon name="chevron" size={15} />
            </button>
          </div>

          {hasFilters && (
            <div className="fx2-active-filters">
              {query.trim() && <button type="button" onClick={() => setQuery("")}>Search: {query} <Icon name="close" size={13} /></button>}
              {category !== ALL && <button type="button" onClick={() => setCategory(ALL)}>{category} <Icon name="close" size={13} /></button>}
              {status !== ALL && <button type="button" onClick={() => setStatus(ALL)}>{status} <Icon name="close" size={13} /></button>}
              {round !== ALL && <button type="button" onClick={() => setRound(ALL)}>{round} <Icon name="close" size={13} /></button>}
              {court !== ALL && <button type="button" onClick={() => setCourt(ALL)}>{court} <Icon name="close" size={13} /></button>}
              {date && <button type="button" onClick={() => setDate("")}>{prettyDate(date)} <Icon name="close" size={13} /></button>}
              <button className="fx2-clear-all" type="button" onClick={resetFilters}>Clear all</button>
            </div>
          )}

          {!filtered.length ? (
            <div className="fx2-empty">
              <span className="fx2-empty-icon"><Icon name="search" size={25} /></span>
              <h3>No fixtures found</h3>
              <p>Try changing your search or removing one or more filters.</p>
              <button type="button" onClick={resetFilters}>Clear all filters <Icon name="arrow" size={15} /></button>
            </div>
          ) : view === "schedule" ? (
            <div className="fx2-schedule">
              {grouped.map(([day, items]) => (
                <section className="fx2-day" key={day}>
                  <div className="fx2-day-heading">
                    <div className="fx2-day-date">
                      <strong>{prettyDate(day, { day: "2-digit" })}</strong>
                      <span>{prettyDate(day, { month: "short" }).toUpperCase()}</span>
                    </div>
                    <div className="fx2-day-title">
                      <h3>{prettyDate(day, { weekday: "long" })}</h3>
                      <span>{prettyDate(day, { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <span className="fx2-day-count">{items.length} {items.length === 1 ? "MATCH" : "MATCHES"}</span>
                  </div>
                  <div className="fx2-match-grid">
                    {items.map((match) => <MatchCard key={match.id} match={match} onDetails={setDetails} />)}
                  </div>
                </section>
              ))}
            </div>
          ) : (
            <div className="fx2-court-grid">
              {courts.filter((name) => court === ALL || name === court).map((courtName) => {
                const courtMatches = filtered.filter((match) => match.court === courtName);
                return (
                  <section className="fx2-court-column" key={courtName}>
                    <div className="fx2-court-heading">
                      <span className="fx2-court-icon"><Icon name="court" size={20} /></span>
                      <div><strong>{courtName}</strong><span>{courtMatches.length} {courtMatches.length === 1 ? "fixture" : "fixtures"}</span></div>
                    </div>
                    {courtMatches.length ? courtMatches.map((match) => <MatchCard key={match.id} match={match} onDetails={setDetails} />) : <p className="fx2-court-empty">No matches for the selected filters.</p>}
                  </section>
                );
              })}
            </div>
          )}
        </section>

        <footer className="fx2-footer">
          <div className="fx2-footer-brand">
            <span className="fx2-footer-mark">
              <img src="/images/dr-khel-utsav-logo.png" alt="Dr Khel Utsav" />
            </span>
            <div><strong>DR KHEL UTSAV</strong><span>GMERS Medical College, Valsad</span></div>
          </div>
          <p>Celebrating competition. Respecting the game.</p>
        </footer>
      </div>

      {calendarOpen && (
        <CalendarPicker
          value={date}
          matches={initialMatches}
          onChange={setDate}
          onClose={() => setCalendarOpen(false)}
        />
      )}

      {details && (
        <div className="fx2-modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDetails(null);
        }}>
          <section ref={modalRef} tabIndex={-1} className="fx2-modal" role="dialog" aria-modal="true" aria-labelledby="fx2-modal-title">
            <div className="fx2-modal-head">
              <div><span>FIXTURE INFORMATION</span><h2 id="fx2-modal-title">{details.id}</h2></div>
              <button type="button" className="fx2-icon-button" onClick={() => setDetails(null)} aria-label="Close details"><Icon name="close" /></button>
            </div>
            <div className="fx2-modal-tags"><span>{details.category}</span><span>{details.round}</span><StatusBadge status={details.status} /></div>
            <div className="fx2-modal-contest">
              <div><span className="fx2-avatar">{details.a.charAt(0).toUpperCase()}</span><strong>{details.a}</strong><b className={details.winner === details.a ? "fx2-winner" : ""}>{details.scoreA ?? "–"}</b></div>
              <span className="fx2-modal-vs">VS</span>
              <div><span className="fx2-avatar">{details.b.charAt(0).toUpperCase()}</span><strong>{details.b}</strong><b className={details.winner === details.b ? "fx2-winner" : ""}>{details.scoreB ?? "–"}</b></div>
            </div>
            <div className="fx2-modal-facts">
              <div><span>Date</span><strong>{prettyDate(details.date, { day: "numeric", month: "long", year: "numeric" })}</strong></div>
              <div><span>Start time</span><strong>{details.time}</strong></div>
              <div><span>Court</span><strong>{details.court}</strong></div>
              <div><span>Round</span><strong>{details.round}</strong></div>
              <div><span>Status</span><strong>{details.status}</strong></div>
              {details.winner && <div><span>Winner</span><strong className="fx2-winner">{details.winner}</strong></div>}
            </div>
            <button className="fx2-modal-done" type="button" onClick={() => setDetails(null)}>Done</button>
          </section>
        </div>
      )}
    </main>
  );
}
