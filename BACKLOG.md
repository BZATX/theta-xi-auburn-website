# Backlog: Oct 1, 2026 site scan

On Oct 1, 2026, twelve separate checks went through the whole site (security,
the admin editor, scripts, forms, links, search listings, facts,
accessibility, layout, speed, a live browser test of every page, and the
code's history), and every finding was re-checked by a second reviewer. This
file lists what is left from that scan. Each item was checked again against
the files on Oct 21, 2026.

On Oct 21, 2026 the owner asked for all the open items to be fixed. Those
fixes are on the working branch `claude/great-sagan-6b17gi` and go live with
the next push to `main`; they're listed under "Fixed, waiting to publish".
**Everything else here is not approved.** Ask the owner before working on it,
follow the rules in `AGENTS.md`, and update this file when an item is done or
turned down. Line numbers can drift; search for the text if a line doesn't
match.

Status on Oct 21: 30 fixed and waiting to publish, 0 open, 7 partly done, 10
waiting on the owner or board, 9 done, 1 turned down.

## Waiting on the owner or board

These need a decision, an outside account, or a fact only a person can
confirm. Some have a small code change that follows.

- **#3 Alumni update form can be used to change someone's contact details** (needs the owner or board)
  No website change is needed. The board should confirm that the ChatGPT
  Alumni Inbox Monitor's Drive runbook acts only on real Netlify emails,
  sends any change to an existing email, phone or address to a person for
  review, and treats form text as information, never as instructions.
  - Where: Drive: Alumni Relations / Alumni Database & Contact Updates /
    "Alumni Inbox Monitor - Operating Runbook - Current" ·
    pages/update-info.html · README.md:218-236
- **#22 Admin login instructions don't work now that the site belongs to the BZATX organization** (needs the owner or board)
  The admin side is fixed and waiting to publish: the login page and README
  give the BZATX token steps, login checks that the token can save, and
  errors stay on screen and mention the Resource owner. Still needs the
  board: add each board editor to the BZATX GitHub organization with Write
  access, and approve their tokens (BZATX, Settings, Personal access tokens,
  Pending requests).
  - Where: admin/index.html:51-59 · admin/admin.js:111-116, 164-173, 360-405
    · README.md:202-204
- **#26 Eric O'Neill's photo comes from Wikimedia Commons and is shown without the required credit** (needs the owner or board)
  Still no credit for Eric O'Neill's photo. Someone needs the photographer's
  name and the license from the Wikimedia Commons page
  (commons.wikimedia.org, File:Eric O'Neill 2019.jpg), or a photo from
  O'Neill himself; then a small credit line goes under the photo and in the
  README.
  - Where: data/alumni.json:22 · js/main.js:278-283 · README.md:262-275
- **#43 'Add to home screen' uses the housing corporation's name, not 'Auburn Theta Xi'** (needs the owner or board)
  The owner needs to decide whether the home-screen name should be 'Auburn
  Theta Xi' or stay 'Beta Zeta Association of Theta Xi'. After that, rename
  both copies of the file and set the home page as the start page, which is
  a small job.
  - Where: site.webmanifest · assets/images/brand/icons/site.webmanifest
- **#49 Jimmy Rane's photo is a YellaWood ad image with Auburn's logo** (needs the owner or board)
  The Rane photo is still the YellaWood ad graphic with Auburn's AU logo,
  and nothing records permission to use it. Someone needs to ask Rane's
  office or Great Southern Wood for a headshot the chapter may use. The
  fallback is a crop that cuts the AU logo out, which needs the owner's OK.
  - Where: data/alumni.json:30 ·
    assets/images/portraits/jimmy-rane-auburn.jpg · README.md:262-275 (Photo
    credits)
- **#52 Confirm which web address is the main one in Netlify** (needs the owner or board)
  Someone still needs to check in Netlify → Domain management that
  www.auburnthetaxi.com is the primary domain and that auburnthetaxi.com
  forwards to it. Before setting up any new subdomain, make sure it has
  https, because the security header covers all subdomains.
  - Where: Netlify → Domain management · _headers:7
- **#54 Updates needed after officer elections and every year** (needs the owner or board)
  This is a recurring job. After elections, someone sends the new officers,
  photos and rush chairman's name and phone. Each summer, they send the IFC
  date and fee, the grade-report year, the Taxi Bash year and the
  years-at-Auburn number (73 in 2027). The docs still have no written
  checklist, and the owner could approve adding one to the README.
  - Where: pages/leadership.html:46,63 ·
    pages/recruitment.html:52,81-82,95,147,165,204,214 ·
    pages/philanthropy.html:49 · data/chapter.json:10,17 · data/members.json
- **#55 Click through the outside links before rush and giving season** (needs the owner or board)
  Someone should open the donation links, the Auburn IFC and source links,
  Burgess's profile and the four Instagram posts in a normal browser before
  rush and giving drives. The Instagram picks should be refreshed twice a
  year.
  - Where: pages/donate.html:66,74-75,118 · pages/recruitment.html:86,147 ·
    data/instagram.json · data/alumni.json:16
- **#56 Check that the Google Map pin is on the house** (needs the owner or board)
  Someone needs to open the home page and check that the map pin sits on 835
  W Magnolia Ave. If it doesn't, all three pages need a fresh Google Maps
  embed.
  - Where: index.html:284 · pages/recruitment.html:282 ·
    pages/parents.html:98
- **#57 Confirm a few facts with Theta Xi headquarters** (needs the owner or board)
  Someone needs to ask Theta Xi HQ (txfn@thetaxi.org) three things: which
  Foundation phone line is answered, how many chapters and colonies there
  are now, and which year(s) Beta Zeta was named an All True Men chapter.
  The site can be updated after that. Separately, the 1954 timeline entry
  could mention Alabama Polytechnic Institute if the owner wants.
  - Where: pages/donate.html:106 · pages/history.html:45,86-88,96-98 ·
    pages/about.html:8,10,64

## Should fix

Accessibility barriers, inconsistencies, problems on some devices, and traps
for whoever edits the site next.

- **#10 Some text and buttons are too faint to read easily** (partly done)
  Two parts are still open and need the owner's OK first. (1) The light-blue
  labels over top-of-page photos are unchanged, including the faint one on
  Scholarships. (2) The white desktop menu text over the top photo measured
  about 4.4:1 on About, Accessibility and Brotherhood. The grey example text
  in form fields was darkened to 4.5:1 or better in this batch (waiting to
  publish). The Accessibility page still claims the site meets the AA
  contrast standard.
  - Why it matters: Low-vision visitors struggle to read the main calls to
    action, and the Accessibility page currently claims the site meets this
    standard.
  - Where: css/main.css:154 (labels over photos) · css/main.css
    navbar:not(.scrolled) rules (top menu over photos) ·
    pages/accessibility.html:52
- **#23 Contact fields in the admin 'Chapter Info' tab change nothing on the site** (partly done)
  The README says these fields do nothing and where contact details really
  live, and the admin hint now says so too (waiting to publish). The editor
  still shows the address, email, Instagram and Facebook fields, and
  chapter.json still holds the unused contact and rush-chair fields. The
  owner still needs to decide: remove the fields or connect them to the
  site.
  - Why it matters: Someone updating contact details in the editor will
    believe it worked while the old details are still showing.
  - Where: admin/admin.js:76-89 · data/chapter.json · js/layout.js:10-14,
    120-123 · pages/recruitment.html:52, 204, 214 · README.md:109-118,
    195-197
- **#24 Gallery photos tagged 'service', 'house' or 'other' never appear anywhere** (partly done)
  The README and the admin hint are corrected (the hint fix is waiting to
  publish). The editor still offers service, house and other tags that never
  appear anywhere. The owner still needs to decide whether Philanthropy gets
  its own gallery; otherwise the editor should offer only 'brotherhood'.
  - Why it matters: The first person who follows the editor's hint or the
    README's example (adding Habitat photos to the 'service' gallery) will
    think the upload failed.
  - Where: admin/admin.js:32-44 · pages/brotherhood.html:73 ·
    pages/philanthropy.html · README.md:107, 120
- **#27 The 2025 tailgate photo is overused, and the uncropped version shows red cups and a cooler** (partly done)
  The New Associate Members post is gone, so the home news row shows the
  tailgate photo once. Still to do: the link previews for Alumni,
  Brotherhood and Update Info, the Brotherhood gallery, and the tailgate
  news post (cover and photo viewer) all use the uncropped photo with the
  cups and cooler, and Brotherhood still shows the tailgate three times. The
  owner needs to decide whether the cups and cooler should come off the site
  entirely.
  - Why it matters: Link previews sent to rushees and parents show the items
    that were deliberately cropped out, and the repetition makes the news
    section look thin.
  - Where: pages/alumni.html:11 · pages/brotherhood.html:11, 29, 48 ·
    pages/update-info.html:11 · data/gallery.json:4 · data/journal.json:23,
    26 (also used as a background at index.html:147, pages/alumni.html:112,
    pages/why-theta-xi.html:125)
- **#29 Photo credits list missing files, and an old photo-download tool is still active** (partly done)
  The README credits are fixed, but the old GitHub photo-download tool is
  still in the repo, with permission to change the site, and can still be
  run from the Actions tab. Delete it along with its README note
  (README.md:256-260). The owner still needs to confirm who took the three
  campus photos.
  - Why it matters: If a photo's rights are ever questioned there's no
    record of where it came from, and re-running the old tool would make
    unwanted changes to the live site.
  - Where: .github/workflows/fetch-campus-photos.yml · README.md:256-260,
    262-275 · PLAN.md:83-87

## Nice to have

Polish and housekeeping.

- **#31 Phone layout polish: officer and news cards, logo subtitle** (partly done)
  News cards are fixed. On phones, the officer and alumni cards still get
  the extra padding around their photos, and the logo line 'Beta Zeta ·
  Auburn' still breaks onto two lines at 360-375px.
  - Why it matters: It's minor, but it's on the most-viewed phone layouts
    and in the logo on every page.
  - Where: css/main.css:1785 · js/layout.js:43 · css/main.css:343-350

## Reminders

- **#51 Fix GitHub's default branch and protect the live branch** (partly done)
  The default branch is now main, and Netlify publishes main. Main still has
  no protection, so the owner needs to add a GitHub ruleset for main that
  blocks deletion and force-pushes. It must not require reviews, because
  /admin saves go straight to main. Don't delete claude/great-sagan-6b17gi:
  it's still the active working branch.
  - Why it matters: It causes 'my change didn't go live' confusion now, and
    leaves the live site one mistake away from being overwritten.
  - Where: GitHub: BZATX/theta-xi-auburn-website → Settings → Rules →
    Rulesets

## Fixed, waiting to publish

Fixed on the working branch on Oct 21, 2026 and tested (two rounds of
independent checks). When they're live, move them to "Done or turned down".
Items with a "Still" note have a small follow-up.

- **#9 Admin login stays saved on whatever computer it was used on** (fixed, not live yet)
  "Keep me signed in" is unticked by default and labelled for personal
  devices only. Unticked, the token is kept only in that browser tab. The
  setup steps ask for a short expiration.
- **#11 In Windows High Contrast mode, the phone menu icon and form focus disappear** (fixed, not live yet)
  High Contrast mode now shows the phone menu lines and X, the current-page
  marker, checklist ticks, the History timeline, stat dividers, the
  back-to-top circle and the focus outline on form fields. The scrolled
  header and the phone menu are solid in that mode.
- **#12 The Explore drop-down menu won't close properly** (fixed, not live yet)
  The Explore drop-down opens and closes reliably with a mouse, a finger and
  the keyboard. Escape closes it and returns to Explore, and screen readers
  are told whether it's open.
- **#13 Phone menu stays open when the screen widens, and keyboard users can't reach its close button** (fixed, not live yet)
  The phone menu closes when the window widens. Keyboard users move into the
  menu, can reach the close button, and focus comes back to a sensible
  place. The page behind is hidden from screen readers while it's open.
  Still open (small): if the window is widened while the menu button itself
  has focus, focus usually moves to the logo, but this hasn't been re-tested
  after the last change.
- **#14 Form fields don't help phones autofill, and two fields handle answers badly** (fixed, not live yet)
  Form fields tell phones what to autofill (except the mailing address box,
  which would only fill the street). GPA takes a number from 0 to 5 with a
  plain message, and LinkedIn accepts a link without https://.
- **#15 Screen readers may not announce that a form was sent** (fixed, not live yet)
  The thank-you and error messages are announced by screen readers, and
  focus stays on the Send button after sending. The required-field note
  reads correctly.
- **#16 Scholarships page scrolls sideways on small phones** (fixed, not live yet)
  The Scholarships page no longer scrolls sideways at 320px, and card grids
  stay centered on small phones.
- **#17 With very large text settings, the menu button and some words get cut off** (fixed, not live yet)
  With the browser's large-text setting, the menu button stays full size,
  the header Rush button hides on phones from about 125 to 150% text (it
  stays in the menu), and long words, buttons, stats and officer cards wrap
  instead of being cut off. Still open: reading tools that enlarge only the
  page's own text (not the browser setting) can still push a few buttons,
  stats and officer cards past the screen edge or split their words, and big
  headings can break mid-word at 125% text or more on the smallest phones.
- **#18 Pages load slowly on phones because photos are too big and load too early** (fixed, not live yet)
  Each page fetches its top photo first, and photos further down (including
  officer, alumni and news photos) load as the visitor scrolls near them.
  Oversized images were re-saved: crest 167 to 29 KB, Founding Fathers 484
  to 48 KB, and smaller copies of the home page card photos. A phone's first
  visit to the home page downloads about half as much before scrolling. The
  top-of-page photos were left at full size (re-saving them saves only about
  2%).
- **#19 Printed pages come out mostly blank, and stats read as '0' until scrolled to** (fixed, not live yet)
  Printouts show all text in black on white, hide the menu and background
  photos, keep section labels with their headings, and print the real stat
  numbers, which screen readers also hear. Photos further down a page print
  once they have loaded, so scroll through the page before printing to
  include them. Still open (small): selecting several stats at once with the
  mouse can pick up each number twice in some tools; copying with Ctrl+C
  gives each number once.
- **#20 Yulista employer tile has no description, is a very large file, and contains a third-party photo** (fixed, not live yet)
  Yulista is now a text tile like Kimley-Horn and Macquarie, so the large
  third-party photo is gone.
- **#21 Privacy page doesn't match how forms and data are actually handled** (fixed, not live yet)
  The Privacy page now matches how the forms work: which fields are
  required, what happens to submissions, and where to email instead.
- **#25 Admin editor can publish blank cards, misplace photos, or silently skip edits** (fixed, not live yet)
  The editor won't publish blank cards or empty stats, ties each photo
  upload to the card it was started for, marks tabs with unsaved changes,
  warns before leaving, and loads fresh data each time.
- **#30 Add an extra layer of browser security** (fixed, not live yet)
  A content security policy is in place: enforced on /admin, and in test
  mode on the public pages. The outdated X-XSS-Protection header was
  removed. Still to do after publishing: open the Social and Brotherhood
  pages on the live site, check the browser console for policy warnings (the
  Instagram posts are the likely ones), then switch the public policy from
  test mode to enforced in `_headers`.
- **#32 Admin login and save errors are confusing** (fixed, not live yet)
  Admin login and save errors are in plain English, the editor logs out only
  when GitHub rejects the token, and it explains what to do when someone
  else saved first.
- **#33 Admin editor is hard to read in dark mode** (fixed, not live yet)
  The admin editor is readable in dark mode.
- **#34 Admin photo uploads: black boxes behind logos, and larger files than needed** (fixed, not live yet)
  Admin photo uploads are saved as JPEGs on white (no black boxes behind
  logos) and capped at 1600px (1200px for headshots).
- **#35 Home links and current-page highlighting** (fixed, not live yet)
  Home links point to the site root, and the current page is highlighted
  with or without ".html" in the address and announced to screen readers.
- **#36 No menu or fallback message when scripts or data files fail** (fixed, not live yet)
  With JavaScript off, each page shows a plain text menu, a short footer
  line and all its photos. When a data file fails to load, the section shows
  a short note with an email address instead of a blank space.
- **#37 Links and photo paths typed in the editor aren't checked** (fixed, not live yet)
  Links and photo paths typed into the data files are checked: bare web
  addresses get https://, site pages work from any page, unsafe links are
  dropped, unusual file names load, and a missing photo shows a plain box.
- **#38 'Call or text' links can only text** (fixed, not live yet)
  Recruitment and officer cards have separate Call and Text links.
- **#39 Motion settings: back-to-top button and the slow zoom on top photos** (fixed, not live yet)
  With reduced motion turned on, back to top jumps instead of scrolling, and
  the slow zoom on top photos is off. Otherwise the zoom plays once.
- **#40 Some buttons land at the top of a long page instead of the right section** (fixed, not live yet)
  Buttons that point to a section further down land on it (the rush form,
  Notable Alumni).
- **#41 Page titles and Google descriptions** (fixed, not live yet)
  Page titles and Google descriptions were rewritten; the academic page is
  titled "Academic Excellence".
- **#42 Link previews in social media and texts could look better** (fixed, not live yet)
  Every page's link preview has its image size, a description and image alt
  text.
- **#44 Small screen-reader wording fixes** (fixed, not live yet)
  Screen reader wording fixed: the Taxi Bash photo description, the logo
  link's name and the Donate fund headings.
- **#45 Donate page's check-memo instruction doesn't match the fund cards** (fixed, not live yet)
  The Donate page's check-memo line now matches the fund cards.
- **#46 Gallery captions show only on mouse hover** (fixed, not live yet)
  Gallery captions always show, not only on mouse hover.
- **#47 Visual effects that silently don't work** (fixed, not live yet)
  The card lift, the frosted blur behind the home buttons, the rounded form
  fields and the fade-in effects all work.
- **#48 Housekeeping: icons, caching, admin search rule and ignored files** (fixed, not live yet)
  favicon.ico added, caching rules set, /admin kept out of search results
  the right way, more files ignored, and the two unused icons removed.

## Done or turned down

- #1 Form confirmation messages never appear on the live site (done)
- #2 Old rush-form and Service page links now show 'Page Not Found' (done)
- #4 'Up to $22,500 a year' doesn't match the scholarship amounts listed (turned down by the owner)
- #5 James Voss's spacewalk is no longer the longest on record (done)
- #6 Jimmy Rane is listed as CEO, but he stepped down in October 2025 (done)
- #7 Retention and graduation stats on the Recruitment page have no source we could find (done)
- #8 Recruitment page gets the IFC timing wrong and leaves out an eligibility rule (done)
- #28 README and PLAN docs are out of date, and PLAN wrongly says the Habitat photos are AI-generated (done)
- #50 Remove the alumni reunion section after Oct 3 (done)
- #53 Chapter news is almost a year old (done)

Notes: #4, the owner said the scholarship figures are correct as they are. #8,
the timing was fixed, and the owner chose not to add the Path to the Plains /
Auburn First eligibility line. #1, the owner cancelled the follow-up test form
on Oct 21.
