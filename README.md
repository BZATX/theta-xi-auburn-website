# Auburn Theta Xi: Beta Zeta Chapter Website

The website of the Beta Zeta Chapter of Theta Xi at Auburn University,
maintained by the **Beta Zeta Association (alumni board)**. It is a plain
static site (HTML, one stylesheet, two scripts, and JSON content files) with
no build step and nothing to install. Keep the domain renewed, and note that
the Netlify plan's credits limit how often you can publish (see below).

- **Live site:** https://www.auburnthetaxi.com
- **Repository:** `BZATX/theta-xi-auburn-website` (public)
- **Hosting:** Netlify publishes the `main` branch. A push to `main` is live
  within a couple of minutes.
- **Current state and open items:** see [`HANDOFF.md`](HANDOFF.md).
- **Rules for AI assistants (Claude, Cursor, Grok):** see
  [`AGENTS.md`](AGENTS.md). `CLAUDE.md` points there.
- **What's left from the Oct 1, 2026 site scan:** see
  [`BACKLOG.md`](BACKLOG.md).
- **Who runs it:** Ben Waters and Shaun, through AI coding assistants and
  GitHub. The old `/admin` browser editor was retired in Oct 2026; every
  change goes through this repository.

---

## How updates work

Undergraduate officers do **not** edit the website. Instead:

1. **The chapter sends content to the alumni board** (officer headshots, bios,
   event photos, news) by email, text or Slack.
2. **A board member opens an AI coding assistant** on this repository:
   Claude Code (claude.ai/code or the app), or Cursor or Grok as an
   experiment. Use one tool at a time; each works on its own branch (see
   `AGENTS.md`).
3. **They describe the change in plain English.** The assistant edits the
   files on its branch and shows screenshots of the result.
4. **When the board member approves ("push to main"), the assistant
   publishes it.** Netlify deploys automatically; check the live site a
   couple of minutes later.

### Publishing costs Netlify credits

The Netlify account is on a credit-based plan. Each publish of `main` (a
"production deploy") uses credits, and the account ran out on Oct 9, 2026
after a run of small pushes. Previews of other branches don't use credits.
So:

- Collect approved changes on a working branch and publish them together,
  not one at a time.
- If Netlify skips a deploy, check the credits, then use Netlify → Deploys →
  Trigger deploy → Deploy site instead of pushing again.

### Example requests that work well

> "The new exec board headshots are in the Drive 'Website Pictures' folder.
> Update the Meet the Officers page: President is John Smith, senior in
> Mechanical Engineering from Huntsville, bio: '…'. Vice President is …"

> "I put 6 photos from the Habitat build day in the Drive 'Website Pictures'
> folder. Swap the best 3 into the Habitat section of the Philanthropy page,
> and write a short news post about it dated last Saturday."

> "Update the home page stats: 52 active brothers this year."

> "Remove Jake Doe from the exec board and move the Treasurer to the top."

Be specific about names, dates and spelling; the assistant will do exactly
what you say.

### Getting photos onto the site

**Photos pasted into an AI chat can't be added to the site.** The assistant
can see them but can't save the image file. Deliver the actual files instead:

