# Housoura

**Know what to worry about before you buy.**  
*Tahu apa yang perlu diwaspadai sebelum Anda membeli.*

Housoura is an AI-guided pre-purchase property screening tool for buyers in Indonesia. Users walk through a property, take photos following a structured 10-step checklist, and receive visual-risk observations powered by Vision AI for each area.

> **Disclaimer:** Housoura is NOT a licensed inspector and does not replace a professional property inspection. It provides screening based solely on visible photos and never declares a property free of defects or safe to buy.

---

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS (Light mode only, clean sans-serif typography via `next/font/google` Inter)
- **Validation:** Zod
- **AI Provider:** Anthropic Messages API (`@anthropic-ai/sdk`), called strictly from server code
- **Client Storage:** React state + `sessionStorage` (thumbnails max 300px and JSON analysis cached, full images in-memory only)
- **Deployment:** Vercel

---

## Getting Started Locally

### 1. Prerequisites
- Node.js 18+ (tested with Node 20 / 22 / 25)
- npm or pnpm

### 2. Environment Setup
Copy the example environment configuration:
```bash
cp .env.example .env.local
```

Fill in your Anthropic API credentials in `.env.local`:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
VISION_MODEL=claude-3-5-sonnet-20241022
MAX_ANALYSES_PER_IP_PER_HOUR=40
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
To test the production build locally:
```bash
npm run build
npm start
```

---

## Deploying to Vercel

### 1. Environment Variables in Vercel
In your Vercel Project Settings under **Environment Variables**, add:
- `ANTHROPIC_API_KEY`: Your Anthropic API Key
- `VISION_MODEL`: Model name (e.g., `claude-3-5-sonnet-20241022`)
- `MAX_ANALYSES_PER_IP_PER_HOUR`: `40` (or your preferred rate limit)

### 2. Function Region Configuration
For the lowest latency to Indonesia, configure your serverless function region to **Singapore (`sin1`)**.

In `vercel.json` (or via Vercel Project Settings > Functions > Function Region):
```json
{
  "regions": ["sin1"]
}
```

### 3. Vercel Request Body Size Limit Notice
- **Vercel Serverless Function Limit:** Vercel enforces a maximum payload size limit on incoming requests to Serverless Functions of approximately **4.5 MB** (uncompressed). Payloads exceeding this return a `413 Payload Too Large` error.
- **Client-Side Optimization in Housoura:** Housoura includes client-side image compression (`lib/imageResize.ts`) that resizes images to a maximum long-edge dimension of 1600px and steps down JPEG compression quality to ensure every uploaded base64 payload remains under **3 MB** (well below Vercel's limit).
- **SessionStorage Quota Safety:** To avoid browser `QuotaExceededError` in `sessionStorage`, Housoura generates downscaled 300px thumbnails alongside the JSON analysis for persistence across page refreshes, retaining high-resolution images in memory only.

---

## Project Structure

```
├── app/
│   ├── page.tsx               # Landing page with value props and trust statement
│   ├── inspect/
│   │   ├── page.tsx           # Setup form, 10 guided photo steps, extra photos, and results screen
│   │   └── layout.tsx         # Inspect layout with noindex robots meta
│   ├── privacy/
│   │   ├── page.tsx           # Privacy policy (ID & EN)
│   │   └── layout.tsx         # Privacy layout
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts       # POST endpoint with zod validation, IP rate limit, and banned claims filtering
│   ├── layout.tsx             # Root layout with Inter font and Open Graph metadata
│   ├── globals.css            # Tailwind CSS styling and light mode enforcement
│   └── robots.ts              # Robots rules: allow landing, disallow /inspect
├── components/
│   ├── StepScreen.tsx         # Inspection step screen with camera/gallery inputs and retake option
│   ├── ProgressBar.tsx        # Inspection progress bar
│   ├── PhotoCapture.tsx       # File inputs (camera capture='environment' and gallery picker)
│   ├── QualityWarning.tsx     # Client-side brightness and blur alert with retake/override
│   ├── ResultCard.tsx         # Inspection finding card with severity badge, confidence, and actions
│   ├── SeverityBadge.tsx      # Color-coded severity badge (High, Medium, Low, Unable to assess)
│   ├── LanguageToggle.tsx     # ID / EN radio toggle
│   └── Disclaimer.tsx         # Legal disclaimer component
└── lib/
    ├── ai/
    │   ├── vision.ts          # Server-only Anthropic Messages API caller with retry logic
    │   ├── prompts.ts         # Indonesian property context system prompt & prompt builder
    │   └── schema.ts          # Zod request/response validation schemas
    ├── imageQuality.ts        # Client-side canvas brightness (luminance) & blur (Laplacian variance)
    ├── imageResize.ts         # Client-side 1600px resize & 300px thumbnail generator
    ├── rateLimit.ts           # In-memory IP rate limiter
    ├── i18n.ts                # Bilingual dictionary (Indonesian & English)
    ├── steps.ts               # 10 guided step definitions with local Indonesian tips and safety warnings
    └── useLanguage.ts         # SSR-safe reactive language hook
```

---

## Security & Compliance

- **No Server-Side Image Storage:** Uploaded photos are streamed directly to the AI provider and are never saved to disk or databases.
- **Banned Claims Post-Processing:** Responses from the AI are automatically checked against a strict denylist of prohibited guarantee phrases (e.g. "safe to buy", "structurally sound", "no leak", "aman untuk dibeli", "struktur aman"). If detected, they are automatically replaced with conservative fallbacks: *"Unable to determine from this photo."* / *"Tidak dapat dipastikan dari foto ini."*
- **No Credentials Leakage:** `ANTHROPIC_API_KEY` is accessed only within `app/api/analyze/route.ts` and `lib/ai/vision.ts`. No secrets or raw API errors are exposed to the client.
