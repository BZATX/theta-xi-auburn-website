/* ============================================================
   Shared layout (navbar + footer) injected on every page.
   Edit links here ONCE and every page updates.
   `data-root` on <body> is "" for index.html and "../" for /pages.
   ============================================================ */
(function () {
  const ROOT = document.body.dataset.root || "";
  const page = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  const SOCIALS = {
    instagram: "https://www.instagram.com/authetaxi/",
    facebook: "https://www.facebook.com/profile.php?id=100067080071858",
    email: "mailto:thetaxibz@gmail.com"
  };

  const igIcon = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.4 5.6 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.6 18.4 4 16.4 4H7.6zm4.4 4.4a5.6 5.6 0 110 11.2 5.6 5.6 0 010-11.2zm0 2a3.6 3.6 0 100 7.2 3.6 3.6 0 000-7.2zm4.7-4.2a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>';
  const fbIcon = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54V12h2.54V9.8c0-2.5 1.48-3.9 3.76-3.9 1.1 0 2.22.2 2.22.2v2.4h-1.25c-1.23 0-1.62.77-1.62 1.55V12h2.78l-.44 2.94h-2.34v7a10.02 10.02 0 008.44-9.9c0-5.54-4.5-10.02-10-10.02z"/></svg>';

  const exploreLinks = [
    { href: "pages/about.html", label: "About Us" },
    { href: "pages/why-theta-xi.html", label: "Why Theta Xi" },
    { href: "pages/recruitment.html", label: "Recruitment" },
    { href: "pages/leadership.html", label: "Meet the Officers" },
    { href: "pages/history.html", label: "Our History" },
    { href: "pages/philanthropy.html", label: "Philanthropy" },
    { href: "pages/brotherhood.html", label: "Brotherhood" },
    { href: "pages/parents.html", label: "For Parents" }
  ];

  const link = (href) => ROOT + href;
  const isActive = (href) => href.split("/").pop().toLowerCase() === page;
  const activeClass = (href) => (isActive(href) ? " active" : "");
  const exploreActive = exploreLinks.some((l) => isActive(l.href));

  /* ---------- NAVBAR ---------- */
  const nav = `
  <nav class="navbar" id="navbar" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="${link("index.html")}" class="brand" aria-label="Auburn Theta Xi home">
        <img src="${link("assets/images/system/crest traditional.png")}" alt="Theta Xi crest">
        <span class="brand-text">
          <span class="brand-name">THETA XI</span>
          <span class="brand-sub">Beta Zeta &middot; Auburn</span>
        </span>
      </a>

      <ul class="nav-links">
        <li><a href="${link("index.html")}" class="nav-link${activeClass("index.html")}">Home</a></li>
        <li class="has-dropdown">
          <a href="${link("pages/about.html")}" class="nav-link dropdown-toggle${exploreActive ? " active" : ""}" aria-haspopup="true" aria-expanded="false" aria-controls="explore-menu">Explore <span class="caret" aria-hidden="true"></span></a>
          <div class="dropdown-panel" id="explore-menu">
            ${exploreLinks.map((l) => `<a href="${link(l.href)}"${isActive(l.href) ? ' class="active"' : ""}>${l.label}</a>`).join("")}
          </div>
        </li>
        <li><a href="${link("pages/scholarships.html")}" class="nav-link${activeClass("pages/scholarships.html")}">Scholarships</a></li>
        <li><a href="${link("pages/journal.html")}" class="nav-link${activeClass("pages/journal.html")}">Social</a></li>
        <li><a href="${link("pages/alumni.html")}" class="nav-link${activeClass("pages/alumni.html")}">Alumni</a></li>
        <li><a href="${link("pages/donate.html")}" class="nav-link${activeClass("pages/donate.html")}">Donate</a></li>
        <li><a href="${link("pages/recruitment.html")}" class="btn btn-primary nav-cta">Rush</a></li>
        <li><a href="${SOCIALS.instagram}" class="nav-social" target="_blank" rel="noopener" aria-label="Instagram @authetaxi">${igIcon}</a></li>
      </ul>

      <a href="${link("pages/recruitment.html")}" class="btn btn-primary nav-cta-mobile">Rush</a>

      <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <div class="drawer-scrim" id="drawer-scrim"></div>
  <nav class="mobile-drawer" id="mobile-drawer" aria-label="Mobile navigation" aria-hidden="true" inert>
    <div class="drawer-group">
      <a href="${link("index.html")}" class="${isActive("index.html") ? "active" : ""}">Home</a>
      <p class="drawer-label">Explore</p>
      ${exploreLinks.map((l) => `<a href="${link(l.href)}" class="${isActive(l.href) ? "active" : ""}">${l.label}</a>`).join("")}
      <p class="drawer-label">Chapter</p>
      <a href="${link("pages/scholarships.html")}" class="${isActive("pages/scholarships.html") ? "active" : ""}">Scholarships</a>
      <a href="${link("pages/journal.html")}" class="${isActive("pages/journal.html") ? "active" : ""}">Social</a>
      <a href="${link("pages/alumni.html")}" class="${isActive("pages/alumni.html") ? "active" : ""}">Alumni</a>
      <a href="${link("pages/donate.html")}" class="${isActive("pages/donate.html") ? "active" : ""}">Donate</a>
      <a href="${link("pages/recruitment.html")}" class="btn btn-primary">Rush Theta Xi</a>
      <div class="drawer-social">
        <a href="${SOCIALS.instagram}" class="social-btn" target="_blank" rel="noopener" aria-label="Instagram @authetaxi">${igIcon}</a>
        <a href="${SOCIALS.facebook}" class="social-btn" target="_blank" rel="noopener" aria-label="Facebook">${fbIcon}</a>
      </div>
    </div>
  </nav>`;

  /* ---------- FOOTER ---------- */
  const footer = `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="${link("assets/images/system/crest traditional.png")}" alt="Theta Xi crest">
          <p><strong style="color:var(--text-hi)">Theta Xi Fraternity</strong><br>
          Beta Zeta Chapter &middot; Auburn University<br>
          Founded 1954 &middot; <em>Juncti Juvant — United They Serve</em></p>
        </div>
        <div class="footer-col">
          <h2>Explore</h2>
          ${exploreLinks.map((l) => `<a href="${link(l.href)}">${l.label}</a>`).join("")}
        </div>
        <div class="footer-col">
          <h2>Chapter</h2>
          <a href="${link("pages/scholarships.html")}">Scholarships</a>
          <a href="${link("pages/journal.html")}">Social</a>
          <a href="${link("pages/alumni.html")}">Alumni</a>
          <a href="${link("pages/scholarship.html")}">Academic Excellence</a>
          <a href="${link("pages/philanthropy.html")}">Service</a>
          <a href="${link("pages/recruitment.html")}">Rush Theta Xi</a>
          <a href="${link("pages/donate.html")}">Give Back</a>
        </div>
        <div class="footer-col">
          <h2>Visit Us</h2>
          <address>835 West Magnolia Ave<br>Auburn, AL 36832</address>
          <a href="${SOCIALS.email}">thetaxibz@gmail.com</a>
          <div class="social-row" style="justify-content:flex-start; margin-top:1rem;">
            <a href="${SOCIALS.instagram}" class="social-btn" target="_blank" rel="noopener" aria-label="Instagram">${igIcon}</a>
            <a href="${SOCIALS.facebook}" class="social-btn" target="_blank" rel="noopener" aria-label="Facebook">${fbIcon}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} Theta Xi — Beta Zeta Chapter. All rights reserved.</p>
        <p><a href="${link("pages/privacy.html")}">Privacy</a> &middot; <a href="${link("pages/accessibility.html")}">Accessibility</a> &middot; <a href="https://thetaxi.org" target="_blank" rel="noopener">Theta Xi National</a></p>
      </div>
    </div>
  </footer>`;

  const navMount = document.getElementById("site-nav");
  const footMount = document.getElementById("site-footer");
  if (navMount) navMount.outerHTML = nav;
  if (footMount) footMount.outerHTML = footer;

  /* ---------- Skip-to-content link (first tab stop) ---------- */
  const mainEl = document.querySelector("main");
  if (mainEl && !mainEl.id) mainEl.id = "main-content";
  if (mainEl) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<a class="skip-link" href="#main-content">Skip to main content</a>'
    );
  }

  /* ---------- Back-to-top button ---------- */
  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML =
    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
  const toggleToTop = () => toTop.classList.toggle("show", window.scrollY > 600);
  window.addEventListener("scroll", toggleToTop, { passive: true });
  toggleToTop();
})();
