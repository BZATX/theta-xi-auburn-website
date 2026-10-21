# Instructions for AI assistants working on this repo

These rules apply to every AI tool used on this site (Claude Code, Cursor,
Grok or anything else). `CLAUDE.md` just points here.

Read `README.md` (how the site works) and `HANDOFF.md` (current state and open
items) before making changes. `BACKLOG.md` lists what's left from the Oct 1,
2026 site scan. Items not marked fixed aren't approved; don't work on them
unless the owner asks.

## Who you're working with

The site is run by the Beta Zeta alumni board. The usual requester is the
Alumni Relations governor. They are not a developer.

- Write replies in plain English, short, with no technical jargon. Explain
  what changed and what they need to do, not how the code works.
- Don't praise ideas by default or agree with ones that won't work. Give
  evidence (a measurement, a screenshot, a file and line), and say so when
  you're unsure.

## One tool at a time

Several AI tools may be tried on this site. Only one works on it at a time,
so they don't overwrite each other's changes (the board's Drive rules also
require a single writer per task).

- Each tool works on its own branch: `claude/…` for Claude, `cursor/…` for
  Cursor, `grok/…` for Grok. Never commit straight to `main`.
- Before starting, fetch and check that `main` hasn't changed under you, and
  that no other tool's branch has unpublished work the owner still wants
  (`git log --oneline origin/main..origin/<branch>`). If one does, ask the
  owner before touching the same files.
- When you finish, update `HANDOFF.md` so the next tool knows the state.

## How changes go live

1. Work on your own branch (see above), never directly on `main`.
2. Show the change before it goes live: screenshots at laptop and phone
   width, light and dark mode.
3. Push to `main` only when the owner says so (they usually write "push to
   main"). A push to `main` is a Netlify production deploy.
4. **Netlify credits are limited.** Each production deploy costs credits,
   and the account ran out on Oct 9, 2026. Bundle approved changes and push
   to `main` once per batch, not after every small fix. Branch deploys and
   deploy previews do not use credits. Netlify's production branch is
   `main`, and GitHub's default branch is `main`.
5. **If Netlify skips a deploy** (the Deploys list says "skipped" or
   "paused"), don't push again. Check the credits first; once they're
   available, the owner clicks Deploys → Trigger deploy → Deploy site. That
   publishes what's already on `main`.
6. **Docs-only updates to `main`** (files that don't change the site, such
   as this one) can skip the deploy: put `[skip netlify]` in the commit
   message of the last commit in the push. Never use it for site changes.
7. Commits: plain, descriptive messages. Don't put AI model names in code,
   comments or page content.
8. Don't open pull requests unless asked.

## Site rules that are easy to break

- **No build step, no frameworks, no npm.** Plain HTML, one stylesheet
  (`css/main.css`), two scripts (`js/layout.js`, `js/main.js`), and JSON in
  `data/`. Keep it that way.
- **Navbar and footer live only in `js/layout.js`.** Never edit them page by
  page. The one exception: each page has a short `<noscript>` menu and
  footer line (address, email, Privacy, Accessibility) for visitors with
  JavaScript off. When a page is added, renamed or removed, or the address or
  email changes, update those on every page too.
- **Bump the stylesheet version** (`main.css?v=N`) on every page,
  including `admin/index.html`, whenever `css/main.css` changes: ideally in
  the same commit, and always before the next push to `main`. (`admin.css`
  and `admin.js` have their own versions.)
- **Escape JSON values** with `esc()` before putting them into HTML in
  `js/main.js`.
- **Forms** are found by `data-ajax-submit` (Netlify strips `data-netlify`
  from the published HTML). Old URLs forward through `_redirects`.

## Accessibility bar

Every text color must reach 4.5:1 contrast (3:1 for large text) in light and
dark mode, measured against the real background behind it, including
see-through panels over photos. Check hover and current-page states too.
"Looks fine" is not a measurement.

- Small links and link-style buttons use `--azure-text` (#005fa8 light,
  #6fb2ee dark). In light mode only, the home page's three photo cards use
  `--navy-mid` for their links, because the lighter blue can't reach 4.5:1
  there; dark mode keeps `--azure-text`.
- Orange is for buttons, the big stat symbols, marker bars and the
  required-field stars. Don't use orange for small text. Existing
  exceptions: footer links and the navbar Instagram icon turn light orange
  (`--orange-soft`) on hover over the navy footer and photos. Measure
  before changing them.
- Keep keyboard use, focus outlines, alt text, heading order and
  reduced-motion support working.

## Writing on the site

The owner audited the site to remove AI-sounding copy. Keep new text plain
and specific:

- No long dashes, stock phrases ("thriving", "more than just…", "it's not X,
  it's Y"), or padded lists of three.
- Don't invent facts, stats, dates or quotes. Use the source the owner gives
  you, and ask if it's missing.
- Decisions the owner made: keep "72+ years"; keep the refounding references
  as they are; don't mention "Auburn first" students or the "Path to the
  Plains".

## Photos

Photos pasted into a chat can't be saved to the repo. Get the actual files:
from Google Drive (the `Website Pictures` folder) or Slack if your tool has
those connections, or ask the owner to save them into the repo folder.
Crop, resize to at most 1800px, save as JPEG (aim for about 200 KB), and
commit them under `assets/images/`. Phone screenshots of photos usually need
the black bars cropped off.

## Testing

- Preview locally: `python3 -m http.server 8765` from the repo root (a
  server is required; `file://` can't load the JSON).
- On your own computer (Cursor, for example), open the local preview in a
  normal browser and use its phone-size view and dark-mode setting.
- In claude.ai/code cloud sessions, browser checks use Playwright with
  `executablePath: '/opt/pw-browsers/chromium'` (don't run
  `playwright install` there). Google Fonts and the live site may be
  blocked in that sandbox, so screenshots can show fallback fonts, and the
  owner checks the live site after a publish.
- Check every page for console errors and sideways scrolling at 390px and
  1280px wide before calling a change done.

## Board records (Google Drive)

The board's Google Drive is the permanent record. Before changing anything
there, read `00 - START HERE - AI Agent Bootstrap & Operating Context` in
the Drive and follow it. In short: explain the plan first, edit files in
place, and log every filing change in the Canonical Drive Organization
Changelog. Website records live in Alumni Relations / Website & Digital
Infrastructure. Never put passwords or tokens in Drive or in this repo
(the repo is public).
