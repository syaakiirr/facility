---
name: design-taste-frontend
description: Anti-slop frontend skill for dashboards, data-driven UIs, and corporate web apps. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. White corporate theme, clean data tables, real design systems when applicable.
---

# tasteskill: Anti-Slop Frontend Skill (KaKeFa Edition)
> Adapted from Taste Skill v2 by Leonxlnx for KaKeFa Facilities Dashboard
> Source: https://github.com/Leonxlnx/taste-skill

## PROJECT CONTEXT
- **App type:** Corporate internal dashboard / data management system
- **Audience:** Government/corporate unit head (ketua unit) — trust-first, B2B
- **Theme:** WHITE CORPORATE — clean, light, professional
- **Language:** English UI
- **Charts:** Apache ECharts (CDN) — NOT Recharts, NOT D3, NOT Chart.js

## DESIGN READ (Pre-set for this project)
> "Reading this as: internal data management dashboard for a corporate/government unit head, with a clean white corporate language, leaning toward Microsoft Fluent / Linear-clean aesthetics — VARIANCE: 4 / MOTION: 3 / DENSITY: 6"

---

## CORE DESIGN DIALS (Fixed for this project)
- **DESIGN_VARIANCE: 4** — Clean, structured, corporate. No artsy chaos.
- **MOTION_INTENSITY: 3** — Subtle transitions only. No cinematic animations.
- **VISUAL_DENSITY: 6** — Data-dense. Tables, charts, numbers. No art-gallery whitespace.

---

## COLOR SYSTEM (White Corporate Theme)

### Primary Palette
```
Background:     #FFFFFF (pure white pages)
Surface:        #F8FAFC (card backgrounds)
Surface-2:      #F1F5F9 (input backgrounds, table stripes)
Border:         #E2E8F0 (subtle borders)
Border-dark:    #CBD5E1 (emphasized borders)

Text-primary:   #0F172A (slate-900 — headlines, important data)
Text-secondary: #475569 (slate-600 — labels, descriptions)
Text-muted:     #94A3B8 (slate-400 — placeholders, metadata)

Accent:         #2563EB (blue-600 — primary CTA, active states)
Accent-light:   #DBEAFE (blue-100 — badge backgrounds, highlights)
Accent-hover:   #1D4ED8 (blue-700 — hover states)
```

### Status Colors
```
Done/Success:   #16A34A (green-600) / bg: #DCFCE7 (green-50)
In Progress:    #2563EB (blue-600)  / bg: #DBEAFE (blue-100)
Pending/Hold:   #D97706 (amber-600) / bg: #FEF3C7 (amber-50)
Declined:       #DC2626 (red-600)   / bg: #FEE2E2 (red-50)
```

