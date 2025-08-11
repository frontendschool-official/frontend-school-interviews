# URL Structure & Component Architecture

This document outlines the complete URL structure and reusable components for the Frontend School Interviews platform.

## 🗂️ URL Structure Overview

### Core Pages
```
/                           # Home/Landing page
/login                      # Authentication
/about                      # About page
/premium                    # Pricing/subscription
```

### User Dashboard & Profile
```
/dashboard                  # User dashboard with overview
/profile                    # User profile management
/progress                   # Progress tracking (future)
/history                    # Interview history
```

### Problems
```
/problems                   # All problems listing
/problems/[id]              # Individual problem solving
/problems/[id]/solution     # View solution (future)
/problems/[id]/feedback     # View feedback (future)
```

### Problem Types (Future)
```
/problems/dsa               # DSA problems
/problems/machine-coding    # Machine coding problems
/problems/system-design     # System design problems
/problems/theory            # Theory problems
```

### Mock Interviews
```
/mock-interviews            # Mock interview hub
/mock-interviews/setup      # Setup new interview
/mock-interviews/[id]       # Active interview
/mock-interviews/[id]/results # Results (future)
```

### Practice Modes
```
/practice                   # Practice hub
/practice/quick             # Quick practice (5-min challenges)
/practice/timed             # Timed practice
/practice/adaptive          # Adaptive practice
/practice/dsa               # DSA practice
/practice/machine-coding    # Machine coding practice
/practice/system-design     # System design practice
/practice/theory            # Theory practice
```

### Companies (Future)
```
/companies                  # Companies listing
/companies/[company]        # Company-specific problems
/companies/[company]/insights # Company insights
```

### Learning (Future)
```
/learn                      # Learning hub
/learn/concepts             # Frontend concepts
/learn/patterns             # Design patterns
/learn/best-practices       # Best practices
```

### Roadmap
```
/roadmap                    # Create personalized roadmap
/roadmap/view               # View generated roadmap
```

## 🧩 Reusable Components

### Dashboard Components

#### `DashboardStats`
- **Location**: `components/dashboard/DashboardStats.tsx`
- **Purpose**: Displays key metrics (problems solved, time spent, success rate, streak)
- **Props**: `stats?: { problemsSolved, timeSpent, successRate, currentStreak }`
- **Usage**: Used in dashboard and other overview pages

#### `QuickActions`
- **Location**: `components/dashboard/QuickActions.tsx`
- **Purpose**: Provides quick access to common actions
- **Props**: None (hardcoded actions)
- **Usage**: Dashboard, practice hub

#### `ProgressOverview`
- **Location**: `components/dashboard/ProgressOverview.tsx`
- **Purpose**: Shows learning progress with progress bars
- **Props**: None (uses mock data)
- **Usage**: Dashboard, profile page

#### `RecentProblems`
- **Location**: `components/dashboard/RecentProblems.tsx`
- **Purpose**: Displays recently attempted problems
- **Props**: None (uses mock data)
- **Usage**: Dashboard, history page

### Problem Components

#### `ProblemTypeFilter`
- **Location**: `components/problems/ProblemTypeFilter.tsx`
- **Purpose**: Filter problems by type (DSA, Machine Coding, etc.)
- **Props**: 
  - `types: ProblemType[]`
  - `activeType: string`
  - `onTypeChange: (typeId: string) => void`
  - `showCount?: boolean`
- **Usage**: Problems page, history page, practice pages

#### `ProblemCard`
- **Location**: `components/problems/ProblemCard.tsx`
- **Purpose**: Displays problem information in a card format
- **Props**:
  - `problem: Problem`
  - `showScore?: boolean`
  - `showStatus?: boolean`
  - `onStart?: (problemId: string) => void`
- **Usage**: Problems listing, history, dashboard

#### `ProblemSolver`
- **Location**: `components/problems/ProblemSolver.tsx`
- **Purpose**: Main problem solving interface
- **Props**: `problemId: string`
- **Usage**: Individual problem pages

### Mock Interview Components

#### `MockInterviewHub`
- **Location**: `components/mock-interviews/MockInterviewHub.tsx`
- **Purpose**: Overview of mock interview types
- **Props**: None
- **Usage**: Mock interviews page

### Practice Components

#### `PracticeHub`
- **Location**: `components/practice/PracticeHub.tsx`
- **Purpose**: Overview of practice modes
- **Props**: None
- **Usage**: Practice page

### History Components

#### `InterviewHistory`
- **Location**: `components/history/InterviewHistory.tsx`
- **Purpose**: Displays interview and problem history
- **Props**: None
- **Usage**: History page

## 🎨 Component Design Patterns

### Styled Components
All components use styled-components with consistent theming:
- `theme.primary` - Primary color (#e5231c)
- `theme.secondary` - Secondary background
- `theme.border` - Border color
- `theme.text` - Text color
- `theme.text80` - Muted text color

### Color Scheme
- **DSA**: #10b981 (Green)
- **Machine Coding**: #3b82f6 (Blue)
- **System Design**: #f59e0b (Orange)
- **Theory**: #8b5cf6 (Purple)

### Common Patterns
1. **Card Layout**: Consistent card styling with hover effects
2. **Grid Layout**: Responsive grid systems
3. **Filter Components**: Reusable filtering interfaces
4. **Status Badges**: Consistent status indicators
5. **Action Buttons**: Standardized button styles

## 🔧 Implementation Guidelines

### Adding New Pages
1. Create page in `pages/` directory
2. Add authentication check if needed
3. Use Layout component for consistent structure
4. Create reusable components for complex functionality

### Adding New Components
1. Create component in appropriate directory
2. Use TypeScript interfaces for props
3. Follow existing styling patterns
4. Add proper error handling and loading states

### Navigation Updates
1. Update `components/NavBar.tsx` menu links
2. Ensure proper authentication requirements
3. Test navigation flow

### Data Integration
1. Replace mock data with Firebase calls
2. Add proper loading states
3. Implement error handling
4. Add real-time updates where needed

## 🚀 Future Enhancements

### Planned Features
- [ ] Company-specific problem sets
- [ ] Learning path system
- [ ] Community features
- [ ] Advanced analytics
- [ ] Mobile app

### Component Extensions
- [ ] Advanced filtering system
- [ ] Search functionality
- [ ] Export/import features
- [ ] Collaborative features

## 📱 Responsive Design

All components are designed to be responsive:
- Mobile-first approach
- Flexible grid systems
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔒 Security Considerations

- Authentication required for user-specific pages
- Proper route protection
- Input validation
- XSS prevention in user-generated content

## 📊 Performance Optimization

- Lazy loading for components
- Image optimization
- Code splitting
- Caching strategies
- Bundle size optimization

This URL structure provides a scalable, user-friendly navigation system that supports the platform's growth and feature expansion. 