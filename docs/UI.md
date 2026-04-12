# OzHelper — UI Design Principles

> **Project context:** OzHelper is an Australian community task marketplace. Users can post tasks (lawn mowing, furniture assembly, dog walking, errands, etc.) or sign up as Taskers to earn money completing them. The UI must feel trustworthy, local, and approachable.

---

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 via `@import 'tailwindcss'` |
| Animation | `tw-animate-css` |
| Component primitives | Radix UI (full suite) |
| Component library | shadcn/ui pattern (CVA + `cn()`) |
| Icons | `lucide-react` |
| Font (body) | **DM Sans** — 400, 500, 600, 700 |
| Font (mono) | **Geist Mono** |
| Charts | Recharts |

---

## 2. Color Palette (OKLCH)

All colors are defined as CSS custom properties using the **OKLCH** color space. This is the **single source of truth** — never hard-code hex or RGB values in components.

### 2.1 Light Mode (`:root`)

| Token | Value | Purpose |
|---|---|---|
| `--background` | `oklch(0.98 0.005 145)` | Page background — very light warm green-white |
| `--foreground` | `oklch(0.2 0.02 150)` | Default body text — dark green-tinted near-black |
| `--card` | `oklch(1 0 0)` | Card surface — pure white |
| `--card-foreground` | `oklch(0.2 0.02 150)` | Text on cards |
| `--popover` | `oklch(1 0 0)` | Popover / dropdown surface |
| `--popover-foreground` | `oklch(0.2 0.02 150)` | Text on popovers |
| `--primary` | `oklch(0.45 0.12 150)` | **Forest green** — brand identity, CTAs, active states |
| `--primary-foreground` | `oklch(0.98 0.005 145)` | Text on primary backgrounds |
| `--secondary` | `oklch(0.95 0.01 145)` | Soft green-tinted grey |
| `--secondary-foreground` | `oklch(0.3 0.05 150)` | Text on secondary |
| `--muted` | `oklch(0.95 0.01 145)` | Subtle background fills |
| `--muted-foreground` | `oklch(0.5 0.02 150)` | Placeholder text, metadata, captions |
| `--accent` | `oklch(0.85 0.18 85)` | **Golden yellow** — prices, highlights, CTA buttons |
| `--accent-foreground` | `oklch(0.25 0.05 85)` | Dark text on accent backgrounds |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Error / delete states (red-orange) |
| `--destructive-foreground` | `oklch(0.98 0 0)` | White text on destructive |
| `--border` | `oklch(0.9 0.02 145)` | Subtle green-tinted borders |
| `--input` | `oklch(0.92 0.01 145)` | Input field background |
| `--ring` | `oklch(0.45 0.12 150)` | Focus ring — matches primary |

### 2.2 Sidebar Tokens (Light Mode)

The sidebar is a **distinct dark green panel**, separate from the main background.

| Token | Value | Notes |
|---|---|---|
| `--sidebar` | `oklch(0.35 0.08 150)` | Dark forest green sidebar background |
| `--sidebar-foreground` | `oklch(0.98 0.005 145)` | Light text on sidebar |
| `--sidebar-primary` | `oklch(0.85 0.18 85)` | Golden accent for sidebar logo badge |
| `--sidebar-primary-foreground` | `oklch(0.25 0.05 85)` | Dark text on golden badge |
| `--sidebar-accent` | `oklch(0.4 0.1 150)` | Active nav item highlight |
| `--sidebar-accent-foreground` | `oklch(0.98 0.005 145)` | Text on active nav item |
| `--sidebar-border` | `oklch(0.4 0.08 150)` | Sidebar divider lines |
| `--sidebar-ring` | `oklch(0.85 0.18 85)` | Focus ring in sidebar |

### 2.3 Dark Mode (`.dark`)

