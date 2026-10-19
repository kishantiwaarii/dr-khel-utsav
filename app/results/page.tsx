"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "./result.css";

type MatchStatus = "Upcoming" | "Live" | "Completed";

type Match = {
  id: number;
  category: string;
  round: string;
  player1: string;
  player2: string;
  score1: number | null;
  score2: number | null;
  status: MatchStatus;
  date: string;
  time: string;
  court: string;
  winner?: string;
};

const demoMatches: Match[] = [
  {
    id: 1,
    category: "Men's Singles",
    round: "Final",
    player1: "Aarav Patel",
    player2: "Dev Shah",
    score1: 21,
    score2: 17,
    status: "Completed",
    date: "2026-10-16",
    time: "10:00 AM",
    court: "Court 1",
    winner: "Aarav Patel",
  },
  {
    id: 2,
    category: "Women's Singles",
    round: "Semi Final",
    player1: "Anaya Mehta",
    player2: "Riya Joshi",
    score1: 18,
    score2: 21,
    status: "Completed",
    date: "2026-10-16",
    time: "11:00 AM",
    court: "Court 2",
    winner: "Riya Joshi",
  },
  {
    id: 3,
    category: "Men's Doubles",
    round: "Semi Final",
    player1: "Team A",
    player2: "Team B",
    score1: 12,
    score2: 9,
    status: "Live",
    date: "2026-10-19",
    time: "10:30 AM",
    court: "Court 1",
  },
  {
    id: 4,
    category: "Mixed Doubles",
    round: "Quarter Final",
    player1: "Team C",
    player2: "Team D",
    score1: null,
    score2: null,
    status: "Upcoming",
    date: "2026-10-20",
    time: "11:30 AM",
    court: "Court 3",
  },
  {
    id: 5,
    category: "Women's Doubles",
    round: "Quarter Final",
    player1: "Team E",
    player2: "Team F",
    score1: null,
    score2: null,
    status: "Upcoming",
    date: "2026-10-20",
    time: "12:30 PM",
    court: "Court 2",
  },
  {
    id: 6,
    category: "Men's Singles",
    round: "Quarter Final",
    player1: "Kabir Desai",
    player2: "Yash Trivedi",
    score1: 21,
    score2: 15,
    status: "Completed",
    date: "2026-10-15",
    time: "09:30 AM",
    court: "Court 1",
    winner: "Kabir Desai",
  },
  {
    id: 7,
    category: "Women's Singles",
    round: "Final",
    player1: "Riya Joshi",
    player2: "Anaya Mehta",
    score1: null,
    score2: null,
    status: "Upcoming",
    date: "2026-10-21",
    time: "10:00 AM",
    court: "Court 1",
  },
];

const categories = [
  "All Categories",
  "Men's Singles",
  "Men's Doubles",
  "Women's Singles",
  "Women's Doubles",
  "Mixed Doubles",
];

const categoryLinks = [
  {
    label: "Men's Singles",
    href: "/categories/mens-singles",
    type: "single",
  },
  {
    label: "Men's Doubles",
    href: "/categories/mens-doubles",
    type: "group",
  },
  {
    label: "Women's Singles",
    href: "/categories/womens-singles",
    type: "single",
  },
  {
    label: "Women's Doubles",
    href: "/categories/womens-doubles",
    type: "group",
  },
  {
    label: "Mixed Doubles",
    href: "/categories/mixed-doubles",
    type: "group",
  },
] as const;

type SortOption =
  | "newest"
  | "oldest"
  | "alphabetical"
  | "highest-score"
  | "lowest-score";

