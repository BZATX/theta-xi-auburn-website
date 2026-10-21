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
    const decimals = (String(el.dataset.count).split(".")[1] || "").length; // 3.31 -> 2, 97.5 -> 1
    const plain = el.dataset.plain !== undefined; // years: no thousands separator
    return decimals ? v.toFixed(decimals) : plain ? String(Math.round(v)) : Math.round(v).toLocaleString();
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
  // Photo paths go inside CSS url('…'). Percent-encode the characters that would
  // end the string or the url() (quotes, brackets, backslash, spaces) rather than
  // dropping them, so a file name like "o'neill.jpg" still loads.
  const cssUrl = (s) =>
    String(s == null ? "" : s)
      .replace(/%(?![0-9a-f]{2})/gi, "%25")
      .replace(/["'()\\\s]/g, (c) => ({ "'": "%27", "(": "%28", ")": "%29" })[c] || encodeURIComponent(c));
  // Repo-relative paths ("assets/images/…") get the page's ROOT; full addresses
  // and site-absolute paths ("/assets/…") are used as typed.
  const resolveImg = (p) => (/^(?:[a-z][a-z0-9+.-]*:|\/)/i.test(p || "") ? p : ROOT + (p || ""));
  // style="…" for a card's photo box, or nothing when there's no photo, so the
  // box shows its plain placeholder tint instead of loading the page as an image.
  const bgImage = (p) => {
    const path = String(p == null ? "" : p).trim();
    return path ? ` style="background-image:url('${esc(cssUrl(resolveImg(path)))}')"` : "";
  };

  /* Links typed into the JSON (or the /admin editor) are cleaned up before use:
     "www.example.com" or "example.com/page" gets https://, an email address gets
     mailto:, a site page such as "update-info.html" or "pages/donate.html" works
     from every page, and only links to other sites open in a new tab. Any other
     scheme (javascript: and the like) is dropped. */
  function cleanLink(raw) {
    let href = String(raw == null ? "" : raw).trim();
    if (!href) return null;
    const host = href.split(/[/?#]/)[0];
    if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?$/i.test(host) && !/\.(html?|pdf|jpe?g|png|gif|webp|svg|json|txt)$/i.test(host)) {
      href = "https://" + href; // a bare domain, e.g. www.linkedin.com/in/…
    } else if (href.startsWith("//")) {
      href = "https:" + href;
    } else if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      if (/^(mailto|tel|sms):/i.test(href)) return { href, newTab: false };
      if (!/^https?:/i.test(href)) return null;
    } else if (/^[^\s@/]+@[^\s@/]+\.[a-z]{2,}$/i.test(href)) {
      return { href: "mailto:" + href, newTab: false };
    } else {
      // One of the site's own pages or files. A bare "name.html" is a page in
      // pages/; other paths are repo-relative, like photo paths.
      if (!/^(\/|#|\?|\.\.?\/)/.test(href)) {
        const path = href.split(/[?#]/)[0];
        const inPages = !path.includes("/") && /\.html?$/i.test(path) && !/^(index|404)\.html?$/i.test(path);
        href = ROOT + (inPages ? "pages/" : "") + href;
      }
      return { href, newTab: false };
    }
    let url;
    try { url = new URL(href); } catch (e) { return null; }
    const site = (h) => h.toLowerCase().replace(/^www\./, "");
    return { href: url.href, newTab: site(url.hostname) !== site(location.hostname) };
  }
  // <a> for a cleaned link (inner is already-escaped HTML), or "" when there's no usable link.
  const linkHtml = (raw, cls, inner) => {
    const link = cleanLink(raw);
    if (!link) return "";
    return `<a class="${cls}" href="${esc(link.href)}"${link.newTab ? ' target="_blank" rel="noopener"' : ""}>${inner}</a>`;
  };

  /* When a data file can't load, say so where its cards would go instead of
     leaving a blank space under the heading. */
  const mailLink = (addr) => `<a class="text-link" href="mailto:${esc(addr)}">${esc(addr)}</a>`;
  const showLoadError = (mount, message) => {
    mount.innerHTML = `<p class="load-error">${message}</p>`;
  };

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
      if (!data || !Array.isArray(data.posts)) {
        showLoadError(igMount, `The Instagram posts couldn't load. Please refresh the page, or see them at <a class="text-link" href="https://www.instagram.com/authetaxi/" target="_blank" rel="noopener">@authetaxi</a>.`);
        return;
      }
      if (!data.posts.length) return;
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
      if (!data || !Array.isArray(data.members)) {
        showLoadError(memberMount, `The officer list couldn't load. Please refresh the page, or email ${mailLink("thetaxibz@gmail.com")}.`);
        return;
      }
      memberMount.innerHTML = data.members
        .slice(0, limit)
        .map(
          (m, i) => `
        <article class="glass-card member-card reveal d${(i % 4) + 1}">
          <div class="member-photo"${bgImage(m.photo)}></div>
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
      if (!data || !Array.isArray(data.alumni)) {
        showLoadError(alumniMount, `The alumni list couldn't load. Please refresh the page, or email ${mailLink("betazetatxalumni@gmail.com")}.`);
        return;
      }
      alumniMount.innerHTML = data.alumni
        .map(
          (a, i) => `
        <article class="glass-card alumni-card reveal d${(i % 3) + 1}">
          <div class="alumni-photo"${bgImage(a.photo)}></div>
          <div class="alumni-body">
            <h3>${esc(a.name)}</h3>
            <span class="member-role">${esc(a.role)}</span>
            <p>${esc(a.bio)}</p>
            ${linkHtml(a.link, "card-link", `${esc(a.linkLabel || "Learn more")} <span class="arrow">&rarr;</span>`)}
          </div>
        </article>`
        )
        .join("");
      observeReveals(alumniMount);
    });
  }

  /* Journal posts. data-journal="3" limits the count; data-journal-category="alumni"
     shows only posts with that category (the Alumni page's event archive). */
  document.querySelectorAll("[data-journal]").forEach((journalMount) => {
    const limit = parseInt(journalMount.dataset.journal, 10) || Infinity;
    const category = journalMount.dataset.journalCategory;
    const section = journalMount.closest("[data-hide-if-empty]");
    loadData("journal").then((data) => {
      if (!data || !Array.isArray(data.posts)) {
        // The Alumni page's archive section just hides; elsewhere, say what happened.
        if (section) section.hidden = true;
        else showLoadError(journalMount, `The latest news couldn't load. Please refresh the page, or email ${mailLink("thetaxibz@gmail.com")}.`);
        return;
      }
      const posts = [...data.posts]
        .filter((p) => !category || p.category === category)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
      journalMount.innerHTML = posts
        .map((p, i) => {
          const date = p.date
            ? new Date(p.date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "";
          const photos = Array.isArray(p.photos) ? p.photos.filter(Boolean) : [];
          const cover = bgImage(p.cover);
          return `
        <article class="glass-card journal-card reveal d${(i % 3) + 1}">
          ${cover ? `<div class="journal-cover${photos.length ? " has-photos" : ""}"${cover}></div>` : ""}
          <div class="journal-body">
            ${date ? `<span class="journal-date">${esc(date)}</span>` : ""}
            <h3>${esc(p.title)}</h3>
            ${p.location ? `<span class="journal-place">${esc(p.location)}</span>` : ""}
            <p>${esc(p.excerpt)}</p>
            ${photos.length ? `<button type="button" class="card-link journal-photos-btn" data-post="${i}">View photos (${photos.length}) <span class="arrow">&rarr;</span></button>` : ""}
            ${linkHtml(p.link, "card-link", `Read more <span class="arrow">&rarr;</span>`)}
          </div>
        </article>`;
        })
        .join("");
      journalMount.querySelectorAll(".journal-card").forEach((card, i) => {
        const btn = card.querySelector(".journal-photos-btn");
        if (!btn) return;
        const post = posts[i];
        const open = () => openLightbox(post.photos.filter(Boolean), post.title, btn);
        btn.addEventListener("click", open);
        card.querySelector(".journal-cover")?.addEventListener("click", open);
      });
      if (!posts.length && section) section.hidden = true;
      observeReveals(journalMount);
    });
  });

  /* Photo viewer for journal posts with a "photos" list. Built on <dialog>, which
     handles focus and Escape; arrow keys and swipes move between photos. */
  let lightbox;
  function openLightbox(photos, title, opener) {
    if (!photos.length) return;
    if (!lightbox) {
      lightbox = document.createElement("dialog");
      lightbox.className = "lightbox";
      lightbox.innerHTML = `
        <button type="button" class="lightbox-btn lightbox-close" aria-label="Close photos">&times;</button>
        <figure class="lightbox-figure">
          <img class="lightbox-img" alt="">
          <figcaption class="lightbox-caption"><span class="lightbox-title"></span> <span class="lightbox-count" aria-live="polite"></span></figcaption>
        </figure>
        <button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous photo">&lsaquo;</button>
        <button type="button" class="lightbox-btn lightbox-next" aria-label="Next photo">&rsaquo;</button>`;
      document.body.appendChild(lightbox);
      const lb = lightbox;
      lb.querySelector(".lightbox-close").addEventListener("click", () => lb.close());
      lb.querySelector(".lightbox-prev").addEventListener("click", () => lb._show(lb._index - 1));
      lb.querySelector(".lightbox-next").addEventListener("click", () => lb._show(lb._index + 1));
      // Clicking the dark area around the photo closes it.
      lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lightbox-figure")) lb.close(); });
      lb.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { e.preventDefault(); lb._show(lb._index - 1); }
        if (e.key === "ArrowRight") { e.preventDefault(); lb._show(lb._index + 1); }
      });
      // Swipe = one finger, mostly sideways, page not zoomed (so pinching and
      // panning around a zoomed photo don't change it).
      let touchX = null, touchY = null;
      const zoomed = () => window.visualViewport && window.visualViewport.scale > 1.01;
      lb.addEventListener("touchstart", (e) => {
        if (e.touches.length > 1 || zoomed()) { touchX = null; return; }
        touchX = e.touches[0].clientX;
        touchY = e.touches[0].clientY;
      }, { passive: true });
      lb.addEventListener("touchend", (e) => {
        if (touchX == null || e.touches.length) { touchX = null; return; }
        const dx = e.changedTouches[0].clientX - touchX;
        const dy = e.changedTouches[0].clientY - touchY;
        touchX = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) lb._show(lb._index + (dx < 0 ? 1 : -1));
      });
      lb.addEventListener("touchcancel", () => { touchX = null; });
      // Hide the old photo while the next one loads, so the count never sits under the wrong picture.
      const lbImg = lb.querySelector(".lightbox-img");
      const reveal = () => { lbImg.style.visibility = ""; };
      lbImg.addEventListener("load", reveal);
      lbImg.addEventListener("error", reveal);
      lb.addEventListener("close", () => {
        document.documentElement.classList.remove("lightbox-open");
        if (lb._opener && document.contains(lb._opener)) lb._opener.focus();
      });
    }
    const lb = lightbox;
    const img = lb.querySelector(".lightbox-img");
    const many = photos.length > 1;
    lb.querySelector(".lightbox-prev").hidden = !many;
    lb.querySelector(".lightbox-next").hidden = !many;
    lb.querySelector(".lightbox-title").textContent = title || "";
    lb.setAttribute("aria-label", `${title || "Event"} photos`);
    lb._opener = opener;
    lb._show = (n) => {
      lb._index = (n + photos.length) % photos.length;
      img.src = resolveImg(photos[lb._index]);
      img.style.visibility = img.complete ? "" : "hidden";
      img.alt = `${title ? title + ", " : ""}photo ${lb._index + 1} of ${photos.length}`;
      lb.querySelector(".lightbox-count").textContent = many ? `${lb._index + 1} / ${photos.length}` : "";
      if (many) { // preload the photos on either side
        new Image().src = resolveImg(photos[(lb._index + 1) % photos.length]);
        new Image().src = resolveImg(photos[(lb._index - 1 + photos.length) % photos.length]);
      }
    };
    lb._show(0);
    lb.showModal();
    document.documentElement.classList.add("lightbox-open");
  }

  /* Photo gallery */
  const galleryMount = document.querySelector("[data-gallery]");
  if (galleryMount) {
    const filter = galleryMount.dataset.gallery; // optional category filter
    loadData("gallery").then((data) => {
      if (!data || !Array.isArray(data.photos)) {
        showLoadError(galleryMount, `These photos couldn't load. Please refresh the page, or email ${mailLink("thetaxibz@gmail.com")}.`);
        return;
      }
      // Skip entries with no photo file (they'd load the page itself as an image).
      const photos = data.photos.filter((p) => p && String(p.src || "").trim() && (!filter || p.category === filter));
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
     Forms marked data-ajax-submit post back to the site; Netlify records the
     submission and emails it to the address configured in the dashboard.
     (Netlify strips data-netlify from the published HTML, so it can't be the
     hook.) Per-form messages come from data-success / data-error attributes. */
  document.querySelectorAll("form[data-ajax-submit]").forEach((form) => {
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
