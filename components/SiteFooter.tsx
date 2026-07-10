import { Logo } from "./Logo";
import { IconPin, IconPhone, IconMail } from "./Icons";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 9h3l.5-3H14V4.2c0-.9.3-1.5 1.6-1.5H17V.1C16.7 0 15.7 0 14.6 0 12.1 0 10.5 1.5 10.5 4v2H7.5v3h3v9H14V9Z" />
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10 15V9l5.2 3L10 15Z" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand" style={{ marginBottom: "1rem" }}>
              <Logo height={40} />
              <span className="brand-text">
                <span className="brand-name">Hindu Center of Charlotte</span>
                <span className="brand-sub">Seva Volunteer Portal</span>
              </span>
            </div>
            <p style={{ maxWidth: "34ch" }}>
              Serving the community through devotion and seva. Volunteer your
              time, and let every hour of service be counted.
            </p>
            <div className="social-row">
              <a href="https://www.facebook.com/HinduCenterCharlotte" aria-label="Facebook" target="_blank" rel="noreferrer"><FacebookIcon /></a>
              <a href="https://www.instagram.com/" aria-label="Instagram" target="_blank" rel="noreferrer"><InstagramIcon /></a>
              <a href="https://www.youtube.com/" aria-label="YouTube" target="_blank" rel="noreferrer"><YoutubeIcon /></a>
            </div>
          </div>

          <div>
            <h4>Visit Us</h4>
            <ul>
              <li className="meta-item"><IconPin style={{ color: "var(--gold)" }} /> 7400 City View Dr, Charlotte, NC 28212</li>
              <li className="meta-item"><IconPhone style={{ color: "var(--gold)" }} /> <a href="tel:+17045353440">(704) 535-3440</a></li>
              <li className="meta-item"><IconMail style={{ color: "var(--gold)" }} /> <a href="mailto:HinduCenter@hcclt.org">HinduCenter@hcclt.org</a></li>
            </ul>
          </div>

          <div>
            <h4>Portal</h4>
            <ul>
              <li><a href="/opportunities">Opportunities</a></li>
              <li><a href="/dashboard">My Hours</a></li>
              <li><a href="/login">Sign in</a></li>
              <li><a href="https://www.hcclt.org" target="_blank" rel="noreferrer">Main Website ↗</a></li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Hindu Center of Charlotte. All rights reserved.</span>
          <span>Seva Volunteer Portal</span>
        </div>
      </div>
    </footer>
  );
}
