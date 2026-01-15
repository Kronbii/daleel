# Design Unification Plan

## Overview

This document outlines the design system implementation and migration plan to unify the design across all pages of the Daleel website.

## ✅ Completed

### 1. Design System Documentation
- **File**: `DESIGN_SYSTEM.md`
- Comprehensive design system with:
  - Color palette guidelines
  - Typography scale
  - Spacing system
  - Component patterns
  - RTL support guidelines
  - Accessibility requirements

### 2. Unified Components Created

#### SectionHeader Component
- **File**: `src/components/ui/section-header.tsx`
- Unified section headers with icon, title, and optional action
- Used across: Homepage sections, News Preview, Electoral Laws Preview

#### SectionCard Component
- **File**: `src/components/ui/section-card.tsx`
- Unified card styling with variants (default, gradient, bordered)
- Supports click handlers and links

#### LinkButton Component
- **File**: `src/components/ui/link-button.tsx`
- Styled link buttons with variants (primary, secondary, ghost)
- RTL support built-in

#### Updated Button Component
- **File**: `src/components/ui/button.tsx`
- Updated to use cedar colors instead of blue
- Consistent with design system

### 3. Homepage Updates
- All sections now use `SectionHeader` component
- Unified width (`max-w-5xl`) across all sections
- Consistent vertical alignment
- Updated About section with card design

### 4. Footer Redesign
- Cleaner, more subtle design
- Matches website aesthetic
- Reduced height and softer background

## 🔄 In Progress / To Do

### 1. Update All Page Headers
**Pages to update:**
- [x] `/candidates/page.tsx` - Uses PageLayout (consistent)
- [x] `/districts/page.tsx` - Uses PageLayout (consistent)
- [x] `/lists/page.tsx` - Uses PageLayout (consistent)
- [x] `/centers/page.tsx` - Uses PageLayout (consistent)
- [x] `/news/page.tsx` - Updated with unified styling
- [x] `/legal/page.tsx` - Uses PageLayout, cards updated

**Status**: All pages use consistent layout patterns. Homepage sections use SectionHeader.

### 2. Standardize Card Components
**Components to review:**
- [x] `candidate-card.tsx` - Updated to use unified card styles (bg-white, shadow-sm)
- [x] All grid/list components - Updated to use consistent card styling
- [x] Detail page cards - Standardized layout with unified styles

**Status**: All cards now use consistent styling (bg-white, border-gray-100, shadow-sm, rounded-xl/2xl).

### 3. Standardize Filters
**Components to review:**
- [x] `candidate-filters.tsx` - Updated colors (cedar), unified styling
- [x] `list-filters.tsx` - Updated colors (cedar), unified styling
- [x] `simple-search-filter.tsx` - Updated to use unified card styles
- [x] `search-filter.tsx` - Consistent with design system

**Status**: All filters use consistent styling with cedar colors and unified card backgrounds.

### 4. Update Detail Pages
**Pages to review:**
- [x] `/candidates/[slug]/page.tsx` - Updated colors (cedar), typography (serif), unified cards
- [x] `/districts/[id]/page.tsx` - Updated colors (cedar), typography, unified cards
- [x] `/lists/[id]/page.tsx` - Updated colors (cedar), typography, unified cards
- [x] `/legal/[slug]/page.tsx` - Updated colors (cedar), unified card styles

**Status**: All detail pages use consistent colors, typography, and card styling.

### 5. Standardize Empty States
**Components:**
- [x] Review `empty-state.tsx` usage across pages
- [x] Updated to use SectionCard component
- [x] Consistent messaging and styling

### 6. Standardize Loading States
**Components:**
- [x] Review `loading-state.tsx` usage
- [x] Updated to use SectionCard component
- [x] Consistent loading indicators with cedar color

### 7. Typography Consistency
**Review:**
- [x] All headings use serif font (PageLayout, DetailLayout updated)
- [x] Section headings use font-serif font-medium
- [x] Consistent text sizes across pages
- [x] Proper text hierarchy maintained

### 8. Spacing Consistency
**Review:**
- [x] Section padding standardized: `py-12 sm:py-16 md:py-20` or `pb-16 sm:pb-20 md:pb-24`
- [x] Container padding: `px-4 sm:px-6`
- [x] Consistent gaps in grids: `gap-3 sm:gap-4` or `gap-4 sm:gap-6`

### 9. Button/Link Consistency
**Review:**
- [x] All CTAs use unified button/link styles
- [x] Consistent hover effects (cedar colors)
- [x] RTL support for all interactive elements
- [x] BackButton and Breadcrumbs updated to use cedar

### 10. Color Consistency
**Review:**
- [x] Replaced emerald colors with cedar across all pages
- [x] Removed backdrop-blur and bg-white/70, using clean bg-white
- [x] Cedar color used consistently for accents and hover states
- [x] Neutral grays for text hierarchy (gray-500, gray-600, gray-900)

## 📋 Component Usage Guidelines

### When to Use SectionHeader
- All major sections on a page
- Preview sections (News, Electoral Laws, etc.)
- Any section that needs an icon + title + optional action

### When to Use SectionCard
- Content cards that need consistent styling
- Preview cards
- Feature cards
- Any card-like container

### When to Use LinkButton
- Primary CTAs
- Navigation links that should look like buttons
- Action links in headers

### When to Use PageLayout
- All standard list/index pages
- Pages with title, description, and content

### When to Use DetailLayout
- Detail/view pages
- Pages showing single item information

## 🎨 Design Tokens

### Colors
```typescript
// Primary
cedar: hsl(163, 47%, 28%)
cedar-light: hsl(163, 42%, 38%)

// Grays
gray-50: Light backgrounds
gray-100: Borders
gray-500: Secondary text
gray-600: Body text
gray-900: Headings
```

### Spacing
```typescript
// Containers
max-w-5xl: Main content sections
max-w-2xl: Text content
max-w-7xl: Full page layouts

// Padding
py-12 sm:py-16 md:py-20: Section padding
px-4 sm:px-6: Container padding
p-6 sm:p-8: Card padding
```

### Typography
```typescript
// Headings
h1: text-4xl font-serif
h2: text-2xl sm:text-3xl font-serif
h3: text-xl sm:text-2xl font-serif

// Body
body: text-sm sm:text-base font-normal
small: text-xs sm:text-sm
```

## 🔍 Review Checklist

For each page/component update:

- [ ] Uses unified components (SectionHeader, SectionCard, etc.)
- [ ] Follows spacing guidelines
- [ ] Uses correct typography scale
- [ ] Uses design system colors only
- [ ] RTL support implemented
- [ ] Accessibility requirements met
- [ ] Responsive design tested
- [ ] Reduced motion support
- [ ] Consistent with other pages

## 📝 Notes

- All new components should follow the design system
- When updating existing components, migrate to unified components
- Document any deviations from the design system
- Keep design system document updated as patterns evolve
