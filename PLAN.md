# Theta Xi Auburn Website — Living Plan

This document tracks completed work and future tasks for the Beta Zeta chapter
website. It serves as a unified roadmap for both webmasters to coordinate on.

## 2026 Redesign (glassmorphism rebuild)
- [x] Full visual redesign: hero → audience cards (Students / Parents /
      Alumni) → stats → Explore pages → Journal.
- [x] Light & airy glassmorphism design system in `css/main.css` — white,
      silver, and Theta Xi azure with navy photo overlays/footer and Auburn
      orange actions (frosted nav, glass cards, blended gradient sections,
      scroll reveals, count-up stats, reduced-motion support).
- [x] Square favicon + apple-touch-icon generated from the crest.
- [x] Navigation: Home · Explore ▾ (About, Why Theta Xi, History,
      Philanthropy, Brotherhood, Parents, Alumni) · Members · Journal · Donate ·
      Join CTA — with a sliding glass drawer on mobile.
- [x] Shared navbar/footer extracted to `js/layout.js` so every page stays in sync.
- [x] All 12 legacy pages carried over and restyled; new `why-theta-xi.html`
      page added.
- [x] OpenGraph tags on every page for rich link previews in iMessage/GroupMe.

## Backend / chapter self-service (done)
- [x] Content moved to `data/*.json`: exec board bios, notable alumni, journal
      posts, photo gallery, chapter stats & contacts.
- [x] `/admin` chapter panel: GitHub-token login, edit/add/reorder/delete
      entries, upload photos (auto-resized to 1600px JPEG), one-click
      "Save & Publish" that commits to this repo and triggers a redeploy.
- [x] **Decision:** content updates flow through the alumni board — the
      chapter sends headshots/bios/photos to the board, and a board member
      applies them via a Claude Code session (workflow documented in README).
      Undergrads are not repo collaborators; the `/admin` panel remains as a
      board-only backup editor.
- [ ] Add officer bios (plus majors/hometowns) to `data/members.json` —
      photos and roles are already live; the chapter owes bios by
      **June 15, 2026 at 5:00 PM**.

## Functionality & content
- [x] **Alumni "Update Your Info":** on-site Netlify form
      (`pages/update-info.html`) replacing the legacy personal-account
      Google Form. Email notification to `betazetatxalumni@gmail.com`
      configured in Netlify (June 2026). Remaining: paste the v3.3
      instruction block (Drive runbook) into the recurring Claude task.
- [x] **Rush form (Netlify Forms):** wired up and live — form detection
      enabled and email notification for `rush-interest` submissions to
      `thetaxibz@gmail.com` configured in Netlify (June 2026).
- [ ] **History polish:** add historical chapter photos, vintage t-shirts, and
      old composites to `history.html` / the gallery.
- [ ] **Brotherhood galleries:** photograph and upload event categories via the
      admin panel — parties/formals, outdoors trips, intramurals, swaps.
- [x] **Real campus photos:** replaced the four AI-generated "Auburn b-roll"
      images with public-domain Library of Congress photographs (Carol M.
      Highsmith) of Samford Hall, Hargis Hall, Toomer's Corner, and the
      campus eagle statue. Credits in README.
- [ ] **Real photos (philanthropy):** the MS Society and Habitat images are
      still AI-generated; replace with real event photography when available.

## Pro-level enhancements (future)
- [ ] Motion: drone shot or video loop for the homepage hero background.
- [ ] Google Calendar embed for rush dates, philanthropy events, and tailgates.
- [x] Instagram on the Journal page: official free post embeds, no widget
      vendor. Board-picked posts live in `data/instagram.json`; refresh
      biannually (or as needed) by swapping the URLs.
- [ ] Google Analytics 4 to monitor traffic during rush week.
- [ ] Brotherhood testimonial carousel (quotes from alumni and recent grads).
