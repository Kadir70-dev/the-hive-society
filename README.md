# The Hive Society

A social discovery and booking platform for women in the UAE.

> "No one has to show up alone."

## Overview

The Hive Society is an Abu Dhabi-first social discovery and booking platform for women. It helps women answer three questions:

- **What should I do?**
- **Where should I go?**
- **Who can I go with?**

The platform combines five pillars into one experience:

- **Discovery** — curated activities and gatherings across Abu Dhabi
- **Community** — recurring circles and a sense of belonging beyond a single event
- **Trust** — verified hosts and visible attendee context before you commit
- **Booking** — reserving a spot for an activity
- **Membership** — tiered access to community and gatherings

The initial focus is Abu Dhabi, with future expansion planned across the UAE.

## Problem

Today, the experience of finding something to do is fragmented across:

- Instagram
- WhatsApp groups
- individual booking apps
- venue pages
- word-of-mouth community recommendations

Even once something is found, there's a common emotional barrier that none of these tools solve:

> "I would love to go, but I don't want to arrive alone."

## Solution

The Hive Society brings together the pieces that are normally scattered across different apps and group chats:

- activity discovery
- community context around each activity
- visibility into which women are attending
- bookings and reservations
- circles ("My Hive") — recurring groups that meet again and again
- membership tiers
- host / organiser relationships

## Product Areas

### Public Website

- Home
- Explore
- Community
- Membership
- Host an Activity
- Partners
- About
- Contact
- Privacy
- Terms
- Community Guidelines

### Product App Shell

- Explore
- My Hive
- Messages
- Profile
- Activity details (experiences)
- Circle details
- Pre-event interaction
- Reservations
- Community circles

## Current Status

This repository currently contains a polished frontend / product prototype.

Current limitations:

- Static data (no CMS or database)
- No production backend
- No real authentication
- No real payments
- No live booking engine
- No production messaging backend

These are intentionally out of scope for this stage of the project.

## Tech Stack

Versions below are read directly from `package.json`.

- [Next.js](https://nextjs.org/) 16.3.3 — App Router
- [React](https://react.dev/) 19.2.0
- [TypeScript](https://www.typescriptlang.org/) ^5.7.2 — `strict: true`, `noUncheckedIndexedAccess`
- ESLint 9 with `eslint-config-next`
- Token-based global CSS (`src/app/globals.css`) — no CSS framework, chosen to keep the design system explicit and framework-independent
- `next/image` for all photography, served from `public/images/`
- `next/font` for Google Fonts (Fraunces, Inter) — self-hosted, no runtime font requests
- `sitemap.ts` / `robots.ts` file conventions for SEO

## Design System

- **Fraunces** — editorial serif, used for headlines and brand voice
- **Inter** — UI and body sans-serif
- A warm sand / cream / espresso / honey color palette
- A premium, editorial Abu Dhabi aesthetic — not a generic SaaS template
- 3D-illustrated lifestyle imagery throughout
- Fully responsive layouts, mobile through desktop
- Two distinct visual shells sharing one design language:
  - the marketing website (top navigation, footer)
  - the product / community application (persistent sidebar shell)

## Repository Structure

```
src/
  app/
    (marketing)/            Public website routes (Home, Explore, Community, ...)
      layout.tsx             Top nav + footer shell
      page.tsx, explore/, community/, membership/, host/, partners/,
      about/, contact/, privacy/, terms/, community-guidelines/
    (product)/app/           Product app shell routes
      layout.tsx             Persistent sidebar shell
      page.tsx                redirects to /app/explore
      explore/, hive/, messages/, profile/
      experiences/[slug]/     dynamic activity detail routes
      circles/[slug]/         dynamic circle detail routes
    globals.css              Token-based global styles (the full design system)
    layout.tsx               Root layout (fonts, metadata)
    robots.ts                robots.txt (file convention)
    sitemap.ts               sitemap.xml (file convention)
    icon.png / apple-icon.jpg  Favicon / touch icon
  components/
    marketing/               Header, Footer, mobile nav, cards, sign-in modal
    product/                 App sidebar, activity cards/grid, event modal, reserve button
    forms/                   Contact, host application, membership waitlist forms
    ui/                      Shared primitives (Button, Badge, Modal, LogoMark, PhotoTile, ...)
  data/                      Static content: experiences, circles, organizers, navigation, faqs
  lib/                       Small shared helpers (site constants, initials)

public/
  images/                    Activity, hero, and brand imagery
```

## Routes

### Marketing

```
/
/explore
/community
/membership
/host
/partners
/about
/contact
/privacy
/terms
/community-guidelines
```

### Product

```
/app                 (redirects to /app/explore)
/app/explore
/app/hive
/app/messages
/app/profile
```

### Dynamic Routes

```
/app/experiences/[slug]
/app/circles/[slug]
```

`sitemap.xml` and `robots.txt` are generated at build time via `src/app/sitemap.ts` and `src/app/robots.ts`.

## Getting Started

Windows PowerShell:

```powershell
git clone https://github.com/Kadir70-dev/the-hive-society.git
cd the-hive-society
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

### Other scripts

```powershell
npm run build       # production build
npm run start        # run the production build locally
npm run lint          # ESLint
npm run typecheck    # TypeScript, no emit
```

### Environment variables

Copy `.env.example` to `.env.local` and adjust as needed:

```powershell
copy .env.example .env.local
```

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Used for SEO metadata (Open Graph, sitemap, robots) | `http://localhost:3000` |

## Forms

The Membership waitlist, Host application, and Contact forms are static prototype flows: client components that call `preventDefault()` on submit and show a polished success state, with no backend call. Each is structured so the `onSubmit` handler can be swapped for a real server action or API call without touching the surrounding UI.

## Deployment

A `netlify.toml` is included, using `@netlify/plugin-nextjs` (full Next.js support on Netlify — image optimization, dynamic routes, and metadata routes all continue to work). Set `NEXT_PUBLIC_SITE_URL` in the deployment environment to the production domain before going live.

## License

Private, unpublished. All rights reserved © 2026 The Hive Society.
