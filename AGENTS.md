# AGENTS.md — Kai Makana Health landing site

Read this before touching anything. This repo is the **live** conversion site. Push to `main` = instant production deploy (GitHub Actions builds `./dist` and publishes to Pages). There is no staging. Treat every edit as if it ships to paying visitors.

---

## CURRENT PRIORITY — hero remodel (do this first)

**The problem (from the owner, verified against the code):** on the first screen, a brand-new visitor is hit with **four competing asks and a price** before learning what the product is or who's behind it. That front-loads the transaction and buries the persuasion — the likely root cause of near-zero conversion despite ~160k followers.

**The first screen (mobile, above the fold) currently renders, in order:**
1. Badge: "5-DAY VIDEO PROTOCOL"
2. H1: "Reset your body in 5 days — without pills or extremes."
3. Blurb: "One natural remedy per day. Short filmed lessons. Kitchen ingredients you already know."
4. `$39` / ~~`$59`~~ "one-time"
5. Primary CTA: "Start the 5-Day Cleanse"
6. Fine print: "Instant access · Watch on any device · 7-day guarantee"
7. "Bundle & save $4.99 →"
8. "Or get the free liver guide ↓"

Plus a `Get Cleanse — $39` button in the nav.

**The objective:** maximize the odds that a first-time visitor understands what the product is and trusts the brand *before* they're asked to buy — then makes buying the obvious next step. Judge every change against that, never against "looks better."

**The fix — baseline changes (you may extend within the guardrails below):**
1. **One ask per screen.** Remove the bundle link and free-guide link from the hero. The hero gets exactly ONE primary CTA. Bundle and free guide stay as their own sections below the fold (they already exist — do not delete the sections).
2. **Establish "what it is" before the price.** Rewrite the blurb to answer the object question in one line, before any number or button: e.g. *"Five short filmed lessons. One kitchen remedy a day. No pills, no supplements, nothing you can't find at the store."*
3. **Surface the 160k in the hero.** Add a one-line trust signal directly under the H1 (the brand's single real proof asset — ~160k followers). Do NOT fabricate anything else.
4. **Make the 7-day guarantee visible.** Promote it from 11px gray fine-print to a visible trust chip near the price/CTA.

**YOU MAY extend (Opus latitude) — only in service of the objective:**
- Rework the H1, subheads, and section copy anywhere on the page for sharper persuasion (holding the no-remedy-spoilers rule).
- Reorder hero content and tighten the flow so value precedes price and trust precedes the ask.
- Reconsider which offer the primary CTA leads with (Cleanse $39 vs Blueprint $14.99 vs Bundle $49) — tiny sales data (2 bundle / 1 blueprint / 0 cleanse) hints the cheaper Blueprint or the bundle may be an easier first "yes," but treat that as a hypothesis, not fact.
- Add a social-proof / "what's inside" beat above the fold if it builds trust without clutter.

**HARD INVARIANTS — never violate, no matter how good the idea feels:**
- Do NOT invent testimonials, purchase counts, or claims (the ~160k follower count is the only real proof asset).
- Do NOT list actual ingredients/amounts/recipes (paid course content — see copy rules).
- Do NOT delete or remove the locked conversion sections (bundle strip, FAQ, 7-day guarantee, testimonials, sticky mobile CTA, final dual CTA, free-guide section). Polish their copy if you must; never remove or reorder them out.
- Do NOT change the accent color, font system, or the dark-premium visual identity.
- Do NOT introduce new products or a different payment platform (Gumroad only).
- Do NOT touch `vite.config.ts`, the unused deps, or the 7 pre-existing `tsc` errors.
- Do NOT commit or push. Output a diff for review. Push = live.

---

## LOCKED — visual system (do not "modernize" away)

- Ink `#0B0F0E` / ink-2 `#141A18` / ink-3 `#1C2421`
- Sand text `#F5F0E8` / muted `#A39E94`
- Accent `#4FC3F7` (the brand blue — same as reel karaoke)
- Fonts: Playfair (serif, headings) + Inter (body)
- Dark premium, anti-"sage-slop". NOT a light airy wellness template.
- Animation: **motion** (`motion/react`), not GSAP. Fade-up on scroll, staggered day cards.

## LOCKED — conversion structure (do not remove or reorder these sections)

1. **Paid owns the first screen.** The free Beehiiv lead magnet stays BELOW the fold (`#free-guide`). Never put the free form in the hero.
2. **Price anchor** — every primary CTA shows strikethrough anchor 30–50% above real price (`$59` → `$39`).
3. **Bundle strip** — three-column pricing card (Cleanse $39 | Blueprint $14.99 | Bundle $49) between the days section and the Included section. The bundle column is highlighted with the CTA.
4. **FAQ accordion** — 6 items, must end with the refund question.
5. **7-day guarantee section** — shield + "7-Day Risk-Free Guarantee" + plain refund language.
6. **Testimonials** — real-format quotes, first name + last initial. NEVER fabricate purchase counts.
7. **Final dual CTA** — primary "Get the Cleanse — $39" + secondary "Bundle & save — $49".
8. **Sticky mobile CTA** — `AnimatePresence` bar after ~280px scroll, `md:hidden` only.

## LOCKED — product copy rules

- Product: **5-Day Full Body Cleanse** ($39). Plus **Blueprint** ($14.99) and **Bundle** ($49).
- **Never list actual ingredients/amounts/recipes on the marketing page** (e.g. "lemon + water + cornstarch"). That's paid course content. Marketing = importance ("liver support", "circulation boost"); course = recipes.
- Day card titles (locked): Inflammation Reset, Cholesterol Block, Circulation Boost, Liver Support, Kidney Cleanse. Each day card ends with a `Result: ...` line.
- H1 default: "Reset your body in 5 days — without pills, juice cleanses, or extremes." (pending the hero remodel above)
- Payments: **Gumroad only.** Never Whop.

## DO NOT TOUCH — deploy & build traps

- **`vite.config.ts` has a latent secret-leak trap.** It contains `define: { 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) }`, which does literal text substitution into the client bundle. Do not wire anything to `GEMINI_API_KEY`, and never put a real secret in a `define`/`import.meta.env` value. The `@google/genai`/`express` deps are unused — leave them out of any change.
- **7 pre-existing `tsc` errors exist** (React namespace, `import.meta.env` typing, FAQ key prop). Do NOT "fix" them into new breakage, and don't claim you broke nothing without checking line numbers fall outside your edit ranges.
- **Build:** `npm install` first (node_modules is often absent) → `npm run build`. Verify with `npm run preview` → `http://localhost:4173/Kai-Makana/` (respects `base`).
- **Favicon/index.html must use RELATIVE paths** (no leading slash) or they 404 in production.
- **Beehiiv:** one `#beehiiv-embed` mount point. Never two.
- **Avatar assets in `public/hosting/` are green-screen raws** — not finished images.

## Data note (do not over-rotate on n=3)

Lifetime sales are tiny: 2 Bundle, 1 Blueprint, 0 Cleanse. That hints the cheaper Blueprint and the value-bundle may be easier entry points than the $39 Cleanse, but the sample is far too small to flip the CTA hierarchy on. The hero remodel is the priority; entry-offer testing comes after conversion tracking is live.
