# Website handoff: current state

**Last updated: Oct 11, 2026.** Update this file at the end of any work
session that changes what's live, what's waiting, or what's open. Dates are
US Eastern time.

## At a glance

- **Live site:** `main` at `d496d10` (published Oct 9, 2026).
- **Waiting to go live:** the commits on `claude/great-sagan-6b17gi` listed
  below. The plan is to publish them together on or after **Oct 20, 2026**,
  once Netlify credits are available again.
- **Why the wait:** the Netlify account ran out of credits on Oct 9 after 14
  separate publishes between Sept 22 and Oct 9 (11 in September, 3 in
  October). Each push to `main` is a paid "production deploy"; previews of
  other branches are free. Publish in batches from now on.
- **Reminder:** a reminder to publish is scheduled in the owner's Claude Code
  session for Oct 20, 2026, 10:00 AM Eastern (9:00 AM Central). It only
  appears inside that session.

## Waiting on the development branch (not live yet)

Compare with `git log --oneline origin/main..origin/claude/great-sagan-6b17gi`.
As of Oct 11:

| Commit | Change |
| --- | --- |
| `70fc306` | Removes the "Welcome, New Associate Members" news post. It used an alumni tailgate photo as a stand-in; there is no photo of the new member class. |
| `837e3c8` | Phone menu: the current page and hovered items are blue instead of bright orange (which failed contrast at about 2.6 to 3:1), and the menu background is a little more solid so the blue passes over dark photos. Officer email links are blue and stay blue on hover. |
| `abcec2c` | Phone menu: the current page's marker bar uses the deeper orange so it stands out (5.1:1 or better). |
| docs commit | This file, `CLAUDE.md`, corrected `README.md` and `PLAN.md`, and the stylesheet bump to 41 on every page that `837e3c8` and `abcec2c` left out, so visitors get the new menu colors. |

### Publishing checklist

1. Confirm the Netlify account has credits (Netlify dashboard → billing).
2. Check that `main` hasn't moved:
   `git log --oneline origin/claude/great-sagan-6b17gi..origin/main` should
   print nothing. If it prints commits (someone saved in `/admin`), merge
   `origin/main` into the development branch first.
3. Review the list above with the owner, then push the development branch to
   `main` once.
4. A few minutes later, check on the live site, on a phone and a laptop:
   - Social page and home page: the new-member post is gone.
   - Phone menu (☰): the current page shows in blue with an orange bar.
   - Meet the Officers: email links are blue, underline on hover.
   - Alumni page: "Past Alumni Events" still works, and "View photos" opens.
5. If a page looks unstyled or old, refresh once; the stylesheet version
   bump should handle returning visitors.
6. Update this file.

## Things only a person can do

- **Switch GitHub's default branch to `main`.** It is still
  `claude/great-sagan-6b17gi` (GitHub → repository Settings → General →
  Default branch). Netlify publishes `main` regardless, but people browsing
  the repo see the development branch first.
- **Netlify and domain ownership.** The site was copied into a new
  repository owned by the `BZATX` organization on Sept 22, 2026 (`2f2473c`;
  earlier history is in the old `theta-xi-auburn-website-archive` repo).
  Whether the Netlify site and the domain are under board-controlled
  accounts with successor access is not recorded here. The migration
  worklist is in the Drive handoff doc in Alumni Relations / Website &
  Digital Infrastructure, titled "Website Operations & Ownership Handoff,
  Current State".
- **Reunion photos in Drive.** The Board Dashboard asks for Rev's four Oct 3
  reunion photos (posted in the board Slack channel on Oct 9) to be saved in
  Drive under Alumni Relations / Alumni Events & Communications. They can't
  be uploaded through Claude's Drive connector; drag them in by hand.
- **Send one test rush form** after the next publish to confirm the email
  still arrives at `thetaxibz@gmail.com`.

## Open items and options

Not yet approved; ask the owner before doing these.

- **Form stars:** the required-field stars (\*) on the Rush and Update Info
  forms are still dark orange. They pass contrast, so changing them is only
  a matter of looks. Owner's call.
- **Screen readers and the menu:** the current page isn't announced to screen
  readers (no `aria-current="page"`). Small fix in `js/layout.js`: add it
  wherever a current-page link gets `active` (desktop menu, Explore
  dropdown, phone menu), but not on the Explore toggle, which is also marked
  `active` when a page inside it is open.
- **White menu text over top photos:** on a few pages (About, Accessibility,
  Brotherhood) the desktop menu's white text over the top photo measured
  about 4.4:1, just under 4.5:1, before you scroll. Found Oct 10; not fixed.
- **Admin panel catch-up:** `/admin` can't set a post's location, photos or
  category, and its hints mention pages that no longer exist. Its saves and
  photo uploads each go straight to `main` and use Netlify credits.
- **Old reunion photo:** the photo from the removed reunion banner (in git
  history at `acd6ccf^:assets/images/dynamic/alumni-reunion-beer-hog.jpg`)
  shows a different venue. Drive has a "2024 Birmingham Alumni Reunion"
  folder; if it's that event, it could become a second archive entry.
- **Photo sources:** see PLAN.md (several photos have no recorded source).
- **Older scan items:** about 40 lower-priority items from the Oct 1 site
  health scan were never approved. The scan lives in the owner's Claude
  account as an artifact.

## Decisions already made (don't reopen)

- Keep "72+ years". Keep the refounding references as they are; people with
  questions can ask the chapter.
- Don't mention "Auburn first" students or the "Path to the Plains".
- No mention of game results (the 2025 tailgate game was a loss).
- Brothers' campus involvement stays general ("active in organizations
  across campus"), not named groups.
- The privacy page stays general: rush and update submissions are internal
  and never sold.
- Buttons use the deep orange (`#b23909` → `#c94a08`). Small text links use
  the `--azure-text` blue. Orange stays on buttons and accents only.
- Scholarship stats on the site are correct as they are.
- Recruitment stats: 97.5% first-year retention (vs 94% for all Auburn
  students) and 82.3% four-year graduation rate, with sources cited on the
  page.
- Reunion date in the archive: Oct 3, 2026 (the banner's date; a Slack
  caption said 10/02).
- The three landing-page redesign concepts (Oct 2026) were turned down; the
  home page stays as it is.

## Recent history (Sept 22 to Oct 11, 2026)

- **Sept 22:** site moved into `BZATX/theta-xi-auburn-website` (`2f2473c`);
  Beta Zeta house-mark icons and branding (`0c716eb`).
- **Sept 22 to 23:** top-of-page photo and page "sheet" redesign; menu
  contrast, focus rings and large-text fixes; plain-language pass over all
  copy (`f1c1a8f`).
- **Sept 30:** fact corrections, form message fix (`data-ajax-submit`),
  `_redirects` for old addresses, deeper orange buttons, sourced recruitment
  stats (`8e977c5`, `d723663`).
- **Oct 9:** reunion banner removed (`acd6ccf`); Past Alumni Events archive
  and photo viewer (`931bc76`, `fe65a73`); small links changed to blue
  (`d496d10`). Netlify credits ran out.
- **Oct 9 to 11 (not live):** new-member post removed; phone menu and email
  colors; docs refresh and stylesheet v41.

## How to check work

- Local preview: `python3 -m http.server 8765` from the repo root.
- Browser tests: Playwright with Chromium at `/opt/pw-browsers/chromium`.
  Check every page at 390px and 1280px wide, light and dark mode, for console
  errors and sideways scrolling.
- Contrast: measure text against the real background behind it (hide the
  text, screenshot the area, compare against the darkest or lightest pixels).
  Check hover and current-page states too.