function CategoryIcon({ type }: { type: "single" | "group" }) {
  if (type === "group") {
    return (
      <svg
        className="r-category-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="7" r="3" />
        <path d="M3 20v-2a6 6 0 0 1 12 0v2" />
        <path d="M16 4.5a3 3 0 0 1 0 5.8" />
        <path d="M18 14a5 5 0 0 1 3 4.5V20" />
      </svg>
    );
  }

  return (
    <svg
      className="r-category-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
    </svg>
  );
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getMatchTimestamp(match: Match) {
  const [timePart, meridiem] = match.time.split(" ");
  const [hoursText, minutesText] = timePart.split(":");
  let hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (meridiem?.toUpperCase() === "PM" && hours !== 12) hours += 12;
  if (meridiem?.toUpperCase() === "AM" && hours === 12) hours = 0;

  return new Date(
    `${match.date}T${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:00`
  ).getTime();
}

function getCategoryType(category: string): "single" | "group" {
  return category.toLowerCase().includes("doubles") ? "group" : "single";
}

function getScoreTotal(match: Match) {
  return (match.score1 ?? 0) + (match.score2 ?? 0);
}

export default function ResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [matches] = useState<Match[]>(demoMatches);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Matches");
  const [sort, setSort] = useState<SortOption>("newest");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [registrationChecked, setRegistrationChecked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState("");
  const [liveOnly, setLiveOnly] = useState(false);

  // Load saved matches from this browser.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dkhu-favorites");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);

        if (
          Array.isArray(parsed) &&
          parsed.every(
            (item) => typeof item === "number" && Number.isFinite(item)
          )
        ) {
          setFavorites(parsed);
        }
      }
    } catch {
      // Local storage is optional.
    }
  }, []);

  // Check registration using your application's registration API.
  useEffect(() => {
    let cancelled = false;

    async function checkRegistration() {
      try {
        const response = await fetch("/api/registration/status", {
          credentials: "include",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Registration status unavailable");
        }

        const data: unknown = await response.json();

        if (
          typeof data === "object" &&
          data !== null &&
          "registered" in data &&
          typeof data.registered === "boolean" &&
          !cancelled
        ) {
          setIsRegistered(data.registered);
        }
      } catch {
        if (!cancelled) {
          setIsRegistered(null);
        }
      } finally {
        if (!cancelled) {
          setRegistrationChecked(true);
        }
      }
    }

    checkRegistration();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      try {
        localStorage.setItem("dkhu-favorites", JSON.stringify(next));
      } catch {
        // Favorites still work for this session.
      }

      return next;
    });
  }, []);

  // URL support: /results?match=3 opens match 3 automatically.
  useEffect(() => {
    const matchParam = searchParams.get("match");

    if (!matchParam) {
      setSelectedMatch(null);
      return;
    }

    const matchId = Number(matchParam);

    if (!Number.isInteger(matchId)) {
      setSelectedMatch(null);
      return;
    }

    const found = matches.find((match) => match.id === matchId);
    setSelectedMatch(found ?? null);
  }, [searchParams, matches]);

  // Close modal with Escape.
  useEffect(() => {
    if (!selectedMatch) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMatchDetails();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
    // closeMatchDetails uses the current selected match.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMatch]);

  const filteredMatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return matches
      .filter((match) => {
        const searchable = [
          match.player1,
          match.player2,
          match.category,
          match.round,
          match.court,
          match.winner ?? "",
          String(match.id),
          match.date,
          formatDate(match.date),
          match.time,
          match.status,
        ]
          .join(" ")
          .toLowerCase();

        return (
          searchable.includes(query) &&
          (category === "All Categories" || match.category === category) &&
          (status === "All Matches" || match.status === status) &&
          (!favoritesOnly || favorites.includes(match.id)) &&
          (!liveOnly || match.status === "Live")
        );
      })
      .sort((a, b) => {
        if (sort === "oldest") {
          return getMatchTimestamp(a) - getMatchTimestamp(b);
        }

        if (sort === "newest") {
          return getMatchTimestamp(b) - getMatchTimestamp(a);
        }

        if (sort === "alphabetical") {
          return a.category.localeCompare(b.category);
        }

        if (sort === "highest-score") {
          return getScoreTotal(b) - getScoreTotal(a);
        }

        if (sort === "lowest-score") {
          return getScoreTotal(a) - getScoreTotal(b);
        }

        return 0;
      });
  }, [
    matches,
    search,
    category,
    status,
    sort,
    favorites,
    favoritesOnly,
    liveOnly,
  ]);

  const liveCount = matches.filter((m) => m.status === "Live").length;

  const completedCount = matches.filter(
    (m) => m.status === "Completed"
  ).length;

  const upcomingCount = matches.filter(
    (m) => m.status === "Upcoming"
  ).length;

  const nextMatch = useMemo(
    () =>
      [...matches]
        .filter((match) => match.status === "Upcoming")
        .sort((a, b) => getMatchTimestamp(a) - getMatchTimestamp(b))[0],
    [matches]
  );

  function resetFilters() {
    setSearch("");
    setCategory("All Categories");
    setStatus("All Matches");
    setSort("newest");
    setFavoritesOnly(false);
    setLiveOnly(false);
  }

  function closeMatchDetails() {
    setSelectedMatch(null);

    const params = new URLSearchParams(searchParams.toString());
    params.delete("match");

    const query = params.toString();
    router.replace(query ? `/results?${query}` : "/results", {
      scroll: false,
    });
  }

  function openMatchDetails(match: Match) {
    setSelectedMatch(match);

    const params = new URLSearchParams(searchParams.toString());
    params.set("match", String(match.id));

    router.replace(`/results?${params.toString()}`, {
      scroll: false,
    });
  }

  async function shareMatch(match: Match) {
    setCopied(false);
    setShareError("");

    const url = new URL(window.location.href);
    url.searchParams.set("match", String(match.id));

    const shareData = {
      title: `Dr Khel Utsav — ${match.category}`,
      text: `${match.player1} vs ${match.player2} | ${match.status} | ${formatDate(
        match.date
      )}`,
      url: url.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        return;
      }

      window.prompt("Copy this match link:", shareData.url);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        setShareError("Unable to share. Please copy the URL from your browser.");
      }
    }
  }

  async function exportResults() {
    const headers = [
      "Match ID",
      "Category",
      "Round",
      "Player/Team 1",
      "Score 1",
      "Player/Team 2",
      "Score 2",
      "Status",
      "Date",
      "Time",
      "Court",
      "Winner",
    ];

    const rows = filteredMatches.map((match) => [
      match.id,
      match.category,
      match.round,
      match.player1,
      match.score1 ?? "",
      match.player2,
      match.score2 ?? "",
      match.status,
      match.date,
      match.time,
      match.court,
      match.winner ?? "",
    ]);

    const escapeCsv = (value: string | number) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "dr-khel-utsav-results.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setSearch("");
    }

    if (event.key === "Enter" && filteredMatches.length === 1) {
      openMatchDetails(filteredMatches[0]);
    }
  }

  return (
    <main className="results-page">
      <div className="r-wrap">
        <nav className="r-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Results</span>
        </nav>

        <section className="r-hero">
          <p className="r-kicker">Dr Khel Utsav Tournament Centre</p>

          <h1>
            MATCH RESULTS
            <br />
            MADE <span>SIMPLE.</span>
          </h1>

          <p className="r-description">
            Check your scores, explore upcoming fixtures, find your category,
            and save the matches you want to follow.
          </p>

          <div className="r-actions">
            <a className="r-button" href="#match-centre">
              Explore Matches
            </a>

            <Link className="r-button r-button-secondary" href="/fixtures">
              Upcoming Fixtures
            </Link>

            <Link className="r-button r-button-secondary" href="/dashboard">
              Student Dashboard
            </Link>
          </div>

          <p className="r-hero-footnote">
            <span className="r-live-indicator" aria-hidden="true" />
            Tournament information centre
          </p>
        </section>

        <section className="r-stats" aria-label="Tournament summary">
          <div className="r-stat">
            <span className="r-stat-label">Total Matches</span>
            <strong className="r-stat-value">{matches.length}</strong>
            <span className="r-stat-note">Across all categories</span>
          </div>

          <div className="r-stat">
            <span className="r-stat-label">Live Matches</span>
            <strong className="r-stat-value highlight">{liveCount}</strong>
            <span className="r-stat-note">Marked as live</span>
          </div>

          <div className="r-stat">
            <span className="r-stat-label">Completed</span>
            <strong className="r-stat-value">{completedCount}</strong>
            <span className="r-stat-note">Completed demo matches</span>
          </div>

          <div className="r-stat">
            <span className="r-stat-label">Upcoming</span>
            <strong className="r-stat-value">{upcomingCount}</strong>
            <span className="r-stat-note">Scheduled demo matches</span>
          </div>
        </section>

        {nextMatch && (
          <section className="r-next-section" aria-labelledby="next-match-title">
            <div className="r-heading">
              <h2 id="next-match-title">Next Match</h2>
              <p>Find the next scheduled game in the tournament.</p>
            </div>

            <div className="r-next">
              <div>
                <span className="r-next-label">Upcoming fixture</span>

                <h3>
                  {nextMatch.player1} vs {nextMatch.player2}
                </h3>

                <p>
                  {nextMatch.category} · {nextMatch.round} · {nextMatch.court}
                </p>
              </div>

              <div className="r-next-time">
                <strong>{formatDate(nextMatch.date)}</strong>
                <span>{nextMatch.time}</span>
                <button
                  type="button"
                  className="r-plain-button"
                  onClick={() => openMatchDetails(nextMatch)}
                >
                  View match
                </button>
              </div>
            </div>
          </section>
        )}

        <section id="match-centre" aria-labelledby="match-centre-title">
          <div className="r-heading">
            <h2 id="match-centre-title">Match Centre</h2>
            <p>Find matches by player, category, status, date, or court.</p>
          </div>

          <div className="r-filters">
            <input
              className="r-control"
              type="search"
              placeholder="Search players, teams, match ID, date..."
              aria-label="Search matches"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={handleSearchKeyDown}
            />

            <select
              className="r-control"
              aria-label="Filter category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              className="r-control"
              aria-label="Sort matches"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="alphabetical">Category A to Z</option>
              <option value="highest-score">Highest combined score</option>
              <option value="lowest-score">Lowest combined score</option>
            </select>
          </div>

          <div className="r-filter-row">
            <div className="r-tabs" aria-label="Match status filters">
              {["All Matches", "Live", "Upcoming", "Completed"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`r-tab ${status === item ? "active" : ""}`}
                  aria-pressed={status === item}
                  onClick={() => {
                    setStatus(item);
                    setLiveOnly(false);
                  }}
                >
                  {item}
                  {item === "Live" && liveCount > 0 && (
                    <span className="r-tab-count">{liveCount}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="r-extra-filters">
              <button
                type="button"
                className={`r-fav-toggle ${favoritesOnly ? "active" : ""}`}
                aria-pressed={favoritesOnly}
                onClick={() => setFavoritesOnly((value) => !value)}
              >
                {favoritesOnly ? "Showing saved matches" : "My saved matches"}
                <span>({favorites.length})</span>
              </button>

              <button
                type="button"
                className={`r-fav-toggle ${liveOnly ? "active" : ""}`}
                aria-pressed={liveOnly}
                onClick={() => {
                  setLiveOnly((value) => !value);
                  if (!liveOnly) setStatus("All Matches");
                }}
              >
                {liveOnly ? "Live only: ON" : "Live only"}
              </button>
            </div>
          </div>

          <div className="r-list-meta">
            <span aria-live="polite">
              <strong>{filteredMatches.length}</strong>{" "}
              {filteredMatches.length === 1 ? "match" : "matches"} found
            </span>

            <div className="r-list-meta-actions">
              <button
                type="button"
                className="r-plain-button"
                onClick={exportResults}
                disabled={filteredMatches.length === 0}
              >
                Export CSV
              </button>

              <button
                type="button"
                className="r-plain-button"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            </div>
          </div>

          {filteredMatches.length > 0 ? (
            <div className="r-match-list">
              {filteredMatches.map((match) => {
                const saved = favorites.includes(match.id);
                const categoryType = getCategoryType(match.category);

                return (
                  <article className="r-match" key={match.id}>
                    <div className="r-match-top">
                      <div className="r-match-tags">
                        <span className="r-category">
                          <CategoryIcon type={categoryType} />
                          {match.category}
                        </span>
                        <span className="r-round">{match.round}</span>
                        <span className="r-match-id">Match #{match.id}</span>
                      </div>

                      <span
                        className={`r-status ${match.status.toLowerCase()}`}
                        aria-label={`Match status: ${match.status}`}
                      >
                        {match.status === "Live" && (
                          <span className="r-live-indicator" aria-hidden="true" />
                        )}
                        {match.status}
                      </span>
                    </div>

                    <div className="r-players">
                      <div className="r-player">
                        <div
                          className={`r-player-name ${
                            match.winner === match.player1 ? "winner" : ""
                          }`}
                        >
                          {match.player1}
                        </div>

                        <span className="r-player-note">
                          {match.winner === match.player1
                            ? "Winner"
                            : match.status === "Completed"
                              ? "Player / Team 1"
                              : "Competitor 1"}
                        </span>
                      </div>

                      {match.status === "Upcoming" ? (
                        <span className="r-versus">VS</span>
                      ) : (
                        <div
                          className="r-score"
                          aria-label={`Score ${match.score1} to ${match.score2}`}
                        >
                          <span>{match.score1 ?? "—"}</span>
                          <span className="r-score-separator">:</span>
                          <span>{match.score2 ?? "—"}</span>
                        </div>
                      )}

                      <div className="r-player">
                        <div
                          className={`r-player-name ${
                            match.winner === match.player2 ? "winner" : ""
                          }`}
                        >
                          {match.player2}
                        </div>

                        <span className="r-player-note">
                          {match.winner === match.player2
                            ? "Winner"
                            : match.status === "Completed"
                              ? "Player / Team 2"
                              : "Competitor 2"}
                        </span>
                      </div>
                    </div>

                    <div className="r-match-bottom">
                      <div className="r-details">
                        <span>{formatDate(match.date)}</span>
                        <span>{match.time}</span>
                        <span>{match.court}</span>
                      </div>

                      <div className="r-match-actions">
                        <button
                          type="button"
                          className={`r-plain-button ${saved ? "saved" : ""}`}
                          aria-pressed={saved}
                          aria-label={
                            saved
                              ? `Remove ${match.category} from saved matches`
                              : `Save ${match.category}`
                          }
                          onClick={() => toggleFavorite(match.id)}
                        >
                          <span aria-hidden="true">{saved ? "★" : "☆"}</span>{" "}
                          {saved ? "Saved" : "Save match"}
                        </button>

                        <button
                          type="button"
                          className="r-plain-button"
                          onClick={() => openMatchDetails(match)}
                        >
                          View details
                        </button>

                        <button
                          type="button"
                          className="r-plain-button"
                          onClick={() => shareMatch(match)}
                        >
                          Share
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="r-empty" role="status">
              <div className="r-empty-symbol" aria-hidden="true">
                ⌕
              </div>
              <h3>No matches found</h3>
              <p>
                Try changing your search, selecting a different category, or
                clearing the saved-match filter.
              </p>

              <button
                type="button"
                className="r-button"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section aria-labelledby="explore-categories-title">
          <div className="r-heading" style={{ marginTop: 44 }}>
            <h2 id="explore-categories-title">Explore Categories</h2>
            <p>Open your tournament category.</p>
          </div>

          <div className="r-categories">
            {categoryLinks.map((item) => (
              <Link
                className="r-category-card"
                href={item.href}
                key={item.href}
              >
                <CategoryIcon type={item.type} />
                <span className="r-category-name">{item.label}</span>
                <span className="r-category-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </section>

        {registrationChecked && isRegistered === false && (
          <section className="r-registration">
            <div>
              <p className="r-kicker">Player Registration</p>
              <h2>Ready to join the tournament?</h2>
              <p>
                Complete your registration to participate in Dr Khel Utsav.
              </p>
            </div>

            <Link className="r-button" href="/register">
              Register Now
            </Link>
          </section>
        )}

        {registrationChecked && isRegistered === true && (
          <section className="r-registration r-registration-success">
            <div>
              <p className="r-kicker">Player Registration</p>
              <h2>You’re registered!</h2>
              <p>
                Your registration status is confirmed by the registration API.
              </p>
            </div>

            <span className="r-registered-badge">✓ Registered</span>
          </section>
        )}

        <aside className="r-note">
          <strong>Demo data:</strong> The names, scores, dates, and fixtures
          shown here are sample information for the page design. They are not
          verified official results. Connect your tournament database before
          publishing actual scores.
        </aside>
      </div>

      {selectedMatch && (
        <div
          className="r-overlay"
          onClick={closeMatchDetails}
          role="presentation"
        >
          <section
            className="r-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="r-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="r-modal-top">
              <div>
                <p className="r-kicker">Match #{selectedMatch.id}</p>
                <h2 id="r-modal-title">{selectedMatch.category}</h2>
              </div>

              <button
                type="button"
                className="r-close"
                aria-label="Close match details"
                onClick={closeMatchDetails}
              >
                ✕
              </button>
            </div>

            <p className="r-modal-subtitle">
              {selectedMatch.round} · {selectedMatch.status}
            </p>

            <div className="r-modal-scoreboard">
              <div className="r-modal-competitor">
                <CategoryIcon
                  type={getCategoryType(selectedMatch.category)}
                />
                <strong>{selectedMatch.player1}</strong>
                {selectedMatch.winner === selectedMatch.player1 && (
                  <span className="r-modal-winner">Winner</span>
                )}
                <span className="r-modal-score">
                  {selectedMatch.score1 ?? "—"}
                </span>
              </div>

              <span className="r-modal-vs">
                {selectedMatch.status === "Upcoming" ? "VS" : ":"}
              </span>

              <div className="r-modal-competitor">
                <CategoryIcon
                  type={getCategoryType(selectedMatch.category)}
                />
                <strong>{selectedMatch.player2}</strong>
                {selectedMatch.winner === selectedMatch.player2 && (
                  <span className="r-modal-winner">Winner</span>
                )}
                <span className="r-modal-score">
                  {selectedMatch.score2 ?? "—"}
                </span>
              </div>
            </div>

            <div className="r-modal-row">
              <span>Round</span>
              <strong>{selectedMatch.round}</strong>
            </div>

            <div className="r-modal-row">
              <span>Score</span>
              <strong>
                {selectedMatch.status === "Upcoming"
                  ? "Not played yet"
                  : `${selectedMatch.score1 ?? "—"} : ${
                      selectedMatch.score2 ?? "—"
                    }`}
              </strong>
            </div>

            <div className="r-modal-row">
              <span>Winner</span>
              <strong>{selectedMatch.winner ?? "Not decided"}</strong>
            </div>

            <div className="r-modal-row">
              <span>Date</span>
              <strong>{formatDate(selectedMatch.date)}</strong>
            </div>

            <div className="r-modal-row">
              <span>Time</span>
              <strong>{selectedMatch.time}</strong>
            </div>

            <div className="r-modal-row">
              <span>Court</span>
              <strong>{selectedMatch.court}</strong>
            </div>

            <div className="r-modal-actions">
              <button
                type="button"
                className="r-button"
                onClick={() => toggleFavorite(selectedMatch.id)}
              >
                {favorites.includes(selectedMatch.id)
                  ? "★ Remove saved match"
                  : "☆ Save this match"}
              </button>

              <button
                type="button"
                className="r-button r-button-secondary"
                onClick={() => shareMatch(selectedMatch)}
              >
                Share match
              </button>

              <button
                type="button"
                className="r-button r-button-secondary"
                onClick={closeMatchDetails}
              >
                Close
              </button>
            </div>

            {copied && (
              <p className="r-feedback" role="status">
                Match link copied to clipboard.
              </p>
            )}

            {shareError && (
              <p className="r-feedback r-feedback-error" role="status">
                {shareError}
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}