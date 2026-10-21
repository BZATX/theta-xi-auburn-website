# Website handoff: current state

**Last updated: Oct 21, 2026.** Update this file at the end of any work
session that changes what's live, what's waiting, or what's open. Dates are
US Eastern time. Rules for any AI tool working here are in `AGENTS.md`.

## At a glance

- **Backlog fixes pushed to `main` on Oct 21 (evening).** The owner asked
  for all 32 open items in `BACKLOG.md` to be fixed and said "push to main"
  after reviewing screenshots. 30 are fixed (see "Last publish" below); #26
  still needs the board (see `BACKLOG.md`). The owner still needs to confirm
  the live pages and that Netlify published the deploy.
- **Who manages the site:** Ben Waters (Alumni Relations governor) and Shaun,
  through AI coding assistants and GitHub. The `/admin` browser editor was
  decommissioned in Oct 2026 (owner, Oct 21), and its files were removed
  from the site in a third publish that evening.
- **Live site:** the backlog batch, pushed Oct 21, 2026 (`main` at the
  commit that adds this note; the batch runs from `5fe60c9`). Later
  commits on `main` that only change docs should carry `[skip netlify]`, so
  they don't publish anything or use credits.
- **Branches:** Netlify's production branch is `main`, and since Oct 21
  GitHub's default branch is `main` too. Claude's working branch is
  `claude/great-sagan-6b17gi`; other tools use their own (`cursor/…`,
  `grok/…`). Only one tool works on the site at a time.
- **Waiting to go live:** nothing. The last publish (Oct 21, evening)
  removed the retired `/admin` page (`admin/` folder, its `_headers` rules
  and the `robots.txt` note); the owner should confirm that `/admin` now
  shows "Page not found".
- **Netlify credits:** the account ran out on Oct 9 after 14 separate
  publishes between Sept 22 and Oct 9. An Oct 20 push (`43ba463`) was
  skipped by Netlify because the credits hadn't reset; they reset sometime
  between 7 PM Oct 20 and 8:42 AM Oct 21, and a second push on Oct 21
  published. Each push to `main` that changes the site is a paid
  "production deploy"; previews of other branches are free. Publish in
  batches. If a deploy is skipped, check credits first, then use Netlify →
  Deploys → Trigger deploy → Deploy site rather than pushing again.
- **Live checks:** Claude's cloud sessions can't reach auburnthetaxi.com, so
  the owner checks the live pages after a publish.

## Last publish: backlog batch (Oct 21, 2026, evening)

`BACKLOG.md` → "Fixed and published" lists each item. In short: faster
photo loading and smaller images; print settings; Windows High Contrast,
keyboard, screen-reader and large-text fixes; menus that open and close
reliably; separate Call and Text links; no-JavaScript menu, footer and
photos; "couldn't load" notes when a data file fails; form autofill and GPA
checks; darker example text in form fields (4.5:1); page titles,
descriptions and link previews; a content security policy (test mode on
public pages); and many fixes to the `/admin` editor, which was retired
soon after (see below).

Versions: `main.css?v=42` on every page. The next change to `css/main.css`
needs 43.