| Token | Value |
|---|---|
| `--background` | `oklch(0.18 0.02 150)` — deep dark green |
| `--foreground` | `oklch(0.95 0.01 145)` — near-white |
| `--card` | `oklch(0.22 0.025 150)` — slightly lighter dark |
| `--primary` | `oklch(0.55 0.14 150)` — brighter green for contrast |
| `--accent` | `oklch(0.75 0.16 85)` — slightly muted golden |
| `--sidebar` | `oklch(0.22 0.025 150)` — matches card in dark mode |
| `--sidebar-primary` | `oklch(0.75 0.16 85)` — muted gold |

### 2.4 Chart Colors

Five sequential chart colors used in data visualizations:

| Token | Value | Hue |
|---|---|---|
| `--chart-1` | `oklch(0.45 0.12 150)` | Forest green (matches primary) |
| `--chart-2` | `oklch(0.85 0.18 85)` | Golden yellow (matches accent) |
| `--chart-3` | `oklch(0.55 0.1 200)` | Teal / cyan-green |
| `--chart-4` | `oklch(0.65 0.15 140)` | Mid green |
| `--chart-5` | `oklch(0.75 0.12 100)` | Olive-yellow |

### 2.5 Color Semantic Summary

| Color | Semantic Role | Usage examples |
|---|---|---|
| **Primary (green)** | Trust, brand, action | Nav active states, form focus rings, badges, step indicators, icon backgrounds |
| **Accent (gold)** | Value, earnings, CTA | Task price display, "Post a Task" / "Get Started" primary buttons, step badges, warning highlights |
| **Muted** | Subtle, secondary | Metadata text, empty states, placeholders, timestamps |
| **Destructive (red-orange)** | Danger | Delete confirmations, error messages |

---

## 3. Typography

### Fonts
- **Body / UI:** `DM Sans` — humanist sans-serif, warm and approachable. Weights used: 400 (regular), 500 (medium), 600 (semibold), 700 (bold).
- **Monospace:** `Geist Mono` — used for code or numeric precision contexts.

### Type Scale (Tailwind classes)
| Use | Class | Notes |
|---|---|---|
| Page titles | `text-2xl font-bold` | Dashboard / page headers |
| Marketing hero | `text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight` | Hero headline |
| Section headings | `text-3xl md:text-4xl font-bold` | Marketing section H2 |
| Card titles | `text-lg font-semibold` | CardTitle |
| Body text | `text-base` (default) | Paragraphs |
| Lead text | `text-lg text-muted-foreground` | Section subtitles |
| Small metadata | `text-sm text-muted-foreground` | Timestamps, locations, counts |
| Micro labels | `text-xs font-medium` | Badges, category pills, step labels |

### Text Utilities
- `text-balance` — on long marketing headlines (prevents orphans)
- `text-pretty` — on descriptive paragraphs
- `antialiased` — applied globally on `<body>`
- `truncate` — on user names / location in sidebar user section

---

## 4. Spacing & Layout

### Grid System
- **Container:** `container mx-auto px-4` — centered with horizontal padding
- Standard content max-widths:
  - `max-w-5xl` — main content grids (task cards, categories)
  - `max-w-4xl` — detail pages (task detail, profile, wallet)
  - `max-w-3xl` — modals, wizards (post task form)
  - `max-w-2xl` — section introductions, auth pages (inner form)
  - `max-w-md` — auth form panels

### Common Grid Patterns
```
// Stats: 4 column on large
grid gap-4 sm:grid-cols-2 lg:grid-cols-4

// Category cards: 4 col on large
grid gap-4 sm:grid-cols-2 lg:grid-cols-4

// Safety features: 2 col on medium
grid gap-6 md:grid-cols-2

// Hero task preview cards: 3 col on medium
grid gap-4 md:grid-cols-3
```

