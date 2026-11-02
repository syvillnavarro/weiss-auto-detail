import { useEffect, useState } from "react";
import corvette from "./assets/img/corvette.jpg";
import corvettePortrait from "./assets/img/corvette-portrait.jpg";
import headlightAfter from "./assets/img/headlight-after.jpg";
import headlightBefore from "./assets/img/headlight-before.jpg";
import logoWhite from "./assets/img/logo-white.png";
import { BeforeAfter } from "./components/BeforeAfter";
import { QuoteForm } from "./components/QuoteForm";
import { ServiceShowcase } from "./components/ServiceShowcase";
import { business, formatPrice, groupLabels, packages, reviews, type PackageGroup } from "./data/site";
import { scrollToId } from "./hooks";

const navLinks = [
  ["services", "Services"],
  ["results", "Results"],
  ["packages", "Packages"],
  ["reviews", "Reviews"],
  ["contact", "Contact"],
] as const;

export default function App() {
  const [service, setService] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const quote = (id: string) => {
    setService(id);
    scrollToId("quote");
  };

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-main" href="#main">
        Skip to content
      </a>
      <div className="concept-bar">Design concept for Weiss Auto Detail. Not the live site.</div>

      <header className={`site-header${menuOpen ? " menu-open" : ""}`}>
        <div className="header-inner wrap">
          <a className="brand" href="#top" aria-label="Weiss Auto Detail, back to top">
            <img src={logoWhite} alt="Weiss Auto Detail" width={1689} height={609} />
          </a>
          <nav id="site-nav" className="site-nav" aria-label="Main">
            {navLinks.map(([id, text]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {text}
              </a>
            ))}
            <a className="nav-phone" href={business.phoneHref}>
              {business.phone}
            </a>
          </nav>
          <a className="btn btn-light header-cta" href="#quote">
            Request a Quote
          </a>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className="menu-bars" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <picture className="hero-media">
            <source media="(max-width: 699px)" srcSet={corvettePortrait} />
            <img src={corvette} alt="Blue Corvette with a deep gloss in low sun" fetchPriority="high" />
          </picture>
          <div className="hero-copy wrap">
            <p className="label">{business.area}</p>
            <h1>
              Every detail.
              <br />
              Perfected.
            </h1>
            <p className="hero-sub">
              Professional auto detailing, paint correction & ceramic coating in Edmonton.
            </p>
            <div className="hero-actions">
              <a className="btn btn-light" href="#quote">
                Request a Quote
              </a>
              <a className="btn btn-ghost" href="#services">
                Explore Services
              </a>
            </div>
            <ul className="hero-facts">
              <li>Certified Owner's Pride installer</li>
              <li>Ceramic coating backed by a 7 year warranty</li>
            </ul>
          </div>
        </section>

        <ServiceShowcase onQuote={quote} />

        <section className="results dark" id="results" aria-labelledby="results-title">
          <div className="wrap results-grid">
            <div className="results-copy">
              <p className="label">Genuine result</p>
              <h2 id="results-title">Same headlight, restored.</h2>
              <p>
                A weathered lens brought back to clear, from Weiss's own photos. Drag the photo or use the
                slider to compare.
              </p>
              <p className="results-price">
                Headlight Restoration <span>{formatPrice(50)}</span>
              </p>
              <button type="button" className="btn btn-light" onClick={() => quote("headlight-restoration")}>
                Request headlight restoration
              </button>
            </div>
            <BeforeAfter
              before={headlightBefore}
              after={headlightAfter}
              beforeAlt="Headlight before restoration, yellowed and cracked"
              afterAlt="The same headlight after restoration, clear"
              label="Compare the headlight before and after"
            />
          </div>
        </section>

        <section className="packages" id="packages" aria-labelledby="packages-title">
          <div className="wrap">
            <div className="section-head">
              <p className="label">All packages</p>
              <h2 id="packages-title">
                <span className="title-line">Pick a package.</span>{" "}
                <span className="title-line">We'll confirm the price for your vehicle.</span>
              </h2>
            </div>
            <div className="package-groups">
              {(["exterior", "interior", "ceramic"] as PackageGroup[]).map((g) => {
                const items = packages.filter((p) => p.group === g);
                return (
                  <div className="package-group" key={g} style={{ gridRow: `span ${items.length + 1}` }}>
                    <h3>{groupLabels[g]}</h3>
                    <ul style={{ gridRow: `span ${items.length}` }}>
                      {items.map((p) => (
                        <li key={p.id} className="package-row">
                          <div>
                            <p className="package-name">{p.name}</p>
                            {p.price !== null ? <p className="package-summary">{p.summary}</p> : null}
                          </div>
                          <div className="package-side">
                            <p className="package-price">{formatPrice(p.price)}</p>
                            <button type="button" className="text-btn" onClick={() => quote(p.id)}>
                              Request<span className="sr-only"> {p.name}</span>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="reviews dark" id="reviews" aria-labelledby="reviews-title">
          <div className="wrap">
            <div className="section-head">
              <p className="label">In customers' words</p>
              <h2 id="reviews-title">What people noticed.</h2>
            </div>
            <div className="review-grid">
              {reviews.map((r) => (
                <figure className="review" key={r.when + r.about}>
                  <blockquote>“{r.quote}”</blockquote>
                  <figcaption>
                    {r.about} · Google review, {r.when}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="quote" id="quote" aria-labelledby="quote-title">
          <div className="wrap quote-grid">
            <div className="quote-copy" id="contact">
              <p className="label">Request a quote</p>
              <h2 id="quote-title">Tell us about your vehicle.</h2>
              <p>Weiss replies with a price for your vehicle and a time that works.</p>
              <dl className="contact-list">
                <div>
                  <dt>Phone</dt>
                  <dd>
                    <a href={business.phoneHref}>{business.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${business.email}`}>{business.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Shop</dt>
                  <dd>
                    {business.street}
                    <br />
                    {business.city}, {business.region}
                  </dd>
                </div>
                <div>
                  <dt>Area</dt>
                  <dd>{business.area}</dd>
                </div>
              </dl>
            </div>
            <QuoteForm service={service} onServiceChange={setService} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-inner">
          <img className="footer-logo" src={logoWhite} alt="Weiss Auto Detail" width={1689} height={609} />
          <div>
            <p>
              {business.street}, {business.city}, {business.region}
            </p>
            <p>
              <a href={business.phoneHref}>{business.phone}</a> ·{" "}
              <a href={`mailto:${business.email}`}>{business.email}</a>
            </p>
          </div>
          <div className="footer-social">
            <a href={business.facebook} rel="noopener" target="_blank">
              Facebook
            </a>
            <a href={business.instagram} rel="noopener" target="_blank">
              Instagram
            </a>
          </div>
        </div>
        <p className="wrap footer-note">
          Design concept prepared for Weiss Auto Detail. Photos and prices from weissautodetail.com.
        </p>
      </footer>
    </>
  );
}
