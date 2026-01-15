# Daleel Design System

## Overview

This design system provides a unified set of components, patterns, and guidelines for the Daleel website. All pages should follow these standards for consistency.

## Design Principles

1. **Visual-first**: Use visuals and animations to communicate complex information
2. **Neutral & Non-political**: Maintain strict neutrality in all design choices
3. **Accessible**: WCAG 2.1 AA compliant, supports reduced motion
4. **Multilingual**: Full support for Arabic (RTL), English, and French
5. **Mobile-first**: Responsive design starting from mobile breakpoints

## Color Palette

### Primary Colors
- **Cedar Green**: `hsl(163, 47%, 28%)` - Primary brand color
- **Cedar Light**: `hsl(163, 42%, 38%)` - Hover states, accents

### Neutral Colors
- **Gray Scale**: Used for text, borders, backgrounds
  - `gray-50`: Light backgrounds
  - `gray-100`: Borders, dividers
  - `gray-500`: Secondary text
  - `gray-600`: Body text
  - `gray-900`: Headings

### Usage Guidelines
- Use cedar for primary actions and accents
- Use gray scale for text hierarchy
- Avoid vibrant colors that could be interpreted as political

## Typography

### Font Families
- **Sans**: System UI (body text)
- **Serif**: Georgia (headings)
- **Arabic**: Arabic font stack (for Arabic locale)

### Type Scale
- **H1**: `text-4xl` (36px) - Page titles
- **H2**: `text-2xl sm:text-3xl` (24-30px) - Section headers
- **H3**: `text-xl sm:text-2xl` (20-24px) - Subsection headers
- **Body**: `text-sm sm:text-base` (14-16px) - Body text
- **Small**: `text-xs sm:text-sm` (12-14px) - Captions, labels

### Font Weights
- **Normal**: `font-normal` (400) - Body text
- **Medium**: `font-medium` (500) - Emphasis
- **Semibold**: `font-semibold` (600) - Headings
- **Bold**: `font-bold` (700) - Strong emphasis

## Spacing System

### Container Widths
- **Full**: `max-w-full` - Full width
- **Standard**: `max-w-5xl` - Main content sections
- **Narrow**: `max-w-2xl` - Text content, cards
- **Wide**: `max-w-7xl` - Full page layouts

### Padding & Margins
- **Section Padding**: `py-12 sm:py-16 md:py-20` - Between major sections
- **Container Padding**: `px-4 sm:px-6` - Horizontal padding
- **Card Padding**: `p-6 sm:p-8` - Internal card spacing
- **Gap**: `gap-4 sm:gap-6` - Between grid items

## Component Patterns

### Section Headers

All sections should use the unified `SectionHeader` component:

```tsx
<SectionHeader
  icon={IconComponent}
  title="Section Title"
  action={<Link>View all</Link>}
/>
```

**Specifications:**
- Icon: 12x12 rounded-2xl with gradient background
- Title: text-2xl sm:text-3xl font-serif
- Alignment: justify-between (icon+title left, action right)
- Spacing: mb-8

### Cards

Use unified card components for consistent styling:

**Standard Card:**
- Background: `bg-white`
- Border: `border border-gray-100`
- Shadow: `shadow-sm hover:shadow-md`
- Radius: `rounded-2xl`
- Padding: `p-6 sm:p-8`

**Gradient Card:**
- Background: `bg-gradient-to-br from-cedar/5 via-white to-cedar/5`
- Border: `border border-cedar/10`
- Shadow: `shadow-sm`

### Buttons & Links

**Primary Button:**
- Background: `bg-cedar text-white`
- Hover: `hover:bg-cedar-light`
- Padding: `px-6 py-3`
- Radius: `rounded-xl`
- Shadow: `shadow-md hover:shadow-lg`

**Secondary Link:**
- Color: `text-cedar`
- Hover: `hover:bg-cedar/5`
- Padding: `px-4 py-2`
- Radius: `rounded-xl`

### Grid Layouts

**Standard Grid:**
- Mobile: `grid-cols-1`
- Tablet: `grid-cols-2`
- Desktop: `grid-cols-3` or `grid-cols-4`
- Gap: `gap-4 sm:gap-6`

## RTL Support

### Automatic (Tailwind)
- Use `rtl:` variants for directional properties
- Use logical properties where possible

### Manual (JavaScript)
- Check `locale === "ar"` for RTL-specific logic
- Flip icons: `className={isRTL ? 'rotate-180' : ''}`
- Reverse animation directions

## Accessibility

### Reduced Motion
- All animations respect `prefers-reduced-motion`
- Use `useReducedMotion()` hook
- Provide static fallbacks

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators: `focus:ring-2 focus:ring-cedar`
- Tab order follows visual hierarchy

### Screen Readers
- Proper ARIA labels
- Semantic HTML
- Alt text for all images
- Alt text toggles for complex visuals

## Animation Guidelines

### Entrance Animations
- Duration: 0.4-0.6s
- Easing: `ease-out`
- Stagger: 0.1s delay between items

### Hover Effects
- Duration: 0.2-0.3s
- Subtle transforms: `scale(1.05)` or `translateY(-2px)`
- Shadow enhancement

### Reduced Motion
- Disable or simplify animations when `prefers-reduced-motion` is active

## Page Structure

### Standard Page Layout
1. **Header** (via PageLayout component)
   - Title: H1
   - Description: Optional
   - Breadcrumbs: Optional
   
2. **Content Sections**
   - Use SectionHeader for each major section
   - Consistent spacing between sections
   - Max width: `max-w-5xl` for main content

3. **Footer** (global)

### Section Patterns
- **Preview Sections**: Icon grid, visual elements, CTA
- **List Pages**: Filters + Grid/List view
- **Detail Pages**: Header + Content sections
- **Educational Pages**: Visual-first with minimal text

## Component Library

### Core Components
- `SectionHeader` - Unified section headers
- `PageLayout` - Standard page wrapper
- `Card` - Reusable card component
- `Button` - Unified button styles
- `Link` - Styled link component

### Layout Components
- `PageLayout` - Main page wrapper
- `DetailLayout` - Detail page wrapper

### UI Components
- `Badge` - Status badges
- `Input` - Form inputs
- `Select` - Dropdown selects
- `LoadingState` - Loading indicators
- `EmptyState` - Empty state messages

## Implementation Checklist

When creating or updating a page:

- [ ] Uses `PageLayout` or appropriate layout component
- [ ] Section headers use `SectionHeader` component
- [ ] Cards use unified card styles
- [ ] Buttons/links follow button guidelines
- [ ] RTL support implemented
- [ ] Accessibility requirements met
- [ ] Responsive design tested
- [ ] Reduced motion support
- [ ] Consistent spacing and typography
