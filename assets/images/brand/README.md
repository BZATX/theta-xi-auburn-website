# Handoff: Beta Zeta House Marks — Web Kit

Five approved marks based on a drawing of the Beta Zeta chapter house (835 W Magnolia Ave, Auburn, AL), ready to drop into auburnthetaxi.com.

> **In this repo:** the kit lives in `assets/images/brand/`, so a mark's web path is `/assets/images/brand/svg/<file>.svg`. The live tab icons, `site.webmanifest` and `og-image.png` are copies of `icons/` at the site root. The `reference/` presentation sheets from the original handoff were not added to the site.

**All artwork is final.** Use these files as they are; don't redraw or restyle them. The lettering has been converted to shapes, so no fonts are needed and every file looks the same everywhere.

## Folder layout
- `svg/`: the main web files. Each mark comes in three versions:
  - `-light.svg`: navy on white. For light sections.
  - `-dark.svg`: white on navy. For navy sections, photo heroes and the footer. (2d Stamp keeps its white face and matches its perforations to navy.)
  - `-themable.svg`: colors come from CSS custom properties when the SVG is **inlined** in the page. Used as `<img>`, it shows the light colors.
- `png/`: raster fallbacks at 1×, 2× and 3× (`-2x`, `-3x`) with transparent backgrounds. For email signatures, social posts and anywhere SVG isn't supported.
- `icons/`: favicon (SVG plus 16/32/48 PNG), apple-touch-icon (180), PWA icons (192/512), `site.webmanifest`, and `og-image.png` (1200×630, used when the site is shared).
- `reference/`: the approved presentation sheets (HTML). Reference only.

## Marks
| id | name | file stem | base size | use |
|---|---|---|---|---|
| 1a | Roofline Wordmark | bz-house-mark-1a-roofline-wordmark | 300×145 | Donate/Alumni page headers |
| 1b | Circular Seal | bz-house-mark-1b-circular-seal | 200×200 | About page, footer |
| 2a | Two-Tone Seal | bz-house-mark-2a-two-tone-seal | 200×200 | Footer, merch/giving pages |
| 2d | Vintage Postage Stamp | bz-house-mark-2d-vintage-postage-stamp | 240×180 | Alumni newsletter, journal |
| 2e | Letterhead Lockup | bz-house-mark-2e-letterhead-lockup | 380×80 | **Navbar logo**, email signature |

Minimum display sizes: 2e 240px wide; seals and stamp 120px wide; 1a 180px wide. Anything smaller should use the favicon mark.

## Implementation

### Favicon + social (in `<head>`)
```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#03244D">
<meta property="og:image" content="https://auburnthetaxi.com/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```
Copy the contents of `icons/` to the site root.

### Navbar (switches from transparent over the hero to frosted white on scroll)
Inline `svg/bz-house-mark-2e-letterhead-lockup-themable.svg` in the navbar and switch colors with CSS:
```css
.navbar .bz-mark { --bz-ink:#FFFFFF; --bz-paper:#03244D; --bz-accent:#DD550C; height:44px; width:auto; transition:all .22s cubic-bezier(.22,.8,.3,1); }
.navbar.scrolled .bz-mark { --bz-ink:#03244D; --bz-paper:#FFFFFF; }
@media (max-width:640px){ .navbar .bz-mark { height:34px; } }
```
Add `class="bz-mark"` to the inlined `<svg>` element. All IDs inside each file are namespaced (`bz1a-…`, `bz2e-…`), so several marks can be inlined on the same page without conflicts.

### As images
```html
<img src="/assets/images/brand/svg/bz-house-mark-1b-circular-seal-dark.svg" alt="Beta Zeta Association of Theta Xi seal" width="200" height="200" loading="lazy">
```
Always set `width` and `height` to avoid layout shift. Mark-only images that sit next to the chapter name should use `alt=""`.

### Themable variables
- `--bz-ink`: linework and lettering (default #03244D)
- `--bz-paper`: fills behind the drawing (default #FFFFFF)
- `--bz-accent`: ΘΞ, rings and rules (default #DD550C)
- `--bz-bite`: stamp perforations only; set it to the page background (default #EDF2F9)

## Accessibility
Every SVG has `role="img"` and a `<title>` ("Beta Zeta Association of Theta Xi"). When a mark is a link to home, put the label on the link: `<a href="/" aria-label="Beta Zeta Association of Theta Xi — Home">`.

## Tokens
Navy #03244D · Auburn orange #DD550C · Azure #0072CE · White #FFFFFF · Field #EDF2F9. The lettering was drawn with Playfair Display and Inter (ΘΞ in Noto Serif) and converted to shapes.

## Notes
- Each SVG is 30–38 KB because of the detailed house drawing. Serve them with gzip or brotli, which brings them to about 8–10 KB. Don't run SVGO with `removeUselessDefs` or `cleanupIds` off-default, because the marks rely on `<symbol>` and `<use>`.
- The favicon is a simplified mark (roofline plus ΘΞ) made for 16–48px.
