# Design Guidelines: AI Subscription Management Dashboard

## Design Approach
**System Selected:** Linear/Notion-inspired design system with Material Design principles for data-heavy interfaces

**Justification:** This is a utility-focused productivity tool requiring clear information hierarchy, efficient data display, and quick actionability. Clean, minimal aesthetic prioritizes usability over visual flair.

## Typography System
- **Primary Font:** Inter or SF Pro (via Google Fonts CDN)
- **Hierarchy:**
  - Page Headers: text-2xl font-semibold
  - Section Headers: text-lg font-medium
  - Card Titles: text-base font-medium
  - Body Text: text-sm font-normal
  - Labels/Meta: text-xs font-medium uppercase tracking-wide text-gray-500

## Layout & Spacing
**Spacing Units:** Consistent use of Tailwind units: 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: space-y-6 to space-y-8
- Card gaps: gap-4
- Page margins: px-6 to px-8

**Layout Structure:**
- Sidebar navigation (w-64) with app logo, main nav links, user profile section
- Main content area (flex-1) with max-w-7xl container
- Dashboard uses mixed layouts: summary cards row (grid-cols-3), subscription table/cards (single column stacked)

## Component Library

**Dashboard Summary Cards:**
- Three-column grid showing: Total Subscriptions, Monthly Spend, Upcoming Renewals
- White background, rounded-lg borders, p-6 padding
- Large metric numbers (text-3xl font-bold) with small labels above

**Subscription Cards/Table View:**
- Toggle between card view and table view
- Card: Subscription icon/logo, name, renewal date, cost, status badge, action buttons
- Table: Sortable columns (Name, Cost, Renewal Date, Status, Actions)
- Status badges: Small pills with distinct states (Active, Expiring Soon, Expired)

**Credential Management:**
- Expandable/collapsible password fields with show/hide toggle
- Copy-to-clipboard buttons for usernames/passwords
- Security indicator icons next to credentials

**Renewal Indicators:**
- Color-coded status system (no actual colors specified):
  - 30+ days: Neutral state
  - 14-30 days: Warning state
  - 7-14 days: Urgent state
  - <7 days: Critical state
- Progress bars showing time until renewal

**Forms & Inputs:**
- Clean, bordered inputs with focus states
- Date pickers for renewal dates
- Currency inputs for subscription costs
- Consistent form field spacing (space-y-4)

**Navigation:**
- Vertical sidebar with icon + label items
- Active state indicator (border-l-4 accent)
- Hover states on nav items
- Bottom section for settings/profile

**Action Buttons:**
- Primary CTA: Send Reminder, Add Subscription (rounded-md px-4 py-2)
- Secondary: Edit, View Details (outlined style)
- Danger: Delete Subscription (red accent)
- Icon buttons for quick actions (copy, edit, delete)

## Iconography
**Library:** Heroicons (outline for navigation, solid for status indicators)
- Navigation: document-text, bell, cog, user
- Actions: pencil, trash, eye, clipboard-copy
- Status: check-circle, exclamation-triangle, x-circle
- Features: calendar, credit-card, lock-closed

## Animations
**Minimal Motion:**
- Sidebar hover: Simple background transition
- Card hover: Subtle lift (shadow change only)
- Status changes: No animation
- Loading states: Simple spinner, no skeleton screens

## Key Dashboard Sections
1. **Header Bar:** App title, search subscriptions, Add New button, user avatar
2. **Summary Cards Row:** Key metrics at-a-glance
3. **Filters & View Toggle:** Category filter, date range, card/table toggle
4. **Subscription List:** Main content area with all subscriptions
5. **Renewal Calendar:** Optional side panel showing upcoming renewals timeline

## Data Visualization
- Simple bar chart for monthly spending trends
- Calendar view marking renewal dates
- No complex charts - focus on clarity over complexity