1. Put the photos in Google Drive, in the **`Website Pictures`** folder
   (inside the `Website` folder of the alumni account's Drive:
   https://drive.google.com/drive/folders/1FaVguZwQn19nd1BvxovB0Sa-SxQsIAvX), or post them
   in Slack.
2. Tell the assistant where they are. Descriptive file names help.
3. The assistant pulls them through its Drive or Slack connection, if it has
   one, crops and resizes them (phone screenshots usually need black bars
   removed), and adds them under `assets/images/`. A tool running on your
   own computer (Cursor) needs the files downloaded into the repo folder.

### What the next webmaster needs (one-time handoff)

- **Admin access to this GitHub repository** (it belongs to the `BZATX`
  organization; an owner adds you).
- **Access to the Netlify account** that deploys it.
- An AI coding assistant with access to the repository (Claude Code has
  been used so far).

The board's Google Drive holds the fuller handoff record: Alumni Relations /
Website & Digital Infrastructure / "Website Operations & Ownership Handoff -
Current State". Passwords and tokens belong in the board's password manager,
never in Drive or this repo.

---

## Where everything lives

**Content: edit these for routine updates.** Each file in `data/` is plain
JSON that the pages read when they load.

| File | What it holds | Where it shows |
| --- | --- | --- |
| `data/members.json` | Exec board: name, role, major, hometown, photo, bio, email, optional phone (shown as separate "Call" and "text" links) | Meet the Officers page (`pages/leadership.html`), and the first 4 on the home page |
| `data/journal.json` | News posts: title, date (YYYY-MM-DD), cover, excerpt, link. Optional: `location`; `photos` (a list of image paths; adds a "View photos" button that opens a photo viewer); `category` (`alumni` also lists the post under Past Alumni Events on the Alumni page) | Social page (`pages/journal.html`), the newest 3 on the home page, and `alumni` posts on the Alumni page |
| `data/gallery.json` | Photos with a caption and a category | Brotherhood page only (category `brotherhood`). No page shows other categories. |
| `data/alumni.json` | Notable alumni cards | Alumni page, "Notable Alumni" section |
| `data/chapter.json` | Home page stats (founded, years at Auburn, active brothers, service hours) | Home page stats strip. Its contact and rush fields are **not used** anywhere; see below. |
| `data/instagram.json` | Board-picked Instagram post links, shown as Instagram's own free embeds. Refresh twice a year by swapping the links (post → share → copy link). | Social page and Brotherhood page |

**Contact details are written into the pages, not read from `chapter.json`.**
To change the chapter email, address or social links, edit `js/layout.js`
(the `SOCIALS` list and the footer), the structured data near the top of
`index.html`, the pages that list them (the recruitment chair's phone and
email in `pages/recruitment.html`, the email in `pages/scholarships.html`),
`data/members.json` (officer emails and the recruitment chair's phone,
shown on Meet the Officers and the home page), and the short no-JavaScript
footer line (address and email) near the bottom of every page.

**Photos on the Philanthropy page** are not in `gallery.json`. The Taxi Bash
and Habitat photos in the page body are set in `pages/philanthropy.html`. The
top photo (Taxi Bash group, with a separate phone crop) is set in
`css/main.css` (`.hero-bg--taxibash`), so changing it also means bumping the
stylesheet version.

**Images** live in `assets/images/`:

| Folder | Holds |
| --- | --- |
| `portraits/` | Notable alumni headshots; current officers in `portraits/officers-2026/` |
| `dynamic/` | Event and page photos (tailgate, Taxi Bash, Habitat, refounding, founding fathers) |
| `events/` | Photo sets for news posts (the "View photos" viewer) |
| `backgrounds/` | Large top-of-page photos |
| `concepts/` | House concept rendering (Donate page) |
| `employers/` | Alumni employer logos (Why Theta Xi page) |
| `system/` | Crest and the Zeffy QR code |
| `brand/` | The Beta Zeta house logos in SVG and PNG; see its README and use them as supplied |

Resize photos to at most 1800px and save as JPEG (aim for a few hundred KB)
before committing.

How photos are written into the pages, so they load quickly:

- **Top-of-page photo:** each page's `<head>` has a
  `<link rel="preload" as="image">` naming its top photo, so it downloads
  first. When you change a page's top photo, change that line too (the
  Philanthropy page has two, one for phones and one for wider screens, which
  must match `.hero-bg--taxibash` in `css/main.css`).
- **Photos further down a page** are written as
  `data-bg style="--bg:url('/assets/images/…')"` (a path starting with `/`)
  instead of `background-image`. They download only when the visitor scrolls
  near them; with JavaScript off they show straight away. The home page's
  photo cards use smaller `-card` copies of the full-size photos.

Reference photos from the JSON with a repo-relative path such as
`assets/images/events/2026-alumni-reunion-1.jpg`.

The browser-tab icons, home-screen icons, `site.webmanifest` and the link
preview image (`og-image.png`) sit at the top level of the repo, copied from
`assets/images/brand/icons/`.

**Structure: rarely needs touching.**

```
index.html        Home page
404.html          "Page not found" page
pages/*.html      The other 16 pages (about, recruitment, leadership = Meet the
                  Officers, journal = Social, alumni, donate, history, …)
css/main.css      The whole design system (colors and fonts are variables at the top)
js/layout.js      Navbar and footer for every page. Edit nav links HERE, then
                  update the short no-JavaScript menu and footer line on each page
js/main.js        Menus and animations, JSON rendering, the photo viewer,
                  and both forms (rush-interest, alumni-update)
data/             Content JSON (see above)
_redirects        Forwards old addresses (e.g. join.html → recruitment.html)
_headers          Security headers (including the content security policy:
                  the outside addresses pages may load from) and caching rules
robots.txt, sitemap.xml, site.webmanifest, icons, og-image.png
```

