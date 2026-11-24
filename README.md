# NextRole

**NextRole** is an AI-assisted job application tracker that helps job seekers capture job postings quickly, manage their application pipeline visually, measure CV-to-job match scores, and stay on top of H+7 follow-ups.

## Key Features

- **Smart Job Clipper** — Paste a raw job description or job URL to extract structured details (company, role, location, salary, and key requirements) with built-in deduplication caching and daily quota management.
- **Visual Kanban Pipeline** — Track applications across 5 actionable stages (`Applied`, `Follow-Up Needed`, `Interview`, `Offered`, `Rejected / Ghosted`) with drag-and-drop updates and activity history.
- **Permanent JD Archiving** — Saves a permanent snapshot of each job description so details stay accessible even after the original posting expires.
- **Semantic CV Match Score** — Upload your PDF resume once and automatically see a 0–100% relevance score against every saved job posting.
- **H+7 Follow-Up Assistant** — Automatic follow-up reminders with polite Indonesian & English draft message generation.
- **1-Click Guest Demo & Google OAuth** — Try the workspace immediately in guest mode or sign in with Google.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Runtime & Package Manager:** Bun
- **Database & Vector Search:** PostgreSQL (Neon Serverless + `pgvector`) with Prisma ORM
- **AI Engine:** Vercel AI SDK + Google Gemini (`gemini-3.5-flash-lite` & `gemini-embedding-2`)
- **Object Storage:** Cloudflare R2 (Private Bucket + Presigned URLs)
- **Authentication & API Docs:** Auth.js v5 (`next-auth`) & Scalar OpenAPI (`/docs`)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) `>= 1.2`
- A PostgreSQL database with `pgvector` enabled (e.g., [Neon](https://neon.tech/))
- API credentials for Google Gemini, Google OAuth, and Cloudflare R2

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ilsetiawan1/next-role.git
cd next-role

# 2. Install dependencies
bun install

# 3. Configure environment variables
cp .env.example .env
# Fill in DATABASE_URL, DIRECT_URL, GEMINI_API_KEY, AUTH_*, and R2_* values

# 4. Run database migrations & generate Prisma client
bunx prisma migrate dev
bunx prisma generate

# 5. Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser, and view interactive API documentation at `/docs`.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the Next.js development server |
| `bun run build` | Build the production application |
| `bun run start` | Start the production server |
| `bun test` | Run unit and integration tests |
| `bun run lint` | Run ESLint checks |

## Documentation

- [Product Requirements (PRD)](docs/PRD.md)
- [Technical Specification (TSD)](docs/TSD.md)
- [Design System](docs/DESIGN.md)

## License

MIT
