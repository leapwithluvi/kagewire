# Design System Inspired by Studio Ghibli Art

## 1. Visual Theme & Atmosphere

The Ghibli visual theme is the ultimate expression of **nostalgia, warmth, hand-painted watercolor art, and nature-centric comfort**. Rather than sharp, digital, high-frequency neon grids, Ghibli style feels like a warm wind blowing through a summer forest in the Japanese countryside. The canvas is not a cold dark void, but a soft, warm **Antique Cream paper** (`#fdfbf7`), resembling physical watercolor sketchbooks and parchment logs. 

Accents are drawn directly from the hand-painted natural backdrops of legendary director Hayao Miyazaki: the endless, breezy **Summer Sky Blue** (`#3fa9e5`) representing dreams, and the lush, leafy **Meadow Forest Green** (`#4a9c68`) representing life and forest paths. Every card or container sits on a cozy **Weathered Parchment** surface (`#f3eee3`), bounded by organic, soft **Oak Wood / Clay** borders (`#cfa375`) and curved with deep, inviting rounded corners (`rounded-[32px]`).

Typography behaves like cozy ink sketches: headlines run in classic, high-character serif faces (**Georgia / Times**) that feel like letters from a long-lost friend, while labels and UI metadata use soft, friendly sans-serif letters.

**Key Characteristics:**
- Warm Antique Cream (`#fdfbf7`) watercolor paper as the main canvas — no pure dark modes
- Meadow Forest Green (`#4a9c68` - dominant/primary) + Summer Sky Blue (`#3fa9e5` - secondary) as soft, high-harmony accents
- Nostalgic, romantic serif typography (Georgia / Times) for display and large headings
- Hand-drawn wood-border cards with cozy `rounded-[32px]` corners and extremely soft organic shadows
- StoryStream timeline styled as a vertical ivy branch with leaf-like node indicators
- Organic, hand-crafted aesthetic with a strong emphasis on hand-painted warmth over digital sterile lines

---

## 2. Color Palette & Roles

Every color in the KageWire system is mapped to a CSS custom variable in `globals.css` to allow instant, effortless theme tweaking.

### Primary Accents (Nature & Skies)
- **Meadow Forest Green** (`#4a9c68` / CSS: `--color-brand-primary`): The primary brand/action and CTA color. Represents life, forest paths, and the core comforting nature aesthetic of Studio Ghibli.
- **Summer Sky Blue** (`#3fa9e5` / CSS: `--color-brand-secondary`): The organic secondary accent. Used for secondary highlights, sky trails, leaf-blooming transitions, and dreams.

### Outline & Borders
- **Oak Wood / Clay Outline** (`#cfa375` / CSS: `--color-brand-primary-border`): The key framing color. Replaces cold digital borders with warm wood and terracotta lines.
- **Soft Ivy Green** (`#a1cca5` / CSS: `--color-timeline-rule`): Used as the soft, organic dashed rule representing the timeline spine.

### Surface & Backgrounds
- **Warm Antique Cream** (`#fdfbf7` / CSS: `--color-canvas-background`): The default warm watercolor paper canvas background.
- **Weathered Parchment** (`#f3eee3` / CSS: `--color-surface-slate`): Secondary card envelopes and input form wrappers.
- **Soft Hand-drawn Image Frame** (`#dfd8ca` / CSS: `--color-image-frame`): Soft frame outline for photography and anime illustrations.

### Typography Ink & Neutrals
- **Charcoal Ink** (`#2d3532` / CSS: `--color-charcoal-ink`): Deep, soft charcoal gray representing raw sketch pencil graphite. Highly legible and extremely soft on the eyes.
- **Mossy Gray** (`#7a8580` / CSS: `--color-muted-gray`): Secondary text, timestamps, and bylines.
- **Forest Charcoal** (`#4a5350` / CSS: `--color-muted-text`): Deep gray for article excerpts and reading body.

---

## 3. Typography Rules

### Font Families
- **Editorial Serif** (Georgia, Cambria, Times) — Signature Ghibli display face. Warm, highly personal, and nostalgic. Used for large headers, page titles, and highlighted pull quotes.
- **Friendly Sans-Serif** (Space Grotesk, DM Sans, system-ui) — The UI workhorse. Handles inputs, lists, labels, and standard buttons with soft, curved metrics.
- **Handwritten/Mono** (Courier New, monospace) — Reserved strictly for timeline timestamps, status badges, and developer-style file paths.

### Spacing & Leading
- **Serif Display**: Tight-but-breathable leading (`1.0`–`1.2`) to emphasize the hand-painted serif characters.
- **Reading Body**: Highly relaxed leading (`1.6`–`1.8`) representing the pacing of reading a classic fairy tale book.

---

## 4. Component Stylings

### Buttons

**Primary — Meadow Forest Green Pill**
- Background: `#4a9c68` (Meadow Forest Green)
- Text: `#ffffff` (White), bold, rounded font
- Border radius: `rounded-full` (fully rounded pill shape)
- Hover: inverts or transitions smoothly to `#3fa9e5` (Summer Sky Blue) to represent sky dreams
- Transition: `180ms` ease on background and shadow

**Secondary — Oak Outline Pill**
- Background: `#f3eee3` (Weathered Parchment)
- Border: `1px solid #cfa375` (Oak Wood)
- Text: `#2d3532` (Charcoal Ink)
- Border radius: `rounded-full`
- Hover: shifts to `#4a9c68` (Meadow Forest Green) fill with white text

### Cards & Containers

**Parchment Card Envelope**
- Background: `#f3eee3` (Weathered Parchment)
- Border: `1px solid #cfa375` (Oak Wood)
- Border radius: `rounded-[32px]` — extremely soft, large organic radius
- Shadow: very subtle warm amber shadow (`shadow-md shadow-amber-900/[0.02]`)

**StoryStream Timeline Spine**
- A vertical dashed rule in Soft Ivy Green (`#a1cca5`)
- Leaf-like circular node indicators in Forest Green (`#4a9c68`) and Sky Blue (`#3fa9e5`) representing blooming timeline logs
- Cozy handwritten-feeling timestamps on the left rail

---

## 5. Do's and Don'ts

### Do
- **Do** keep the canvas light and warm. The warm cream paper background is the core product.
- **Do** round everything generously: `rounded-xl`, `rounded-[32px]`, or `rounded-full`. Sharp square corners are strictly prohibited as they destroy the Ghibli hand-drawn feel.
- **Do** use soft, nature-inspired colors: sky blue, forest green, warm terracotta, and pencil charcoal.
- **Do** frame cards in cozy clay/oak wood outlines (`#cfa375`).
- **Do** use nostalgic serifs (Georgia / Times) for display shouting.

### Don't
- **Don't** use cold pure dark backgrounds or pure OLED blacks.
- **Don't** use neon neon safety paints or hazard warnings. Ghibli is about soft watercolor washes.
- **Don't** use sharp square inputs or sterile technical grids.
- **Don't** use hard cold drop shadows. Only use warm, near-transparent amber shadows.