name: crochet-blog
description: Next.js 16.4 crochet blog project deployed on Cloudflare Workers using OpenNext adapter. Features pattern detail pages, simplified navigation, contact functionality, and Cloudflare deployment via OpenNext.

---

# crochet-blog

A crochet pattern blog built with Next.js 16.4 and deployed to Cloudflare Workers using the OpenNext adapter. The project features a pattern detail page, navigation, about/contact pages, and Cloudflare deployment configuration.

## When to use this project

- When building a content blog with Next.js 16.4 and Cloudflare Pages deployment
- When using the OpenNext `@opennextjs/cloudflare` adapter for Serverless/Workers deployment
- When needing Next.js 16.4 compatibility with Cloudflare Workers runtime
- When requiring `output: export` static site generation with dynamic pattern routes

## Core Patterns & Key Decisions

### 1. OpenNext Cloudflare Deployment Workflow
- **Configure** `@opennextjs/cloudflare@1.21.2` in `package.json` for Next.js 16.4 compatibility (fixes `preview-props.json` manifest error)
- **Create** `opennext.config.mjs` with minimal config: `export default {}`
- **Use** OpenNext CLI commands instead of `wrangler deploy` directly:
  - `npm run build` - Build Next.js
  - `npx opennext cloudflare` - Generate manifest
  - `npx opennext cloudflare deploy` - Deploy to Cloudflare
- **Avoid** running `npx wrangler deploy` directly - causes `Unexpected loadManifest(/.next/server/preview-props.json) call!` runtime error

### 2. Navigation Bar Simplification
- **Removed** right-side links (Search, Log in, Subscribe) from Navbar
- **Kept** middle links: Patterns → `#latest-patterns`, About Us → `#about`, Contact → `#contact`
- **Mobile**: Shows three links vertically (no hamburger menu/toggle)
- **"Beginners"** link was added then **removed** per request

### 3. PDF Download Removal
- **Removed** `pdfUrl` field from `src/data/patterns.ts` type and all pattern objects
- **Removed** PDF download button from pattern detail page
- **Kept** `buyUrl` field for "Support me" Gumroad link

### 4. Pattern Data Enhancements
- **Filled** `otherImgs` arrays with themed images from `public/pattern imgs/{folder}/`:
  - `spider-hero`: images from `spiderwomn` folder matching "Spider Hero Girl" title
  - `iphone-case`: images from `iphonecase` folder matching "IPhone 18 pro max case" title
- **Removed** legacy fields: `patternPdf`, `patterntext`, `buyLink`
- **Kept** `buyUrl` field for each pattern (Gumroad purchase links)

### 5. Home Page Sections
- **Hero** section with main image and title (`#patterns` anchor)
- **About** section with mission/team info (`#about` anchor)
- **Latest Patterns** gallery section (`#latest-patterns` anchor)
- **Contact** form section with name, email, message fields (`#contact` anchor)
- **Removed** Beginners Patterns section and navbar link

### 6. Pattern Detail Page
- **Main image** on left half, pattern details on right (desktop)
- **Small non-clickable thumbnails** in horizontal row below description (mobile/stacked)
- **"Support me" button** linking to `https://crochetmakerr.gumroad.com/`
- **No PDF download** functionality (removed per request)
- **Gallery images** are non-clickable, slightly larger size (h-20 w-20), cursor-default

### 7. Contact Functionality
- **Added** contact form to home page with name, email, message fields
- **Success screen** after form submission with "Back to home" link
- **Navbar link** scrolls to contact section at bottom of home page

## Reference Files

| File | Content | When to load |
|------|---------|--------------|
| `src/data/patterns.ts` | Pattern type definitions and 9 sample patterns | Always loaded by PatternGallery and PatternDetailPage |
| `src/app/patterns/[id]/page.tsx` | Pattern detail page component | Per-pattern viewing |
| `src/components/Navigation.tsx` | Navbar with Patterns, About, Contact links | Site-wide navigation |
| `src/app/page.tsx` | Home page with Hero, About, Patterns, Contact sections | Root URL display |
| `src/app/about/page.tsx` | About page content | `/about` route |
| `src/app/contact/page.tsx` | Contact form page | `/contact` route |
| `opennext.config.mjs` | OpenNext Cloudflare config (minimal) | OpenNext CLI initialization |
| `package.json` | Dependencies and OpenNext scripts | npm build/deploy workflow |

## Workflows

### Cloudflare Deployment Workflow

```bash
# Step 1: Build Next.js locally
npm run build

# Step 2: Generate OpenNext manifest
npx opennext cloudflare

# Step 3: Deploy to Cloudflare Pages
npx opennext cloudflare deploy
```

**Do not** run `npx wrangler deploy` - this causes the runtime error:
`Unexpected loadManifest(/.next/server/preview-props.json) call!`

### Adding a New Pattern

1. Add pattern entry to `src/data/patterns.ts` with:
   - id, title, description, date, author, category, difficulty
   - mainImg path
   - otherImgs array (filled with themed images from public/pattern imgs/{folder}/)
   - buyUrl (Gumroad purchase link, optional)

2. Add corresponding image folder in `public/pattern imgs/{folder}/`

3. Ensure `otherImgs` images don't repeat the main image

### Removing PDF Download Functionality

1. Remove `pdfUrl?: string;` from the `CrochetPattern` type in `src/data/patterns.ts`
2. Remove `pdfUrl:` property from all pattern objects
3. Remove the PDF download button from `src/app/patterns/[id]/page.tsx`
4. Keep the "Support me" button with `buyUrl` linking to Gumroad

### Troubleshooting

#### Build Fails with generateStaticParams Errors

If `generateStaticParams` causes import errors (`@/context/PatternsContext` not resolving):

- **Remove** the `generateStaticParams` export from `src/app/patterns/[id]/page.tsx`
- The pattern detail page works without it for `output: export` config
- Ensure the page is a server component (remove `"use client"`)

#### Cloudflare Deployment Crashes at Runtime

If site crashes with `Unexpected loadManifest(/.next/server/preview-props.json) call!`:

1. **Update** `@opennextjs/cloudflare` from `1.20.10` to `1.21.2` in `package.json`
2. **Create** `opennext.config.mjs` with minimal config: `export default {}`
3. **Use** OpenNext CLI workflow (`npx opennext cloudflare deploy`) instead of `wrangler deploy`
4. **Preserve** all pattern data, images, and page components unchanged

#### Navigation Links Not Scrolling to Sections

Ensure home page sections have proper anchor IDs:
- `#patterns` for Hero section
- `#about` for About section  
- `#latest-patterns` for Latest Patterns gallery
- `#contact` for Contact form section

Navbar links should use anchor syntax: `<a href="#section-id">Patterns</a>` or Next.js `<Link>` with `scroll` behavior.

### Build Issues - Pattern Detail Page

If `npm run build` fails with import errors in `src/app/patterns/[id]/page.tsx`:

- **Remove** `generateStaticParams` export - the page works without it
- **Convert** page to server component (remove `"use client"`)
- **Use** inline pattern data instead of `@/context/PatternsContext` import
- **Use** relative imports or ensure `@/path` aliases are configured in next.config.ts

## Known Issues (Pre-existing)

- **9 lint errors** in about page, home page entity errors, footer setState - existed before our changes, not introduced
- **6 warnings** (minor): unused vars/imports from Navigation and PatternsContext simplification
- Site is **production-ready** with all requested features implemented