Testing: three rounds of independent checks before publishing (every page at
320 to 1280px, light and dark, JavaScript off, print, large text, keyboard,
the admin editor against a mock of GitHub, and contrast measurements). Most
problems they found were fixed and re-checked; the few small ones left are
"Still" notes in `BACKLOG.md` (#13, #17, #19).

Still to do now that it's pushed:
- The owner checks that Netlify published it (Deploys list) and looks at
  Home, Recruitment, Meet the Officers and Donate on a phone and a laptop.
- Security policy (#30): someone opens the Social and Brotherhood pages in a
  desktop browser with the developer console open and looks for "Content
  Security Policy" warnings. If there are none, the public policy can be
  switched from test mode to enforced in `_headers` (a small change for the
  next batch).
- Board task that came out of this batch: #26, the photo credit, in
  `BACKLOG.md` under "Waiting on the owner or board".

## Previous publish (Oct 21, 2026, morning)

`main` moved from `d496d10` (Oct 9) to `d0ff607`. The site changes:

| Commit | Change |
| --- | --- |
| `70fc306` | Removes the "Welcome, New Associate Members" news post. It used an alumni tailgate photo as a stand-in; there is no photo of the new member class. |
| `837e3c8` | Phone menu: the current page and hovered items are blue instead of bright orange (which failed contrast at about 2.6 to 3:1), and the menu background is a little more solid so the blue passes over dark photos. Officer email links are blue and stay blue on hover. |
| `abcec2c` | Phone menu: the current page's marker bar uses the deeper orange so it stands out (5.1:1 or better). |
| `43ba463` | This file, `CLAUDE.md` (now `AGENTS.md`), corrected `README.md` and `PLAN.md`, and the stylesheet bump to 41 on every page that `837e3c8` and `abcec2c` left out, so visitors get the new menu colors. |

## Publishing checklist

1. Confirm the Netlify account has credits (Netlify dashboard → billing).
2. Check that `main` hasn't moved:
   `git log --oneline origin/<your-branch>..origin/main` should print
   nothing. If it prints commits (another tool or person published), merge
   `origin/main` into your branch first.
3. Review what's waiting with the owner
   (`git log --oneline origin/main..origin/<your-branch>`), then push your
   branch to `main` once, after the owner says "push to main".
4. A few minutes later, the owner checks the changed pages on the live
   site, on a phone and a laptop. If a deploy shows "skipped" in Netlify,
   see the credits note above.
5. If a page looks unstyled or old, refresh once; the stylesheet version
   bump should handle returning visitors.
6. Update this file.

## Things only a person can do

- **Netlify and domain ownership.** The site was copied into a new
  repository owned by the `BZATX` organization on Sept 22, 2026 (`2f2473c`;
  earlier history is in the old `theta-xi-auburn-website-archive` repo,
  which is private and doesn't affect the site). Whether the Netlify site
  and the domain are under board-controlled accounts with successor access
  is not recorded here. The migration worklist is in the Drive handoff doc
  in Alumni Relations / Website & Digital Infrastructure, titled "Website
  Operations & Ownership Handoff, Current State".
- **Reunion photos in Drive.** The Board Dashboard asks for Rev's four Oct 3
  reunion photos (posted in the board Slack channel on Oct 9) to be saved in
  Drive under Alumni Relations / Alumni Events & Communications. They can't
  be uploaded through Claude's Drive connector; drag them in by hand.
- Done Oct 21: GitHub's default branch switched to `main`. The owner
  cancelled the planned test rush form.

## Open items and options

Not yet approved; ask the owner before doing these.

- **Form stars:** the required-field stars (\*) on the Rush and Update Info
  forms are still dark orange. They pass contrast, so changing them is only
  a matter of looks. Owner's call.
- **White menu text over top photos:** on a few pages (About, Accessibility,
  Brotherhood) the desktop menu's white text over the top photo measured
  about 4.4:1, just under 4.5:1, before you scroll. Found Oct 10; not fixed.
- **Old reunion photo:** the photo from the removed reunion banner (in git
  history at `acd6ccf^:assets/images/dynamic/alumni-reunion-beer-hog.jpg`)
  shows a different venue. Drive has a "2024 Birmingham Alumni Reunion"
  folder; if it's that event, it could become a second archive entry.
- **Photo sources:** see PLAN.md (several photos have no recorded source).
- **Older scan items:** the rest of the Oct 1 site scan (partly done items
  and ones waiting on the owner or board) is in `BACKLOG.md`. Those aren't
  approved.

## Decisions already made (don't reopen)

- The `/admin` browser editor is decommissioned (Oct 21, 2026). The site is
  managed by Ben Waters and Shaun through AI coding assistants and GitHub.
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

## Recent history (Sept 22 to Oct 21, 2026)

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
- **Oct 9 to 11:** new-member post removed; phone menu and email colors;
  docs refresh and stylesheet v41. Published Oct 21 (the Oct 20 push was
  skipped by Netlify while credits were out).
- **Oct 21:** GitHub default branch set to `main`; `CLAUDE.md` became
  `AGENTS.md` for any AI tool; `BACKLOG.md` added from the Oct 1 scan. The
  owner asked for all 32 open backlog items to be fixed; 30 fixed, tested
  and pushed to `main` that evening (#22 and #26 need the board).

## How to check work

- Local preview: `python3 -m http.server 8765` from the repo root.
- Browser tests: in Claude's cloud sessions, Playwright with Chromium at
  `/opt/pw-browsers/chromium`; on a local machine, a normal browser's phone
  view and dark mode. Check every page at 390px and 1280px wide, light and
  dark mode, for console errors and sideways scrolling.
- Contrast: measure text against the real background behind it (hide the
  text, screenshot the area, compare against the darkest or lightest pixels).
  Check hover and current-page states too.
