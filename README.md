# ShopGenius AI

A polished, responsive ecommerce operations dashboard MVP for independent shops. Built with Next.js App Router, React, TypeScript, and Tailwind CSS (plus custom dashboard styling).

## Features

- Overview dashboard with revenue chart, store metrics, AI shortcuts, and recent products.
- Product catalog with search, status/stock display, and add product interaction.
- AI Studio for product descriptions, SEO titles/keywords/meta descriptions, and Facebook, Instagram, or TikTok copy.
- Server-side OpenAI integration. The API key is read only on the server and is never sent to the browser.
- Clearly labeled local demo mode when no API key is configured. Demo content is illustrative and does not make an AI request.
- Responsive layout for desktop and mobile.

## Requirements

- Node.js 20.9 or newer
- pnpm (or npm; scripts are standard Next.js scripts)

## Run locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>. You can explore the full product in demo mode without an API key.

## Configure OpenAI

Copy `.env.example` to `.env.local` and fill in your key:

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

Restart the development server after changing environment variables. Without `OPENAI_API_KEY`, the interface labels results as `DEMO MODE · SAMPLE OUTPUT`; with a key, it labels results as `AI GENERATED DRAFT`. OpenAI errors are shown to the user without falling back to a fake result. Keep `.env.local` private and never commit it.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The generation endpoint is `POST /api/generate`. Send JSON with `type` (`Product description`, `SEO package`, or `Social post`), `productName`, `details`, and optionally `platform` (`Facebook`, `Instagram`, or `TikTok`).

## Record a short demo video

1. Start the app with `pnpm dev` and open <http://localhost:3000> in a desktop browser.
2. Record at 1920×1080 (or your screen’s native resolution), hide personal notifications, and keep the browser zoom at 100%.
3. Show the Overview dashboard, then open **Products**, search for “Ritual”, and add a sample product.
4. Open the AI assistant, generate a product description, then switch to **SEO package** and **Social post** to show the output and platform selector. With no API key, point out the visible demo-mode label.
5. Keep the walkthrough to about 60–90 seconds. Use a test product and avoid showing `.env.local` or API credentials.

## Current MVP scope

Products and analytics are in-memory demo data and reset when the page reloads. Store integrations, authentication, persistence, publishing, and billing are not wired up in this MVP.