### Spacing Scale
| Context | Class |
|---|---|
| Section vertical padding | `py-20` |
| Card internal padding | `p-5` or `p-6` |
| Section bottom margin | `mb-16` |
| Between form fields | `space-y-4` |
| Between nav items | `space-y-1` |
| Header height | `h-16` |
| Sidebar width | `w-64` (`lg:pl-64` for main content offset) |

---

## 5. Border Radius

`--radius` is set to `0.75rem`.

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `0.5rem` | Small elements |
| `--radius-md` | `0.625rem` | Medium elements, inputs |
| `--radius-lg` | `0.75rem` | Cards, modals |
| `--radius-xl` | `1rem` | Icon containers, accent blocks |

In practice:
- `rounded-lg` → cards, task cards, inputs, nav items
- `rounded-xl` → icon containers (`h-12 w-12 rounded-xl`), category icon blocks
- `rounded-2xl` → how-it-works step icons (`h-16 w-16 rounded-2xl`)
- `rounded-full` → pills/badges, avatar circles, trust badge pills
- `rounded-md` → buttons (default), badge component

---

## 6. Shadows & Elevation

| Level | Class | Usage |
|---|---|---|
| Default | `shadow-sm` | Cards at rest |
| Hover | `shadow-md` | Cards on hover (`hover:shadow-md`) |
| Floating | `shadow-lg` | Sidebar mobile toggle, overlays |

Cards use `transition-all` so shadow transitions are smooth on hover.

---

## 7. Component Patterns

### 7.1 Buttons

Built with CVA — all variants defined in `components/ui/button.tsx`.

| Variant | Visual | Typical Use |
|---|---|---|
| `default` | `bg-primary text-primary-foreground` | Standard form submit |
| `outline` | `border bg-background` / `bg-transparent` | Secondary actions |
| `ghost` | Transparent, hover fills accent | Nav items, icon actions |
| `link` | Text only, underline on hover | Inline links |
| `destructive` | Red background | Delete / danger actions |

**Custom overrides used in the app:**
- **Primary CTA:** `bg-accent text-accent-foreground hover:bg-accent/90` — golden "Post a Task" / "Get Started" buttons
- **On primary bg:** `border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10` — secondary buttons on green CTA section

**Sizes:** `sm` (h-8), `default` (h-9), `lg` (h-10 / `h-12` with `px-8` for marketing CTAs), `icon` (size-9)

### 7.2 Cards

```tsx
// Standard card pattern
<Card>               // bg-card, border, rounded-xl, shadow-sm, gap-6
  <CardHeader>       // grid layout, px-6
    <CardTitle />    // font-semibold leading-none
    <CardDescription /> // text-sm text-muted-foreground
  </CardHeader>
  <CardContent>      // px-6
    ...
  </CardContent>
</Card>
```

**Interactive task cards** (not using Card component) use:
```
rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md
```
On hover: `hover:border-primary` to highlight in brand green.

### 7.3 Badges

Four variants:
- `default` — `bg-primary text-primary-foreground` (green)
- `secondary` — `bg-secondary text-secondary-foreground`
- `destructive` — red
- `outline` — border only, transparent bg

**Custom inline badges used throughout:**
```tsx
// Category pill on task cards
"rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"

// Status badge — in progress
"bg-primary/10 text-primary"

// Status badge — pending offers
"bg-accent/10 text-accent-foreground"

// Price display (not a badge, but styled)
"text-lg font-bold text-accent"   // golden yellow
```

### 7.4 Avatar

- Shape: `rounded-full`
- Fallback: 2-letter initials, `bg-sidebar-accent` in sidebar, `bg-primary/10` elsewhere
- Sizes: typically `h-10 w-10` (sidebar user), `h-12 w-12` (profiles)

### 7.5 Form Elements

- `Input` — uses `--input` background (`oklch(0.92 0.01 145)`)
- `Label` — `text-sm font-medium`
- `Textarea` — same styling as Input
- `Select` — Radix-based, matches input styling
- `Checkbox` / `RadioGroup` — Radix-based, styled with primary color
- Focus ring: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`

**Label + Input stack pattern:**
```tsx
<div className="space-y-2">
  <Label htmlFor="...">Field Name</Label>
  <Input id="..." ... />
