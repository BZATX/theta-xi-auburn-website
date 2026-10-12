# Instructions for Claude sessions on this repo

Read `README.md` (how the site works) and `HANDOFF.md` (current state and open
items) before making changes. This file covers how to work with the owner.

## Who you're working with

The site is run by the Beta Zeta alumni board. The usual requester is the
Alumni Relations governor. They are not a developer.

- Write replies in plain English, short, with no technical jargon. Explain
  what changed and what they need to do, not how the code works.
- Don't praise ideas by default or agree with ones that won't work. Give
  evidence (a measurement, a screenshot, a file and line), and say so when
  you're unsure.

## How changes go live

1. Work on the development branch (currently `claude/great-sagan-6b17gi`),
   never directly on `main`.
2. Show the change before it goes live: screenshots at laptop and phone
   width, light and dark mode.
3. Push to `main` only when the owner says so (they usually write "push to
   main"). A push to `main` is a Netlify production deploy.
4. **Netlify credits are limited.** Each production deploy costs credits,
   and the account ran out on Oct 9, 2026. Bundle approved changes and push
   to `main` once per batch, not after every small fix. Branch deploys and
   deploy previews do not use credits.
5. Commits: plain, descriptive messages. Don't put AI model names in code,
   comments or page content.
6. Don't open pull requests unless asked.

## Site rules that are easy to break

- **No build step, no frameworks, no npm.** Plain HTML, one stylesheet
  (`css/main.css`), two scripts (`js/layout.js`, `js/main.js`), and JSON in
  `data/`. Keep it that way.
- **Navbar and footer live only in `js/layout.js`.** Never edit them page by
  page.
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

Photos pasted into a chat can't be saved to the repo. Get the files from
Google Drive (the `Website Pictures` folder) or Slack through the connectors.
Crop, resize to at most 1800px, save as JPEG (aim for about 200 KB), and
commit them under `assets/images/`. Phone screenshots of photos usually need
the black bars cropped off.

## Testing

- Preview locally: `python3 -m http.server 8765` from the repo root (a
  server is required; `file://` can't load the JSON).
- In claude.ai/code cloud sessions, browser checks use Playwright with
  `executablePath: '/opt/pw-browsers/chromium'` (don't run
  `playwright install` there). Google Fonts may be blocked in that sandbox,
  so screenshots can show fallback fonts unless the fonts are served
  locally. On a local machine, use the installed Chrome or Chromium.
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
