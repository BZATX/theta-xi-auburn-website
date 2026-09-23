/* ============================================================
   AUBURN THETA XI — site behavior + dynamic content layer
   Content lives in /data/*.json and is editable from /admin.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const ROOT = document.body.dataset.root || "";

  /* ---------------- Navbar ---------------- */
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("mobile-drawer");
  const scrim = document.getElementById("drawer-scrim");

  // The navbar switches to its frosted-white "scrolled" style when the page
  // scrolls OR while the light mobile drawer is open behind it.
  const onScroll = () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 24 || (drawer && drawer.classList.contains("open")));
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // The element that had focus before the drawer opened, so we can restore it.
  let drawerReturnFocus = null;
  const drawerFocusables = () =>
    drawer ? [...drawer.querySelectorAll('a[href], button:not([disabled])')] : [];

  function setDrawer(open) {
    if (!toggle || !drawer || !scrim) return;
    toggle.classList.toggle("open", open);
    drawer.classList.toggle("open", open);
    scrim.classList.toggle("show", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    // Keep the off-screen drawer out of the tab order / accessibility tree
    // when closed — otherwise keyboard users tab into an invisible menu.
    if (open) {
      drawer.removeAttribute("inert");
      drawer.removeAttribute("aria-hidden");
      drawerReturnFocus = document.activeElement;
      // Defer briefly so the toggle's own click-focus settles first, then
      // move focus into the now-visible drawer (a same-tick focus is overridden).
      const first = drawerFocusables()[0];
      if (first) setTimeout(() => { if (drawerOpen()) first.focus(); }, 60);
    } else {
      drawer.setAttribute("inert", "");
      drawer.setAttribute("aria-hidden", "true");
      if (drawerReturnFocus && typeof drawerReturnFocus.focus === "function") {
        drawerReturnFocus.focus();
      } else if (toggle) {
        toggle.focus();
      }
      drawerReturnFocus = null;
    }
    onScroll();
  }
  const drawerOpen = () => drawer && drawer.classList.contains("open");
  if (toggle) toggle.addEventListener("click", () => setDrawer(!drawerOpen()));
  if (scrim) scrim.addEventListener("click", () => setDrawer(false));

  // Escape closes the drawer no matter where focus is; Tab is trapped inside it.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawerOpen()) setDrawer(false);
  });
  if (drawer) {
    drawer.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const items = drawerFocusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    });
  }

  /* Explore dropdown — keep aria-expanded in sync for screen readers and
     support touch-tap, keyboard focus, click-away, and Escape. */
  document.querySelectorAll(".has-dropdown").forEach((li) => {
    const t = li.querySelector(".dropdown-toggle");
    if (!t) return;
    const setOpen = (open) => {
      li.classList.toggle("open", open);
      t.setAttribute("aria-expanded", String(open));
    };
    // Touch devices toggle on tap (no hover); keep the link nav on other devices.
    t.addEventListener("click", (e) => {
      if (window.matchMedia("(hover: none)").matches) {
        e.preventDefault();
        setOpen(!li.classList.contains("open"));
      }
    });
    // Keyboard focus opens the panel (CSS :focus-within also reveals it).
    li.addEventListener("focusin", () => setOpen(true));
    li.addEventListener("focusout", (e) => {
      if (!li.contains(e.relatedTarget)) setOpen(false);
    });
    t.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { setOpen(false); t.focus(); }
    });
  });
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".has-dropdown.open").forEach((li) => {
      if (!li.contains(e.target)) {
        li.classList.remove("open");
        const t = li.querySelector(".dropdown-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  const observeReveals = (scope) =>
    (scope || document).querySelectorAll(".reveal:not(.in)").forEach((el) => revealObserver.observe(el));
  observeReveals();

  /* ---------------- Count-up stats ---------------- */
  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const formatCount = (el, v) => {
    const isFloat = String(el.dataset.count).includes(".");
    const plain = el.dataset.plain !== undefined; // years: no thousands separator
    return isFloat ? v.toFixed(2) : plain ? String(Math.round(v)) : Math.round(v).toLocaleString();
  };
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);
        el.dataset.counted = "running";
        // Respect reduced-motion: show the final value without the ticking animation.
        if (reduceMotion()) { el.textContent = formatCount(el, parseFloat(el.dataset.count)); el.dataset.counted = "done"; return; }
        const duration = 1600;
        const start = performance.now();
        const step = (now) => {
          // The first frame's timestamp can precede `start`; clamp so it never counts below 0.
          const p = Math.min(Math.max((now - start) / duration, 0), 1);
          // Read the target every frame, so chapter data arriving mid-count just retargets it.
          el.textContent = formatCount(el, parseFloat(el.dataset.count) * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
          else el.dataset.counted = "done";
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.4 }
  );
  // Each number counts once. Until it does it reads 0, so a half-visible number
  // never shows its final value and then snaps back to 0 to start counting.
  const observeCounts = (scope) =>
    (scope || document).querySelectorAll("[data-count]:not([data-counted])").forEach((el) => {
      if (!reduceMotion()) el.textContent = formatCount(el, 0);
      countObserver.observe(el);
    });
  observeCounts();

  /* ---------------- Dynamic content (data/*.json) ---------------- */
  const esc = (s) =>
    String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  const cssUrl = (s) => String(s == null ? "" : s).replace(/["'\\]/g, "");
  const resolveImg = (p) => (/^https?:\/\//.test(p || "") ? p : ROOT + (p || ""));

  async function loadData(name) {
    try {
      const res = await fetch(`${ROOT}data/${name}.json`, { cache: "no-cache" });
      if (!res.ok) throw new Error(res.statusText);
      return await res.json();
    } catch (err) {
      console.warn(`Could not load data/${name}.json`, err);
      return null;
    }
  }

  function fillSlots(data, prefix) {
    document.querySelectorAll(`[data-slot^="${prefix}."]`).forEach((el) => {
      const path = el.dataset.slot.slice(prefix.length + 1);
      const value = path.split(".").reduce((o, k) => (o == null ? o : o[k]), data);
      if (value == null) return;
      if (el.dataset.count !== undefined) {
        el.dataset.count = value;
        // Already finished counting before the data arrived: just show the value.
        // (Mid-count, the animation picks up the new target by itself.)
        if (el.dataset.counted === "done") el.textContent = formatCount(el, parseFloat(value));
      } else if (el.tagName === "A") {
        el.href = String(value).includes("@") ? `mailto:${value}` : value;
        if (!el.dataset.keepText) el.textContent = value;
      } else {
        el.textContent = value;
      }
    });
  }

  /* Chapter info: stats + contacts (any page with data-slot="chapter.*") */
  if (document.querySelector('[data-slot^="chapter."]')) {
    loadData("chapter").then((data) => {
      if (!data) return;
      fillSlots(data, "chapter");
      observeCounts();
    });
  }

  /* Instagram embeds (Journal): post URLs live in data/instagram.json */
  const igMount = document.querySelector("[data-instagram]");
  if (igMount) {
    loadData("instagram").then((data) => {
      if (!data || !Array.isArray(data.posts) || !data.posts.length) return;
      igMount.innerHTML = data.posts
        .map((url) => {
          const clean = esc(String(url).split("?")[0]);
          return `
        <blockquote class="instagram-media" data-instgrm-permalink="${clean}" data-instgrm-version="14">
          <a href="${clean}" target="_blank" rel="noopener">View this post from @authetaxi on Instagram</a>
        </blockquote>`;
        })
        .join("");
      if (window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      } else {
        const s = document.createElement("script");
        s.async = true;
        s.src = "https://www.instagram.com/embed.js";
        document.body.appendChild(s);
      }
    });
  }

  /* Exec board / member bios */
  const memberMount = document.querySelector("[data-members]");
  if (memberMount) {
    const limit = parseInt(memberMount.dataset.members, 10) || Infinity;
    loadData("members").then((data) => {
      if (!data || !data.members) return;
      memberMount.innerHTML = data.members
        .slice(0, limit)
        .map(
          (m, i) => `
        <article class="glass-card member-card reveal d${(i % 4) + 1}">
          <div class="member-photo" style="background-image:url('${cssUrl(resolveImg(m.photo))}')"></div>
          <div class="member-body">
            <h3>${esc(m.name)}</h3>
            <span class="member-role">${esc(m.role)}</span>
            ${m.major || m.hometown ? `<p class="member-meta">${esc([m.major, m.hometown].filter(Boolean).join(" · "))}</p>` : ""}
            ${m.bio ? `<p class="member-bio">${esc(m.bio)}</p>` : ""}
            ${m.email ? `<a class="member-contact" href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ""}
            ${m.phone ? `<a class="member-contact" href="sms:+1${esc(String(m.phone).replace(/\D/g, ""))}">Call or text ${esc(m.phone)}</a>` : ""}
          </div>
        </article>`
        )
        .join("");
      observeReveals(memberMount);
    });
  }

  /* Notable alumni */
  const alumniMount = document.querySelector("[data-alumni]");
  if (alumniMount) {
    loadData("alumni").then((data) => {
      if (!data || !data.alumni) return;
      alumniMount.innerHTML = data.alumni
        .map(
          (a, i) => `
        <article class="glass-card alumni-card reveal d${(i % 3) + 1}">
          <div class="alumni-photo" style="background-image:url('${cssUrl(resolveImg(a.photo))}')"></div>
          <div class="alumni-body">
            <h3>${esc(a.name)}</h3>
            <span class="member-role">${esc(a.role)}</span>
            <p>${esc(a.bio)}</p>
            ${a.link ? `<a class="card-link" href="${esc(a.link)}" target="_blank" rel="noopener">${esc(a.linkLabel || "Learn more")} <span class="arrow">&rarr;</span></a>` : ""}
          </div>
        </article>`
        )
        .join("");
      observeReveals(alumniMount);
    });
  }

  /* Journal posts */
  const journalMount = document.querySelector("[data-journal]");
  if (journalMount) {
    const limit = parseInt(journalMount.dataset.journal, 10) || Infinity;
    loadData("journal").then((data) => {
      if (!data || !data.posts) return;
      const posts = [...data.posts].sort((a, b) => new Date(b.date) - new Date(a.date));
      journalMount.innerHTML = posts
        .slice(0, limit)
        .map((p, i) => {
          const date = p.date
            ? new Date(p.date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "";
          return `
        <article class="glass-card journal-card reveal d${(i % 3) + 1}">
          ${p.cover ? `<div class="journal-cover" style="background-image:url('${cssUrl(resolveImg(p.cover))}')"></div>` : ""}
          <div class="journal-body">
            ${date ? `<span class="journal-date">${esc(date)}</span>` : ""}
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.excerpt)}</p>
            ${p.link ? `<a class="card-link" href="${esc(p.link)}" target="_blank" rel="noopener">Read more <span class="arrow">&rarr;</span></a>` : ""}
          </div>
        </article>`;
        })
        .join("");
      observeReveals(journalMount);
    });
  }

  /* Photo gallery */
  const galleryMount = document.querySelector("[data-gallery]");
  if (galleryMount) {
    const filter = galleryMount.dataset.gallery; // optional category filter
    loadData("gallery").then((data) => {
      if (!data || !data.photos) return;
      const photos = filter ? data.photos.filter((p) => p.category === filter) : data.photos;
      galleryMount.innerHTML = photos
        .map(
          (p, i) => `
        <figure class="gallery-item reveal d${(i % 4) + 1}">
          <img src="${esc(resolveImg(p.src))}" alt="${esc(p.caption || "Chapter photo")}" loading="lazy">
          ${p.caption ? `<figcaption class="gallery-caption">${esc(p.caption)}</figcaption>` : ""}
        </figure>`
        )
        .join("");
      observeReveals(galleryMount);
    });
  }

  /* ---------------- Netlify forms (rush interest, alumni updates) ----------------
     Any form with data-netlify posts back to the site; Netlify records the
     submission and emails it to the address configured in the dashboard.
     Per-form messages come from data-success / data-error attributes. */
  document.querySelectorAll("form[data-netlify]").forEach((form) => {
    const status = form.querySelector(".form-status");
    if (!status) return;
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";
      status.className = "form-status";

      const formData = new FormData(form);
      const showStatus = (ok, msg) => {
        status.className = `form-status ${ok ? "success" : "error"}`;
        // Errors announce assertively; success politely.
        status.setAttribute("role", ok ? "status" : "alert");
        status.textContent = msg;
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      };

      // Honeypot: silently "succeed" for bots
      if (formData.get("website_confirm")) {
        form.reset();
        showStatus(true, "Thank you! Your form has been submitted.");
        return;
      }

      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        if (key !== "website_confirm") params.append(key, value);
      }

      try {
        const res = await fetch("/", {
          method: "POST",
          body: params.toString(),
          headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        showStatus(true, form.dataset.success || "Thank you! Your form has been submitted.");
      } catch (err) {
        console.error("Submission error:", err);
        showStatus(false, form.dataset.error || "There was an issue submitting the form. Please try again or contact us by email.");
      }
    });
  });

  /* ---------------- Accessibility enhancements ----------------
     Runs once for static markup and again for anything injected later
     (nav/footer/cards). Idempotent — each element is flagged once. */
  function enhanceA11y(root) {
    const scope = root && root.querySelectorAll ? root : document;
    // Announce links that open a new tab (WCAG 3.2.5 / G201).
    scope.querySelectorAll('a[target="_blank"]:not([data-newtab])').forEach((a) => {
      a.setAttribute("data-newtab", "");
      const label = a.getAttribute("aria-label");
      if (label) {
        a.setAttribute("aria-label", `${label} (opens in a new tab)`);
      } else {
        a.insertAdjacentHTML("beforeend", '<span class="sr-only"> (opens in a new tab)</span>');
      }
    });
    // Hide decorative glyphs from assistive tech.
    scope.querySelectorAll(".arrow:not([aria-hidden]), .caret:not([aria-hidden])").forEach((el) => {
      el.setAttribute("aria-hidden", "true");
    });
  }
  enhanceA11y(document);
  // Catch nav/footer (injected via outerHTML) and async card grids.
  const a11yObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) enhanceA11y(node.parentNode || node);
      });
    }
  });
  a11yObserver.observe(document.body, { childList: true, subtree: true });
});
