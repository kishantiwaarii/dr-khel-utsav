
import type { Metadata } from "next";
import Link from "next/link";
import { tournamentCategories } from "./categories-data";

export const metadata: Metadata = {
  title: "Tournament Categories | Dr Khel Utsav",
  description:
    "Explore the five badminton competition categories at Dr Khel Utsav, GMERS Valsad.",
};

export default function CategoriesPage() {
  return (
    <main className="categories-page">
      <section className="categories-hero">
        <div className="category-container">
          <p className="category-eyebrow">DR KHEL UTSAV · GMERS VALSAD</p>
          <h1>
            Choose your
            <span> competition.</span>
          </h1>
          <p className="categories-intro">
            Explore the tournament categories, understand the entry format
            and find the competition that suits you.
          </p>

          <div className="category-overview" aria-label="Tournament overview">
            <div className="overview-item">
              <strong>05</strong>
              <span>Categories</span>
            </div>
            <div className="overview-item">
              <strong>02</strong>
              <span>Entry formats</span>
            </div>
            <div className="overview-item">
              <strong>01</strong>
              <span>Tournament</span>
            </div>
          </div>
        </div>
      </section>

      <section className="category-list-section">
        <div className="category-container">
          <div className="category-section-heading">
            <div>
              <p className="category-eyebrow">THE LINE-UP</p>
              <h2>Competition categories</h2>
            </div>
            <p>
              Select a category to view its entry format, eligibility
              information and competition details.
            </p>
          </div>

          <div className="tournament-category-grid">
            {tournamentCategories.map((category, index) => (
              <Link
                className="tournament-category-card"
                href={`/categories/${category.slug}`}
                key={category.slug}
              >
                <div className="category-card-top">
                  <span className="category-index">
                    CATEGORY {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="category-type">{category.type}</span>
                </div>

                <div className="category-card-content">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </div>

                <div className="category-card-footer">
                  <span>{category.format}</span>
                  <span className="category-view-label">View details</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="category-information-note">
            <span className="note-indicator" aria-hidden="true" />
            <p>
              Final eligibility, registration dates, match format and
              tournament rules will be published after confirmation by
              the organisers.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
