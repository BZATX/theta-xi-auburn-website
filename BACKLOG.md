# Backlog: Oct 1, 2026 site scan

On Oct 1, 2026, twelve separate checks went through the whole site (security,
the admin editor, scripts, forms, links, search listings, facts,
accessibility, layout, speed, a live browser test of every page, and the
code's history), and every finding was re-checked by a second reviewer. This
file lists what is left from that scan. Each item was checked again against
the files on Oct 21, 2026.

**None of these are approved.** They are ideas and known problems, not tasks.
Ask the owner before working on any of them, follow the rules in `AGENTS.md`,
and update this file when an item is done or turned down. Line numbers can
drift; search for the text if a line doesn't match.

Status on Oct 21: 32 open, 7 partly done, 8 waiting on the owner or board, 9
done, 1 turned down.

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

## Left over from "fix now"

The rest of the original "fix now" group is done.

- **#9 Admin login stays saved on whatever computer it was used on** (open)
  Untick "Remember me" by default and relabel it so it is clearly for a
  personal device only (or forget the key when the tab closes). Also add
  "set a short expiration date" to the key setup steps.
  - Why it matters: Whoever has that key can change anything on the live
    site, including the donation links and the rush form.
  - Where: admin/index.html:47,51-58 · admin/admin.js:94,164-168,413-418

## Should fix

Accessibility barriers, inconsistencies, problems on some devices, and traps
for whoever edits the site next.

- **#10 Some text and buttons are too faint to read easily** (partly done)
  Three parts are still open and need the owner's OK first. (1) The
  light-blue labels over top-of-page photos are unchanged, including the
  faint one on Scholarships. (2) The white desktop menu text over the top
  photo measured about 4.4:1 on About, Accessibility and Brotherhood. (3)
  The grey example text inside form fields is still faint. The Accessibility
  page still claims the site meets the AA contrast standard.
  - Why it matters: Low-vision visitors struggle to read the main calls to
    action, and the Accessibility page currently claims the site meets this
    standard.
  - Where: css/main.css:154 (labels over photos) · css/main.css
    navbar:not(.scrolled) rules (top menu over photos) ·
    css/main.css:1489,1977 (form example text) · pages/accessibility.html:52
- **#11 In Windows High Contrast mode, the phone menu icon and form focus disappear** (open)
  Add a High Contrast section to css/main.css that redraws the phone menu
  lines and close X, the 'you are here' marker, checklist ticks, timeline
  line, stat dividers and back-to-top circle. Give form fields a see-through
  outline when focused so High Contrast mode shows it.
  - Why it matters: People who rely on this mode lose the menu button in
    narrow windows and can't track where they are in the rush and alumni
    forms.
  - Where: css/main.css:496-530 (menu button), 1487-1495 (form focus) ·
    js/layout.js
- **#12 The Explore drop-down menu won't close properly** (open)
  Make Escape close the Explore menu from anywhere in it, let a second tap
  close it on touch laptops and tablets, keep the open/closed state screen
  readers hear in step with what's on screen, and remove
  aria-haspopup="true".
  - Why it matters: Keyboard and touch users get stuck with a panel covering
    the page, and screen-reader users get wrong information.
  - Where: js/main.js:80-113 · css/main.css:449-458 · js/layout.js:50
- **#13 Phone menu stays open when the screen widens, and keyboard users can't reach its close button** (open)
  Still to do: close the phone menu on its own when the window widens to
  desktop size, let Tab reach the X button, hide the page behind the menu
  from screen readers while it's open, and move focus into the menu
  reliably. Nothing here has changed since the scan; the Oct 9-10 menu work
  only changed colors.
  - Why it matters: Tablet users and keyboard or screen-reader users can get
    stuck or lost in the menu.
  - Where: js/main.js:22-77 · css/main.css:534-594 (drawer/scrim), 1750-1752
    (64em breakpoint) · js/layout.js:65-86
- **#14 Form fields don't help phones autofill, and two fields handle answers badly** (open)
  Add autofill hints to the name, email, phone, address, employer, job title
  and LinkedIn fields. Make LinkedIn a plain text field. Give GPA a number
  keypad, a 0-5 check and a clearer label.
  - Why it matters: Rushees and alumni, mostly on phones, have to type more,
    and some alumni get blocked by a field that is supposed to be optional.
  - Where: pages/recruitment.html:223-248 · pages/update-info.html:52-89
- **#15 Screen readers may not announce that a form was sent** (open)
  Keep the message box on the page (empty) instead of hidden, use one
  announcement type, and add hidden text so the note reads 'Fields marked
  with an asterisk are required'.
  - Why it matters: Once the form-script fix above is live, a blind
    applicant may still not know whether their rush or alumni form went
    through.
  - Where: css/main.css:1498-1518 · js/main.js:441-488 ·
    pages/recruitment.html:220, 260 · pages/update-info.html:49, 101
- **#16 Scholarships page scrolls sideways on small phones** (open)
  Let the card columns shrink on very small phones (a one-line change per
  grid) on Scholarships, Philanthropy and Recruitment.
  - Why it matters: Scholarships is a key recruiting page, and it looks
    broken for visitors on small phones.
  - Where: pages/scholarships.html:46 · pages/philanthropy.html:59 ·
    pages/recruitment.html:158
- **#17 With very large text settings, the menu button and some words get cut off** (open)
  Stop the menu button from shrinking, let long words (officer email,
  'Recruitment Chairman', Kimley-Horn tile, headings) wrap, and hide the
  header Rush button only at very large text. The owner still needs to OK
  hiding that Rush button.
  - Why it matters: Visitors with poor eyesight can lose the menu button and
    parts of the contact details.
  - Where: css/main.css:496-509 (menu button), 1063-1092 (officer cards),
    1397-1447 (logo tiles), 683-684 (page headings), 1750-1760
- **#18 Pages load slowly on phones because photos are too big and load too early** (open)
  Tell browsers to load each page's top photo first and load lower photos as
  the visitor scrolls. Re-save the oversized home photos, the crest and the
  Founding Fathers picture at smaller file sizes.
  - Why it matters: Rushees and parents on cellular data stare at a blank
    top section for several seconds and use extra data.
  - Where: index.html:83-86, 131-169 · assets/images/backgrounds/ ·
    assets/images/portraits/officers-2026/group-picture.jpg ·
    assets/images/system/crest traditional.png ·
    assets/images/dynamic/FoundingFathers.png · pages/history.html:11, 49
- **#19 Printed pages come out mostly blank, and stats read as '0' until scrolled to** (open)
  Add print settings: show all sections, hide the menu and background
  photos, print text in black. Keep the real stat numbers readable by screen
  readers and printers instead of '0' until scrolled to.
  - Why it matters: A donor printing the Donate page to mail a check, or a
    parent printing the Parents page, gets very little usable information.
  - Where: css/main.css · js/main.js:132-167 · index.html:102-114 ·
    pages/recruitment.html:127-141 · pages/donate.html
- **#20 Yulista employer tile has no description, is a very large file, and contains a third-party photo** (open)
  Replace the Yulista tile with a plain logo labelled 'Yulista Aviation' (or
  a text tile reading 'Yulista' if no clean logo is available), like the
  other employers.
  - Why it matters: Blind visitors miss Yulista, the page loads slower, and
    the background photo may belong to someone other than Yulista.
  - Where: pages/why-theta-xi.html:115 · assets/images/employers/yulista.png
    · css/main.css:1436-1445
- **#21 Privacy page doesn't match how forms and data are actually handled** (open)
  The owner decided the privacy page stays general, so the Drive
  spreadsheet, automated assistant and Google Forms details are declined.
  Three wording errors are still on the page: it says only 'a few' fields
  are required (the rush form requires 6 of 7), it says 'call us' with no
  number, and the alumni form says updates are used 'only' for records while
  the privacy page also mentions contacting people about events. The owner
  can still check that the two scholarship Google Forms accept responses and
  are owned by a chapter account.
  - Why it matters: The privacy page is the chapter's public promise about
    personal data, some of it from high-school students, and it currently
    understates what is collected and who handles it.
  - Where: pages/privacy.html:45, 55, 61, 67 · pages/update-info.html:99 ·
    pages/scholarships.html:51, 57
- **#22 Admin login instructions don't work now that the site belongs to the BZATX organization** (open)
  Rewrite the token steps on the admin login page and in the README: join
  the BZATX organization, set Resource owner to BZATX, and get the key
  approved. Make login test that the key can save, and keep any error on
  screen. The owner also needs to add board editors to the BZATX GitHub
  organization and approve their keys.
  - Why it matters: Board members who follow the steps either get stuck or
    think they're logged in when they can't save, so in practice only the
    webmaster can use the backup editor.
  - Where: admin/index.html:51-59 · admin/admin.js:111-116, 164-173, 360-405
    · README.md:202-204
- **#23 Contact fields in the admin 'Chapter Info' tab change nothing on the site** (partly done)
  The README now says these fields do nothing and where contact details
  really live. The editor still shows the address, email, Instagram and
  Facebook fields and says 'Saved!', and chapter.json still holds the unused
  contact and rush-chair fields. The owner still needs to decide: remove the
  fields or connect them to the site.
  - Why it matters: Someone updating contact details in the editor will
    believe it worked while the old details are still showing.
  - Where: admin/admin.js:76-89 · data/chapter.json · js/layout.js:10-14,
    120-123 · pages/recruitment.html:52, 204, 214 · README.md:109-118,
    195-197
- **#24 Gallery photos tagged 'service', 'house' or 'other' never appear anywhere** (partly done)
  The README is corrected. The admin editor still says 'service' photos show
  on a Service page that no longer exists, and it still offers
  service/house/other tags that never appear anywhere. The owner still needs
  to decide whether Philanthropy gets its own gallery; otherwise the editor
  should offer only 'brotherhood'.
  - Why it matters: The first person who follows the editor's hint or the
    README's example (adding Habitat photos to the 'service' gallery) will
    think the upload failed.
  - Where: admin/admin.js:32-44 · pages/brotherhood.html:73 ·
    pages/philanthropy.html · README.md:107, 120
- **#25 Admin editor can publish blank cards, misplace photos, or silently skip edits** (open)
  The backup editor still lets a blank card or an empty stat (published as
  0) go live, can attach a photo that is still uploading to the wrong
  person, saves only the open tab with no unsaved-changes warning, and has
  no Phone field for officers.
  - Why it matters: Small slips by a board member go straight to the live
    site or quietly disappear.
  - Where: admin/admin.js:22-30, 194-198, 300, 339-344, 347-366, 392-410
- **#26 Eric O'Neill's photo comes from Wikimedia Commons and is shown without the required credit** (open)
  There is still no credit for Eric O'Neill's photo. Someone needs to get
  the photographer and license from the Wikimedia Commons page, or a photo
  from O'Neill; then a small credit line goes under the photo and in the
  README.
  - Why it matters: Using the photo without the credit breaks its license,
    which technically makes the use a copyright infringement.
  - Where: data/alumni.json:22 · js/main.js:278-283 · README.md:262-275
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

- **#30 Add an extra layer of browser security** (open)
  Still to do: add a Content Security Policy (test mode on public pages,
  enforced on /admin/), remove the outdated X-XSS-Protection line, and drop
  the referrer setting from the three map embeds.
  - Why it matters: We found no actual hole, but this setting is the one
    thing that would stop a sneaked-in script from sending the admin key or
    rush entries elsewhere.
  - Where: _headers · index.html:285 · pages/parents.html:99 ·
    pages/recruitment.html:283
- **#31 Phone layout polish: officer and news cards, logo subtitle** (partly done)
  News cards are fixed. On phones, the officer and alumni cards still get
  the extra padding around their photos, and the logo line 'Beta Zeta ·
  Auburn' still breaks onto two lines at 360-375px.
  - Why it matters: It's minor, but it's on the most-viewed phone layouts
    and in the logo on every page.
  - Where: css/main.css:1785 · js/layout.js:43 · css/main.css:343-350
- **#32 Admin login and save errors are confusing** (open)
  Still to do: the editor should always load fresh copies and explain the
  'changed since you opened it' error, forget the saved key only when GitHub
  actually rejects it, and let Enter submit the login.
  - Why it matters: GitHub shows a key only once, so editors must create a
    new one without knowing why, and the stale-version error makes them redo
    work.
  - Where: admin/admin.js:138-155, 175-192, 404-405, 413-418 ·
    admin/index.html:43-48
- **#33 Admin editor is hard to read in dark mode** (open)
  Still to do: dark-mode colors for the admin cards, tabs and buttons, and a
  header subtitle color that can be read in light mode.
  - Why it matters: Board members whose phones are in dark mode will
    struggle to read the editor.
  - Where: admin/admin.css:78, 102, 132 · admin/index.html:28
- **#34 Admin photo uploads: black boxes behind logos, and larger files than needed** (open)
  Still to do: uploads should get a white background before saving (so logos
  don't get black boxes), and headshots and news covers should use a smaller
  size limit (about 1200px) than gallery photos.
  - Why it matters: A logo upload looks broken, and each year's officer
    update makes the pages a little slower.
  - Where: admin/admin.js:368-389
- **#35 Home links and current-page highlighting** (open)
  Still to do: the menu should ignore '.html' when highlighting the current
  page, and the logo, Home and 'Back to Home' links should point to '/'
  instead of index.html.
  - Why it matters: A minor point: shared links lose the 'you are here' cue,
    and search engines see two addresses for the home page.
  - Where: js/layout.js:8, 31, 39, 48, 74 · pages/accessibility.html:81
- **#36 No menu or fallback message when scripts or data files fail** (open)
  Still to do: a plain text menu for visitors without JavaScript, and a
  short 'couldn't load this, email us' message when the officers, alumni or
  news data fails to load.
  - Why it matters: It's rare, but when it happens visitors have no way
    around the site and no explanation.
  - Where: index.html:78, 310 · pages/*.html · js/main.js:178-187, 248, 274,
    300
- **#37 Links and photo paths typed in the editor aren't checked** (open)
  Links typed in the editor are still used exactly as entered: no 'https://'
  is added, and every alumni and news link opens in a new tab, including the
  alumni card's own-site 'Update your contact info' link. Photo paths still
  have quotes stripped, so a file name with an apostrophe shows a blank
  card, and an entry with no photo still points the photo box at the page
  itself.
  - Why it matters: Small typos in the editor turn into broken links or
    blank cards on the live site.
  - Where: js/main.js:176-177, 254, 279, 284, 313, 320 · data/alumni.json:40
- **#38 'Call or text' links can only text** (open)
  The Recruitment page quote still says 'call or text' but links only to
  Messages (sms:), and the officer card for anyone with a phone number still
  reads 'Call or text' with a text-only link. Split each into separate
  'Call' and 'Text' links.
  - Why it matters: A parent who wants to call can't do it with one tap.
  - Where: pages/recruitment.html:204 (lines 52 and 214 say 'Text' and are
    fine) · js/main.js:261
- **#39 Motion settings: back-to-top button and the slow zoom on top photos** (open)
  The back-to-top button still always scrolls smoothly, even for visitors
  who have turned on reduce motion, because the script asks for smooth
  scrolling directly. The top-photo zoom still loops forever unless that
  setting is on; making it play once is optional.
  - Why it matters: Visitors who are sensitive to motion can find constant
    movement uncomfortable.
  - Where: js/layout.js:161-163 · css/main.css:617, 1737-1745
- **#40 Some buttons land at the top of a long page instead of the right section** (open)
  The 'Rush Theta Xi' button on Why Theta Xi still goes to the top of the
  Recruitment page instead of the form (#application). The Notable Alumni
  section still has no anchor, so the History and Update Info buttons land
  at the top of the Alumni page, three sections above it.
  - Why it matters: Visitors who are ready to act have to scroll to find
    what the button promised.
  - Where: pages/why-theta-xi.html:129 · pages/alumni.html:87 ·
    pages/history.html:64 · pages/update-info.html:114
- **#41 Page titles and Google descriptions** (open)
  The academics page is still titled 'Scholarship' (next to 'Scholarships')
  and the footer still calls it 'Academic Excellence'. The officers
  description still promises undergraduate members that the page doesn't
  list, and the Scholarships (191 characters) and Philanthropy (169)
  descriptions are still over about 155 characters.
  - Why it matters: Someone searching for scholarship money can land on the
    academics page, and cut-off descriptions lose their key point.
  - Where: pages/scholarship.html:7, 9 · js/layout.js:116 ·
    pages/scholarships.html:8, 74 · pages/leadership.html:8, 10 ·
    pages/philanthropy.html:8, 10
- **#42 Link previews in social media and texts could look better** (open)
  The same nine pages still have no large-image or image-size tags. Only the
  home page has the page-type and address tags, and no page has site-name or
  image-description tags. History's preview is still the small portrait
  image.
  - Why it matters: Recruitment and Scholarships links are the ones most
    often sent to rushees, and a large preview picture draws more clicks.
  - Where: Tags at the top of index.html and pages/*.html ·
    pages/history.html:11
- **#44 Small screen-reader wording fixes** (open)
  The Taxi Bash photo description still says 'on the front lawn', but the
  photo shows a paved lot with a tarp, so it should be corrected. The logo
  link's hidden label still leaves out 'Beta Zeta', and the two Donate group
  labels are still not real headings.
  - Why it matters: Screen-reader and voice-control users get wrong or
    missing information.
  - Where: pages/philanthropy.html:47 · js/layout.js:39 ·
    pages/donate.html:50, 88
- **#45 Donate page's check-memo instruction doesn't match the fund cards** (open)
  The Venmo/check line still says to put 'the fund name in the memo', while
  the cards ask for the memos 'General', 'Move-In Fund' and 'ATM Building
  Fund'. Change it to point to the memo shown on each card.
  - Why it matters: Donors may write the card's title instead of the memo
    the treasurer expects.
  - Where: pages/donate.html:80
- **#46 Gallery captions show only on mouse hover** (open)
  Brotherhood gallery captions still appear only on mouse hover, so phone
  and keyboard users never see them. Each caption is still also used as the
  photo's description, so screen readers read it twice.
  - Why it matters: Most visitors use phones and miss the captions entirely.
  - Where: css/main.css:1348-1363 · js/main.js:426-428
- **#47 Visual effects that silently don't work** (open)
  None of these fixes are in. Cards that fade in still can't lift on hover,
  and the setting on fade-in elements that blocks the frosted blur behind
  the home page's top buttons is still there. Form fields still change
  corner shape when clicked, and the duplicate rules haven't been cleaned
  up.
  - Why it matters: The design looks inconsistent, and dead rules make
    future edits riskier.
  - Where: css/main.css:1722-1731, 246-250, 1798-1802 · duplicates near
    524-528, 914-919, 1043
- **#48 Housekeeping: icons, caching, admin search rule and ignored files** (open)
  The housekeeping is all still to do: there's no /favicon.ico, the 48-pixel
  icon isn't linked, the two unused icons are still in the site, robots.txt
  still blocks /admin/, no caching rules are set, and .gitignore still
  doesn't cover .env, .netlify/ or downloaded .csv files.
  - Why it matters: These are small tidiness and speed gains, plus a guard
    against accidentally publishing a downloaded list of rush applicants.
  - Where: robots.txt:3 · _headers · .gitignore ·
    assets/images/system/favicon.png, apple-touch-icon.png · favicon-48.png
    (root) · page <head> sections

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
