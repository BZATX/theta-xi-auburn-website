/* ============================================================
   AUBURN THETA XI — site behavior + dynamic content layer
   Content lives in /data/*.json and is editable from /admin.
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const ROOT = document.body.dataset.root || "";

  /* ---------------- Photos further down the page ----------------
     Background photos below the first screen are written as data-bg="path"
     instead of an inline background-image, so they download only when the
     visitor scrolls near them and the top photo gets the connection first.
     Watching starts once the page has loaded (by then the officer, news and
     Instagram sections have filled in and pushed lower photos down), or at
     the visitor's first scroll if that comes sooner. */
  const showBg = (el) => {
    if (el.style.backgroundImage) return;
    el.style.backgroundImage = `url("${el.dataset.bg.replace(/["\\]/g, "\\$&")}")`;
  };
  const bgObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { showBg(entry.target); obs.unobserve(entry.target); }
      });
    },
    { rootMargin: "500px 0px" }
  );
  const watchBgs = () => document.querySelectorAll("[data-bg]").forEach((el) => bgObserver.observe(el));
  if (document.readyState === "complete") watchBgs();
  else {
    window.addEventListener("load", watchBgs, { once: true });
    window.addEventListener("scroll", watchBgs, { once: true, passive: true });
  }
  window.addEventListener("beforeprint", () => document.querySelectorAll("[data-bg]").forEach(showBg));

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

  const drawerOpen = () => !!drawer && drawer.classList.contains("open");
  const drawerFocusables = () =>
    drawer ? [...drawer.querySelectorAll('a[href], button:not([disabled])')] : [];
  // While the phone menu is open, the page behind it is hidden from screen
  // readers and taken out of the keyboard order.
  const pageBehind = () =>
    [document.querySelector("main"), document.querySelector(".site-footer"),
     document.querySelector(".skip-link"), document.querySelector(".to-top")].filter(Boolean);

  function setDrawer(open, { focusToggle = true } = {}) {
    if (!toggle || !drawer || !scrim || open === drawerOpen()) return;
    toggle.classList.toggle("open", open);
    drawer.classList.toggle("open", open);
    scrim.classList.toggle("show", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
    pageBehind().forEach((el) => {
      if (open) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); }
      else { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
    });
    // Keep the off-screen drawer out of the tab order / accessibility tree
    // when closed — otherwise keyboard users tab into an invisible menu.
    if (open) {
      drawer.removeAttribute("inert");
      drawer.removeAttribute("aria-hidden");
      // Move focus to the first link in the menu now, and check again once
      // the tap or click that opened it has finished.
      const focusFirst = () => {
        const first = drawerFocusables()[0];
        if (drawerOpen() && first && !drawer.contains(document.activeElement)) first.focus({ preventScroll: true });
      };
      focusFirst();
      setTimeout(focusFirst, 60);
    } else {
      const focusWasInside = drawer.contains(document.activeElement);
      drawer.setAttribute("inert", "");
      drawer.setAttribute("aria-hidden", "true");
      // Focus goes back to the menu button. When the window has just widened
      // to desktop size the button is hidden, so focus is simply released.
      if (focusToggle) toggle.focus();
      else if (focusWasInside) document.activeElement.blur();
    }
    onScroll();
  }
  if (toggle) toggle.addEventListener("click", () => setDrawer(!drawerOpen()));
  if (scrim) scrim.addEventListener("click", () => setDrawer(false));

  // Escape closes the drawer no matter where focus is. Tab and Shift+Tab loop
  // through the close (X) button and the links in the drawer.
  document.addEventListener("keydown", (e) => {
    if (!drawerOpen()) return;
    if (e.key === "Escape") { setDrawer(false); return; }
    if (e.key !== "Tab") return;
    const items = [toggle, ...drawerFocusables()];
    const first = items[0];
    const last = items[items.length - 1];
    const at = items.indexOf(document.activeElement);
    if (at === -1) {
      e.preventDefault(); (e.shiftKey ? last : first).focus();
    } else if (e.shiftKey && at === 0) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && at === items.length - 1) {
      e.preventDefault(); first.focus();
    }
  });

  // Close the phone menu when the window widens to the desktop menu (a tablet
  // turned sideways, a browser window resized). Same breakpoint as css/main.css.
  const phoneMenu = window.matchMedia("(max-width: 64em)");
  const onMenuBreakpoint = () => { if (!phoneMenu.matches) setDrawer(false, { focusToggle: false }); };
  if (phoneMenu.addEventListener) phoneMenu.addEventListener("change", onMenuBreakpoint);
  else if (phoneMenu.addListener) phoneMenu.addListener(onMenuBreakpoint);

  /* Explore dropdown. Only the "open" class shows it (no CSS hover), so
     aria-expanded always matches what is on screen.
     Mouse: opens on hover and closes when the pointer leaves; clicking
     Explore goes to About Us. Touch and pen: a tap opens it and a second tap
     closes it. Keyboard: opens when focus moves into it. Escape closes it
     from anywhere inside and puts focus back on Explore. */
  document.querySelectorAll(".has-dropdown").forEach((li) => {
    const t = li.querySelector(".dropdown-toggle");
    if (!t) return;
    let pointerAt = 0;   // last press inside the menu (any pointer)
    let touchAt = 0;     // last press by finger or pen
    let closeTimer = null;
    let quietFocus = false; // focus moved back to Explore by Escape: don't reopen
    const isOpen = () => li.classList.contains("open");
    const setOpen = (open) => {
      clearTimeout(closeTimer);
      li.classList.toggle("open", open);
      t.setAttribute("aria-expanded", String(open));
    };
    const keyboardFocusInside = () => {
      try { return !!li.querySelector(":focus-visible"); } catch (err) { return li.contains(document.activeElement); }
    };
    li.addEventListener("pointerdown", (e) => {
      pointerAt = Date.now();
      if (e.pointerType !== "mouse") touchAt = pointerAt;
    });
    li.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") setOpen(true); });
    li.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse" || keyboardFocusInside()) return;
      clearTimeout(closeTimer);
      // A short pause, so the pointer can cross the gap between Explore and the panel.
      closeTimer = setTimeout(() => setOpen(false), 200);
    });
    t.addEventListener("click", (e) => {
      const tapped = Date.now() - touchAt < 1000 || window.matchMedia("(hover: none)").matches;
      if (!tapped) return; // mouse click or Enter: follow the link to About Us
      e.preventDefault();
      setOpen(!isOpen());
    });
    // Keyboard focus opens the panel; a click or tap is handled above.
    li.addEventListener("focusin", () => {
      if (!quietFocus && Date.now() - pointerAt > 1000) setOpen(true);
    });
    li.addEventListener("focusout", (e) => {
      if (li.contains(e.relatedTarget)) return;
      let hovered = false;
      try { hovered = li.matches(":hover") && !window.matchMedia("(hover: none)").matches; } catch (err) { /* old browser */ }
      if (!hovered) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !isOpen()) return;
      const focusInside = li.contains(document.activeElement);
      quietFocus = true;
      setOpen(false);
      if (focusInside) t.focus();
      quietFocus = false;
    });
    document.addEventListener("click", (e) => {
      if (isOpen() && !li.contains(e.target)) setOpen(false);
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
  // Screen readers and printouts get the real number from the start: it sits in
  // a hidden copy just before the counter, and the counting copy is hidden from
  // screen readers (css/main.css prints the real copy instead of the counter).
  const setFinalCopy = (el) => {
    let copy = el.previousElementSibling;
    if (!copy || !copy.classList.contains("count-final")) {
      copy = document.createElement("span");
      copy.className = "sr-only count-final";
      el.before(copy);
      el.setAttribute("aria-hidden", "true");
    }
    copy.textContent = formatCount(el, parseFloat(el.dataset.count));
  };
  // Each number counts once. Until it does it reads 0, so a half-visible number
  // never shows its final value and then snaps back to 0 to start counting.
  const observeCounts = (scope) =>
    (scope || document).querySelectorAll("[data-count]:not([data-counted])").forEach((el) => {
      setFinalCopy(el);
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
        setFinalCopy(el);
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
  // "Call or text (913) 300-1872" with separate Call (dialer) and Text
  // (Messages) links. US numbers; a leading 1 is accepted but not required.
  const phoneLinks = (phone) => {
    const digits = String(phone).replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "");
    const num = esc(phone);
    return `<p class="member-contact member-phone"><a href="tel:+1${digits}" aria-label="Call ${num}">Call</a> or <a href="sms:+1${digits}" aria-label="Text ${num}">text</a> <span style="white-space:nowrap">${num}</span></p>`;
  };
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
            ${m.phone ? phoneLinks(m.phone) : ""}
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

  /* Photo gallery. A photo with a caption gets empty alt text: the caption
     describes it, and screen readers would otherwise read it twice. */
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
          <img src="${esc(resolveImg(p.src))}" alt="${p.caption ? "" : "Chapter photo"}" loading="lazy">
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
     hook.) Per-form messages come from data-success / data-error attributes.
     The .form-status box is one polite live region (role="status") that stays
     in the page, empty until a message arrives, so screen readers announce
     both the thank-you and the error message. */
  document.querySelectorAll("form[data-ajax-submit]").forEach((form) => {
    const status = form.querySelector(".form-status");
    if (!status) return;

    // A field with a pattern can carry a plain-English message
    // (data-invalid-msg) that replaces the browser's generic one.
    form.querySelectorAll("[data-invalid-msg]").forEach((field) => {
      const check = () => field.setCustomValidity(field.validity.patternMismatch ? field.dataset.invalidMsg : "");
      field.addEventListener("input", check);
      check();
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting…";
      status.className = "form-status";
      status.textContent = "";

      const formData = new FormData(form);
      const showStatus = (ok, msg) => {
        status.className = `form-status ${ok ? "success" : "error"}`;
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
