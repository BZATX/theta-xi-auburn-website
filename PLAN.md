# Theta Xi Auburn Website: Plan

Completed work and future ideas for the Beta Zeta chapter website. For the
current state, what's waiting to go live, and short-term to-dos, see
[`HANDOFF.md`](HANDOFF.md).

## 2026 redesign (done)

- [x] Full visual redesign. Home page: top photo → stats → audience cards
      (Incoming Students / Parents / Alumni) → A Home For All True Men →
      four pillars → purpose quote → Meet the Officers (4) → News From the
      Chapter (3) → Instagram → map → call to action.
- [x] Light glass design system in `css/main.css`: white, silver and Theta Xi
      azure with navy photo overlays and footer, Auburn orange buttons,
      rounded page "sheet" over the top photo, scroll reveals, count-up
      stats, reduced-motion support and automatic dark mode.
- [x] Navigation: Home · Explore ▾ (About Us, Why Theta Xi, Recruitment,
      Meet the Officers, Our History, Philanthropy, Brotherhood, For
      Parents) · Scholarships · Social · Alumni · Donate · Rush button ·
      Instagram. On phones it's a sliding menu with Explore and Chapter
      groups.
- [x] Shared navbar and footer in `js/layout.js`, so every page stays in sync.
- [x] Legacy pages carried over and restyled; `why-theta-xi.html` added.
      Later, the rush form moved from `join.html` to `recruitment.html`, and
      the Service page was folded into `philanthropy.html`; `_redirects`
      forwards the old addresses.
- [x] Link previews (OpenGraph tags) on every page.
- [x] Beta Zeta house-mark branding (Sept 2026): browser-tab and home-screen
      icons, web manifest, link-preview image, footer seal, Donate wordmark,
      Parents address card. The old crest icons in
      `assets/images/system/` are no longer used.

## Content workflow (done)

- [x] Content moved to `data/*.json`: officers, notable alumni, news posts,
      photo gallery, home stats, Instagram picks.
- [x] `/admin` browser editor with GitHub-token login (Sept 2026). Retired
      in Oct 2026: the site is managed by Ben Waters and Shaun through AI
      coding assistants and GitHub.
- [x] **Decision:** content updates go through the alumni board. The chapter
      sends headshots, bios and photos to the board, and a board member
      applies them with an AI coding assistant (see README). Undergraduates
      are not repo collaborators.
- [x] Site copied into a new repository owned by the `BZATX` GitHub
      organization (Sept 22, 2026). Earlier history is in the old
      `theta-xi-auburn-website-archive` repository.
- [x] Officer bios, majors and hometowns in `data/members.json` for all 7
      officers (photos in `assets/images/portraits/officers-2026/`).

## Functionality and content

- [x] **Alumni "Update Your Info":** on-site Netlify form
      (`pages/update-info.html`, form `alumni-update`) replacing the old
      Google Form. Emails go to `betazetatxalumni@gmail.com`, where the
      board's Alumni Inbox Monitor automation processes them (runbook in
      Drive).
- [x] **Rush form:** Netlify form `rush-interest`, with email notifications
      to `thetaxibz@gmail.com`.
- [x] **Form messages fixed** (Sept 30, 2026): the thank-you and error messages
      now work on the published site (`data-ajax-submit`).
- [x] **Real photos:** Taxi Bash 2025 and Habitat build-day photos on the
      Philanthropy page; Library of Congress photo of Hargis Hall.
- [x] **Plain-language pass** (Sept 2026): removed AI-sounding copy and
      claims the site couldn't support.
- [x] **Fact corrections** (Sept 30, 2026): James Voss spacewalk record, Jimmy
      Rane's title, recruitment timing, and sourced retention and
      graduation stats on the Recruitment page.
- [x] **Accessible colors** (Sept 30 to Oct 9, 2026): deeper orange
      buttons; small text links changed from dark orange to brand blue
      (measured 4.74:1 or better in light mode, 5.32:1 in dark). The phone
      menu colors went live Oct 21; see HANDOFF.md for what's still open.
- [x] **Alumni event archive** (Oct 2026): "Past Alumni Events" on the
      Alumni page with a full-screen photo viewer; news posts can carry a
      photo set.
- [x] **Instagram:** Instagram's own free post embeds on the Social and
      Brotherhood pages; picks live in `data/instagram.json`. Refresh twice a
      year.
- [ ] **History:** add historical chapter photos, vintage shirts and old
      composites to the History page.
- [ ] **Brotherhood gallery:** collect event photos (formals, trips,
      intramurals, swaps) in the Drive "Website Pictures" folder and add them
      to `data/gallery.json`. Separate galleries per event type would need a
      small code change.
- [ ] **Photo sources:** confirm where `auburn-sign.jpg`,
      `jordan-hare-stadium.jpg`, `jordan-hare-dusk.jpg`, the alumni
      portraits, the Founding Fathers composite (`dynamic/FoundingFathers.jpg`),
      the house rendering and the employer logos came from, then credit or
      replace them.

## Possible future additions

- [ ] Video loop or drone shot behind the home page's top photo.
- [ ] Google Calendar embed for rush dates, philanthropy events and
      tailgates.
- [ ] Visitor analytics during rush week.
- [ ] Brotherhood testimonials (quotes from alumni and recent grads).
- [ ] Show `chapter.json`'s contact fields on the site, or remove them, so
      there's one place to change contact details.
