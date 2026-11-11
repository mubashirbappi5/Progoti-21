# 🌟 Progoti 21 – Eid-ul-Fitr Reunion 2027 Survey Platform

A modern, responsive, production-ready survey and event planning platform designed for **Progoti 21 – Eid-ul-Fitr Reunion 2027**. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, and **Neon Serverless PostgreSQL** via Drizzle ORM.

---

## 📋 Table of Contents

- [1. Overview & Architecture](#1-overview--architecture)
- [2. Design & Theme](#2-design--theme)
- [3. Feature Highlights](#3-feature-highlights)
- [4. Technology Stack](#4-technology-stack)
- [5. Database Architecture (Neon PostgreSQL)](#5-database-architecture-neon-postgresql)
- [6. Getting Started Locally](#6-getting-started-locally)
- [7. Environment Variables](#7-environment-variables)
- [8. Database Migrations & Seeding](#8-database-migrations--seeding)
- [9. Admin Dashboard & Authentication](#9-admin-dashboard--authentication)
- [10. Testing](#10-testing)
- [11. Production Deployment on Vercel](#11-production-deployment-on-vercel)

---

## 1. Overview & Architecture

Progoti 21 is organizing a memorable reunion after Eid-ul-Fitr 2027. This platform enables batch members to submit their detailed preferences regarding:

1. **Personal Information**: Full Name & Bangladeshi Mobile Number (`01[3-9]\d{8}`).
2. **Reunion Date**: 2nd day after Eid, 3rd day after Eid, or Custom Date (with interactive date picker).
3. **Food Menu**: Biryani, Morog Pulao, Fried Rice + Chicken, or Custom Food Preference.
4. **Meal Schedule**: Lunch Only or Lunch + Evening Snacks.
5. **Reunion Gifts**: Customized Gift Box, Signature T-Shirt, or Custom Souvenir.
6. **Reunion Activities**: Multi-select (maximum 3) from Cultural Program, Games, Storytelling, Photo Booth, Batch Networking, Award Ceremony, Surprise Performances, or Custom Activity.
7. **Previous Pitfalls to Avoid**: Multi-select (maximum 3) from Long Speeches, Excessive Photo Sessions, Lengthy Programs, Delayed Food, Overly Formal Environment, or Custom Suggestion.
8. **Additional Suggestions**: Freeform textarea for ideas and requests.

> **Zero Spreadsheet Storage**: All responses are stored permanently in Neon Serverless PostgreSQL with atomic unique constraints to prevent duplicate entries.

---

## 2. Design & Theme

- **Color Palette**: Deep Navy (`#050c18`, `#0b192c`), Pearl White (`#f8fafc`), and Warm Gold (`#d4af37`, `#f59e0b`).
- **Glassmorphism**: Subtle translucent panels with golden glowing borders (`glass-panel-glow`).
- **Smooth Animations**: Powered by `framer-motion` for step transitions and card interactions.
- **Celebratory Celebration**: Confetti animation (`canvas-confetti`) on the Success Screen.
- **Mobile First**: 100% responsive across mobile phones, tablets, laptops, and desktop screens.

---

## 3. Feature Highlights

- **8-Step Guided Stepper**: Visual progress bar, step indicators, and back/forward navigation.
- **Strict Server & Client Validation**:
  - Bangladeshi mobile number format check (`01[3-9]\d{8}`).
  - Dynamic conditional validation for custom dates, foods, gifts, and activities.
  - Strict maximum of 3 selections for activities and avoidance questions.
  - Duplicate mobile prevention at both application and database level.
- **Protected Admin Dashboard**:
  - Secure login with bcrypt password comparison and HTTP-only JWT cookies (`jose`).
  - Real-time KPI metric cards (Total submissions, unique participants, top date, top food, top gift, top activity).
  - Searchable and filterable table (by name, mobile, date choice, food choice, and date sorting).
  - Full response detail modal.
  - Delete submission with confirmation modal.
  - Instant CSV export with UTF-8 BOM encoding for Excel/Sheets.
  - Interactive charts via Recharts (Bar, Pie/Donut, Horizontal ranking charts).

---

## 4. Technology Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database Driver**: [`@neondatabase/serverless`](https://neon.tech/)
- **Validation**: [Zod](https://zod.dev/)
- **Auth & Cryptography**: `jose` (JWT) & `bcryptjs`
- **Effects**: `canvas-confetti`

---

## 5. Database Architecture (Neon PostgreSQL)

### Table: `reunion_submissions`

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | Primary Key, `default gen_random_uuid()` | Unique submission identifier |
| `full_name` | `VARCHAR(255)` | `NOT NULL` | Participant's name |
| `mobile_number` | `VARCHAR(32)` | `NOT NULL, UNIQUE` | Normalized BD mobile number |
| `preferred_date` | `VARCHAR(100)` | `NOT NULL` | Date choice |
| `custom_date` | `DATE` | `NULLABLE` | Conditional custom date |
| `preferred_food` | `VARCHAR(100)` | `NOT NULL` | Food menu preference |
| `custom_food` | `TEXT` | `NULLABLE` | Conditional custom food |
| `meal_schedule` | `VARCHAR(100)` | `NOT NULL` | Lunch Only / Lunch + Snacks |
| `preferred_gift` | `VARCHAR(100)` | `NOT NULL` | Gift souvenir choice |
| `custom_gift` | `TEXT` | `NULLABLE` | Conditional custom gift |
| `preferred_activities` | `JSONB` | `NOT NULL` | Array of chosen activities (max 3) |
| `activities_to_avoid` | `JSONB` | `NOT NULL` | Array of experiences to avoid (max 3) |
| `additional_suggestions`| `TEXT` | `NULLABLE` | Freeform suggestions |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Submission timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT now(), NOT NULL` | Update timestamp |

---

## 6. Getting Started Locally

### Prerequisites

- Node.js 18.x or later (Node 20+ recommended)
- `pnpm` (or `npm`)
- A free [Neon](https://neon.tech) PostgreSQL account

### 1. Clone & Install Dependencies

```bash
git clone <repository-url>
cd "Progoti 21"
pnpm install
```

### 2. Configure Environment Variables

Create `.env.local` by copying `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your Neon connection string in `.env.local`:

```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@ep-xyz-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
ADMIN_EMAIL=admin@progoti21.org
ADMIN_PASSWORD_HASH=$2b$10$sYOYRrTlPWkLON2SYbfDE.SZl58YMlS4moYHCJcZrXdO0g0Oi4GcO
AUTH_SECRET=progoti-21-super-secret-jwt-key-2027-reunion-secure-32chars
```

*(Default password for testing: `Progoti21@Admin`)*

### 3. Run Database Migrations

Apply the database schema directly to your Neon PostgreSQL instance:

```bash
node scripts/migrate.mjs
# Or with Drizzle Kit:
pnpm db:push
```

### 4. (Optional) Seed Sample Submissions

Populate sample batch responses to preview the Admin Dashboard & Charts:

```bash
pnpm db:seed
```

### 5. Start the Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | **Yes** | Neon Serverless PostgreSQL connection string (`sslmode=require`) |
| `ADMIN_EMAIL` | **Yes** | Committee admin login email (default: `admin@progoti21.org`) |
| `ADMIN_PASSWORD_HASH` | **Yes** | Bcrypt hash of admin password |
| `AUTH_SECRET` | **Yes** | Secret string (32+ chars) used to sign JWT cookies |

To generate a new bcrypt password hash:

```bash
node -e "console.log(require('bcryptjs').hashSync('YourNewPasswordHere', 10));"
```

---

## 8. Database Migrations & Seeding

- `drizzle/0000_noisy_shiver_man.sql`: Complete Drizzle SQL migration file creating `reunion_submissions` table with unique constraint and indexes.
- `scripts/migrate.mjs`: Node.js migration runner connecting directly to Neon.
- `scripts/seed.mjs`: Seeds realistic Progoti 21 batch responses.
- `drizzle.config.ts`: Drizzle Kit configuration.

---

## 9. Admin Dashboard & Authentication

1. Navigate to `/admin/login` (or click **Admin** in the navigation header).
2. Enter:
   - **Email**: `admin@progoti21.org`
   - **Password**: `Progoti21@Admin`
3. Access:
   - **Overview**: Real-time KPI summaries.
   - **Interactive Charts**:
     - Reunion Date Preferences (Bar Chart)
     - Food Menu Breakdown (Donut Chart)
     - Meal Arrangement (Pie Chart)
     - Gift Souvenir (Bar Chart)
     - Top Activities (Horizontal Ranking Chart)
     - Pitfalls to Avoid (Horizontal Ranking Chart)
   - **Responses Table**: Search by name or phone, filter by date or food, sort by date, view full submission details in a modal, delete response with confirmation.
   - **One-Click CSV Export**: Download complete dataset with UTF-8 BOM encoding for Excel/Sheets.
   - **Logout**: Clears HTTP-only session cookie.

---

## 10. Testing

Run the automated test suite covering phone regex validation, normalization, conditional field constraints, max-3 rules, Zod schema validation, and JWT session handling:

```bash
node --experimental-strip-types scripts/test-suite.mjs
```

All 20 unit and integration tests execute and pass out-of-the-box.

---

## 11. Production Deployment on Vercel

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import the repository.
4. In the **Environment Variables** section, add:
   - `DATABASE_URL`: Your pooled Neon connection string.
   - `ADMIN_EMAIL`: Your admin email.
   - `ADMIN_PASSWORD_HASH`: Your bcrypt password hash.
   - `AUTH_SECRET`: Random 32+ character string (`openssl rand -base64 32`).
5. Click **Deploy**. Vercel will build the Next.js project and deploy it on global edge infrastructure.
6. Run the migration once against your Neon database (`node scripts/migrate.mjs` or via Neon Console SQL Editor).

---

## ❤️ Proudly Built for Progoti 21 Batch
Eid-ul-Fitr Reunion 2027 • Creating Unforgettable Memories Together.

