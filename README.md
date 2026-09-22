# Auburn Theta Xi — Beta Zeta Chapter Website

The official website of the Beta Zeta Chapter of Theta Xi at Auburn University,
maintained by the **alumni board**. A light glassmorphism design, built so that
content updates take minutes — using Claude Code as the editor — without anyone
touching HTML.

**Live site:** auburnthetaxi.com (deployed by Netlify from the `main` branch —
every commit to `main` goes live automatically in about two minutes.)

---

## How updates work (the official workflow)

Undergrad officers do **not** edit the website. Instead:

1. **The chapter sends content to the alumni board** — officer headshots,
   bios, event photos, journal write-ups — by email/text, as needed.
2. **A board member opens a Claude Code session** on this repository
   (claude.ai/code, or the Claude Code CLI/desktop app with the repo cloned).
3. **Tell Claude what to change, in plain English, and attach the files.**
   Claude edits the content files, optimizes the photos, commits, and pushes.
4. **Netlify deploys automatically.** Check the live site a couple of minutes
   after the push.

### Example prompts that work well

> "Here's the new exec board after elections (attached headshots). Update the
> Members page: President is John Smith, senior in Mechanical Engineering from
> Huntsville, bio: '…'. Vice President is …"

> "Attached are 6 photos from the Habitat build day. Add the best 4 to the
> service gallery with captions, and write a short journal post about it
> dated last Saturday."

> "Update the homepage stats: 52 active brothers this year."

> "Remove Jake Doe from the exec board and move the Treasurer to the top."

Claude Code can read this README, so it knows the structure below. Be specific
about names, dates, and spelling — it will do exactly what you say.

### What the next webmaster needs (one-time handoff)

- **Admin access to this GitHub repository** (the outgoing webmaster adds you
  as a collaborator, or transfers ownership).
- **Access to the Netlify account** that deploys it (or re-connect the repo to
  a new Netlify account — it's a static site; no build settings needed).
- A Claude account with Claude Code access for making updates.

That's the entire system. There is no server, no database, no hosting bill,
and nothing to renew except the domain.

---

## Where everything lives (for Claude, or for editing by hand)

**Content — edit these for routine updates.** Every file in `data/` is plain
JSON read by the pages at load time:

| File | Controls | Shown on |
| --- | --- | --- |
| `data/members.json` | Exec board: name, role, major, hometown, photo, bio, email | Members page + first 4 on the home page |
| `data/journal.json` | News posts: title, date (YYYY-MM-DD), cover, excerpt, link | Journal page + newest 3 on the home page |
| `data/gallery.json` | Photos with captions and a category (`brotherhood`, `service`, `house`) | Brotherhood page (brotherhood), Service page (service) |
| `data/alumni.json` | Notable alumni cards | Notable Alumni page |
| `data/chapter.json` | Home-page stats (founded, years, brothers, service hours) and contact info | Home page |
| `data/instagram.json` | Board-picked Instagram post URLs, shown as official free embeds (no widget vendor, no view limits). Refresh biannually: replace the URLs (post → share → copy link; `?...` junk is stripped automatically) | Journal page |

**Images** go in `assets/images/`:
`portraits/` (headshots), `dynamic/` (event photos), `backgrounds/` (hero
images), `uploads/` (anything added after launch), `system/` (crest, favicon).
Resize to ≤1800px JPEG before committing; reference them from the JSON with a
repo-relative path like `assets/images/uploads/2026-president.jpg`.

### Adding new photos — use the Google Drive pathway

**Photos pasted into a Claude chat cannot be added to the site** — Claude can
see them but has no access to the underlying image file, so it can't place them
in the repo. To get a new photo onto the website, deliver the actual file
through Google Drive:

1. Put the image file(s) in Google Drive — the chapter uses the **`website
   pictures`** folder inside the broader **`website`** folder.
2. Tell Claude the files are in Drive (naming them descriptively, e.g.
   `taxi-bash-1.jpg`, helps Claude grab the right ones).
3. Claude pulls them via the Drive connector, resizes/crops as needed, commits
   them under `assets/images/…`, and wires them into the page.

(Committing image files straight to the Git repo by hand also works, but the
Drive route is the standard path for non-developers.)

**Structure — rarely needs touching:**

```
index.html        Home page
pages/*.html      All other pages (about, join, history, alumni, …)
css/main.css      The entire design system (colors/fonts are CSS variables at the top)
js/layout.js      Navbar + footer, shared by every page — edit nav links HERE once
js/main.js        Menu/animations, JSON rendering, rush form submission
admin/            Optional browser-based editor (see below)
```

Conventions that keep the site easy to maintain:
- Page `<head>` references `main.css?v=N` — bump `N` on every CSS change so
  visitors' browsers fetch the new styles.
- The navbar/footer exist only in `js/layout.js`; never edit them per-page.
- Run a local preview with `python -m http.server 8000` (a server is required
  — `file://` can't fetch the JSON).

---

## The `/admin` panel (optional backup editor)

`admin/index.html` ("Chapter Login" in the footer) is a browser GUI that edits
the same `data/*.json` files and uploads photos by committing straight to this
repo via the GitHub API. It's handy for a board member who wants to fix a typo
from a phone without opening a Claude session.

It only works for **repository collaborators** holding a fine-grained GitHub
token (instructions are on its login screen). Under the alumni-board workflow,
simply never add undergrads as collaborators — then the panel, like the repo,
is board-only.

---

## Alumni "Update Your Info" pipeline (contact-info updates)

Alumni contact updates use the same Netlify Forms architecture as the rush
form — no Google Form, no Apps Script, no response spreadsheet:

1. **`pages/update-info.html`** hosts a styled, on-site form (Netlify form
   name `alumni-update`), linked from the Notable Alumni page's "Update
   Your Info" button and the Scott Yates card in `data/alumni.json`.
2. On submission, Netlify emails the **full answers as labeled fields** to
   the alumni board inbox (`betazetatxalumni@gmail.com`) — that email is
   both the record and the trigger. A backup copy of every submission sits
   in the Netlify dashboard under **Forms → alumni-update**.
3. The board's **recurring Claude task** (the daily one that watches the
   alumni inbox) parses each new notification email, matches the submitter
   against the "BZ Alumni Database Clean" sheet in Drive, and applies
   updates only at **≥ 0.8 confidence**, stamping Last Contact Date and
   appending Change Log entries with source "website form". Uncertain
   matches are flagged `NEEDS REVIEW` for a human instead of being applied.

The authoritative setup/runbook doc (including the paste-ready instruction
block for the recurring task) lives in Drive: **AI Alumni Engagement
System → the highest-versioned "Website 'Update Your Info' → Alumni
Database" doc** (v3.4 as of June 2026; each version says which ones it
supersedes). The website's only responsibilities are the form page itself and
the email notification configured in the Netlify dashboard (Site
configuration → Notifications → Form submission notifications →
`alumni-update` → `betazetatxalumni@gmail.com`).

