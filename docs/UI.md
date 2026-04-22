# OzHelper — Design Specification (Cinematic v2.0)

---

## 0. Meta

- **Project:** OzHelper
- **Version:** 2.0
- **Type:** Full-stack Design MD (UI + UX + Product + Engineering)

---

## 1. Product Definition

### 1.1 Product Identity
OzHelper is a high-trust labor marketplace focused on Australian tradie services, combining:
- Transactional marketplace
- Real-time communication
- Social trust signals

---

### 1.2 Core Value Proposition
- Reduce friction in hiring tradies
- Increase trust via visibility and feedback
- Surface value through pricing clarity

---

### 1.3 Core User Roles

| Role     | Description                    |
| -------- | ------------------------------ |
| Customer | Posts tasks, pays, reviews     |
| Tradie   | Accepts jobs, completes work   |
| Platform | Facilitates trust and payments |

---

## 2. Design Vision

**"Nightclub for Tradies"**

- High contrast
- High energy
- Precision + emotional interaction

---

## 3. Visual System

### 3.1 The Void Canvas
The canvas uses a **layered dark system** — not a single flat black. Three depth levels create visual breathing room without breaking the dark, cinematic mood.

| Layer        | Value     | Usage                                      |
| ------------ | --------- | ------------------------------------------ |
| surface-base | `#080808` | Page background, nav, footer, sections     |
| surface-card | `#111111` | Cards, dropdowns, floating elements        |
| surface-hover| `#1A1A1A` | Hover states, interactive surfaces         |

**Rules:**
- Never use pure `#000000` as a background — it flattens the layout
- Never use neutral gray (`#888`, `#ccc`) as a background
- Borders always use `white/5` or `white/8` — never solid gray

---

### 3.2 Interaction Shape
- All interactive elements must use:

rounded-[100px]


---

### 3.3 Glow System
- 1px ring glow (Navy / Gold)
- 0.5px top highlight

---

### 3.4 Hero Gradient
The first-screen Hero section uses a Navy radial gradient to anchor the page and add depth:

```css
background: radial-gradient(ellipse at top, #0D1829 0%, #080808 60%);
```

- `#0D1829` = Navy `#163266` diluted to ~8% visibility
- Gradient must be `ellipse at top` — never centered or bottom
- Only used in the Hero section, not globally

---

## 4. Color System

### Primary
| Token         | Value     |
| ------------- | --------- |
| surface-base  | `#080808` |
| surface-card  | `#111111` |
| surface-hover | `#1A1A1A` |
| primary-700   | `#163266` |
| primary-text  | `#FFFFFF` |
| muted-silver  | `#A6A6A6` |

---

### Accent (Value Layer)
| Token     | Value                 |
| --------- | --------------------- |
| gold-500  | #D4AF37               |
| gold-glow | rgba(212,175,55,0.15) |

---

### Social Layer
| Token    | Value   |
| -------- | ------- |
| pink-500 | #EC4899 |

---

## 5. Typography System

### Font Families
- Display: DM Sans (700 / 900)
- Body: Inter (cv01, cv11, ss03)
- Data: Geist Mono

---

### Rules
- Headings MUST use negative letter-spacing
- Apply:

font-feature-settings: "cv11", "ss03";


---

## 6. Design Tokens

### Spacing

xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 40px
2xl: 80px
section: 120px


---

### Radius

pill: 100px
container: 24px
card: 20px


---

### Elevation

level-0: none
level-1: ring + highlight
level-2: + shadow


---

### Z-index

nav: 100
dropdown: 200
modal: 1000
toast: 1100


---

## 7. Component System

### 7.1 Buttons

#### Primary CTA
Used in:
- Post Task
- Confirm Payment
- Hero actions

---

#### Gold CTA
Used in:
- Pricing
- Premium actions

---

#### Frosted Button
Used in:
- Social interactions
- Secondary actions

---

### 7.2 Card System

#### Task Card
- Title (Inter)
- Price (Geist Mono, Gold)
- Status badge

---

#### Social Card
- User info
- Interaction (like/comment)
- Pink indicators

---

## 8. Layout System

### Grid
- Max-width: 1280px
- Center aligned

---

### Composition
- Desktop: 40 / 60 split
- Mobile: stacked

---

## 9. Core User Flows

### 9.1 Post Task Flow
1. Enter task title
2. Add description
3. Select category
4. Set price
5. Publish

---

### 9.2 Accept Job Flow
1. View task
2. Review details
3. Accept
4. Status → In Progress

---

### 9.3 Payment Flow
1. Confirm completion
2. Process payment
3. Status → Completed

---

### 9.4 Messaging Flow
1. Real-time chat
2. Pink interaction indicators
3. Timestamp display

---

## 10. Screen Architecture

### Core Screens
- Home
- Marketplace
- Task Detail
- Chat
- Profile
- Payment Summary

---

### Navigation
- Desktop: floating top nav
- Mobile: pill drawer

---

## 11. State System

### Loading
- Skeleton UI only

---

### Empty
- Muted Silver text

---

### Error
- Pink accent + retry CTA

---

### Success
- Gold highlight feedback

---

## 12. Data Representation

### Currency

$120.00

- Font: Geist Mono

---

### Time

2h ago


---

### Status

| Status      | Color        |
| ----------- | ------------ |
| Open        | White        |
| In Progress | Gold         |
| Completed   | Muted Silver |

---

## 13. Motion System

### Duration
- 150ms (micro)
- 300ms (standard)

---

### Easing

ease-out


---

### Scale

hover: scale(1.05)
active: scale(0.95)


---

### Entry Animation

fade + translateY(10px)


---

## 14. Responsive System

### Breakpoints

| Name    | Width      |
| ------- | ---------- |
| Mobile  | <768px     |
| Tablet  | 768–1024px |
| Desktop | >1024px    |

---

### Rules
- Maintain negative tracking proportionally
- Preserve spacing hierarchy

---

## 15. Accessibility

- Contrast ≥ 4.5:1
- Focus states required
- Keyboard navigation supported
- Touch targets ≥ 48px

---

## 16. Engineering Rules

### Tailwind Enforcement
- Do NOT hardcode hex values

---

### Typography

antialiased
font-feature-settings: "cv11", "ss03"


---

### Interaction

active:scale-95


---

## 17. AI Prompt System

### Base Prompt

Use absolute black (#000000) background.
All buttons must be pill-shaped (100px radius).
Use DM Sans for headings with negative letter-spacing.
Use Gold (#D4AF37) for pricing and CTA.
Use Pink (#EC4899) for social interactions.


---

### Component Prompt Template

Generate a [component] using:

Background: absolute black
Typography: Inter / DM Sans
CTA: pill-shaped
Glow: 1px gold ring

---

### Validation Checklist
- Is background pure black?
- Are buttons pill-shaped?
- Is gold used only for value?
- Is pink used only for social?

---

## 18. Do / Don’t

### Do
- Use absolute black (#000000)
- Use negative letter-spacing
- Use pill-shaped buttons
- Use gold for value
- Use pink for social

---

### Don’t
- No gray backgrounds
- No small border radius
- No positive tracking
- No blurry shadows
- No decorative visuals
