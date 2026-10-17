
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type PageNavigationProps = {
  title: string;
  subtitle?: string;
};

export default function PageNavigation({
  title,
  subtitle,
}: PageNavigationProps) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <section className="page-navigation">
      <div className="page-container page-navigation-inner">
        <div className="page-navigation-actions">
          <button
            type="button"
            className="page-nav-button"
            onClick={handleBack}
          >
            Back
          </button>

          <Link href="/" className="page-nav-button page-nav-home">
            Home
          </Link>
        </div>

        <div className="page-navigation-heading">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}