## Other things the next person should know

- **Rush interest form** (`pages/join.html`) uses **Netlify Forms** — the
  form posts back to the site and Netlify captures it (no scripts, no
  backend). Submissions are listed in the Netlify dashboard under **Forms →
  rush-interest**, and an email notification containing the full answers
  goes to `thetaxibz@gmail.com` (configured under Site configuration →
  Notifications → Form submission notifications). One-time setup: form
  detection must be enabled (Site configuration → Forms) *before* a deploy
  for Netlify to register the form. Free tier allows 100 submissions/month.
- **Alumni-board contact:** wherever the site says to contact the Alumni
  Board (e.g. the "Volunteer Your Time" CTA on the donate page), the
  address is `betazetatxalumni@gmail.com` — the same inbox the board's
  daily Claude task watches, so volunteer offers and questions land in one
  monitored place instead of anyone's personal email. The Parents page
  "Contact Us" button also goes to the board inbox (parents' questions are
  fielded by the board, not the undergrads). Chapter-facing contact (rush
  interest notifications, exec-board emails on the Members page) stays
  `thetaxibz@gmail.com`.
- **Donations** link to the chapter's Zeffy forms (see `pages/donate.html`).
- **The Google Map** on Home/Join/Parents is a plain embed — no API key.
- **`.github/workflows/fetch-campus-photos.yml`** is the one-shot workflow
  that fetched the public-domain campus photography; re-run it from the
  Actions tab only if those images are ever lost.

## Photo credits

Campus photography is by **Carol M. Highsmith**, from the George F. Landegger
Collection of Alabama Photographs in Carol M. Highsmith's America, Library of
Congress, Prints and Photographs Division. Highsmith donated her archive to
the public domain — no known restrictions on publication; the footer credit is
a courtesy.

| File | Subject | LOC item |
| --- | --- | --- |
| `loc_samford_hall.jpg` | William J. Samford Hall | [2010639190](https://www.loc.gov/item/2010639190/) |
| `loc_hargis_hall.jpg` | Hargis Hall (1888) | [2010639183](https://www.loc.gov/item/2010639183/) |
| `loc_university_chapel.jpg` | Auburn University Chapel (1851) | [2010637884](https://www.loc.gov/item/2010637884/) |
| `loc_eagle_statue.jpg` | Eagle statue on campus | [2010637883](https://www.loc.gov/item/2010637883/) |
| `loc_jordan_hare.jpg` | Tigers entering Jordan-Hare Stadium (2010) | [2011646784](https://www.loc.gov/item/2011646784/) |

All other photography is chapter-owned or placeholder; replace placeholders
with real chapter photos as they're collected.