</div>
```

### 7.6 Icon Containers

Consistent sizes for icon feature blocks:
```
h-12 w-12 rounded-xl bg-primary/10   // Standard feature icon
h-14 w-14 rounded-2xl bg-primary     // Section lead icon (e.g. Safety)
h-16 w-16 rounded-2xl bg-primary/10  // Large step icon (How It Works)
```

Icons inside always set to matching text color: `text-primary` or `text-primary-foreground`.

---

## 8. Navigation Patterns

### 8.1 Marketing Header
- `sticky top-0 z-50` — stays visible on scroll
- `bg-background/95 backdrop-blur` — frosted glass effect
- `border-b border-border/40` — subtle bottom border
- Nav links: `text-sm font-medium text-muted-foreground hover:text-foreground`
- Mobile: hamburger toggle; drawer with full nav + auth buttons
- Logo: green rounded square badge `bg-primary` + bold "OzHelper" text

### 8.2 Dashboard Sidebar
- **Fixed left panel**, `w-64`, hidden off-screen on mobile (`-translate-x-full`), always visible on `lg:`
- Background: `bg-sidebar` (dark forest green)
- Text: `text-sidebar-foreground` (near-white)
- Active nav item: `bg-sidebar-accent text-sidebar-accent-foreground`
- Inactive: `text-sidebar-foreground/70 hover:bg-sidebar-accent/50`
- Logo badge: `bg-sidebar-primary` (gold)
- User section at bottom with initials avatar + name + Sign Out button
- Mobile: overlay (`bg-black/50`) + slide-in with toggle button

---

## 9. Page Layouts

### 9.1 Marketing (Landing) Layout
```
<header sticky />
<main flex-1>
  <HeroSection />          // centered text, task preview cards
  <HowItWorksSection />    // bg-card, step grid
  <CategoriesSection />    // bg-background, 4-col icon grid
  <SafetySection />        // bg-primary/5, 2-col feature cards
  <CTASection />           // bg-primary (full green), centered text + buttons
</main>
<footer />                 // bg-card, 4-col links
```

- Sections alternate between `bg-background`, `bg-card`, `bg-primary/5`, and solid `bg-primary`
- Each section: `py-20` vertical padding
- Section intro: `mx-auto mb-16 max-w-2xl text-center`

### 9.2 Auth Pages (Sign In / Sign Up)
- Split layout: `flex min-h-screen`
- Left half: form panel, `lg:w-1/2 lg:px-16`
- Right half (implied): decorative / brand panel
- Form area: `mx-auto w-full max-w-md`
- Social auth buttons below separator

### 9.3 Dashboard Layout
- Sidebar fixed left (`w-64`), main content `lg:pl-64`
- Main content padding: `p-4 pt-16 lg:p-8 lg:pt-8`
- Page-level spacing: `space-y-8` (dashboard) or `space-y-6` (most pages)
- Page header pattern: title + subtitle on left, primary action button on right

### 9.4 Wizard / Multi-step Forms
- Centered, `max-w-3xl`
- Progress steps: numbered circles (`h-10 w-10 rounded-full border-2`)
  - Completed: `border-primary bg-primary text-primary-foreground` with checkmark
  - Active: `border-primary bg-primary/10 text-primary`
  - Inactive: `border-border bg-background text-muted-foreground`
- Connector lines: `h-0.5 bg-primary` (completed) vs `bg-border` (not yet)
- Step content inside a `<Card>`

---

## 10. Status & Feedback Patterns

### Task Status Badges
| Status | Style |
|---|---|
| Open | `bg-primary/10 text-primary` — green pill |
| In Progress | `bg-primary/10 text-primary` — green pill |
| Pending Offers | `bg-accent/10 text-accent-foreground` — gold pill |
| Completed | `variant="outline" text-muted-foreground` — grey outline |

### Trust / Verification Badges
- ID Verified: `BadgeCheck` icon + text, displayed inline next to tasker name
- Blue badge = ID verified; Gold badge = licensed professional (per app copy)

### Info Callouts
```tsx
// Tool availability callout
<div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm">
  <CheckCircle className="h-4 w-4 text-primary" />
  ...