Conventions that keep the site easy to maintain:

- Every page loads `css/main.css?v=N` (currently 42). Bump `N` on every page
  whenever `css/main.css` changes, so visitors' browsers fetch the new
  styles.
- The navbar and footer exist only in `js/layout.js`; never edit them page by
  page. The exception is the short `<noscript>` menu and footer line on each
  page, shown only when JavaScript is off; keep those in step with
  `js/layout.js`.
- Values from the JSON files are escaped with `esc()` in `js/main.js` before
  they go into the page. Keep doing that.
- Text colors must reach WCAG AA contrast (4.5:1 for normal text) in light and
  dark mode. Small links use the `--azure-text` blue; orange is for buttons
  and accents (plus the light-orange hover on footer links, which sit on
  navy). See `AGENTS.md` for details.
- Preview locally with `python3 -m http.server 8765` from the repo root (a
  server is required; opening the files directly can't load the JSON).

---

## Forms

Both forms use **Netlify Forms**: the form posts back to the site and Netlify
records it. `js/main.js` sends it in the background so the page shows its own
thank-you message. It finds forms by `data-ajax-submit`, because Netlify
removes `data-netlify` when it publishes. Check Netlify's current limit on
form submissions before rush (the old free tier allowed 100 a month).

**Rush interest** (`pages/recruitment.html`, form name `rush-interest`):
submissions appear in the Netlify dashboard under Forms → rush-interest, and
an email with the answers goes to `thetaxibz@gmail.com` (set under Site
configuration → Notifications → Form submission notifications).

**Alumni "Update Your Info"** (`pages/update-info.html`, form name
`alumni-update`), linked from the Alumni page:

1. Netlify emails the labeled answers to the alumni board inbox,
   `betazetatxalumni@gmail.com`. A backup copy of every submission stays in
   the Netlify dashboard under Forms → alumni-update.
2. The board's **Alumni Inbox Monitor** automation (a ChatGPT task) reads
   those emails and updates the "BZ Alumni Database Clean" sheet in Drive
   only when it can match the person safely; anything uncertain is labeled
   for a human to review.
3. The current rules are in Drive: Alumni Relations / Alumni Database &
   Contact Updates / "Alumni Inbox Monitor - Operating Runbook - Current".
   The older "Website 'Update Your Info' → Alumni Database" v3.x documents
   are history only.

The website's only jobs here are the form page itself and the email
notification set in the Netlify dashboard.

---

## Other things the next person should know

- **Contacts.** Wherever the site says to contact the Alumni Board
  (volunteering, parents' questions), the address is
  `betazetatxalumni@gmail.com`, the inbox the board monitors.
  Chapter-facing contact (rush notifications, officer emails) is
  `thetaxibz@gmail.com`.
- **Donations** (`pages/donate.html`). Gifts to the Beta Zeta Association
  (not tax-deductible) go to General Support, the House Move-In Fund (Zeffy
  form) or the Building Fund (CauseVox page, Zeffy form and QR code), or by
  Venmo `@BZATX_Assoc` or check. Tax-deductible gifts go by check to the
  Theta Xi Foundation (Beta Zeta Legacy Fund or Chapter Educational Account).
- **The Google Map** on the Home, Recruitment and Parents pages is a plain
  embed with no API key.
- **Dark mode** follows the visitor's device setting automatically.
- **Hargis Hall photo:** `loc_hargis_hall.jpg` came from the Library of
  Congress through an old one-time GitHub workflow, removed in Oct 2026 (it
  could still publish to `main`). If the photo is ever lost, restore it from
  git history.

## Photo credits

`assets/images/backgrounds/loc_hargis_hall.jpg` (Hargis Hall, 1888; History
page and the Scholarship pages) is by **Carol M. Highsmith**, from the George
F. Landegger Collection of Alabama Photographs in Carol M. Highsmith's
America, Library of Congress, Prints and Photographs Division
([item 2010639183](https://www.loc.gov/item/2010639183/)). It is in the
public domain. The site doesn't currently show an on-page credit.

Most other photos are the chapter's own. The sources of these are not
recorded and should be confirmed (then credited or replaced):
`auburn-sign.jpg`, `jordan-hare-stadium.jpg`, `jordan-hare-dusk.jpg`, the
notable-alumni portraits, the Founding Fathers composite, the house concept
rendering and the employer logos.
