# Clifford Santos — Portfolio Website (PRD)

## Original problem statement
> Build my portfolio website. Inspiration: Mina Massoud, Bschoder, Vanschneider, Juan Mora. Keep color scheme from current site (cliffordsantos.com/cliffordsantos). Use uploaded resume to refresh content. Improve the existing logo monogram. Contact form with backend. Responsive. Editable content for main sections + projects/case studies.

## User decisions
- **Design vibe**: Juan Mora + Mina Massoud blend (editorial, distinctive, asymmetric, bold display type).
- **Color scheme**: pulled live from cliffordsantos.com — cyan `#0093c9`, navy `#2c3e50`, deep navy `#004965`.
- **Logo**: refined CS monogram (custom inline SVG inspired by original).
- **Sections kept**: About, Experience, Projects/Case Studies, Skills, Education, Contact. (Blog removed.)
- **Backend stack**: Python/FastAPI + MongoDB (PHP not supported on Emergent).
- **Admin auth**: single email/password JWT.
- **Contact form**: stored in admin dashboard, no email integration.

## Architecture
- **Backend**: FastAPI single-file (`/app/backend/server.py`), MongoDB via Motor.
  - Auth: JWT (HS256, 24h), httpOnly cookie + Bearer header fallback. bcrypt hashing. Admin seeded on startup from `.env`.
  - Public endpoints: `/api/site`, `/api/projects`, `/api/experience`, `/api/education`, `/api/skills`, `POST /api/contact`.
  - Admin endpoints (protected): full CRUD on projects/experience/education + site/skills updates + messages list/read/delete.
  - All MongoDB IDs are UUID strings (never ObjectId in responses); singleton docs (`site`, `skills`) use `_id` excluded on read.
- **Frontend**: React + React Router + Tailwind + Framer Motion + Lenis smooth scroll.
  - Routes: `/` (Portfolio), `/admin` (login), `/admin/dashboard` (CMS).
  - Fonts: Cabinet Grotesk (display) + Satoshi (body) from Fontshare.
  - Custom dot/ring cursor, marquee, asymmetric bento, kinetic underline links, grain texture in About.
  - Admin CMS: 6 tabs — Site, Projects, Experience, Education, Skills, Messages.

## Implemented (2026-01)
- ✅ Public portfolio site fully designed and content-complete from resume + live-site projects.
- ✅ 12 project bento grid with modal detail view.
- ✅ Experience timeline (4 jobs from resume, 2008–2026).
- ✅ Education sticky card.
- ✅ Skills grouped (Design / Development / Marketing / CRM / AI / Workflow).
- ✅ Contact form posting to backend, stored in DB.
- ✅ Refined CS monogram logo (inline SVG).
- ✅ Admin login + dashboard with full CRUD across all content types.
- ✅ Responsive: mobile menu, stacking layouts, bento collapses to 1-col.
- ✅ Tested: 19/19 backend tests pass; frontend e2e flows verified (Playwright).

## Code-quality hardening (2026-01)
- ✅ Auth: removed localStorage token storage — frontend now relies solely on httpOnly+secure cookies (XSS-safe).
- ✅ CORS: `allow_credentials=True` with explicit origins from `CORS_ORIGINS` env var.
- ✅ Test secrets: pulled from `.env` via dotenv (no hardcoded creds).
- ✅ `Projects.jsx`: extracted `ProjectCard` subcomponent (cyclomatic complexity reduced).
- ✅ `seed()` decomposed into `_seed_admin / _seed_singleton / _seed_collection / _ensure_indexes` helpers.
- ✅ All FastAPI endpoints have explicit return type hints.
- ✅ React error logging: every `.catch()` now logs via `console.error` (no silent failures).
- ✅ Stable composite keys replace array-index keys in dynamic editors and marquee.

## Test credentials
- Admin: `clifforddapogi@gmail.com` / `Clifford2026!`
- Stored at `/app/memory/test_credentials.md`

## Backlog / next iterations
- **P1**: Email delivery for contact form (Resend or SendGrid) — currently stored only.
- **P1**: Rich-text/markdown editor for paragraphs + image uploads (replace URL fields).
- **P1**: Drag-to-reorder projects in admin.
- **P2**: Case-study detail pages with multi-image galleries.
- **P2**: SEO: sitemap.xml, OG tags, structured data.
- **P2**: Light/dark theme toggle.
- **P3**: Brute-force lockout on admin login.
- **P3**: Analytics (Plausible/Vercel Analytics).