</div>
```

### Escrow / Payment States
- Pending earnings: shown with `Clock` icon, muted styling
- Completed transactions: `CheckCircle` icon, green accent

---

## 11. Motion & Transitions

- `transition-all` — on interactive cards (shadow + border color change on hover)
- `transition-colors` — on nav links and buttons
- `duration-200` — sidebar slide-in on mobile
- `hover:shadow-md` — card elevation on hover
- `hover:border-primary` — card border highlight
- `supports-[backdrop-filter]:bg-background/60` — progressive enhancement for header blur

No heavy animations. UX philosophy: subtle, fast feedback.

---

## 12. Responsive Breakpoints (Tailwind defaults)

| Breakpoint | Width | Usage |
|---|---|---|
| `sm` | 640px | Stack → row for button groups, 2-col grids |
| `md` | 768px | 2–4 col grids, show full nav text |
| `lg` | 1024px | Sidebar always visible, multi-column dashboard layouts |

Mobile-first: sidebar hidden by default, toggled by hamburger. All grids start single-column.

---

## 13. Icon Library

**lucide-react** only. Common icons used:

| Icon | Context |
|---|---|
| `MapPin` | Location / suburb |
| `Shield` / `BadgeCheck` | Trust, verification |
| `Star` | Ratings |
| `DollarSign` / `Wallet` | Pricing, earnings |
| `Clock` | Time, pending states |
| `CheckCircle` | Completion, tools available |
| `Plus` | Post task, add action |
| `ArrowLeft` / `ArrowRight` | Wizard navigation |
| `Search` / `Filter` | Browse tasks |
| `Send` | Message send |
| `LayoutDashboard` | Nav — Dashboard |
| `ClipboardList` | Nav — Browse Tasks |
| `MessageSquare` | Nav — Messages |
| `LogOut` | Sign out |
| `Menu` / `X` | Mobile nav toggle |

Default icon size in text: `h-4 w-4`. In feature blocks: `h-6 w-6` or `h-8 w-8`.

---

## 14. Brand Identity

- **Name:** OzHelper
- **Logo mark:** Rounded-square badge (`rounded-lg`) with `bg-primary` (green), white bold "Oz" text
- **Tagline context:** "Your Neighbourhood, Your Helpers"
- **Audience:** Australian communities — language uses "neighbourhood", suburb/state/postcode, references to Australian states (NSW, VIC, QLD)
- **Trust signals:** ID verification, escrow payments, public liability insurance, star ratings, youth protection
- **Tone:** Friendly, trustworthy, local, practical

---

## 15. Common Utility Patterns

```tsx
// Color fill with transparency
bg-primary/10      // 10% primary — icon containers, status pills
bg-primary/5       // 5% primary — section backgrounds, callout boxes
bg-accent/10       // 10% accent — pending/gold status pills
bg-black/50        // Overlay scrim for mobile sidebar

// Hover patterns on interactive elements
hover:border-primary        // Card border on hover
hover:shadow-md             // Card elevation on hover
hover:text-foreground       // Nav link text on hover
hover:bg-accent/90          // CTA button darken on hover
hover:bg-sidebar-accent/50  // Inactive nav item hover

// Focus rings
focus-visible:ring-ring/50 focus-visible:ring-[3px]

// Truncation in tight spaces
truncate

// Text rendering
antialiased   (body)
text-balance  (headings)
text-pretty   (paragraphs)
```
