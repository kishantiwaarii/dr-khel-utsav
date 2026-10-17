
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  tournamentCategories,
} from "../categories-data";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tournamentCategories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found | Dr Khel Utsav" };
  }

  return {
    title: `${category.title} | Dr Khel Utsav`,
    description: `${category.description} Explore ${category.title} at Dr Khel Utsav, GMERS Valsad.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="category-detail-page">
      <section className="detail-hero">
        <div className="category-container">
          <nav className="category-breadcrumb" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span className="breadcrumb-divider">/</span>
            <Link href="/categories">Categories</Link>
            <span className="breadcrumb-divider">/</span>
            <span aria-current="page">{category.title}</span>
          </nav>

          <div className="detail-hero-layout">
            <div className="detail-hero-copy">
              <p className="category-eyebrow">
                DR KHEL UTSAV · OFFICIAL CATEGORY
              </p>
              <p className="detail-category-type">{category.type} EVENT</p>
              <h1>{category.title}</h1>
              <p className="detail-description">{category.description}</p>

              <div className="detail-actions">
                <Link className="category-button category-button-primary" href="/categories">
                  Explore categories
                </Link>
                <span className="registration-status">
                  Registration information pending confirmation
                </span>
              </div>
            </div>

            <aside className="detail-format-panel">
              <p className="panel-overline">ENTRY OVERVIEW</p>
              <div className="format-main">
                <span className="format-label">Entry format</span>
                <strong>{category.format}</strong>
              </div>
              <div className="format-row">
                <span>Players per entry</span>
                <strong>{category.participants}</strong>
              </div>
              <div className="format-row">
                <span>Team structure</span>
                <strong>{category.teamSize}</strong>
              </div>
              <div className="format-row">
                <span>Event type</span>
                <strong>{category.type}</strong>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="detail-content-section">
        <div className="category-container detail-content-grid">
          <div className="detail-main-content">
            <p className="category-eyebrow">CATEGORY INFORMATION</p>
            <h2>What to expect</h2>
            <p className="detail-body-copy">
              This category is part of the Dr Khel Utsav badminton tournament
              at GMERS Valsad. Tournament-specific fixtures, match results
              and confirmed rules can be added here as the organisers release
              official information.
            </p>

            <div className="detail-feature-list">
              {category.highlights.map((highlight, index) => (
                <div className="detail-feature" key={highlight}>
                  <span className="detail-feature-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p>{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="eligibility-panel">
            <p className="category-eyebrow">BEFORE YOU ENTER</p>
            <h2>Eligibility</h2>
            <p>{category.eligibility}</p>
            <div className="eligibility-divider" />
            <span className="eligibility-status">Awaiting organiser confirmation</span>
            <p className="eligibility-small">
              Check the final tournament announcement before registering.
            </p>
          </aside>
        </div>
      </section>

      <section className="detail-bottom-section">
        <div className="category-container detail-bottom-inner">
          <div>
            <p className="category-eyebrow">DR KHEL UTSAV</p>
            <h2>Explore every competition.</h2>
            <p>
              Compare the available categories before choosing your event.
            </p>
          </div>
          <Link className="category-button category-button-primary" href="/categories">
            View all categories
          </Link>
        </div>
      </section>
    </main>
  );
}
