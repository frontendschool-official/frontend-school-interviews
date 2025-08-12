# Unified Loading System

This document describes the unified loading system implemented across the application to provide consistent loading states and skeleton loaders.

## Components

### 1. Loader Component (`Loader.tsx`)

A unified loader component that replaces all previous loading spinners.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' - Controls the size of the loader
- `text`: string - Optional loading text to display
- `className`: string - Additional CSS classes
- `variant`: 'spinner' | 'dots' | 'pulse' - Different animation variants
- `fullScreen`: boolean - Whether to take full screen height

**Usage:**
```tsx
import { Loader } from '@/components/ui/Loader';

// Basic usage
<Loader text="Loading..." />

// Full screen loading
<Loader text="Loading page..." size="lg" fullScreen />

// Different variants
<Loader variant="dots" text="Processing..." />
<Loader variant="pulse" size="sm" />
```

### 2. Skeleton Components (`Skeleton.tsx`)

Reusable skeleton components for different UI elements.

**Available Components:**
- `Skeleton` - Basic skeleton element
- `CardSkeleton` - Generic card skeleton
- `ProblemCardSkeleton` - Problem card specific skeleton
- `DashboardCardSkeleton` - Dashboard stats card skeleton
- `ListItemSkeleton` - List item skeleton
- `TableRowSkeleton` - Table row skeleton
- `HeaderSkeleton` - Page header skeleton
- `GridSkeleton` - Grid layout skeleton
- `StatsGridSkeleton` - Stats grid skeleton

**Usage:**
```tsx
import { 
  Skeleton, 
  CardSkeleton, 
  ProblemCardSkeleton,
  GridSkeleton 
} from '@/components/ui/Skeleton';

// Basic skeleton
<Skeleton width={200} height={20} />

// Card skeleton
<CardSkeleton />

// Grid of problem cards
<GridSkeleton 
  items={6} 
  columns={3} 
  itemComponent={ProblemCardSkeleton} 
/>
```

### 3. LoadingState Component (`LoadingState.tsx`)

A wrapper component that conditionally shows loading states or content.

**Props:**
- `loading`: boolean - Whether to show loading state
- `children`: ReactNode - Content to show when not loading
- `type`: 'spinner' | 'skeleton' | 'grid' | 'stats' | 'cards' | 'header'
- `skeletonProps`: object - Props for skeleton components
- `loaderProps`: object - Props for loader component
- `className`: string - Additional CSS classes

**Usage:**
```tsx
import { LoadingState } from '@/components/ui/LoadingState';

<LoadingState loading={isLoading} type="cards">
  <div>Your content here</div>
</LoadingState>
```

### 4. Pre-built Loading States

**PageLoadingState** - Full screen page loading
```tsx
import { PageLoadingState } from '@/components/ui/LoadingState';
<PageLoadingState text="Loading page..." />
```

**CardLoadingState** - Grid of card skeletons
```tsx
import { CardLoadingState } from '@/components/ui/LoadingState';
<CardLoadingState count={6} />
```

**ProblemCardLoadingState** - Grid of problem card skeletons
```tsx
import { ProblemCardLoadingState } from '@/components/ui/LoadingState';
<ProblemCardLoadingState count={9} />
```

**DashboardLoadingState** - Complete dashboard skeleton
```tsx
import { DashboardLoadingState } from '@/components/ui/LoadingState';
<DashboardLoadingState />
```

## Migration Guide

### Before (Old System)
```tsx
// Multiple different loaders
import { Loader } from './Loader';
import LoadingSpinner from './LoadingSpinner';

// Inline skeleton components
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
```

### After (New System)
```tsx
// Single unified import
import { Loader, ProblemCardLoadingState } from '@/components/ui';

// Consistent loading states
<Loader text="Loading..." size="md" />
<ProblemCardLoadingState count={6} />
```

## Best Practices

1. **Use appropriate skeleton types** - Match the skeleton to the actual content structure
2. **Consistent sizing** - Use the same skeleton count as expected content
3. **Meaningful loading text** - Provide context about what's loading
4. **Full screen for page loads** - Use `fullScreen` prop for initial page loads
5. **Skeleton for content updates** - Use skeletons for content that's being refreshed

## Implementation Examples

### Problems Page
```tsx
{isLoading ? (
  <ProblemCardLoadingState count={9} />
) : (
  <div>Problems content</div>
)}
```

### Dashboard
```tsx
{loading ? (
  <DashboardLoadingState />
) : (
  <div>Dashboard content</div>
)}
```

### Layout Component
```tsx
{isLoading ? (
  <Loader text={loadingText} size="lg" fullScreen />
) : (
  <main>{children}</main>
)}
```

## Benefits

1. **Consistency** - All loading states look and behave the same
2. **Maintainability** - Single source of truth for loading components
3. **Performance** - Optimized skeleton components
4. **User Experience** - Better perceived performance with skeleton loaders
5. **Developer Experience** - Easy to use and consistent API 