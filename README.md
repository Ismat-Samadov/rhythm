# RHYTHM — Neon Beat

A full-stack browser rhythm game built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Hit notes as they fall, chain massive combos, and see how high you can score across three difficulty levels.

---

## Features

- **4-lane falling-note gameplay** — styled with a neon cyberpunk aesthetic
- **Three difficulty modes** — Easy (90 BPM), Medium (128 BPM), Hard (160 BPM)
- **Timing grades** — Perfect (±50 ms) and Good (±110 ms) with combo multipliers
- **Score multipliers** — ×1 → ×2 → ×4 → ×8 as your combo grows
- **Particle effects** — burst of neon particles on every hit
- **Procedural audio** — background music + hit/miss SFX via Web Audio API (no external files)
- **High score persistence** — saved per-difficulty via `localStorage`
- **Countdown before each round** — 3 · 2 · 1 · GO!
- **Pause / resume** — press `Esc` or `P` at any time
- **Results screen** — letter grade (S / A / B / C / F), accuracy, and per-note breakdown
- **Music & SFX toggles** — on/off controls in the HUD
- **Fully responsive** — desktop keyboard + mobile touch controls with no horizontal scroll
- **Canvas rendering** — smooth 60 fps game field via `requestAnimationFrame`
- **Framer Motion** — animated menus, combo pop, and results reveal

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v11 |
| Audio | Web Audio API (no external files) |
| Fonts | Orbitron + Space Mono (Google Fonts) |
| Persistence | `localStorage` |

---

## Controls

### Desktop (Keyboard)

| Key | Action |
|-----|--------|
| `A` | Lane 1 (cyan) |
| `S` | Lane 2 (purple) |
| `D` | Lane 3 (yellow) |
| `F` | Lane 4 (pink) |
| `Esc` / `P` | Pause / Resume |

### Mobile

Tap the four on-screen lane buttons at the bottom of the screen. Multi-touch is fully supported — hold multiple buttons simultaneously.

---

## Running Locally

```bash
# 1. Clone the repository
git clone <repo-url>
cd rhythm

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Build for production

```bash
npm run build
npm start
```

---

## Deploy to Vercel

The project is pre-configured for zero-config Vercel deployment.

1. Push the repository to GitHub (or any Git host).
2. Import the repository in the [Vercel dashboard](https://vercel.com/new).
3. Click **Deploy** — no environment variables or additional configuration needed.

Alternatively, use the CLI:

```bash
npx vercel
```

---

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Tailwind base, fonts, reset
│   ├── icon.svg          # Neon favicon
│   ├── layout.tsx        # Root layout with metadata
│   └── page.tsx          # Main game page
├── components/
│   ├── game/
│   │   ├── CountdownOverlay.tsx
│   │   ├── GameHUD.tsx
│   │   ├── MobileControls.tsx
│   │   ├── PauseMenu.tsx
│   │   ├── ResultScreen.tsx
│   │   └── StartScreen.tsx
│   └── ui/
│       └── Button.tsx
├── hooks/
│   ├── useGameEngine.ts  # Main game loop, state, canvas renderer
│   └── useInputHandler.ts
└── lib/
    ├── audioEngine.ts    # Web Audio API music + SFX
    ├── beatmap.ts        # Procedural beatmap generator
    ├── constants.ts      # Game constants
    ├── types.ts          # TypeScript types
    └── utils.ts          # Scoring, grading, storage helpers
```

---

## Gameplay Tips

- **Stay on beat** — watch the BPM indicator in the HUD and feel the grid
- **Aim for Perfect** — it's worth 3× a Good and builds your multiplier faster
- **Don't panic on misses** — your combo resets but your score is not deducted
- **Hard mode** has notes at sixteenth-note density — warm up on Medium first!

---

## License

MIT — do whatever you like with it.
