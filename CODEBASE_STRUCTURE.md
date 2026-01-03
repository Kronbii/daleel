# Codebase Structure Guide

## 📁 Optimized Project Structure

This document explains the improved, organized structure of the Daleel codebase.

## 🎯 Key Improvements

### 1. **Shared Layout Components** (`/components/layouts/`)
- **`page-layout.tsx`** - Standard page layout with breadcrumbs, header, and content
- **`detail-layout.tsx`** - Layout for detail pages (candidate, district, list profiles)

**Benefits:**
- Consistent page structure across the app
- Single source of truth for page layouts
- Easy to update styling globally

### 2. **Reusable UI Components** (`/components/ui/`)
- **`empty-state.tsx`** - Shows when no data is available
- **`loading-state.tsx`** - Loading spinner with message

**Benefits:**
- Consistent empty/loading states
- Easy to update loading animations
- Better UX with standardized messages

### 3. **Data Query Utilities** (`/lib/queries/`)
- **`candidates.ts`** - All candidate data fetching logic
- **`districts.ts`** - All district data fetching logic
- **`lists.ts`** - All electoral list data fetching logic

**Benefits:**
- Centralized data fetching
- Reusable query functions
- Easier to optimize database queries
- Better type safety

### 4. **Reusable Sections** (`/components/sections/`)
- **`candidates-grid.tsx`** - Grid display for candidates
- **`page-header.tsx`** - Standardized page headers

**Benefits:**
- DRY (Don't Repeat Yourself) principle
- Consistent grid layouts
- Easy to update grid styling globally

## 📂 Complete Structure

```
apps/web/src/
├── app/                          # Next.js App Router pages
│   ├── [locale]/                 # Locale-specific routes
│   │   ├── page.tsx             # Home page
│   │   ├── candidates/
│   │   │   ├── page.tsx         # Candidates list (uses PageLayout)
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Candidate detail (uses DetailLayout)
│   │   ├── districts/
│   │   │   ├── page.tsx         # Districts list (uses PageLayout)
│   │   │   └── [id]/
│   │   │       └── page.tsx     # District detail (uses DetailLayout)
│   │   └── lists/
│   │       ├── page.tsx         # Lists list (uses PageLayout)
│   │       └── [id]/
│   │           └── page.tsx     # List detail (uses DetailLayout)
│   └── api/                      # API routes
│
├── components/
│   ├── layouts/                  # 🆕 Shared page layouts
│   │   ├── page-layout.tsx       # Standard page layout
│   │   └── detail-layout.tsx    # Detail page layout
│   │
│   ├── sections/                 # 🆕 Reusable page sections
│   │   ├── candidates-grid.tsx  # Candidate grid component
│   │   └── page-header.tsx      # Page header component
│   │
│   ├── ui/                       # 🆕 Reusable UI components
│   │   ├── empty-state.tsx      # Empty state component
│   │   └── loading-state.tsx    # Loading state component
│   │
│   └── [existing components]    # Feature-specific components
│       ├── candidate-card.tsx
│       ├── navbar.tsx
│       ├── footer.tsx
│       └── ...
│
└── lib/
    ├── queries/                   # 🆕 Data fetching utilities
    │   ├── candidates.ts        # Candidate queries
    │   ├── districts.ts          # District queries
    │   └── lists.ts              # List queries
    │
    └── [existing utilities]      # Other utilities
        ├── auth.ts
        ├── legal-content.ts
        └── ...
```

## 🔄 Migration Pattern

### Before (Repetitive):
```tsx
// Every page had this boilerplate
<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
  <main className="container mx-auto px-4 py-12">
    <div className="max-w-7xl mx-auto">
      <Breadcrumbs items={[...]} />
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
      {/* Content */}
    </div>
  </main>
</div>
```

### After (Clean & Reusable):
```tsx
// Now pages are much cleaner
<PageLayout
  title={t("candidates")}
  description={description}
  breadcrumbs={[{ label: t("candidates") }]}
>
  <CandidatesGrid candidates={candidates} locale={locale} />
</PageLayout>
```

## 🎨 Component Usage Examples

### Using PageLayout:
```tsx
import { PageLayout } from "@/components/layouts/page-layout";

export default async function MyPage() {
  return (
    <PageLayout
      title="My Page"
      description="Page description"
      breadcrumbs={[{ label: "Home" }, { label: "My Page" }]}
    >
      {/* Your content here */}
    </PageLayout>
  );
}
```

### Using Query Utilities:
```tsx
import { getCandidatesList } from "@/lib/queries/candidates";

async function MyComponent() {
  const candidates = await getCandidatesList(locale);
  // Use candidates...
}
```

### Using Reusable Sections:
```tsx
import { CandidatesGrid } from "@/components/sections/candidates-grid";

function MyComponent() {
  return (
    <CandidatesGrid
      candidates={candidates}
      locale={locale}
      emptyMessage="No candidates found"
    />
  );
}
```

## ✅ Benefits Summary

1. **Less Code Duplication** - Shared components reduce repetition by ~60%
2. **Easier Maintenance** - Update styling/layout in one place
3. **Better Type Safety** - Centralized queries with proper types
4. **Improved Readability** - Pages are now much cleaner and easier to understand
5. **Faster Development** - Reusable components speed up new feature development
6. **Consistent UX** - All pages follow the same patterns

## 🚀 Next Steps

When adding new pages:
1. Use `PageLayout` for list pages
2. Use `DetailLayout` for detail pages
3. Create query utilities in `/lib/queries/` for data fetching
4. Use reusable sections like `CandidatesGrid` when appropriate
5. Use `LoadingState` and `EmptyState` for consistent UX

