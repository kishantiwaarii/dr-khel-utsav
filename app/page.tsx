
"use client";

import { useState } from "react";

const categories = [
  {
    number: "01",
    title: "Men's Singles",
    description: "One player. One court. All determination.",
    href: "/categories/mens-singles",
    tag: "SINGLES",
  },
  {
    number: "02",
    title: "Men's Doubles",
    description: "Two players. One powerful partnership.",
    href: "/categories/mens-doubles",
    tag: "DOUBLES",
  },
  {
    number: "03",
    title: "Women's Singles",
    description: "Skill, speed and a champion's mindset.",
    href: "/categories/womens-singles",
    tag: "SINGLES",
  },
  {
    number: "04",
    title: "Women's Doubles",
    description: "Teamwork that changes the game.",
    href: "/categories/womens-doubles",
    tag: "DOUBLES",
  },
  {
    number: "05",
    title: "Mixed Doubles",
    description: "Two strengths. One winning team.",
    href: "/categories/mixed-doubles",
    tag: "MIXED",
  },
];

const hubLinks = [
  {
    number: "01",
    title: "Player Registration",
    description:
      "Join the tournament, submit your details and get ready to compete.",
    href: "/register",
    label: "Register now",
  },
  {
    number: "02",
    title: "Fixtures & Schedule",
    description:
      "Find your upcoming matches and check the tournament schedule.",
    href: "/fixtures",
    label: "View fixtures",
  },
  {
    number: "03",
    title: "Live Results",
    description:
      "Follow match outcomes, scores and the journey to the final.",
    href: "/results",
    label: "Explore results",
  },
  {
    number: "04",
    title: "Player Dashboard",
    description:
      "Access your player information and track your tournament progress.",
    href: "/dashboard",
    label: "Open dashboard",
  },
];

function Brand() {
  return (
    <a href="/" className="brand" aria-label="Dr Khel Utsav home">
      <span className="brand-mark">
        <img
          src="/drkhelutsavlogo.png"
          alt="Dr Khel Utsav badminton logo"
          width="45"
          height="45"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "inherit",
          }}
        />
      </span>
      <span className="brand-copy">
        <span className="brand-name">DR KHEL UTSAV</span>
        <span className="brand-subtitle">GMERS VALSAD</span>
      </span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />

        <nav
          id="main-navigation"
          className={`main-nav ${menuOpen ? "main-nav-open" : ""}`}
          aria-label="Main navigation"
        >
          <a href="#tournament-hub" onClick={closeMenu}>
            Explore
          </a>
          <a href="#categories" onClick={closeMenu}>
            Categories
          </a>
          <a href="/fixtures" onClick={closeMenu}>
            Fixtures
          </a>
          <a href="/results" onClick={closeMenu}>
            Results
          </a>

          <a
            href="/register"
            className="button button-small nav-register"
            onClick={closeMenu}
          >
            Register
          </a>
        </nav>

        <button
          type="button"
          className={`menu-toggle ${menuOpen ? "menu-toggle-active" : ""}`}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-background" aria-hidden="true" />

      <div className="hero-inner">
        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" />
            GMERS COLLEGE, VALSAD
          </div>

          <h1>
            The court is calling.
            <br />
            <span>Will you answer?</span>
          </h1>

          <p className="hero-description">
            The competition starts here. Bring your game, represent your
            category and make every point count at Dr Khel Utsav.
          </p>

          <div className="hero-actions">
            <a href="/register" className="button button-primary">
              Register for the tournament
            </a>
            <a href="#categories" className="button button-outline">
              Explore categories
            </a>
          </div>

          <div className="hero-note">
            <span className="hero-note-line" />
            YOUR GAME. YOUR MOMENT. YOUR LEGACY.
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image" role="img" aria-label="Badminton court" />

          <div className="hero-image-label">
            <span className="image-label-dot" />
            THE GAME IS ON
          </div>

          <div className="hero-index">
            <span>DKU</span>
            <span>01 / 25</span>
          </div>
        </div>
      </div>

      <div className="hero-bottom">
        <span>BUILT FOR COMPETITION</span>
        <span className="hero-bottom-center">
          BADMINTON · COMMUNITY · SPORT
        </span>
        <a href="#tournament-hub">DISCOVER THE EXPERIENCE</a>
      </div>
    </section>
  );
}

function TournamentHub() {
  return (
    <section id="tournament-hub" className="section tournament-hub">
      <div className="section-heading">
        <div>
          <p className="section-kicker">YOUR TOURNAMENT, SIMPLIFIED</p>
          <h2>
            Everything you need.
            <br />
            <span>One place.</span>
          </h2>
        </div>

        <p className="section-intro">
          From your first registration to the final score, find the essential
          tournament information right here.
        </p>
      </div>

      <div className="hub-grid">
        {hubLinks.map((item) => (
          <a className="hub-card" href={item.href} key={item.number}>
            <span className="hub-number">{item.number}</span>
            <div className="hub-card-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <span className="hub-card-link">{item.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section id="categories" className="section categories-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">FIND YOUR ARENA</p>
          <h2>
            Five categories.
            <br />
            <span>One champion mindset.</span>
          </h2>
        </div>

        <p className="section-intro">
          Choose your event, prepare your game and get ready to compete.
        </p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <a
            className="category-card"
            href={category.href}
            key={category.number}
          >
            <div className="category-card-top">
              <span className="category-number">{category.number}</span>
              <span className="category-tag">{category.tag}</span>
            </div>

            <div className="category-card-bottom">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
              <span className="category-link">Explore category</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ClosingCallToAction() {
  return (
    <section className="closing-section">
      <div className="closing-inner">
        <p className="section-kicker">THIS IS YOUR MOMENT</p>
        <h2>
          Ready to make
          <br />
          <span>your mark?</span>
        </h2>
        <p>
          Step onto the court. Bring your best game. Be part of Dr Khel Utsav.
        </p>
        <a href="/register" className="button button-primary">
          Get tournament-ready
        </a>
      </div>
      <div className="closing-decoration" aria-hidden="true">
        DKU
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <Brand />
        <p>
          Celebrating the spirit of sport, the strength of teamwork and the
          pursuit of excellence.
        </p>

        <div className="footer-links">
          <a href="#tournament-hub">Explore</a>
          <a href="#categories">Categories</a>
          <a href="/fixtures">Fixtures</a>
          <a href="/results">Results</a>
          <a href="/register">Registration</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>DR KHEL UTSAV · GMERS VALSAD</span>
        <span>PLAY WITH PURPOSE.</span>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <TournamentHub />
        <Categories />
        <ClosingCallToAction />
      </main>
      <Footer />
    </>
  );
}