### BANNED for this project
- ❌ Dark backgrounds / dark mode
- ❌ Neon colors, gradients
- ❌ AI purple / blue glows
- ❌ Warm cream/beige (#f5f1ea family)
- ❌ Gold/brass accents (#b08947 family)

---

## TYPOGRAPHY

### Font Stack
```
Primary: 'Inter', system-ui, -apple-system, sans-serif
Mono:    'JetBrains Mono', 'Fira Code', monospace (for RM values, codes)
```

### Scale
```
Page title:     24px / 600 weight / slate-900
Section title:  18px / 600 weight / slate-900
Card title:     15px / 600 weight / slate-900
Body:           14px / 400 weight / slate-600 / leading-relaxed
Label:          12px / 500 weight / slate-500 / uppercase tracking-wide
Table header:   12px / 600 weight / slate-500 / uppercase tracking-wide
RM values:      14px / 600 weight / mono font / slate-900
```

---

## COMPONENT RULES

### KPI Cards
- White background, subtle shadow `0 1px 3px rgba(0,0,0,0.08)`
- Left border accent (4px solid, colored by category)
- Icon in colored circle (tinted background)
- Large number in 24px Outfit/Inter, bold
- Label in 11px uppercase slate-500

### Tables
- White background with header row in slate-50
- Row hover: slate-50 background
- Alternating rows: white / F8FAFC
- Status badge: pill shape, 12px, colored background
- Progress: thin bar (6px height), rounded
- Actions: edit/delete icon buttons appear on row hover

### Charts (Apache ECharts)
- White background cards
- Thin 1px border in slate-200
- Grid lines: slate-100 (very subtle)
- Tooltip: white bg, 1px slate-200 border, 13px Inter
- Colors: use status palette (blue, green, amber, red) — no random colors

### Sidebar
- White background (NOT dark)
- Width: 240px desktop
- Active item: blue-600 text + blue-50 background + left indicator line
- Inactive: slate-600 text, hover slate-50 background
- Logo: brand icon + "KaKeFa" text

### Modals / Forms
- White background with overlay backdrop (rgba 0,0,0,0.4)
- Rounded 12px corners
- Max-width 640px
- Label above input (ALWAYS)
- Input: 1px slate-300 border, rounded-8px, height 40px
- Focus: blue-600 ring, 2px offset

---

## LAYOUT RULES

### Dashboard Layout
```
[Sidebar 240px] | [Main content flex-1]
                  [Topbar 64px sticky]
                  [Page content padding-24px]
                    [KPI Grid: 3-4 cols]
                    [Charts Row: 2 cols]
                    [Table: full width]
```

### Responsiveness
- Sidebar collapses to hamburger at < 1024px
- KPI grid: 2 cols at tablet, 1 col at mobile
- Tables: horizontal scroll on mobile

---

## ECHARTS SPECIFIC RULES

### Setup
```javascript
// ALWAYS use Apache ECharts via CDN
// <script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>

// Global text defaults
const echartsTextStyle = {
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: 13,
  color: '#475569'
};
```

### Donut Chart (Status Distribution)
```javascript
{
  tooltip: {
    trigger: 'item',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    textStyle: { fontFamily: "'Inter'", fontSize: 13, color: '#0F172A' }
  },
  legend: { bottom: 0, itemWidth: 12, itemGap: 16 },
  series: [{
    type: 'pie',
    radius: ['55%', '78%'],
    avoidLabelOverlap: true,
    itemStyle: { borderRadius: 4, borderColor: '#FFF', borderWidth: 2 }
  }]
}
```

### Bar Chart
```javascript
{
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    textStyle: { fontFamily: "'Inter'", fontSize: 13, color: '#0F172A' }
  },
  grid: { left: 12, right: 16, top: 16, bottom: 8, containLabel: true },
  xAxis: { type: 'category', axisLine: { lineStyle: { color: '#E2E8F0' } }, axisLabel: { color: '#475569' } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#F1F5F9', type: 'dashed' } } },
  series: [{
    type: 'bar',
    barWidth: '60%',
    itemStyle: { borderRadius: [4, 4, 0, 0] }
  }]
}
```

---

## INTERACTIVE STATE RULES

### Loading States
- Skeleton loaders: animated pulse, rounded, matches layout shape
- NOT: circular spinner

### Empty States
- Center-aligned icon + heading + description + CTA button
- Icon from Phosphor or Tabler (NOT hand-rolled SVG)

### Error States
- Inline for forms (below input, red-600 text)
- Toast for transient (3 seconds, top-right)

### Button States
- Primary: blue-600 bg, white text, hover blue-700
- Secondary: white bg, slate-300 border, slate-700 text
- Danger: red-600 bg, white text
- ALL buttons: scale(0.98) on :active

---

## ANTI-PATTERNS TO AVOID

1. ❌ Dark sidebar / dark theme
2. ❌ Excessive shadows (keep it flat/minimal)
3. ❌ Random gradient backgrounds
4. ❌ emoji in UI (use icon library instead)
5. ❌ `#REF!` or broken formula display
6. ❌ Generic "lorem ipsum" placeholder text
7. ❌ Circular spinner as only loading state
8. ❌ Same layout for every section

---

*Installed for KaKeFa Facilities Dashboard — 1 Julai 2026*
